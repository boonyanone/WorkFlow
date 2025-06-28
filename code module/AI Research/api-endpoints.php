<?php
/**
 * AI Research API Endpoints
 * Handles AJAX requests from frontend
 * 
 * @version 1.0.2
 * @author FlowWork Team
 */

// Security check
if (!defined('FLOWWORK_VERSION')) {
    header('HTTP/1.1 403 Forbidden');
    exit('Access denied');
}

// Start session if not already started
if (!session_id()) {
    session_start();
}

// Include the AI API handler
require_once __DIR__ . '/ai-api-handler.php';

class AIResearchEndpoints {
    
    private $handler;
    
    public function __construct() {
        $this->handler = new AIAPIHandler();
    }
    
    /**
     * Handle API requests
     */
    public function handleRequest() {
        // Set JSON header
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        
        try {
            $action = $_GET['action'] ?? $_POST['action'] ?? '';
            
            switch ($action) {
                case 'research':
                    $this->handleResearch();
                    break;
                    
                case 'status':
                    $this->handleStatus();
                    break;
                    
                case 'usage':
                    $this->handleUsage();
                    break;
                    
                case 'test':
                    $this->handleTest();
                    break;
                    
                default:
                    $this->sendError('Invalid action', 400);
            }
            
        } catch (Exception $e) {
            $this->sendError($e->getMessage(), 500);
        }
    }
    
    /**
     * Handle research request
     */
    private function handleResearch() {
        // Get POST data
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $input = $_POST;
        }
        
        // Validate required fields
        $query = $input['query'] ?? '';
        $persona = $input['persona'] ?? '';
        $model = $input['model'] ?? 'auto';
        
        if (empty($query)) {
            $this->sendError('Query is required', 400);
            return;
        }
        
        if (empty($persona)) {
            $this->sendError('Persona is required', 400);
            return;
        }
        
        // Parse options
        $options = [
            'depth' => intval($input['depth'] ?? 3),
            'language' => $input['language'] ?? 'thai',
            'temperature' => floatval($input['temperature'] ?? 0.7),
            'max_tokens' => intval($input['max_tokens'] ?? 2000),
            'sources' => $input['sources'] ?? ['government', 'academic', 'news'],
            'model' => $model
        ];
        
        // Validate user credits (mock for now)
        $userCredits = $this->getUserCredits();
        $estimatedCost = $this->estimateCost($model, $options['depth']);
        
        if ($userCredits < $estimatedCost) {
            $this->sendError('Insufficient credits', 402);
            return;
        }
        
        // Perform research
        $result = $this->handler->performResearch($query, $persona, $model, $options);
        
        if ($result['success']) {
            // Deduct credits
            $this->deductCredits($result['cost']);
            
            // Send successful response
            $this->sendSuccess([
                'content' => $result['data']['content'],
                'provider' => $result['provider'],
                'model' => $result['model'],
                'cost' => $result['cost'],
                'tokens_used' => $result['tokens_used'],
                'sources' => $result['data']['sources'],
                'timestamp' => $result['data']['timestamp'],
                'remaining_credits' => $this->getUserCredits()
            ]);
        } else {
            $this->sendError($result['error'], 500);
        }
    }
    
    /**
     * Handle status request
     */
    private function handleStatus() {
        $status = $this->handler->getProviderStatus();
        
        $this->sendSuccess([
            'providers' => $status,
            'user_credits' => $this->getUserCredits(),
            'available_models' => [
                'auto' => ['name' => 'Auto Select', 'cost' => 6, 'available' => true],
                'gpt-4' => ['name' => 'GPT-4', 'cost' => 8, 'available' => isset($status['openai'])],
                'claude' => ['name' => 'Claude', 'cost' => 5, 'available' => isset($status['anthropic'])],
                'gemini' => ['name' => 'Gemini', 'cost' => 2, 'available' => isset($status['google'])],
                'typhoon' => ['name' => 'Typhoon', 'cost' => 3, 'available' => isset($status['typhoon'])]
            ]
        ]);
    }
    
    /**
     * Handle usage request
     */
    private function handleUsage() {
        $usage = $_SESSION['ai_usage'] ?? [];
        
        $this->sendSuccess([
            'usage' => $usage,
            'total_requests' => array_sum(array_column($usage, 'requests')),
            'total_tokens' => array_sum(array_column($usage, 'tokens'))
        ]);
    }
    
    /**
     * Handle test request
     */
    private function handleTest() {
        // Simple test to verify API is working
        $testResult = [
            'message' => 'AI Research API is working!',
            'timestamp' => date('Y-m-d H:i:s'),
            'session_id' => session_id(),
            'providers_available' => count($this->handler->getProviderStatus()),
            'user_credits' => $this->getUserCredits()
        ];
        
        $this->sendSuccess($testResult);
    }
    
    /**
     * Get user credits (mock implementation)
     */
    private function getUserCredits() {
        // In production, get from database
        if (!isset($_SESSION['user_credits'])) {
            $_SESSION['user_credits'] = 1246; // Default credits
        }
        
        return $_SESSION['user_credits'];
    }
    
    /**
     * Deduct credits from user account
     */
    private function deductCredits($amount) {
        $currentCredits = $this->getUserCredits();
        $_SESSION['user_credits'] = max(0, $currentCredits - $amount);
        
        // Log the transaction
        error_log("Credits deducted: {$amount}, Remaining: {$_SESSION['user_credits']}");
    }
    
    /**
     * Estimate cost for research
     */
    private function estimateCost($model, $depth) {
        $baseCosts = [
            'auto' => 6,
            'gpt-4' => 8,
            'claude' => 5,
            'gemini' => 2,
            'typhoon' => 3
        ];
        
        $baseCost = $baseCosts[$model] ?? 6;
        $multiplier = 0.7 + ($depth * 0.15); // 0.85x to 1.55x
        
        return round($baseCost * $multiplier);
    }
    
    /**
     * Send success response
     */
    private function sendSuccess($data) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => time()
        ]);
        exit();
    }
    
    /**
     * Send error response
     */
    private function sendError($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => $code,
            'timestamp' => time()
        ]);
        exit();
    }
}

// Handle request if called directly
if (basename($_SERVER['PHP_SELF']) === 'api-endpoints.php') {
    $endpoints = new AIResearchEndpoints();
    $endpoints->handleRequest();
}

// Register WordPress/FlowWork AJAX handlers if available
if (function_exists('add_action')) {
    
    function flowwork_ai_research_ajax() {
        $endpoints = new AIResearchEndpoints();
        $endpoints->handleRequest();
    }
    
    // Register for both logged in and non-logged in users
    add_action('wp_ajax_ai_research', 'flowwork_ai_research_ajax');
    add_action('wp_ajax_nopriv_ai_research', 'flowwork_ai_research_ajax');
}
?>