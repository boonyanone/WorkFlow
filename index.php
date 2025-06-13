<?php
/**
 * FlowWork 3.0 - Modular AI Platform
 * Entry Point & Application Bootstrap
 * 
 * @version 3.0.0
 * @author FlowWork Team
 */

// System constants (only define if not already defined)
if (!defined('FLOWWORK_VERSION')) {
    define('FLOWWORK_VERSION', '3.0.0');
}
if (!defined('FLOWWORK_PATH')) {
    define('FLOWWORK_PATH', __DIR__);
}
if (!defined('CORE_PATH')) {
    define('CORE_PATH', FLOWWORK_PATH . '/core');
}
if (!defined('MODULES_PATH')) {
    define('MODULES_PATH', FLOWWORK_PATH . '/modules/installed');
}
if (!defined('DATA_PATH')) {
    define('DATA_PATH', FLOWWORK_PATH . '/data');
}
if (!defined('ASSETS_PATH')) {
    define('ASSETS_PATH', FLOWWORK_PATH . '/assets');
}

// Error reporting (only in development)
if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

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
    
    // Load modules
    $moduleManager->loadActiveModules();
    
} catch (Exception $e) {
    // Error handling
    $systemError = $e->getMessage();
    $activeModules = [];
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
    <link href="./assets/core.css" rel="stylesheet">
    
    <!-- Module Styles -->
    <?php foreach ($activeModules as $module): ?>
        <?php if (isset($module['assets']['css'])): ?>
            <link href="modules/installed/<?php echo $module['name']; ?>/<?php echo $module['assets']['css']; ?>" rel="stylesheet">
        <?php endif; ?>
    <?php endforeach; ?>
    
    <style>
        /* Quick fixes for missing styles */
        
        .flowwork-app { display: block !important; } /* เปลี่ยนจาก none เป็น block */
        .loading-screen { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
        display: flex; align-items: center; justify-content: center;
     background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        flex-direction: column; gap: 20px;
        }
/* ... rest of styles remain the same */
        .loading-spinner {
            width: 64px; height: 64px; border: 4px solid #e2e8f0;
            border-top: 4px solid #6366f1; border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .app-header {
            height: 64px; background: rgba(255,255,255,0.95);
            border-bottom: 1px solid #e2e8f0; position: fixed;
            top: 0; left: 0; right: 0; z-index: 999;
            display: flex; align-items: center; padding: 0 24px;
            backdrop-filter: blur(12px);
        }
        .header-logo { font-size: 24px; font-weight: 700; color: #6366f1; }
        
        .app-container { display: flex; min-height: 100vh; padding-top: 64px; }
        
        .app-sidebar {
            position: fixed; top: 64px; left: 0; bottom: 0; width: 280px;
            background: white; border-right: 1px solid #e2e8f0;
            overflow-y: auto; z-index: 998;
        }
        .sidebar-content { padding: 24px 0; }
        .module-navigation { padding: 0 16px; }
        
        .nav-item {
            display: flex; align-items: center; padding: 12px 16px;
            border-radius: 12px; color: #6b7280; font-size: 14px;
            font-weight: 500; margin-bottom: 4px; transition: all 0.2s ease;
            cursor: pointer; gap: 12px;
        }
        .nav-item:hover { background: #f3f4f6; color: #374151; }
        .nav-item.active {
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            color: #6366f1; font-weight: 600;
        }
        .nav-item i { width: 20px; text-align: center; }
        
        .app-content {
            flex: 1; margin-left: 280px; min-height: calc(100vh - 64px);
            padding: 24px; overflow-y: auto;
        }
        
        .welcome-message {
            text-align: center; padding: 80px 20px; color: #6b7280;
        }
        .welcome-message h2 {
            font-size: 28px; font-weight: 700; color: #374151; margin-bottom: 8px;
        }
        
        .system-error {
            background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
            padding: 16px; border-radius: 8px; margin: 20px;
        }
        
        @media (max-width: 768px) {
            .app-sidebar { transform: translateX(-100%); }
            .app-content { margin-left: 0; padding: 16px; }
        }
    </style>
</head>
<body>
    <!-- Loading Screen -->
    <div id="loadingScreen" class="loading-screen">
        <div class="loading-spinner"></div>
        <h3>กำลังโหลด FlowWork...</h3>
        <p>กำลังตั้งค่า modules และระบบ...</p>
    </div>
    
    <!-- Application Container -->
    <div id="flowworkApp" class="flowwork-app">
        
        <!-- Header -->
        <header class="app-header" id="appHeader">
            <div class="header-logo">
                <i class="fas fa-rocket"></i> FlowWork
            </div>
            <div style="margin-left: auto;">
                <a href="?admin=true" style="color: #6366f1; text-decoration: none; font-weight: 500;">
                    <i class="fas fa-cog"></i> Admin
                </a>
            </div>
        </header>
        
        <!-- Main Container -->
        <div class="app-container">
            
            <!-- Sidebar Navigation -->
            <aside class="app-sidebar" id="appSidebar">
                <div class="sidebar-content">
                    <!-- Dynamic Navigation -->
                    <nav id="moduleNavigation" class="module-navigation">
                        <!-- Default Dashboard item -->
                        <div class="nav-item active" onclick="loadModule('dashboard')">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </div>
                        <!-- Modules will register nav items here -->
                    </nav>
                </div>
            </aside>
            
            <!-- Content Area -->
            <main class="app-content" id="moduleContainer">
                <?php if (isset($systemError)): ?>
                    <div class="system-error">
                        <h4><i class="fas fa-exclamation-triangle"></i> System Error</h4>
                        <p><?php echo htmlspecialchars($systemError); ?></p>
                    </div>
                <?php endif; ?>
                
                <!-- Default welcome content -->
                <div class="welcome-message" id="welcomeMessage">
                    <h2>ยินดีต้อนรับสู่ FlowWork 3.0!</h2>
                    <p>แพลตฟอร์ม AI Assistant ที่ครบครันสำหรับการวิจัยและการทำงาน</p>
                    <?php if (!empty($activeModules)): ?>
                        <p>เลือก module จาก sidebar เพื่อเริ่มใช้งาน</p>
                    <?php else: ?>
                        <p><a href="?admin=true">ติดตั้ง modules</a> เพื่อเริ่มใช้งาน</p>
                    <?php endif; ?>
                </div>
            </main>
            
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
                        try {
                            callback(data);
                        } catch (e) {
                            console.error('Hook error:', e);
                        }
                    });
                }
            },
            
            // Module management
            loadModule: function(moduleName) {
                console.log('🔄 Loading module:', moduleName);
                
                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const module = this.modules.find(m => m.name === moduleName);
                if (module && window[module.name + 'Module']) {
                    this.currentModule = moduleName;
                    this.runHook('module.before_load', module);
                    
                    // Hide welcome message
                    const welcomeMsg = document.getElementById('welcomeMessage');
                    if (welcomeMsg) welcomeMsg.style.display = 'none';
                    
                    if (window[module.name + 'Module'].render) {
                        const container = document.getElementById('moduleContainer');
                        try {
                            window[module.name + 'Module'].render(container);
                        } catch (e) {
                            console.error('Module render error:', e);
                            container.innerHTML = `<div class="system-error">
                                <h4>Module Error</h4>
                                <p>Failed to load ${moduleName}: ${e.message}</p>
                            </div>`;
                        }
                    }
                    
                    this.runHook('module.after_load', module);
                    console.log('✅ Module loaded:', moduleName);
                    
                    // Update nav active state
                    const navItem = document.querySelector(`[data-module="${moduleName}"]`);
                    if (navItem) navItem.classList.add('active');
                    
                } else if (moduleName === 'dashboard') {
                    // Default dashboard
                    this.loadDashboard();
                } else {
                    console.error('Module not found:', moduleName);
                }
            },
            
            loadDashboard: function() {
                const container = document.getElementById('moduleContainer');
                const welcomeMsg = document.getElementById('welcomeMessage');
                if (welcomeMsg) welcomeMsg.style.display = 'block';
                
                // Update nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector('.nav-item').classList.add('active');
            },
            
            // Navigation management
            addNavItem: function(item) {
                console.log('➕ Adding nav item:', item);
                const nav = document.getElementById('moduleNavigation');
                const navItem = document.createElement('div');
                navItem.className = 'nav-item';
                navItem.setAttribute('data-module', item.module);
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
                        try {
                            window[module.name + 'Module'].init();
                        } catch (e) {
                            console.error('Module init error:', e);
                        }
                    }
                });
                
                // Hide loading screen
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('flowworkApp').style.display = 'block';
                
                console.log('✅ FlowWork initialized successfully!');
                console.log('📊 Active modules:', this.modules.length);
            }
        };
        
        // Global loadModule function for backward compatibility
        function loadModule(moduleName) {
            FlowWork.loadModule(moduleName);
        }
        
        // Auto-initialize when DOM ready
        document.addEventListener('DOMContentLoaded', function() {
            FlowWork.init();
            // หลังจาก FlowWork.init() เพิ่ม:
init: function() {
    console.log('🚀 FlowWork ' + this.version + ' - Initializing...');
    
    // Force show app
    document.getElementById('flowworkApp').style.display = 'block';
    document.getElementById('loadingScreen').style.display = 'none';
    
    // ... rest of init code
}
        });
    </script>
    
    <!-- Module Scripts -->
    <?php foreach ($activeModules as $module): ?>
        <?php if (isset($module['assets']['js'])): ?>
            <script src="modules/installed/<?php echo $module['name']; ?>/<?php echo $module['assets']['js']; ?>"></script>
        <?php endif; ?>
    <?php endforeach; ?>
    
</body>
</html>
