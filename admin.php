<?php
/**
 * FlowWork Admin Panel
 * Module Management & System Administration
 */

// Security check
if (!isset($_GET['admin']) && strpos($_SERVER['REQUEST_URI'], '/admin') === false) {
    die('Access denied');
}

// Include core components
require_once 'core/config.php';
require_once 'core/module-manager.php';
require_once 'core/installer.php';

// Initialize system
$config = new FlowWorkConfig();
$moduleManager = new FlowWorkModuleManager($config);
$installer = new FlowWorkInstaller($moduleManager);

// Handle AJAX requests
if (isset($_POST['action']) || isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    $action = $_POST['action'] ?? $_GET['action'];
    $response = ['success' => false, 'message' => 'Unknown action'];
    
    switch ($action) {
        case 'upload':
            if (isset($_FILES['module_zip'])) {
                $response = $installer->installFromZip($_FILES['module_zip']['tmp_name']);
            } else {
                $response = ['success' => false, 'error' => 'No file uploaded'];
            }
            break;
            
        case 'activate':
            $moduleId = $_GET['module'] ?? '';
            if ($moduleManager->activateModule($moduleId)) {
                $response = ['success' => true, 'message' => "Module '$moduleId' activated"];
            } else {
                $response = ['success' => false, 'error' => "Failed to activate module '$moduleId'"];
            }
            break;
            
        case 'deactivate':
            $moduleId = $_GET['module'] ?? '';
            if ($moduleManager->deactivateModule($moduleId)) {
                $response = ['success' => true, 'message' => "Module '$moduleId' deactivated"];
            } else {
                $response = ['success' => false, 'error' => "Failed to deactivate module '$moduleId'"];
            }
            break;
            
        case 'delete':
            $moduleId = $_GET['module'] ?? '';
            if ($moduleManager->deleteModule($moduleId)) {
                $response = ['success' => true, 'message' => "Module '$moduleId' deleted"];
            } else {
                $response = ['success' => false, 'error' => "Failed to delete module '$moduleId'"];
            }
            break;
            
        case 'system_info':
            $response = [
                'success' => true,
                'data' => [
                    'flowwork_version' => FLOWWORK_VERSION,
                    'php_version' => phpversion(),
                    'modules_total' => count($moduleManager->getAllModules()),
                    'modules_active' => count($moduleManager->getActiveModules()),
                    'disk_space' => $this->formatBytes(disk_free_space('.')),
                    'memory_limit' => ini_get('memory_limit'),
                    'upload_max_filesize' => ini_get('upload_max_filesize')
                ]
            ];
            break;
    }
    
    echo json_encode($response);
    exit;
}

// Get modules data
$allModules = $moduleManager->getAllModules();
$activeModules = $moduleManager->getActiveModules();

