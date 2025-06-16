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

// Check for admin request
if (isset($_GET['admin'])) {
    require_once 'admin.php';
    exit;
}

// Initialize variables
$activeModules = [];
$systemError = null;

// Load core components safely
try {
    if (file_exists(CORE_PATH . '/config.php')) {
        require_once CORE_PATH . '/config.php';
    }
    if (file_exists(CORE_PATH . '/module-manager.php')) {
        require_once CORE_PATH . '/module-manager.php';
    }
    
    // Initialize system
    if (class_exists('FlowWorkConfig') && class_exists('FlowWorkModuleManager')) {
        $config = new FlowWorkConfig();
        $moduleManager = new FlowWorkModuleManager($config);
        
        // Create directories if not exist
        if (!file_exists(MODULES_PATH)) {
            mkdir(MODULES_PATH, 0755, true);
        }
        
        // Get active modules
        $activeModules = $moduleManager->getActiveModules();
    }
    
} catch (Exception $e) {
    $systemError = $e->getMessage();
}

// Debug mode
if (isset($_GET['debug'])) {
    echo "<pre>";
    echo "=== FlowWork Debug ===\n";
    echo "Version: " . FLOWWORK_VERSION . "\n";
    echo "Modules: " . count($activeModules) . "\n";
    echo "Error: " . ($systemError ?? 'None') . "\n";
    print_r($activeModules);
    echo "</pre>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowWork - AI Assistant Platform</title>
    
    <!-- External Dependencies -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans Thai', 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .logo i {
            font-size: 32px;
            color: #667eea;
        }
        
        .logo h1 {
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
        }
        
        .version {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .subtitle {
            color: #718096;
            font-size: 16px;
            margin-top: 8px;
        }
        
        .main-content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }
        
        .sidebar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            height: fit-content;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .nav-section {
            margin-bottom: 24px;
        }
        
        .nav-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #a0aec0;
            margin-bottom: 12px;
            letter-spacing: 0.05em;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 12px;
            color: #4a5568;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            margin-bottom: 4px;
        }
        
        .nav-item:hover {
            background: #edf2f7;
            color: #667eea;
            transform: translateX(4px);
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .nav-item i {
            width: 20px;
            text-align: center;
        }
        
        .content-area {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .welcome {
            text-align: center;
            padding: 40px 20px;
        }
        
        .welcome-icon {
            font-size: 80px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .welcome h2 {
            font-size: 32px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 16px;
        }
        
        .welcome p {
            font-size: 18px;
            color: #718096;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        
        .status-card {
            background: linear-gradient(135deg, #e6fffa, #f0fff4);
            border: 1px solid #9ae6b4;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .status-card.error {
            background: linear-gradient(135deg, #fed7d7, #ffe5e5);
            border-color: #feb2b2;
        }
        
        .status-icon {
            font-size: 24px;
            color: #38a169;
        }
        
        .status-icon.error {
            color: #e53e3e;
        }
        
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 32px;
        }
        
        .module-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
            cursor: pointer;
        }
        
        .module-card:hover {
            border-color: #667eea;
            transform: translateY(-4px);
            box-shadow: 0 12px 28px rgba(102, 126, 234, 0.15);
        }
        
        .module-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .module-icon {
            font-size: 24px;
        }
        
        .module-info h4 {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
        }
        
        .module-info p {
            font-size: 12px;
            color: #a0aec0;
        }
        
        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 32px;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: #edf2f7;
            color: #4a5568;
        }
        
        .btn-secondary:hover {
            background: #e2e8f0;
        }
        
        .footer {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            padding: 24px;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .container {
                padding: 16px;
            }
            
            .welcome h2 {
                font-size: 24px;
            }
            
            .actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo">
                <i class="fas fa-rocket"></i>
                <div>
                    <h1>FlowWork</h1>
                    <span class="version">v<?php echo FLOWWORK_VERSION; ?></span>
                </div>
            </div>
            <p class="subtitle">แพลตฟอร์ม AI Assistant แบบ Modular สำหรับคนไทย</p>
        </header>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="nav-section">
                    <div class="nav-title">หลัก</div>
                    <div class="nav-item active" onclick="showWelcome()">
                        <i class="fas fa-home"></i>
                        <span>หน้าแรก</span>
                    </div>
                </div>

                <?php if (!empty($activeModules)): ?>
                <div class="nav-section">
                    <div class="nav-title">Modules</div>
                    <?php foreach ($activeModules as $module): ?>
                    <div class="nav-item" onclick="loadModule('<?php echo $module['name']; ?>')">
                        <i class="<?php echo $module['icon'] ?? 'fas fa-puzzle-piece'; ?>"></i>
                        <span><?php echo htmlspecialchars($module['display_name']); ?></span>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>

                <div class="nav-section">
                    <div class="nav-title">เครื่องมือ</div>
                    <a href="?admin=true" class="nav-item">
                        <i class="fas fa-cog"></i>
                        <span>จัดการ Modules</span>
                    </a>
                    <a href="?debug=true" class="nav-item">
                        <i class="fas fa-bug"></i>
                        <span>Debug Info</span>
                    </a>
                </div>
            </aside>

            <!-- Content Area -->
            <main class="content-area" id="contentArea">
                <div class="welcome" id="welcomeContent">
                    <div class="welcome-icon">🚀</div>
                    <h2>ยินดีต้อนรับสู่ FlowWork 3.0</h2>
                    <p>แพลตฟอร์ม AI Assistant ที่ออกแบบมาเพื่อคนไทย<br>รองรับการทำงานแบบ Modular และ Pay-per-use</p>

                    <!-- System Status -->
                    <?php if ($systemError): ?>
                    <div class="status-card error">
                        <i class="fas fa-exclamation-triangle status-icon error"></i>
                        <div>
                            <h4>System Error</h4>
                            <p><?php echo htmlspecialchars($systemError); ?></p>
                        </div>
                    </div>
                    <?php else: ?>
                    <div class="status-card">
                        <i class="fas fa-check-circle status-icon"></i>
                        <div>
                            <h4>ระบบพร้อมใช้งาน</h4>
                            <p>FlowWork <?php echo FLOWWORK_VERSION; ?> | Modules: <?php echo count($activeModules); ?></p>
                        </div>
                    </div>
                    <?php endif; ?>

                    <!-- Modules Showcase -->
                    <?php if (!empty($activeModules)): ?>
                    <div class="modules-grid">
                        <?php foreach ($activeModules as $module): ?>
                        <div class="module-card" onclick="loadModule('<?php echo $module['name']; ?>')">
                            <div class="module-header">
                                <div class="module-icon"><?php echo $module['icon'] ?? '📦'; ?></div>
                                <div class="module-info">
                                    <h4><?php echo htmlspecialchars($module['display_name']); ?></h4>
                                    <p>v<?php echo htmlspecialchars($module['version']); ?></p>
                                </div>
                            </div>
                            <p><?php echo htmlspecialchars($module['description']); ?></p>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>

                    <!-- Action Buttons -->
                    <div class="actions">
                        <?php if (empty($activeModules)): ?>
                        <a href="?admin=true" class="btn btn-primary">
                            <i class="fas fa-download"></i>
                            ติดตั้ง Modules
                        </a>
                        <?php else: ?>
                        <button onclick="loadModule('<?php echo $activeModules[0]['name']; ?>')" class="btn btn-primary">
                            <i class="fas fa-play"></i>
                            เริ่มใช้งาน
                        </button>
                        <a href="?admin=true" class="btn btn-secondary">
                            <i class="fas fa-plus"></i>
                            เพิ่ม Modules
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </main>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <p>🎯 FlowWork <?php echo FLOWWORK_VERSION; ?> - Made with ❤️ for Thailand</p>
        </footer>
    </div>

    <!-- JavaScript -->
    <script>
        window.FlowWork = {
            version: '<?php echo FLOWWORK_VERSION; ?>',
            modules: <?php echo json_encode($activeModules); ?>,
            currentModule: null,

            loadModule: function(moduleName) {
                console.log('Loading module:', moduleName);
                
                // Update nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });

                const contentArea = document.getElementById('contentArea');
                const module = this.modules.find(m => m.name === moduleName);

                if (module) {
                    this.currentModule = moduleName;
                    
                    // Check if module object exists
                    if (window[module.name + 'Module'] && window[module.name + 'Module'].render) {
                        try {
                            window[module.name + 'Module'].render(contentArea);
                        } catch (e) {
                            contentArea.innerHTML = this.getErrorTemplate(moduleName, e.message);
                        }
                    } else {
                        contentArea.innerHTML = this.getModuleTemplate(module);
                    }
                } else {
                    contentArea.innerHTML = this.getNotFoundTemplate(moduleName);
                }
            },

            getModuleTemplate: function(module) {
                return `
                    <div style="text-align: center; padding: 60px 20px;">
                        <div style="font-size: 64px; margin-bottom: 24px;">${module.icon || '📦'}</div>
                        <h2>${module.display_name}</h2>
                        <p style="color: #718096; margin: 16px 0 32px;">${module.description}</p>
                        
                        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 32px 0;">
                            <h4 style="color: #2d3748; margin-bottom: 8px;">📦 Module Status</h4>
                            <p style="color: #718096; margin: 0;">Module ติดตั้งแล้วแต่ Interface ยังไม่พร้อม</p>
                        </div>
                        
                        <button onclick="window.location.reload()" class="btn btn-primary">
                            <i class="fas fa-refresh"></i> Reload Page
                        </button>
                    </div>
                `;
            },

            getErrorTemplate: function(moduleName, error) {
                return `
                    <div style="text-align: center; padding: 60px 20px;">
                        <div style="font-size: 64px; margin-bottom: 24px;">⚠️</div>
                        <h2 style="color: #e53e3e;">Module Error</h2>
                        <p style="color: #718096;">Failed to load ${moduleName}</p>
                        <div style="background: #fed7d7; border: 1px solid #feb2b2; border-radius: 12px; padding: 16px; margin: 24px 0;">
                            <code style="color: #e53e3e;">${error}</code>
                        </div>
                        <button onclick="FlowWork.showWelcome()" class="btn btn-primary">
                            <i class="fas fa-home"></i> กลับหน้าแรก
                        </button>
                    </div>
                `;
            },

            getNotFoundTemplate: function(moduleName) {
                return `
                    <div style="text-align: center; padding: 60px 20px;">
                        <div style="font-size: 64px; margin-bottom: 24px;">❓</div>
                        <h2>Module Not Found</h2>
                        <p style="color: #718096;">Module "${moduleName}" ไม่พบหรือไม่ได้เปิดใช้งาน</p>
                        <button onclick="FlowWork.showWelcome()" class="btn btn-primary">
                            <i class="fas fa-home"></i> กลับหน้าแรก
                        </button>
                    </div>
                `;
            },

            showWelcome: function() {
                document.getElementById('contentArea').innerHTML = document.getElementById('welcomeContent').outerHTML;
                
                // Update nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector('.nav-item').classList.add('active');
                
                this.currentModule = null;
            },

            init: function() {
                console.log('🚀 FlowWork', this.version, 'initialized');
                console.log('📦 Modules:', this.modules.length);

                // Initialize modules
                this.modules.forEach(module => {
                    if (window[module.name + 'Module'] && window[module.name + 'Module'].init) {
                        try {
                            window[module.name + 'Module'].init();
                        } catch (e) {
                            console.error('Module init error:', e);
                        }
                    }
                });
            }
        };

        function loadModule(moduleName) {
            FlowWork.loadModule(moduleName);
        }

        function showWelcome() {
            FlowWork.showWelcome();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            FlowWork.init();
        });

        console.log('✅ FlowWork System Ready');
    </script>

    <!-- Module Scripts -->
    <?php foreach ($activeModules as $module): ?>
        <?php if (isset($module['assets']['js'])): ?>
            <?php $jsPath = "modules/installed/" . $module['name'] . "/" . $module['assets']['js']; ?>
            <?php if (file_exists($jsPath)): ?>
                <script src="<?php echo $jsPath; ?>"></script>
            <?php endif; ?>
        <?php endif; ?>
    <?php endforeach; ?>
</body>
</html>