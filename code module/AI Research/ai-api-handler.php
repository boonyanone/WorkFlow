<?php
/**
 * AI API Handler for FlowWork AI Research Module
 * Handles multi-provider AI API integration
 * 
 * @version 1.0.2
 * @author FlowWork Team
 */

// Security check
if (!defined('FLOWWORK_VERSION')) {
    die('Access denied');
}

class AIAPIHandler {
    
    private $apiKeys;
    private $endpoints;
    private $models;
    private $rateLimits;
    private $usage;
    
    public function __construct() {
        $this->loadConfiguration();
        $this->initializeProviders();
        $this->loadUsageData();
    }
    
    /**
     * Load API configuration
     */
    private function loadConfiguration() {
        // Load from environment variables or config file
        $this->apiKeys = [
            'openai' => getenv('OPENAI_API_KEY') ?: '',
            'anthropic' => getenv('ANTHROPIC_API_KEY') ?: '',
            'google' => getenv('GOOGLE_AI_API_KEY') ?: '',
            'typhoon' => getenv('TYPHOON_API_KEY') ?: ''
        ];
        
        $this->endpoints = [
            'openai' => 'https://api.openai.com/v1/chat/completions',
            'anthropic' => 'https://api.anthropic.com/v1/messages',
            'google' => 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            'typhoon' => 'https://api.opentyphoon.ai/v1/chat/completions'
        ];
        
        $this->models = [
            'auto' => 'gpt-4o-mini', // Default fallback
            'gpt-4' => 'gpt-4o',
            'claude' => 'claude-3-sonnet-20240229',
            'gemini' => 'gemini-pro',
            'typhoon' => 'typhoon-v1.5x-70b-instruct'
        ];
        
        $this->rateLimits = [
            'openai' => ['requests_per_minute' => 60, 'tokens_per_minute' => 150000],
            'anthropic' => ['requests_per_minute' => 50, 'tokens_per_minute' => 100000],
            'google' => ['requests_per_minute' => 60, 'tokens_per_minute' => 32000],
            'typhoon' => ['requests_per_minute' => 30, 'tokens_per_minute' => 50000]
        ];
    }
    
    /**
     * Initialize AI providers
     */
    private function initializeProviders() {
        // Check which providers are available
        $this->availableProviders = [];
        
        foreach ($this->apiKeys as $provider => $key) {
            if (!empty($key)) {
                $this->availableProviders[] = $provider;
            }
        }
        
        if (empty($this->availableProviders)) {
            error_log('Warning: No AI API keys configured for FlowWork AI Research');
        }
    }
    
    /**
     * Load usage data for rate limiting
     */
    private function loadUsageData() {
        // Load from cache/database - for now use session
        if (!isset($_SESSION['ai_usage'])) {
            $_SESSION['ai_usage'] = [
                'openai' => ['requests' => 0, 'tokens' => 0, 'last_reset' => time()],
                'anthropic' => ['requests' => 0, 'tokens' => 0, 'last_reset' => time()],
                'google' => ['requests' => 0, 'tokens' => 0, 'last_reset' => time()],
                'typhoon' => ['requests' => 0, 'tokens' => 0, 'last_reset' => time()]
            ];
        }
        
        $this->usage = $_SESSION['ai_usage'];
    }
    
    /**
     * Main research function
     */
    public function performResearch($query, $persona, $model = 'auto', $options = []) {
        try {
            // Validate input
            if (empty($query) || empty($persona)) {
                throw new Exception('Query and persona are required');
            }
            
            // Determine best provider
            $provider = $this->selectProvider($model);
            if (!$provider) {
                throw new Exception('No available AI providers');
            }
            
            // Build prompt based on persona
            $prompt = $this->buildPersonaPrompt($query, $persona, $options);
            
            // Make API call
            $response = $this->makeAPICall($provider, $prompt, $options);
            
            // Process and format response
            $result = $this->processResponse($response, $provider, $query);
            
            // Log usage
            $this->logUsage($provider, $result['tokens_used'], $result['cost']);
            
            return [
                'success' => true,
                'data' => $result,
                'provider' => $provider,
                'model' => $this->models[$model],
                'cost' => $result['cost'],
                'tokens_used' => $result['tokens_used']
            ];
            
        } catch (Exception $e) {
            error_log('AI Research Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'provider' => $provider ?? 'unknown'
            ];
        }
    }
    
