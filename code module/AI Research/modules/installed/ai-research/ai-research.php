<?php
/**
 * AI Research Module - Main Controller
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

// Security check
if (!defined('FLOWWORK_VERSION')) {
    die('Access denied');
}

class AIResearchModule {
    
    private $config;
    private $personas;
    private $aiProviders;
    
    public function __construct() {
        $this->loadConfig();
        $this->loadPersonas();
        $this->initAIProviders();
    }
    
    /**
     * Module initialization
     */
    public function init() {
        // Register hooks
        add_action('flowwork_init', [$this, 'registerRoutes']);
        add_action('flowwork_enqueue_scripts', [$this, 'enqueueAssets']);
        
        // Register API endpoints
        $this->registerAPIEndpoints();
        
        return true;
    }
    
    /**
     * Render main interface
     */
    public function render($container = null) {
        ob_start();
        include __DIR__ . '/ui/research-interface.php';
        $content = ob_get_clean();
        
        if ($container) {
            echo $content;
            return true;
        }
        
        return $content;
    }
    
    /**
     * Load module configuration
     */
    private function loadConfig() {
        $configFile = __DIR__ . '/config/settings.json';
        if (file_exists($configFile)) {
            $this->config = json_decode(file_get_contents($configFile), true);
        } else {
            $this->config = $this->getDefaultConfig();
            $this->saveConfig();
        }
    }
    
    /**
     * Load persona configurations
     */
    private function loadPersonas() {
        $personaFile = __DIR__ . '/config/personas.json';
        if (file_exists($personaFile)) {
            $this->personas = json_decode(file_get_contents($personaFile), true);
        } else {
            $this->personas = $this->getDefaultPersonas();
            $this->savePersonas();
        }
    }
    
    /**
     * Initialize AI providers
     */
    private function initAIProviders() {
        $this->aiProviders = [
            'openai' => new OpenAIProvider($this->config['apis']['openai']),
            'anthropic' => new AnthropicProvider($this->config['apis']['anthropic']),
            'google' => new GoogleAIProvider($this->config['apis']['google']),
            'scb' => new SCBTyphoonProvider($this->config['apis']['scb'])
        ];
    }
    
    /**
     * Register API endpoints
     */
    private function registerAPIEndpoints() {
        // Research endpoints
        add_action('wp_ajax_ai_research_query', [$this, 'handleResearchQuery']);
        add_action('wp_ajax_ai_research_export', [$this, 'handleExportRequest']);
        
        // Team endpoints  
        add_action('wp_ajax_ai_research_create_team', [$this, 'handleCreateTeam']);
        add_action('wp_ajax_ai_research_invite_team', [$this, 'handleInviteTeam']);
        
        // OAuth endpoints
        add_action('wp_ajax_ai_research_oauth_google', [$this, 'handleGoogleOAuth']);
        add_action('wp_ajax_ai_research_oauth_microsoft', [$this, 'handleMicrosoftOAuth']);
    }
    
    /**
     * Handle research query
     */
    public function handleResearchQuery() {
        try {
            // Verify nonce for security
            if (!wp_verify_nonce($_POST['nonce'], 'ai_research_nonce')) {
                throw new Exception('Security check failed');
            }
            
            $query = sanitize_text_field($_POST['query']);
            $persona = sanitize_text_field($_POST['persona']);
            $aiModel = sanitize_text_field($_POST['ai_model']);
            $userId = get_current_user_id();
            
            // Get user credits
            $userCredits = $this->getUserCredits($userId);
            
            // Calculate cost
            $estimatedCost = $this->calculateQueryCost($query, $aiModel);
            
            if ($userCredits < $estimatedCost) {
                throw new Exception('Insufficient credits');
            }
            
            // Process research
            $result = $this->processResearch([
                'query' => $query,
                'persona' => $persona,
                'ai_model' => $aiModel,
                'user_id' => $userId
            ]);
            
            // Deduct credits
            $this->deductCredits($userId, $result['cost']);
            
            wp_send_json_success([
                'result' => $result,
                'remaining_credits' => $userCredits - $result['cost']
            ]);
            
        } catch (Exception $e) {
            wp_send_json_error([
                'message' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Process AI research
     */
    private function processResearch($params) {
        $startTime = microtime(true);
        
        // Get persona prompt
        $personaPrompt = $this->getPersonaPrompt($params['persona']);
        
        // Build enhanced prompt
        $enhancedPrompt = $this->buildEnhancedPrompt(
            $params['query'], 
            $personaPrompt
        );
        
        // Select AI provider
        $provider = $this->selectAIProvider($params['ai_model']);
        
        // Execute research
        $aiResponse = $provider->query($enhancedPrompt);
        
        // Process and enhance response
        $processedResult = $this->processAIResponse($aiResponse, $params);
        
        $endTime = microtime(true);
        
        // Save research to database
        $researchId = $this->saveResearch([
            'user_id' => $params['user_id'],
            'query' => $params['query'],
            'persona' => $params['persona'],
            'ai_model' => $params['ai_model'],
            'result' => $processedResult,
            'cost' => $processedResult['cost'],
            'duration' => $endTime - $startTime,
            'created_at' => current_time('mysql')
        ]);
        
        return [
            'id' => $researchId,
            'content' => $processedResult['content'],
            'sources' => $processedResult['sources'],
            'cost' => $processedResult['cost'],
            'duration' => round($endTime - $startTime, 2),
            'ai_model' => $params['ai_model'],
            'timestamp' => time()
        ];
    }
    
    /**
     * Get default configuration
     */
    private function getDefaultConfig() {
        return [
            'version' => '1.0.0',
            'enabled' => true,
            'max_query_length' => 10000,
            'default_ai_model' => 'auto',
            'credit_costs' => [
                'gpt-4' => 8,
                'claude' => 5,
                'gemini' => 2,
                'typhoon' => 3
            ],
            'apis' => [
                'openai' => [
                    'model' => 'gpt-4',
                    'max_tokens' => 4000,
                    'temperature' => 0.7
                ],
                'anthropic' => [
                    'model' => 'claude-3-opus',
                    'max_tokens' => 4000,
                    'temperature' => 0.7
                ],
                'google' => [
                    'model' => 'gemini-pro',
                    'max_tokens' => 4000,
                    'temperature' => 0.7
                ],
                'scb' => [
                    'model' => 'typhoon-v1',
                    'max_tokens' => 4000,
                    'temperature' => 0.7
                ]
            ],
            'features' => [
                'team_collaboration' => true,
                'document_export' => true,
                'source_verification' => true,
                'multi_language' => true
            ]
        ];
    }
    
    /**
     * Get default personas
     */
    private function getDefaultPersonas() {
        return [
            'student' => [
                'name' => 'นักเรียน/นักศึกษา',
                'icon' => '🎓',
                'description' => 'สำหรับทำรายงาน การบ้าน และเตรียมสอบ',
                'prompt_template' => 'คุณเป็นผู้ช่วยด้านการศึกษาที่เชี่ยวชาญในการอธิบายเนื้อหาให้เข้าใจง่าย และช่วยนักเรียนนักศึกษาในการเรียนรู้',
                'output_style' => 'educational',
                'target_audience' => 'students'
            ],
            'business' => [
                'name' => 'พนักงานบริษัท',
                'icon' => '💼',
                'description' => 'วิเคราะห์ตลาด แผนธุรกิจ และกลยุทธ์องค์กร',
                'prompt_template' => 'คุณเป็นที่ปรึกษาธุรกิจมืออาชีพที่มีประสบการณ์ในการวิเคราะห์ตลาด วางแผนกลยุทธ์ และแก้ไขปัญหาธุรกิจ',
                'output_style' => 'professional',
                'target_audience' => 'business_professionals'
            ],
            'government' => [
                'name' => 'ข้าราชการ',
                'icon' => '🏛️',
                'description' => 'รายงานวิชาการ นโยบายสาธารณะ และระเบียบราชการ',
                'prompt_template' => 'คุณเป็นผู้เชี่ยวชาญด้านนโยบายสาธารณะและระเบียบราชการที่มีความรู้เกี่ยวกับกฎหมายและแนวปฏิบัติของภาครัฐ',
                'output_style' => 'formal',
                'target_audience' => 'government_officials'
            ],
            'researcher' => [
                'name' => 'นักวิจัย',
                'icon' => '🔬',
                'description' => 'งานวิจัยเชิงวิชาการ การทบทวนวรรณกรรม และการวิเคราะห์ข้อมูล',
                'prompt_template' => 'คุณเป็นนักวิจัยมืออาชีพที่มีความเชี่ยวชาญในการทบทวนวรรณกรรม การวิเคราะห์ข้อมูล และการเขียนงานวิจัยเชิงวิชาการ',
                'output_style' => 'academic',
                'target_audience' => 'researchers'
            ],
            'general' => [
                'name' => 'บุคคลทั่วไป',
                'icon' => '👥',
                'description' => 'คำถามทั่วไป การเงินส่วนตัว และการตัดสินใจในชีวิต',
                'prompt_template' => 'คุณเป็นผู้ช่วยส่วนตัวที่เป็นมิตรและให้คำแนะนำที่เป็นประโยชน์สำหรับการใช้ชีวิตประจำวัน',
                'output_style' => 'conversational',
                'target_audience' => 'general_public'
            ],
            'organization' => [
                'name' => 'องค์กร/SME',
                'icon' => '🏢',
                'description' => 'การวางแผนเชิงกลยุทธ์ การจัดการทีมงาน และการเติบโตของธุรกิจ',
                'prompt_template' => 'คุณเป็นที่ปรึกษาองค์กรระดับสูงที่มีประสบการณ์ในการพัฒนาองค์กร การจัดการเชิงกลยุทธ์ และการขับเคลื่อนการเปลี่ยนแปลง',
                'output_style' => 'strategic',
                'target_audience' => 'organizations'
            ]
        ];
    }
    
    /**
     * Save configuration
     */
    private function saveConfig() {
        $configDir = __DIR__ . '/config';
        if (!is_dir($configDir)) {
            mkdir($configDir, 0755, true);
        }
        
        file_put_contents(
            $configDir . '/settings.json', 
            json_encode($this->config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
    
    /**
     * Save personas
     */
    private function savePersonas() {
        $configDir = __DIR__ . '/config';
        if (!is_dir($configDir)) {
            mkdir($configDir, 0755, true);
        }
        
        file_put_contents(
            $configDir . '/personas.json', 
            json_encode($this->personas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
    
    /**
     * Module cleanup
     */
    public function destroy() {
        // Cleanup resources
        $this->aiProviders = null;
        $this->personas = null;
        $this->config = null;
        
        return true;
    }
}

// Register module
if (class_exists('FlowWorkModuleManager')) {
    $aiResearchModule = new AIResearchModule();
    
    // Auto-initialize if called directly
    if (defined('FLOWWORK_AUTOLOAD_MODULES')) {
        $aiResearchModule->init();
    }
}