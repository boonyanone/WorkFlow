<?php
/**
 * FlowWork 3.0 - Complete Dashboard with Sidebar
 */

// Basic constants
define('FLOWWORK_VERSION', '3.0.0');
define('FLOWWORK_PATH', __DIR__);
define('CORE_PATH', FLOWWORK_PATH . '/core');
define('MODULES_PATH', FLOWWORK_PATH . '/modules/installed');
define('DATA_PATH', FLOWWORK_PATH . '/data');

// Error handling
if (strpos($_SERVER['HTTP_HOST'], 'localhost') === false) {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Check for admin
if (isset($_GET['admin'])) {
    require_once 'admin.php';
    exit;
}

// Load core
$activeModules = [];
$systemError = null;

try {
    if (file_exists(CORE_PATH . '/config.php')) {
        require_once CORE_PATH . '/config.php';
    }
    if (file_exists(CORE_PATH . '/module-manager.php')) {
        require_once CORE_PATH . '/module-manager.php';
    }
    
    if (class_exists('FlowWorkConfig')) {
        $config = new FlowWorkConfig();
        $moduleManager = new FlowWorkModuleManager($config);
        $activeModules = $moduleManager->getActiveModules();
    }
} catch (Exception $e) {
    $systemError = $e->getMessage();
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
    
    <!-- FlowWork CSS -->
    <link href="assets/css/main.css" rel="stylesheet">
</head>

<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <!-- Left Section -->
            <div class="header-left">
                <button class="mobile-menu-btn" onclick="toggleMobileSidebar()">
                    <i class="fas fa-bars"></i>
                </button>
                
                <div class="logo-section">
                    <div class="logo-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <span class="logo-text">FlowWork</span>
                    <span class="version-badge">v<?php echo FLOWWORK_VERSION; ?></span>
                </div>
            </div>

            <!-- Search -->
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Ask AI anything... (Ctrl+K)">
                <i class="fas fa-search search-icon"></i>
            </div>

            <!-- Right Section -->
            <div class="header-right">
                <!-- Credits -->
                <div class="header-btn credits-btn">
                    <i class="fas fa-coins"></i>
                    <span id="creditsCount">1,246</span>
                    <span class="text-mobile-hide">credits</span>
                </div>

                <!-- Workspace Toggle -->
                <button class="header-btn workspace-toggle" id="workspaceToggle" onclick="SidebarSettings.show()">
                    <i class="fas fa-sidebar"></i>
                    <span class="text-mobile-hide">Workspace</span>
                </button>
                
                <!-- Team -->
                <button class="team-btn">
                    <i class="fas fa-users"></i>
                    <span>ทีมการตลาด</span>
                    <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
                </button>

                <!-- Admin -->
                <a href="?admin=true" class="header-btn" style="background: var(--gray-100); color: var(--gray-700);">
                    <i class="fas fa-cog"></i>
                    <span class="text-mobile-hide">Admin</span>
                </a>

                <!-- Notifications -->
                <button class="notification-btn">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge">3</span>
                </button>

                <!-- User -->
                <button class="user-btn">
                    <div class="user-avatar">โล่</div>
                    <i class="fas fa-chevron-down" style="font-size: 12px; color: var(--gray-400);"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="main-container">
        
        <!-- Sidebar -->
        <aside id="sidebar" class="sidebar">
            <div class="sidebar-content">
                <!-- Navigation -->
                <div class="sidebar-nav">
                    <!-- Main -->
                    <div class="nav-section">
                        <div class="nav-item active" onclick="FlowWork.loadModule('dashboard')">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </div>
                        
                        <?php if (!empty($activeModules)): ?>
                            <?php foreach ($activeModules as $module): ?>
                            <div class="nav-item" onclick="FlowWork.loadModule('<?php echo $module['name']; ?>')">
                                <i class="<?php echo $module['icon'] ?? 'fas fa-puzzle-piece'; ?>"></i>
                                <span><?php echo htmlspecialchars($module['display_name']); ?></span>
                                <span class="nav-badge">Module</span>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                        <div class="nav-item" onclick="FlowWork.showNotification('AI Research module coming soon!', 'info')">
                            <i class="fas fa-brain"></i>
                            <span>AI Research</span>
                            <span class="nav-badge">Soon</span>
                        </div>
                        <?php endif; ?>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Documents module coming soon!', 'info')">
                            <i class="fas fa-file-alt"></i>
                            <span>Documents</span>
                        </div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Team Workspace coming soon!', 'info')">
                            <i class="fas fa-users"></i>
                            <span>Team Workspace</span>
                        </div>
                    </div>

                    <!-- Meeting Intelligence -->
                    <div class="nav-section">
                        <div class="nav-section-title">Meeting Intelligence</div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Meeting Hub coming soon!', 'info')">
                            <i class="fas fa-microphone"></i>
                            <span>Meeting Hub</span>
                        </div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Live Recording coming soon!', 'info')">
                            <i class="fas fa-record-vinyl" style="color: var(--red-500);"></i>
                            <span>Live Recording</span>
                        </div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Action Items coming soon!', 'info')">
                            <i class="fas fa-tasks"></i>
                            <span>Action Items</span>
                        </div>
                    </div>

                    <!-- Tools & Analytics -->
                    <div class="nav-section">
                        <div class="nav-section-title">Tools & Analytics</div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Analytics coming soon!', 'info')">
                            <i class="fas fa-chart-bar"></i>
                            <span>Analytics</span>
                        </div>
                        
                        <div class="nav-item" onclick="FlowWork.showNotification('Integrations coming soon!', 'info')">
                            <i class="fas fa-plug"></i>
                            <span>Integrations</span>
                        </div>
                        
                        <div class="nav-item" onclick="window.location.href='?admin=true'">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </div>
                    </div>
                </div>

                <!-- User Profile -->
                <div class="sidebar-footer">
                    <div class="user-profile">
                        <div class="profile-avatar">โล่</div>
                        <div class="profile-info">
                            <div class="profile-name">พี่โล่</div>
                            <div class="profile-role">Team Leader</div>
                        </div>
                        <div class="profile-status">Online</div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Content Area -->
        <main class="content-area" id="contentArea">
            <?php if ($systemError): ?>
                <div class="system-error">
                    <h4><i class="fas fa-exclamation-triangle"></i> System Error</h4>
                    <p><?php echo htmlspecialchars($systemError); ?></p>
                </div>
            <?php endif; ?>
            
            <!-- Loading State -->
            <div style="text-align: center; padding: 80px 0;">
                <div class="loading-spinner" style="width: 64px; height: 64px; border-width: 4px; margin: 0 auto 16px;"></div>
                <h3 style="font-size: 20px; font-weight: 600; color: var(--gray-900); margin-bottom: 8px;">กำลังโหลด FlowWork Dashboard...</h3>
                <p style="color: var(--gray-600);">กำลังตั้งค่าระบบ...</p>
            </div>
        </main>

        <!-- Right Panel -->
        <aside class="right-panel" id="rightPanel">
            
            <!-- Panel Header -->
            <div class="panel-header">
                <h3 class="panel-title">Workspace</h3>
                <div class="panel-controls">
                    <button class="panel-btn" onclick="SidebarSettings.toggle()">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="panel-btn" onclick="SidebarSettings.hide()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Today's Info -->
            <div class="info-section">
                <div class="section-header">
                    <span class="section-title">Today</span>
                </div>
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-content">
                            <div class="info-main"><?php echo date('j M Y', strtotime('+543 years')); ?></div>
                            <div class="info-sub"><?php echo date('F j, Y'); ?></div>
                        </div>
                        <div class="info-icon">📅</div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-content">
                            <div class="info-main" id="currentTime"><?php echo date('H:i'); ?></div>
                            <div class="info-sub">Bangkok</div>
                        </div>
                        <div class="info-icon">🕐</div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-content">
                            <div class="info-main">28°C</div>
                            <div class="info-sub">Partly Cloudy</div>
                        </div>
                        <div class="info-icon">⛅</div>
                    </div>
                </div>
            </div>

            <!-- System Status -->
            <div class="info-section">
                <div class="section-header">
                    <span class="section-title">System Status</span>
                    <span class="status-badge"><?php echo empty($systemError) ? 'Active' : 'Error'; ?></span>
                </div>
                <div class="info-grid">
                    <div class="info-card <?php echo empty($systemError) ? 'highlighted' : ''; ?>">
                        <div class="info-content">
                            <div class="info-main">FlowWork <?php echo FLOWWORK_VERSION; ?></div>
                            <div class="info-sub"><?php echo count($activeModules); ?> modules active</div>
                        </div>
                        <div class="info-icon"><?php echo empty($systemError) ? '✅' : '⚠️'; ?></div>
                    </div>
                </div>
            </div>

            <!-- Team Status -->
            <div class="info-section">
                <div class="section-header">
                    <span class="section-title">Team</span>
                    <span class="status-badge">4 online</span>
                </div>
                <div class="team-list">
                    <div class="team-member">
                        <div class="member-avatar online">โล่</div>
                        <div class="member-info">
                            <div class="member-name">พี่โล่ (You)</div>
                            <div class="member-status">Testing dashboard</div>
                        </div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar busy">เอ</div>
                        <div class="member-info">
                            <div class="member-name">เอ</div>
                            <div class="member-status">In meeting</div>
                        </div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar away">บี</div>
                        <div class="member-info">
                            <div class="member-name">บี</div>
                            <div class="member-status">Back in 10 min</div>
                        </div>
                    </div>
                    
                    <div class="team-member">
                        <div class="member-avatar offline">ซี</div>
                        <div class="member-info">
                            <div class="member-name">ซี</div>
                            <div class="member-status">Offline</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="info-section">
                <div class="section-header">
                    <span class="section-title">Quick Actions</span>
                </div>
                <div class="action-list">
                    <?php if (!empty($activeModules)): ?>
                        <?php $firstModule = $activeModules[0]; ?>
                        <button onclick="FlowWork.loadModule('<?php echo $firstModule['name']; ?>')" class="action-btn primary">
                            <i class="<?php echo $firstModule['icon'] ?? 'fas fa-puzzle-piece'; ?>"></i>
                            <span><?php echo htmlspecialchars($firstModule['display_name']); ?></span>
                        </button>
                    <?php else: ?>
                        <button onclick="FlowWork.showNotification('AI Research coming soon!', 'info')" class="action-btn primary">
                            <i class="fas fa-brain"></i>
                            <span>Ask AI</span>
                        </button>
                    <?php endif; ?>
                    
                    <button onclick="FlowWork.showNotification('Live Recording coming soon!', 'info')" class="action-btn danger">
                        <i class="fas fa-record-vinyl"></i>
                        <span>Record</span>
                    </button>
                    
                    <button onclick="window.location.href='?admin=true'" class="action-btn info">
                        <i class="fas fa-cog"></i>
                        <span>Admin Panel</span>
                    </button>
                </div>
            </div>

            <!-- System Stats -->
            <div class="info-section minimal-hide">
                <div class="section-header">
                    <span class="section-title">Performance</span>
                    <span class="status-badge">Good</span>
                </div>
                <div class="system-stats">
                    <div class="stat-item">
                        <span class="stat-label">PHP</span>
                        <span class="stat-value"><?php echo PHP_VERSION; ?></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Memory</span>
                        <span class="stat-value"><?php echo ini_get('memory_limit'); ?></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Modules</span>
                        <span class="stat-value"><?php echo count($activeModules); ?></span>
                    </div>
                </div>
            </div>
        </aside>
    </div>

    <!-- FlowWork JavaScript -->
    <script>
    window.FlowWorkConfig = {
        version: '<?php echo FLOWWORK_VERSION; ?>',
        modules: <?php echo json_encode(array_values($activeModules ?: [])); ?>,
        hasError: <?php echo isset($systemError) ? 'true' : 'false'; ?>,
        adminUrl: '?admin=true'
    };
</script>
    <script src="assets/js/app.js"></script>
    
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
