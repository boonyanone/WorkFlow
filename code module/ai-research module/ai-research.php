<?php
/**
 * AI Research Module
 * Multi-AI Research Assistant with Persona System
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

class AIResearchModule {
    
    private $config;
    private $creditManager;
    private $aiIntegration;
    
    public function __construct() {
        $this->loadConfig();
        $this->initializeComponents();
    }
    
    public function init() {
        // Register navigation
        $this->registerNavigation();
        
        // Load module assets
        $this->loadAssets();
        
        // Register API endpoints
        $this->registerEndpoints();
    }
    
    private function registerNavigation() {
        // Add to FlowWork navigation
        echo "<script>
            FlowWork.addNavItem({
                title: 'AI Research',
                icon: 'fas fa-brain',
                module: 'ai-research',
                badge: 'NEW'
            });
        </script>";
    }
    
    public function render($container) {
        return file_get_contents(__DIR__ . '/ui/research-interface.html');
    }
    
    private function loadConfig() {
        $manifestPath = __DIR__ . '/manifest.json';
        if (file_exists($manifestPath)) {
            $this->config = json_decode(file_get_contents($manifestPath), true);
        }
    }
    
    private function initializeComponents() {
        require_once __DIR__ . '/api/credit-calculator.php';
        require_once __DIR__ . '/api/ai-integrations.php';
        
        $this->creditManager = new CreditCalculator();
        $this->aiIntegration = new AIIntegrations();
    }
    
    private function loadAssets() {
        // Assets will be loaded automatically by FlowWork core
    }
    
    private function registerEndpoints() {
        // Will be handled by research-handler.php
    }
}

// Initialize module
$aiResearchModule = new AIResearchModule();

// Register with FlowWork
if (isset($GLOBALS['FlowWork'])) {
    $GLOBALS['FlowWork']['modules']['ai-research'] = $aiResearchModule;
}

// Export for JavaScript
echo "<script>
    window.AIResearchModule = {
        init: function() {
            console.log('🧠 AI Research Module initialized');
            
            // Register with FlowWork
            FlowWork.addHook('module.before_load', function(module) {
                if (module.name === 'ai-research') {
                    console.log('📋 Loading AI Research interface...');
                }
            });
        },
        
        render: function(container) {
            fetch('modules/installed/ai-research/ui/research-interface.html')
                .then(response => response.text())
                .then(html => {
                    container.innerHTML = html;
                    // Initialize research interface
                    if (window.AIResearchInterface) {
                        window.AIResearchInterface.init();
                    }
                })
                .catch(error => {
                    console.error('Failed to load AI Research interface:', error);
                    container.innerHTML = '<div class=\"error\">Failed to load AI Research module</div>';
                });
        }
    };
</script>";
?>