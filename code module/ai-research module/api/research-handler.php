<?php
/**
 * AI Research Handler
 * Main backend processor for research requests
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

// Prevent direct access
if (!defined('FLOWWORK_PATH')) {
    define('FLOWWORK_PATH', dirname(dirname(dirname(__DIR__))));
}

require_once __DIR__ . '/ai-integrations.php';
require_once __DIR__ . '/credit-calculator.php';

class ResearchHandler {
    
    private $aiIntegration;
    private $creditCalculator;
    private $config;
    
    public function __construct() {
        $this->aiIntegration = new AIIntegrations();
        $this->creditCalculator = new CreditCalculator();
        $this->loadConfig();
    }
    
    private function loadConfig() {
        $configPath = dirname(__DIR__) . '/manifest.json';
        if (file_exists($configPath)) {
            $this->config = json_decode(file_get_contents($configPath), true);
        }
    }
    
    public function handleRequest() {
        // Set JSON header
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit;
        }
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $action = $input['action'] ?? $_GET['action'] ?? '';
            
            switch ($action) {
                case 'start_research':
                    $this->startResearch($input);
                    break;
                    
                case 'get_research_status':
                    $this->getResearchStatus($input);
                    break;
                    
                case 'cancel_research':
                    $this->cancelResearch($input);
                    break;
                    
                default:
                    throw new Exception('Unknown action: ' . $action);
            }
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function startResearch($data) {
        // Validate input
        $this->validateResearchData($data);
        
        // Calculate cost
        $cost = $this->creditCalculator->calculateResearchCost($data);
        
        // Check credit balance
        if (!$this->creditCalculator->hasEnoughCredits($cost)) {
            throw new Exception('เครดิตไม่เพียงพอ ต้องการ ' . $cost . ' credits');
        }
        
        // Deduct credits
        $this->creditCalculator->deductCredits($cost);
        
        // Process research
        $result = $this->processResearch($data);
        
        // Save research history
        $this->saveResearchHistory($data, $result, $cost);
        
        echo json_encode([
            'success' => true,
            'data' => $result,
            'cost' => $cost,
            'remaining_credits' => $this->creditCalculator->getCurrentBalance()
        ]);
    }
    
    private function validateResearchData($data) {
        $required = ['topic', 'persona', 'depth', 'language', 'provider'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Missing required field: {$field}");
            }
        }
        
        // Validate persona
        $validPersonas = ['researcher', 'analyst', 'consultant', 'writer'];
        if (!in_array($data['persona'], $validPersonas)) {
            throw new Exception('Invalid persona');
        }
        
        // Validate depth
        $validDepths = ['basic', 'detailed', 'comprehensive'];
        if (!in_array($data['depth'], $validDepths)) {
            throw new Exception('Invalid research depth');
        }
        
        // Validate language
        $validLanguages = ['th', 'en', 'both'];
        if (!in_array($data['language'], $validLanguages)) {
            throw new Exception('Invalid language');
        }
        
        // Topic length check
        if (strlen($data['topic']) > 500) {
            throw new Exception('Research topic too long (max 500 characters)');
        }
    }
    
    private function processResearch($data) {
        // Load persona configuration
        $persona = $this->loadPersona($data['persona']);
        
        // Build research prompt
        $prompt = $this->buildResearchPrompt($data, $persona);
        
        // Select AI provider
        $provider = $this->selectAIProvider($data['provider'], $data);
        
        // Call AI API
        $aiResponse = $this->aiIntegration->callAI($provider, $prompt, $data);
        
        // Process and format response
        $result = $this->formatResponse($aiResponse, $data);
        
        return $result;
    }
    
    private function loadPersona($personaType) {
        $personasPath = dirname(__DIR__) . '/config/personas.json';
        
        if (file_exists($personasPath)) {
            $personas = json_decode(file_get_contents($personasPath), true);
            return $personas[$personaType] ?? $personas['researcher'];
        }
        
        // Fallback persona configurations
        $defaultPersonas = [
            'researcher' => [
                'name' => 'นักวิจัย',
                'description' => 'วิเคราะห์อย่างลึกซึ้ง อ้างอิงวิชาการ',
                'prompt_prefix' => 'คุณเป็นนักวิจัยที่มีความเชี่ยวชาญ ให้วิเคราะห์และวิจัยหัวข้อต่อไปนี้อย่างละเอียดและมีแหล่งอ้างอิง:',
                'style' => 'academic',
                'focus' => 'depth and accuracy'
            ],
            'analyst' => [
                'name' => 'นักวิเคราะห์',
                'description' => 'มุ่งเน้นข้อมูล สถิติ และแนวโน้ม',
                'prompt_prefix' => 'คุณเป็นนักวิเคราะห์ข้อมูล ให้วิเคราะห์หัวข้อต่อไปนี้โดยเน้นข้อมูล สถิติ และแนวโน้ม:',
                'style' => 'analytical',
                'focus' => 'data and trends'
            ],
            'consultant' => [
                'name' => 'ที่ปรึกษา',
                'description' => 'คำแนะนำเชิงธุรกิจ แนวทางปฏิบัติ',
                'prompt_prefix' => 'คุณเป็นที่ปรึกษาธุรกิจที่มีประสบการณ์ ให้คำแนะนำเชิงปฏิบัติสำหรับหัวข้อต่อไปนี้:',
                'style' => 'practical',
                'focus' => 'actionable insights'
            ],
            'writer' => [
                'name' => 'นักเขียน',
                'description' => 'เนื้อหาที่อ่านง่าย สื่อสารชัดเจน',
                'prompt_prefix' => 'คุณเป็นนักเขียนที่มีทักษะในการสื่อสาร ให้เขียนเกี่ยวกับหัวข้อต่อไปนี้ให้อ่านง่ายและเข้าใจได้ชัดเจน:',
                'style' => 'accessible',
                'focus' => 'clarity and engagement'
            ]
        ];
        
        return $defaultPersonas[$personaType] ?? $defaultPersonas['researcher'];
    }
    
    private function buildResearchPrompt($data, $persona) {
        $prompt = $persona['prompt_prefix'] . "\n\n";
        $prompt .= "หัวข้อวิจัย: " . $data['topic'] . "\n";
        
        if (!empty($data['details'])) {
            $prompt .= "รายละเอียดเพิ่มเติม: " . $data['details'] . "\n";
        }
        
        // Add depth instructions
        switch ($data['depth']) {
            case 'basic':
                $prompt .= "\nให้ข้อมูลพื้นฐานและสรุปหลักการสำคัญ (ประมาณ 300-500 คำ)";
                break;
            case 'detailed':
                $prompt .= "\nให้ข้อมูลละเอียดพร้อมการวิเคราะห์ (ประมาณ 800-1200 คำ)";
                break;
            case 'comprehensive':
                $prompt .= "\nให้ข้อมูลครบถ้วนและการวิเคราะห์เชิงลึก (ประมาณ 1500-2000 คำ)";
                break;
        }
        
        // Add language instructions
        switch ($data['language']) {
            case 'th':
                $prompt .= "\nตอบเป็นภาษาไทยเท่านั้น";
                break;
            case 'en':
                $prompt .= "\nRespond in English only";
                break;
            case 'both':
                $prompt .= "\nให้ข้อมูลเป็นภาษาไทยและแปลสรุปสำคัญเป็นภาษาอังกฤษด้วย";
                break;
        }
        
        $prompt .= "\n\nให้จัดรูปแบบดังนี้:";
        $prompt .= "\n1. สรุปสำคัญ";
        $prompt .= "\n2. รายละเอียดการวิจัย";
        $prompt .= "\n3. แหล่งข้อมูลอ้างอิง (ถ้ามี)";
        
        return $prompt;
    }
    
    private function selectAIProvider($requested, $data) {
        if ($requested !== 'auto') {
            return $requested;
        }
        
        // Auto-select based on criteria
        if ($data['language'] === 'th' || $data['language'] === 'both') {
            return 'typhoon'; // Best for Thai
        }
        
        if ($data['depth'] === 'comprehensive') {
            return 'claude'; // Best for long-form content
        }
        
        return 'openai'; // Default to GPT-4
    }
    
    private function formatResponse($aiResponse, $data) {
        // Parse AI response into structured format
        $content = $aiResponse['content'] ?? '';
        
        // Try to extract sections
        $sections = $this->extractSections($content);
        
        return [
            'id' => uniqid('research_'),
            'timestamp' => date('Y-m-d H:i:s'),
            'topic' => $data['topic'],
            'persona' => $data['persona'],
            'summary' => $sections['summary'] ?? $this->generateSummary($content),
            'content' => $sections['content'] ?? $content,
            'sources' => $sections['sources'] ?? [],
            'metadata' => [
                'depth' => $data['depth'],
                'language' => $data['language'],
                'provider' => $aiResponse['provider'] ?? 'unknown',
                'word_count' => str_word_count(strip_tags($content)),
                'processing_time' => $aiResponse['processing_time'] ?? 0
            ]
        ];
    }
    
    private function extractSections($content) {
        $sections = [];
        
        // Simple section extraction (can be improved with NLP)
        if (preg_match('/สรุปสำคัญ:?\s*(.*?)(?=รายละเอียด|$)/is', $content, $matches)) {
            $sections['summary'] = trim($matches[1]);
        }
        
        if (preg_match('/รายละเอียด.*?:?\s*(.*?)(?=แหล่งข้อมูล|$)/is', $content, $matches)) {
            $sections['content'] = trim($matches[1]);
        }
        
        // Extract sources
        if (preg_match_all('/(?:https?:\/\/[^\s]+|www\.[^\s]+)/i', $content, $matches)) {
            $sections['sources'] = array_map(function($url) {
                return [
                    'url' => $url,
                    'title' => $this->extractTitleFromUrl($url)
                ];
            }, array_unique($matches[0]));
        }
        
        return $sections;
    }
    
    private function generateSummary($content) {
        // Simple summary extraction (first paragraph or first 200 chars)
        $paragraphs = explode("\n\n", $content);
        $firstParagraph = trim($paragraphs[0]);
        
        if (strlen($firstParagraph) > 50) {
            return $firstParagraph;
        }
        
        return substr($content, 0, 200) . '...';
    }
    
    private function extractTitleFromUrl($url) {
        // Simple URL title extraction (domain name)
        $parsed = parse_url($url);
        return $parsed['host'] ?? $url;
    }
    
    private function saveResearchHistory($data, $result, $cost) {
        $historyPath = dirname(__DIR__) . '/data/research_history.json';
        
        // Ensure data directory exists
        $dataDir = dirname($historyPath);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        // Load existing history
        $history = [];
        if (file_exists($historyPath)) {
            $history = json_decode(file_get_contents($historyPath), true) ?? [];
        }
        
        // Add new research
        $history[] = [
            'id' => $result['id'],
            'timestamp' => $result['timestamp'],
            'topic' => $data['topic'],
            'persona' => $data['persona'],
            'depth' => $data['depth'],
            'language' => $data['language'],
            'provider' => $result['metadata']['provider'],
            'cost' => $cost,
            'word_count' => $result['metadata']['word_count']
        ];
        
        // Keep only last 100 records
        if (count($history) > 100) {
            $history = array_slice($history, -100);
        }
        
        // Save history
        file_put_contents($historyPath, json_encode($history, JSON_PRETTY_PRINT));
    }
    
    private function getResearchStatus($data) {
        // For future implementation of async research
        echo json_encode([
            'success' => true,
            'status' => 'completed',
            'progress' => 100
        ]);
    }
    
    private function cancelResearch($data) {
        // For future implementation of cancellable research
        echo json_encode([
            'success' => true,
            'message' => 'Research cancelled'
        ]);
    }
}

// Handle request if called directly
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET') {
    $handler = new ResearchHandler();
    $handler->handleRequest();
}
?>