    /**
     * Select best provider based on model and availability
     */
    private function selectProvider($model) {
        // If specific model requested, use that provider
        if ($model !== 'auto') {
            $providerMap = [
                'gpt-4' => 'openai',
                'claude' => 'anthropic',
                'gemini' => 'google',
                'typhoon' => 'typhoon'
            ];
            
            $targetProvider = $providerMap[$model] ?? null;
            if ($targetProvider && in_array($targetProvider, $this->availableProviders)) {
                if ($this->checkRateLimit($targetProvider)) {
                    return $targetProvider;
                }
            }
        }
        
        // Auto-select best available provider
        $priorities = ['openai', 'anthropic', 'google', 'typhoon'];
        
        foreach ($priorities as $provider) {
            if (in_array($provider, $this->availableProviders) && $this->checkRateLimit($provider)) {
                return $provider;
            }
        }
        
        return null;
    }
    
    /**
     * Check rate limits for provider
     */
    private function checkRateLimit($provider) {
        $usage = $this->usage[$provider] ?? [];
        $limits = $this->rateLimits[$provider] ?? [];
        
        // Reset if over 1 minute
        if (time() - $usage['last_reset'] > 60) {
            $this->usage[$provider] = [
                'requests' => 0,
                'tokens' => 0,
                'last_reset' => time()
            ];
            $_SESSION['ai_usage'] = $this->usage;
            return true;
        }
        
        // Check limits
        if ($usage['requests'] >= $limits['requests_per_minute']) {
            return false;
        }
        
        if ($usage['tokens'] >= $limits['tokens_per_minute']) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Build persona-based prompt
     */
    private function buildPersonaPrompt($query, $persona, $options = []) {
        $personas = [
            'student' => 'คุณเป็นผู้ช่วยวิจัยสำหรับนักเรียนและนักศึกษา โดยให้ข้อมูลที่เป็นประโยชน์สำหรับการทำรายงาน การบ้าน และการเตรียมสอบ',
            'business' => 'คุณเป็นที่ปรึกษาธุรกิจที่ช่วยวิเคราะห์ตลาด สร้างแผนธุรกิจ และให้คำแนะนำเชิงกลยุทธ์สำหรับองค์กร',
            'government' => 'คุณเป็นผู้เชียวชาญด้านการบริหารราชการ ช่วยจัดทำรายงานวิชาการ วิเคราะห์นโยบายสาธารณะ และให้คำแนะนำเรื่องระเบียบราชการ',
            'researcher' => 'คุณเป็นผู้ช่วยวิจัยระดับสูง ช่วยในการทำงานวิจัยเชิงวิชาการ การทบทวนวรรณกรรม และการวิเคราะห์ข้อมูลอย่างลึกซึ้ง',
            'general' => 'คุณเป็นผู้ช่วยส่วนตัวที่เป็นมิตร ช่วยตอบคำถามทั่วไป ให้คำแนะนำด้านการเงินส่วนตัว และช่วยในการตัดสินใจในชีวิตประจำวัน',
            'organization' => 'คุณเป็นที่ปรึกษาระดับผู้บริหารสำหรับองค์กรและ SME ช่วยในการวางแผนเชิงกลยุทธ์ การจัดการทีมงาน และการขับเคลื่อนการเติบโตของธุรกิจ'
        ];
        
        $personaPrompt = $personas[$persona] ?? $personas['general'];
        
        $depth = $options['depth'] ?? 3;
        $language = $options['language'] ?? 'thai';
        $sources = $options['sources'] ?? ['government', 'academic', 'news'];
        
        $depthInstructions = [
            1 => 'ให้คำตอบสั้นและกระชับ',
            2 => 'ให้คำตอบปานกลางพร้อมตัวอย่าง',
            3 => 'ให้คำตอบละเอียดพร้อมการวิเคราะห์',
            4 => 'ให้คำตอบเชิงลึกพร้อมข้อมูลเปรียบเทียบ',
            5 => 'ให้คำตอบครอบคลุมทุกมิติพร้อมการวิเคราะห์เชิงซับซ้อน'
        ];
        
        $languageInstruction = $language === 'thai' ? 'ตอบเป็นภาษาไทย' : 
                              ($language === 'english' ? 'ตอบเป็นภาษาอังกฤษ' : 'ตอบทั้งภาษาไทยและอังกฤษ');
        
        $prompt = $personaPrompt . "\n\n";
        $prompt .= "คำถาม: " . $query . "\n\n";
        $prompt .= "คำแนะนำ:\n";
        $prompt .= "- " . $depthInstructions[$depth] . "\n";
        $prompt .= "- " . $languageInstruction . "\n";
        $prompt .= "- ให้ข้อมูลที่ถูกต้องและทันสมัย\n";
        $prompt .= "- ระบุแหล่งที่มาที่เชื่อถือได้\n";
        $prompt .= "- จัดรูปแบบให้อ่านง่าย\n\n";
        $prompt .= "โปรดตอบคำถามด้วยข้อมูลที่มีคุณภาพและเป็นประโยชน์";
        
        return $prompt;
    }
    
    /**
     * Make API call to selected provider
     */
    private function makeAPICall($provider, $prompt, $options = []) {
        $apiKey = $this->apiKeys[$provider];
        $endpoint = $this->endpoints[$provider];
        $model = $this->models[$options['model'] ?? 'auto'];
        
        // Adjust model based on provider
        if ($provider === 'openai') {
            $model = $options['model'] === 'gpt-4' ? 'gpt-4o' : 'gpt-4o-mini';
        }
        
        $headers = $this->getHeaders($provider, $apiKey);
        $payload = $this->buildPayload($provider, $model, $prompt, $options);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new Exception("cURL Error: " . $error);
        }
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP Error $httpCode: " . $response);
        }
        
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response");
        }
        
        return $decoded;
    }
    
    /**
     * Get headers for specific provider
     */
    private function getHeaders($provider, $apiKey) {
        switch ($provider) {
            case 'openai':
                return [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $apiKey
                ];
                
            case 'anthropic':
                return [
                    'Content-Type: application/json',
                    'x-api-key: ' . $apiKey,
                    'anthropic-version: 2023-06-01'
                ];
                
            case 'google':
                return [
                    'Content-Type: application/json'
                ];
                
            case 'typhoon':
                return [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $apiKey
                ];
                
            default:
                return ['Content-Type: application/json'];
        }
    }
    
    /**
     * Build payload for specific provider
     */
    private function buildPayload($provider, $model, $prompt, $options = []) {
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 2000;
        
        switch ($provider) {
            case 'openai':
                return [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => $temperature,
                    'max_tokens' => $maxTokens
                ];
                
            case 'anthropic':
                return [
                    'model' => $model,
                    'max_tokens' => $maxTokens,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => $temperature
                ];
                
            case 'google':
                return [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'temperature' => $temperature,
                        'maxOutputTokens' => $maxTokens
                    ]
                ];
                
            case 'typhoon':
                return [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => $temperature,
                    'max_tokens' => $maxTokens
                ];
                
            default:
                return [];
        }
    }
    
    /**
     * Process API response
     */
    private function processResponse($response, $provider, $query) {
        $content = '';
        $tokensUsed = 0;
        $cost = 0;
        
        switch ($provider) {
            case 'openai':
                $content = $response['choices'][0]['message']['content'] ?? '';
                $tokensUsed = $response['usage']['total_tokens'] ?? 0;
                $cost = $this->calculateCost('openai', $tokensUsed);
                break;
                
            case 'anthropic':
                $content = $response['content'][0]['text'] ?? '';
                $tokensUsed = ($response['usage']['input_tokens'] ?? 0) + ($response['usage']['output_tokens'] ?? 0);
                $cost = $this->calculateCost('anthropic', $tokensUsed);
                break;
                
            case 'google':
                $content = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
                $tokensUsed = $response['usageMetadata']['totalTokenCount'] ?? 0;
                $cost = $this->calculateCost('google', $tokensUsed);
                break;
                
            case 'typhoon':
                $content = $response['choices'][0]['message']['content'] ?? '';
                $tokensUsed = $response['usage']['total_tokens'] ?? 0;
                $cost = $this->calculateCost('typhoon', $tokensUsed);
                break;
        }
        
        return [
            'content' => $content,
            'tokens_used' => $tokensUsed,
            'cost' => $cost,
            'query' => $query,
            'timestamp' => time(),
            'sources' => $this->extractSources($content)
        ];
    }
    
    /**
     * Calculate cost based on provider and tokens
     */
    private function calculateCost($provider, $tokens) {
        $rates = [
            'openai' => 0.000015,   // $0.015 per 1K tokens (GPT-4o-mini)
            'anthropic' => 0.000018, // $0.018 per 1K tokens (Claude Sonnet)
            'google' => 0.000007,    // $0.007 per 1K tokens (Gemini Pro)
            'typhoon' => 0.000012    // $0.012 per 1K tokens (estimated)
        ];
        
        $rate = $rates[$provider] ?? 0.000015;
        return round($tokens * $rate * 34, 2); // Convert to THB (34 THB/USD)
    }
    
    /**
     * Extract sources from content (basic implementation)
     */
    private function extractSources($content) {
        // This is a placeholder - in real implementation, would use NLP to extract sources
        return [
            ['title' => 'ธนาคารแห่งประเทศไทย', 'url' => 'https://bot.or.th', 'trust' => 'high'],
            ['title' => 'กระทรวงการคลัง', 'url' => 'https://mof.go.th', 'trust' => 'high'],
            ['title' => 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', 'url' => 'https://nesdc.go.th', 'trust' => 'high']
        ];
    }
    
    /**
     * Log usage for analytics and billing
     */
    private function logUsage($provider, $tokens, $cost) {
        // Update session usage
        $this->usage[$provider]['requests']++;
        $this->usage[$provider]['tokens'] += $tokens;
        $_SESSION['ai_usage'] = $this->usage;
        
        // Log to file/database for billing
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'provider' => $provider,
            'tokens' => $tokens,
            'cost' => $cost,
            'user_id' => $_SESSION['user_id'] ?? 'anonymous'
        ];
        
        // In production, save to database
        error_log('AI Usage: ' . json_encode($logEntry));
    }
    
    /**
     * Get provider status and costs
     */
    public function getProviderStatus() {
        $status = [];
        
        foreach ($this->availableProviders as $provider) {
            $status[$provider] = [
                'available' => !empty($this->apiKeys[$provider]),
                'rate_limited' => !$this->checkRateLimit($provider),
                'usage' => $this->usage[$provider] ?? [],
                'cost_per_1k_tokens' => $this->calculateCost($provider, 1000)
            ];
        }
        
        return $status;
    }
}

// Usage example for testing
if (!function_exists('test_ai_research')) {
    function test_ai_research() {
        if (!session_id()) session_start();
        
        $handler = new AIAPIHandler();
        
        $result = $handler->performResearch(
            "แนวโน้มการลงทุนใน AI ในประเทศไทย 2025",
            "business",
            "auto",
            [
                'depth' => 3,
                'language' => 'thai',
                'temperature' => 0.7,
                'max_tokens' => 1500
            ]
        );
        
        return $result;
    }
}
?>