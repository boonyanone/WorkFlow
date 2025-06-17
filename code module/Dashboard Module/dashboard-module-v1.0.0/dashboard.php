<?php
/**
 * Dashboard Module for FlowWork 3.0
 * Main dashboard with analytics and quick actions
 */

class DashboardModule {
    
    private $config;
    private $version = '1.0.0';
    
    public function __construct($config = null) {
        $this->config = $config;
    }
    
    public function init() {
        // Module initialization
        $this->registerHooks();
        $this->registerNavigation();
        
        return true;
    }
    
    private function registerHooks() {
        // Register module hooks
        add_action('flowwork_init', [$this, 'onFlowWorkInit']);
        add_filter('navigation_items', [$this, 'addNavigationItem']);
        add_filter('quick_actions', [$this, 'addQuickActions']);
    }
    
    private function registerNavigation() {
        // This will be called by the template system
        return [
            'title' => 'Dashboard',
            'icon' => 'fas fa-home',
            'route' => '/',
            'active' => true,
            'priority' => 1
        ];
    }
    
    public function renderDashboard() {
        $data = $this->getDashboardData();
        $template = $this->loadTemplate('dashboard', $data);
        return $template;
    }
    
    private function getDashboardData() {
        return [
            'user' => [
                'name' => 'โล่',
                'role' => 'Team Leader',
                'avatar' => 'โล่'
            ],
            'stats' => [
                'ai_queries' => 24,
                'meetings' => 12,
                'efficiency' => 94,
                'team_members' => 8
            ],
            'activities' => [
                [
                    'type' => 'ai_research',
                    'title' => 'AI Research completed',
                    'description' => 'Business registration process',
                    'time' => '2 hours ago',
                    'icon' => 'fas fa-brain',
                    'color' => 'purple'
                ],
                [
                    'type' => 'meeting',
                    'title' => 'Meeting recorded',
                    'description' => 'Budget review meeting',
                    'time' => '4 hours ago',
                    'icon' => 'fas fa-video',
                    'color' => 'blue'
                ],
                [
                    'type' => 'task',
                    'title' => 'Task completed',
                    'description' => 'UI design review finished',
                    'time' => '1 day ago',
                    'icon' => 'fas fa-check-circle',
                    'color' => 'green'
                ]
            ],
            'quick_actions' => [
                [
                    'title' => 'AI Research',
                    'description' => 'Ask AI anything, get instant insights',
                    'icon' => 'fas fa-brain',
                    'color' => 'primary',
                    'action' => 'ai-research',
                    'badge' => 'Most Used'
                ],
                [
                    'title' => 'Start Recording',
                    'description' => 'Record & transcribe meetings instantly',
                    'icon' => 'fas fa-record-vinyl',
                    'color' => 'danger',
                    'action' => 'live-recording',
                    'badge' => 'Live'
                ],
                [
                    'title' => 'Meeting Hub',
                    'description' => 'Manage all your meetings in one place',
                    'icon' => 'fas fa-microphone',
                    'color' => 'info',
                    'action' => 'meeting-hub',
                    'badge' => 'Hub'
                ]
            ],
            'team_status' => [
                ['name' => 'โล่', 'status' => 'online', 'activity' => 'Testing modules'],
                ['name' => 'เอ', 'status' => 'busy', 'activity' => 'In meeting'],
                ['name' => 'บี', 'status' => 'away', 'activity' => 'Back in 10 min'],
                ['name' => 'ซี', 'status' => 'offline', 'activity' => 'Offline']
            ],
            'system_info' => [
                'load_time' => '0.2s',
                'memory' => '8MB',
                'credits' => 1246,
                'ai_status' => 'GPT-4 Turbo'
            ]
        ];
    }
    
    private function loadTemplate($template, $data = []) {
        $templateFile = __DIR__ . "/ui/{$template}.html";
        
        if (!file_exists($templateFile)) {
            return "<div class='error'>Template not found: {$template}</div>";
        }
        
        $content = file_get_contents($templateFile);
        
        // Simple template variable replacement
        foreach ($data as $key => $value) {
            if (is_string($value) || is_numeric($value)) {
                $content = str_replace("{{" . strtoupper($key) . "}}", $value, $content);
            }
        }
        
        // Replace current date
        $content = str_replace('{{CURRENT_DATE}}', $this->getCurrentDate(), $content);
        $content = str_replace('{{CURRENT_TIME}}', $this->getCurrentTime(), $content);
        
        return $content;
    }
    
    private function getCurrentDate() {
        return date('l, F j, Y');
    }
    
    private function getCurrentTime() {
        return date('H:i');
    }
    
    public function addNavigationItem($items) {
        $items[] = $this->registerNavigation();
        return $items;
    }
    
    public function addQuickActions($actions) {
        $data = $this->getDashboardData();
        return array_merge($actions, $data['quick_actions']);
    }
    
    public function onFlowWorkInit() {
        // Called when FlowWork initializes
        error_log("Dashboard Module initialized");
    }
}

// Auto-register when included
if (class_exists('FlowWorkModuleManager')) {
    global $flowworkModules;
    $flowworkModules['dashboard'] = new DashboardModule();
}