// Helper function
function formatBytes($size, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
        $size /= 1024;
    }
    return round($size, $precision) . ' ' . $units[$i];
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowWork Admin - Module Manager</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="assets/admin.css" rel="stylesheet">
</head>
<body>
    <div class="admin-container">
        
        <!-- Header -->
        <header class="admin-header">
            <div class="header-content">
                <div class="header-left">
                    <div class="logo-section">
                        <div class="logo-icon">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <div class="logo-text">
                            <h1>FlowWork Admin</h1>
                            <span class="version">v<?php echo FLOWWORK_VERSION; ?></span>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <button class="btn-secondary" onclick="showSystemInfo()">
                        <i class="fas fa-info-circle"></i> System Info
                    </button>
                    <a href="/" class="btn-primary">
                        <i class="fas fa-eye"></i> View Site
                    </a>
                </div>
            </div>
        </header>
        
        <!-- Main Content -->
        <main class="admin-main">
            
            <!-- Upload Section -->
            <section class="upload-section">
                <div class="section-header">
                    <h2><i class="fas fa-upload"></i> Install New Module</h2>
                    <p>Upload a .zip module package to install new functionality</p>
                </div>
                
                <div class="upload-card">
                    <div class="upload-zone" id="uploadZone">
                        <div class="upload-content">
                            <i class="fas fa-cloud-upload-alt upload-icon"></i>
                            <h3>Drag & Drop Module Package</h3>
                            <p>or <button type="button" onclick="selectFile()" class="btn-link">browse files</button></p>
                            <small>Supported format: .zip (max <?php echo ini_get('upload_max_filesize'); ?>)</small>
                        </div>
                        <input type="file" id="moduleFile" accept=".zip" style="display: none;">
                    </div>
                    
                    <!-- Upload Progress -->
                    <div id="uploadProgress" class="upload-progress" style="display: none;">
                        <div class="progress-header">
                            <h4><i class="fas fa-cog fa-spin"></i> Installing Module...</h4>
                            <button onclick="cancelUpload()" class="btn-cancel">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="progress-bar">
                            <div id="progressFill" class="progress-fill"></div>
                        </div>
                        <div id="progressText" class="progress-text">Preparing upload...</div>
                    </div>
                    
                    <!-- Upload Result -->
                    <div id="uploadResult" class="upload-result" style="display: none;">
                        <!-- Success/Error message will be inserted here -->
                    </div>
                </div>
            </section>
            
            <!-- Modules Section -->
            <section class="modules-section">
                <div class="section-header">
                    <h2><i class="fas fa-puzzle-piece"></i> Installed Modules</h2>
                    <div class="section-stats">
                        <span class="stat">
                            <strong><?php echo count($allModules); ?></strong> Total
                        </span>
                        <span class="stat">
                            <strong><?php echo count($activeModules); ?></strong> Active
                        </span>
                    </div>
                </div>
                
                <?php if (empty($allModules)): ?>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <h3>No Modules Installed</h3>
                    <p>Upload your first module package to get started with FlowWork!</p>
                    <button onclick="selectFile()" class="btn-primary">
                        <i class="fas fa-plus"></i> Install First Module
                    </button>
                </div>
                <?php else: ?>
                <div class="modules-grid" id="modulesGrid">
                    <?php foreach ($allModules as $module): ?>
                    <div class="module-card <?php echo $module['active'] ? 'active' : 'inactive'; ?>" data-module="<?php echo $module['name']; ?>">
                        
                        <div class="module-header">
                            <div class="module-icon">
                                <?php echo $module['icon'] ?? '📦'; ?>
                            </div>
                            <div class="module-info">
                                <h3 class="module-name"><?php echo htmlspecialchars($module['display_name']); ?></h3>
                                <span class="module-version">v<?php echo htmlspecialchars($module['version']); ?></span>
                                <span class="module-author">by <?php echo htmlspecialchars($module['author']); ?></span>
                            </div>
                            <div class="module-status">
                                <?php if ($module['active']): ?>
                                    <span class="status-badge active">
                                        <i class="fas fa-check-circle"></i> Active
                                    </span>
                                <?php else: ?>
                                    <span class="status-badge inactive">
                                        <i class="fas fa-pause-circle"></i> Inactive
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="module-description">
                            <p><?php echo htmlspecialchars($module['description']); ?></p>
                        </div>
                        
                        <div class="module-meta">
                            <span class="meta-item">
                                <i class="fas fa-calendar"></i>
                                Installed: <?php echo date('M d, Y', strtotime($module['installed_at'])); ?>
                            </span>
                        </div>
                        
                        <div class="module-actions">
                            <?php if ($module['active']): ?>
                                <button class="btn btn-warning" onclick="deactivateModule('<?php echo $module['name']; ?>')">
                                    <i class="fas fa-pause"></i> Deactivate
                                </button>
                            <?php else: ?>
                                <button class="btn btn-success" onclick="activateModule('<?php echo $module['name']; ?>')">
                                    <i class="fas fa-play"></i> Activate
                                </button>
                            <?php endif; ?>
                            
                            <button class="btn btn-secondary" onclick="showModuleInfo('<?php echo $module['name']; ?>')">
                                <i class="fas fa-info"></i> Details
                            </button>
                            
                            <button class="btn btn-danger" onclick="deleteModule('<?php echo $module['name']; ?>')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                        
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </section>
            
        </main>
        
        <!-- Footer -->
        <footer class="admin-footer">
            <div class="footer-content">
                <div class="footer-left">
                    <span>FlowWork v<?php echo FLOWWORK_VERSION; ?> - Modular AI Platform</span>
                </div>
                <div class="footer-right">
                    <span>PHP <?php echo phpversion(); ?> | Modules: <?php echo count($activeModules); ?>/<?php echo count($allModules); ?></span>
                </div>
            </div>
        </footer>
        
    </div>
    
    <!-- Modals -->
    <div id="systemInfoModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-server"></i> System Information</h3>
                <button onclick="closeModal('systemInfoModal')" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="systemInfoContent">
                <div class="loading-spinner"></div>
                <p>Loading system information...</p>
            </div>
        </div>
    </div>
    
    <div id="moduleInfoModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-puzzle-piece"></i> Module Details</h3>
                <button onclick="closeModal('moduleInfoModal')" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="moduleInfoContent">
                <!-- Module details will be loaded here -->
            </div>
        </div>
    </div>
    
    <!-- Notification Container -->
    <div id="notifications" class="notifications-container"></div>
    
    <script src="assets/admin.js"></script>
</body>
</html>