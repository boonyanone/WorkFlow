<?php
/**
 * Credit Calculator
 * Manages credit calculations and user balance
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

class CreditCalculator {
    
    private $creditFile;
    private $ratesConfig;
    
    public function __construct() {
        $this->creditFile = dirname(__DIR__) . '/data/credits.json';
        $this->loadRatesConfig();
        $this->ensureDataDirectory();
    }
    
    private function loadRatesConfig() {
        $this->ratesConfig = [
            'base_rates' => [
                'basic' => 5,
                'detailed' => 8,
                'comprehensive' => 12
            ],
            'multipliers' => [
                'language' => [
                    'th' => 1.0,
                    'en' => 1.0,
                    'both' => 1.5
                ],
                'provider' => [
                    'auto' => 1.0,
                    'openai' => 1.0,
                    'claude' => 1.2,
                    'typhoon' => 0.8
                ],
                'persona' => [
                    'researcher' => 1.1,
                    'analyst' => 1.0,
                    'consultant' => 1.2,
                    'writer' => 0.9
                ]
            ],
            'credit_to_baht' => 1.60
        ];
    }
    
    private function ensureDataDirectory() {
        $dataDir = dirname($this->creditFile);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
    }
    
    public function calculateResearchCost($data) {
        $baseRate = $this->ratesConfig['base_rates'][$data['depth']] ?? 8;
        
        // Apply multipliers
        $languageMultiplier = $this->ratesConfig['multipliers']['language'][$data['language']] ?? 1.0;
        $providerMultiplier = $this->ratesConfig['multipliers']['provider'][$data['provider']] ?? 1.0;
        $personaMultiplier = $this->ratesConfig['multipliers']['persona'][$data['persona']] ?? 1.0;
        
        $totalCost = $baseRate * $languageMultiplier * $providerMultiplier * $personaMultiplier;
        
        return max(1, ceil($totalCost)); // Minimum 1 credit
    }
    
    public function getCurrentBalance($userId = null) {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        return $credits[$userId]['balance'] ?? 0;
    }
    
    public function hasEnoughCredits($amount, $userId = null) {
        return $this->getCurrentBalance($userId) >= $amount;
    }
    
    public function deductCredits($amount, $userId = null, $description = 'AI Research') {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        if (!isset($credits[$userId])) {
            $credits[$userId] = [
                'balance' => 0,
                'transactions' => []
            ];
        }
        
        $currentBalance = $credits[$userId]['balance'] ?? 0;
        
        if ($currentBalance < $amount) {
            throw new Exception('Insufficient credits. Current balance: ' . $currentBalance . ', Required: ' . $amount);
        }
        
        // Deduct credits
        $credits[$userId]['balance'] -= $amount;
        
        // Add transaction record
        $credits[$userId]['transactions'][] = [
            'id' => uniqid('txn_'),
            'type' => 'debit',
            'amount' => $amount,
            'description' => $description,
            'timestamp' => date('Y-m-d H:i:s'),
            'balance_after' => $credits[$userId]['balance']
        ];
        
        // Keep only last 100 transactions
        if (count($credits[$userId]['transactions']) > 100) {
            $credits[$userId]['transactions'] = array_slice($credits[$userId]['transactions'], -100);
        }
        
        $this->saveCredits($credits);
        
        return $credits[$userId]['balance'];
    }
    
    public function addCredits($amount, $userId = null, $description = 'Credit Purchase') {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        if (!isset($credits[$userId])) {
            $credits[$userId] = [
                'balance' => 0,
                'transactions' => []
            ];
        }
        
        // Add credits
        $credits[$userId]['balance'] += $amount;
        
        // Add transaction record
        $credits[$userId]['transactions'][] = [
            'id' => uniqid('txn_'),
            'type' => 'credit',
            'amount' => $amount,
            'description' => $description,
            'timestamp' => date('Y-m-d H:i:s'),
            'balance_after' => $credits[$userId]['balance']
        ];
        
        $this->saveCredits($credits);
        
        return $credits[$userId]['balance'];
    }
    
    public function getTransactionHistory($userId = null, $limit = 20) {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        $transactions = $credits[$userId]['transactions'] ?? [];
        
        // Sort by timestamp (newest first)
        usort($transactions, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });
        
        return array_slice($transactions, 0, $limit);
    }
    
    public function getCreditStats($userId = null) {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        $transactions = $credits[$userId]['transactions'] ?? [];
        $balance = $credits[$userId]['balance'] ?? 0;
        
        $totalSpent = 0;
        $totalAdded = 0;
        $researchCount = 0;
        
        foreach ($transactions as $txn) {
            if ($txn['type'] === 'debit') {
                $totalSpent += $txn['amount'];
                if (strpos($txn['description'], 'Research') !== false) {
                    $researchCount++;
                }
            } else {
                $totalAdded += $txn['amount'];
            }
        }
        
        return [
            'current_balance' => $balance,
            'total_spent' => $totalSpent,
            'total_added' => $totalAdded,
            'research_count' => $researchCount,
            'avg_cost_per_research' => $researchCount > 0 ? round($totalSpent / $researchCount, 2) : 0,
            'balance_in_baht' => round($balance * $this->ratesConfig['credit_to_baht'], 2)
        ];
    }
    
    private function loadCredits() {
        if (file_exists($this->creditFile)) {
            $data = file_get_contents($this->creditFile);
            return json_decode($data, true) ?? [];
        }
        
        return [];
    }
    
    private function saveCredits($credits) {
        $data = json_encode($credits, JSON_PRETTY_PRINT);
        file_put_contents($this->creditFile, $data);
    }
    
    private function getCurrentUserId() {
        // In a real application, this would get the authenticated user ID
        // For now, we'll use a session-based approach or default user
        session_start();
        
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['user_id'] = 'demo_user_' . substr(md5($_SERVER['REMOTE_ADDR']), 0, 8);
        }
        
        return $_SESSION['user_id'];
    }
    
    public function initializeDemoCredits($userId = null) {
        $userId = $userId ?? $this->getCurrentUserId();
        $credits = $this->loadCredits();
        
        // Give demo user 50 credits to start
        if (!isset($credits[$userId])) {
            $credits[$userId] = [
                'balance' => 50,
                'transactions' => [
                    [
                        'id' => uniqid('txn_'),
                        'type' => 'credit',
                        'amount' => 50,
                        'description' => 'Welcome Bonus',
                        'timestamp' => date('Y-m-d H:i:s'),
                        'balance_after' => 50
                    ]
                ]
            ];
            
            $this->saveCredits($credits);
        }
        
        return $credits[$userId]['balance'];
    }
    
    public function handleRequest() {
        header('Content-Type: application/json');
        
        try {
            $action = $_GET['action'] ?? '';
            
            switch ($action) {
                case 'get_balance':
                    echo json_encode([
                        'success' => true,
                        'balance' => $this->getCurrentBalance()
                    ]);
                    break;
                    
                case 'get_stats':
                    echo json_encode([
                        'success' => true,
                        'stats' => $this->getCreditStats()
                    ]);
                    break;
                    
                case 'get_history':
                    $limit = (int)($_GET['limit'] ?? 20);
                    echo json_encode([
                        'success' => true,
                        'transactions' => $this->getTransactionHistory(null, $limit)
                    ]);
                    break;
                    
                case 'calculate_cost':
                    $input = json_decode(file_get_contents('php://input'), true);
                    $cost = $this->calculateResearchCost($input);
                    echo json_encode([
                        'success' => true,
                        'cost' => $cost,
                        'cost_baht' => round($cost * $this->ratesConfig['credit_to_baht'], 2)
                    ]);
                    break;
                    
                case 'init_demo':
                    $balance = $this->initializeDemoCredits();
                    echo json_encode([
                        'success' => true,
                        'balance' => $balance,
                        'message' => 'Demo credits initialized'
                    ]);
                    break;
                    
                default:
                    throw new Exception('Unknown action');
            }
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}

// Handle direct requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $calculator = new CreditCalculator();
    $calculator->handleRequest();
}
?>