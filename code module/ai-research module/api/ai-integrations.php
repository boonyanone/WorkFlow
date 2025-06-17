<?php
/**
 * AI Integrations
 * Multi-provider AI API integration
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

class AIIntegrations {
    
    private $config;
    private $apiKeys;
    
    public function __construct() {
        $this->loadConfig();
        $this->loadApiKeys();
    }
    
    private function loadConfig() {
        $configPath = dirname(__DIR__) . '/config/ai-providers.json';
        
        if (file_exists($configPath)) {
            $this->config = json_decode(file_get_contents($configPath), true);
        } else {
            $this->config = $this->getDefaultConfig();
        }
    }
    
    private function getDefaultConfig() {
        return [
            'openai' => [
                'name' => 'OpenAI GPT-4',
                'endpoint' => 'https://api.openai.com/v1/chat/completions',
                'model' => 'gpt-4',
                'max_tokens' => 4000,
                'temperature' => 0.7,
                'cost_per_1k_tokens' => 0.03
            ],
            'claude' => [
                'name' => 'Anthropic Claude',
                'endpoint' => 'https://api.anthropic.com/v1/messages',
                'model' => 'claude-3-sonnet-20240229',
                'max_tokens' => 4000,
                'temperature' => 0.7,
                'cost_per_1k_tokens' => 0.025
            ],
            'typhoon' => [
                'name' => 'SCB Typhoon',
                'endpoint' => 'https://api.opentyphoon.ai/v1/chat/completions',
                'model' => 'typhoon-v1.5x-70b-instruct',
                'max_tokens' => 4000,
                'temperature' => 0.7,
                'cost_per_1k_tokens' => 0.02
            ]
        ];
    }
    
    private function loadApiKeys() {
        // Load from environment or config file
        $this->apiKeys = [
            'openai' => getenv('OPENAI_API_KEY') ?: '',
            'claude' => getenv('ANTHROPIC_API_KEY') ?: '',
            'typhoon' => getenv('TYPHOON_API_KEY') ?: ''
        ];
        
        // Load from config file if not in environment
        $keyPath = dirname(__DIR__) . '/config/api-keys.json';
        if (file_exists($keyPath)) {
            $fileKeys = json_decode(file_get_contents($keyPath), true);
            $this->apiKeys = array_merge($this->apiKeys, $fileKeys);
        }
    }
    
    public function callAI($provider, $prompt, $options = []) {
        $startTime = microtime(true);
        
        try {
            switch ($provider) {
                case 'openai':
                    $result = $this->callOpenAI($prompt, $options);
                    break;
                    
                case 'claude':
                    $result = $this->callClaude($prompt, $options);
                    break;
                    
                case 'typhoon':
                    $result = $this->callTyphoon($prompt, $options);
                    break;
                    
                default:
                    throw new Exception('Unsupported AI provider: ' . $provider);
            }
            
            $processingTime = microtime(true) - $startTime;
            
            return [
                'content' => $result['content'],
                'provider' => $provider,
                'model' => $this->config[$provider]['model'],
                'processing_time' => round($processingTime, 2),
                'tokens_used' => $result['tokens_used'] ?? 0,
                'cost' => $result['cost'] ?? 0
            ];
            
        } catch (Exception $e) {
            // Log error and try fallback
            error_log("AI API Error ({$provider}): " . $e->getMessage());
            
            // Try fallback provider
            if ($provider !== 'openai') {
                return $this->callAI('openai', $prompt, $options);
            }
            
            throw $e;
        }
    }
    
    private function callOpenAI($prompt, $options) {
        $apiKey = $this->apiKeys['openai'];
        if (empty($apiKey)) {
            throw new Exception('OpenAI API key not configured');
        }
        
        $config = $this->config['openai'];
        
        $data = [
            'model' => $config['model'],
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => $config['max_tokens'],
            'temperature' => $config['temperature']
        ];
        
        $response = $this->makeApiRequest($config['endpoint'], $data, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ]);
        
        if (!$response || !isset($response['choices'][0]['message']['content'])) {
            throw new Exception('Invalid OpenAI response');
        }
        
        $tokensUsed = $response['usage']['total_tokens'] ?? 0;
        $cost = ($tokensUsed / 1000) * $config['cost_per_1k_tokens'];
        
        return [
            'content' => $response['choices'][0]['message']['content'],
            'tokens_used' => $tokensUsed,
            'cost' => $cost
        ];
    }
    
    private function callClaude($prompt, $options) {
        $apiKey = $this->apiKeys['claude'];
        if (empty($apiKey)) {
            throw new Exception('Claude API key not configured');
        }
        
        $config = $this->config['claude'];
        
        $data = [
            'model' => $config['model'],
            'max_tokens' => $config['max_tokens'],
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ]
        ];
        
        $response = $this->makeApiRequest($config['endpoint'], $data, [
            'x-api-key: ' . $apiKey,
            'Content-Type: application/json',
            'anthropic-version: 2023-06-01'
        ]);
        
        if (!$response || !isset($response['content'][0]['text'])) {
            throw new Exception('Invalid Claude response');
        }
        
        $tokensUsed = ($response['usage']['input_tokens'] ?? 0) + ($response['usage']['output_tokens'] ?? 0);
        $cost = ($tokensUsed / 1000) * $config['cost_per_1k_tokens'];
        
        return [
            'content' => $response['content'][0]['text'],
            'tokens_used' => $tokensUsed,
            'cost' => $cost
        ];
    }
    
    private function callTyphoon($prompt, $options) {
        $apiKey = $this->apiKeys['typhoon'];
        if (empty($apiKey)) {
            // Fallback to mock response for demo
            return $this->getMockTyphoonResponse($prompt);
        }
        
        $config = $this->config['typhoon'];
        
        $data = [
            'model' => $config['model'],
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'max_tokens' => $config['max_tokens'],
            'temperature' => $config['temperature']
        ];
        
        $response = $this->makeApiRequest($config['endpoint'], $data, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ]);
        
        if (!$response || !isset($response['choices'][0]['message']['content'])) {
            throw new Exception('Invalid Typhoon response');
        }
        
        $tokensUsed = $response['usage']['total_tokens'] ?? 0;
        $cost = ($tokensUsed / 1000) * $config['cost_per_1k_tokens'];
        
        return [
            'content' => $response['choices'][0]['message']['content'],
            'tokens_used' => $tokensUsed,
            'cost' => $cost
        ];
    }
    
    private function getMockTyphoonResponse($prompt) {
        // Mock response for demo purposes
        sleep(2); // Simulate API delay
        
        return [
            'content' => "นี่คือการตอบกลับจำลองจาก Typhoon AI สำหรับคำถาม: " . substr($prompt, 0, 100) . "...\n\n" .
                        "ในการวิจัยนี้ จะพบว่ามีข้อมูลที่น่าสนใจหลายประการ และสามารถสรุปได้ดังนี้:\n\n" .
                        "1. ข้อมูลหลักและการวิเคราะห์\n" .
                        "2. แนวโน้มและการพัฒนา\n" .
                        "3. ข้อเสนอแนะและแนวทางปฏิบัติ\n\n" .
                        "สำหรับข้อมูลเพิ่มเติม สามารถศึกษาจากแหล่งข้อมูลที่เชื่อถือได้",
            'tokens_used' => 150,
            'cost' => 0.003
        ];
    }
    
    private function makeApiRequest($url, $data, $headers) {
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYPEER => false
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        
        curl_close($ch);
        
        if ($error) {
            throw new Exception('API request failed: ' . $error);
        }
        
        if ($httpCode !== 200) {
            throw new Exception('API returned HTTP ' . $httpCode . ': ' . $response);
        }
        
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON response from API');
        }
        
        return $decoded;
    }
    
    public function getAvailableProviders() {
        $providers = [];
        
        foreach ($this->config as $key => $config) {
            $providers[$key] = [
                'name' => $config['name'],
                'available' => !empty($this->apiKeys[$key]),
                'cost_per_1k_tokens' => $config['cost_per_1k_tokens']
            ];
        }
        
        return $providers;
    }
}
?>