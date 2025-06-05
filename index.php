<?php
/**
 * FlowWork 3.0 - Modular AI Platform
 * Entry Point & Application Bootstrap
 * 
 * @version 3.0.0
 * @author FlowWork Team
 */

// System constants
define('FLOWWORK_VERSION', '3.0.0');
define('FLOWWORK_PATH', __DIR__);
define('CORE_PATH', FLOWWORK_PATH . '/core');
define('MODULES_PATH', FLOWWORK_PATH . '/modules/installed');
define('DATA_PATH', FLOWWORK_PATH . '/data');
define('ASSETS_PATH', FLOWWORK_PATH . '/assets');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Autoloader
spl_autoload_register(function ($class) {
    $file = CORE_PATH . '/' . strtolower(str_replace('FlowWork', '', $class)) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Check for admin request
if (isset($_GET['admin']) || strpos($_SERVER['REQUEST_URI'], '/admin') !== false) {
    require_once 'admin.php';
    exit;
}

// Load core components
require_once CORE_PATH . '/config.php';
require_once CORE_PATH . '/module-manager.php';

try {
    // Initialize system
    $config = new FlowWorkConfig();
    $moduleManager = new FlowWorkModuleManager($config);
    
    // Get active modules
    $activeModules = $moduleManager->getActiveModules();
    
    // If no modules installed, redirect to admin
    if (empty($activeModules)) {
        $adminUrl = $_SERVER['REQUEST_URI'] . '?admin=true';
        header("Location: $adminUrl");
        exit;
    }
    
    // Load modules
    $moduleManager->loadActiveModules();
    
} catch (Exception $e) {
    // Error handling
    die('FlowWork Error: ' . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>FlowWork - AI Assistant Platform</title>
    
    <!-- External Dependencies -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Core Styles -->
    <link href="<?php echo ASSETS_PATH; ?>/core.css" rel="stylesheet">
    
    <!-- Module Styles -->
    <?php foreach ($activeModules as $module): ?>
        <?php if (isset($module['assets']['css'])): ?>
            <link href="<?php echo MODULES_PATH . '/' . $module['name'] . '/' . $module['assets']['css']; ?>" rel="stylesheet">
        <?php endif; ?>
    <?php endforeach; ?>
</head>
<body>
    <!-- Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-spinner"></div>
        <h3>Starting FlowWork...</h3>
        <p>Loading modules and initializing system...</p>
    </div>
    
    <!-- Application Container -->
    <div id="flowworkApp" class="flowwork-app" style="display: none;">
        
        <!-- Header -->
        <header class="app-header" id="appHeader">
            <!-- Will be populated by modules -->
        </header>
        
        <!-- Main Container -->
        <div class="app-container">
            
            <!-- Sidebar Navigation -->
            <aside class="app-sidebar" id="appSidebar">
                <div class="sidebar-content">
                    <!-- Dynamic Navigation -->
                    <nav id="moduleNavigation" class="module-navigation">
                        <!-- Modules will register nav items here -->
                    </nav>
                </div>
            </aside>
            
            <!-- Content Area -->
            <main class="app-content" id="moduleContainer">
                <!-- Active module content -->
                <div class="welcome-message">
                    <h2>Welcome to FlowWork 3.0!</h2>
                    <p>Select a module from the sidebar to get started.</p>
                </div>
            </main>
            
            <!-- Right Panel -->
            <aside class="app-right-panel" id="appRightPanel">
                <div class="panel-content">
                    <!-- Module widgets -->
                    <div id="moduleWidgets"></div>
                </div>
            </aside>
            
        </div>
    </div>
    
    <!-- Global FlowWork Object -->
    <script>
        window.FlowWork = {
            version: '<?php echo FLOWWORK_VERSION; ?>',
            modules: <?php echo json_encode($activeModules); ?>,
            currentModule: null,
            hooks: {},
            
            // Hook system
            addHook: function(hookName, callback) {
                if (!this.hooks[hookName]) {
                    this.hooks[hookName] = [];
                }
                this.hooks[hookName].push(callback);
            },
            
            runHook: function(hookName, data) {
                if (this.hooks[hookName]) {
                    this.hooks[hookName].forEach(callback => {
                        callback(data);
                    });
                }
            },
            
            // Module management
            loadModule: function(moduleName) {
                const module = this.modules.find(m => m.name === moduleName);
                if (module && window[module.name + 'Module']) {
                    this.currentModule = moduleName;
                    this.runHook('module.before_load', module);
                    
                    if (window[module.name + 'Module'].render) {
                        const container = document.getElementById('moduleContainer');
                        window[module.name + 'Module'].render(container);
                    }
                    
                    this.runHook('module.after_load', module);
                    console.log('✅ Module loaded:', moduleName);
                }
            },
            
            // Navigation management
            addNavItem: function(item) {
                const nav = document.getElementById('moduleNavigation');
                const navItem = document.createElement('div');
                navItem.className = 'nav-item';
                navItem.innerHTML = `
                    <i class="${item.icon}"></i>
                    <span>${item.title}</span>
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                `;
                navItem.onclick = () => this.loadModule(item.module);
                nav.appendChild(navItem);
            },
            
            // System initialization
            init: function() {
                console.log('🚀 FlowWork ' + this.version + ' - Initializing...');
                
                // Initialize all modules
                this.modules.forEach(module => {
                    if (window[module.name + 'Module'] && window[module.name + 'Module'].init) {
                        console.log('📦 Initializing module:', module.name);
                        window[module.name + 'Module'].init();
                    }
                });
                
                // Hide loading screen
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('flowworkApp').style.display = 'block';
                
                // Load default module
                if (this.modules.length > 0) {
                    this.loadModule(this.modules[0].name);
                }
                
                console.log('✅ FlowWork initialized successfully!');
            }
        };
        
        // Auto-initialize when DOM ready
        document.addEventListener('DOMContentLoaded', function() {
            FlowWork.init();
        });
    </script>
    
    <!-- Module Scripts -->
    <?php foreach ($activeModules as $module): ?>
        <?php if (isset($module['assets']['js'])): ?>
            <script src="<?php echo MODULES_PATH . '/' . $module['name'] . '/' . $module['assets']['js']; ?>"></script>
        <?php endif; ?>
    <?php endforeach; ?>
    
</body>
</html>