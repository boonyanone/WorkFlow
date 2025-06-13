/**
 * FlowWork Admin Panel JavaScript
 * Handles module management, uploads, and UI interactions
 * 
 * @version 3.0.0
 * @author FlowWork Team
 */

class FlowWorkAdmin {
    constructor() {
        this.uploadInProgress = false;
        this.currentUpload = null;
        this.apiBaseUrl = window.location.href.split('?')[0] + '?admin=true';
        
        this.init();
    }
    
    init() {
        console.log('🎛️ FlowWork Admin Panel initializing...');
        
        // Initialize upload functionality
        this.initUpload();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize UI components
        this.initUI();
        
        console.log('✅ Admin Panel ready!');
    }
    
    initUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('moduleFile');
        
        if (!uploadZone || !fileInput) {
            console.warn('Upload components not found');
            return;
        }
        
        // Drag & Drop events
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            // Only remove dragover if leaving the upload zone completely
            if (!uploadZone.contains(e.relatedTarget)) {
                uploadZone.classList.remove('dragover');
            }
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
        
        // Click to upload
        uploadZone.addEventListener('click', (e) => {
            if (!this.uploadInProgress && !e.target.closest('button')) {
                fileInput.click();
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    initEventListeners() {
        // Prevent form submission on enter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
            }
        });
        
        // Close modals on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Global error handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showNotification('An unexpected error occurred', 'error');
        });
    }
    
    initUI() {
        // Create notifications container if it doesn't exist
        if (!document.getElementById('notifications')) {
            const container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }
    
    // File Upload Handling
    handleFileUpload(file) {
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }
        
        console.log('📦 Starting upload:', file.name);
        
        // Prepare upload
        this.showUploadProgress();
        this.uploadInProgress = true;
        
        // Create form data
        const formData = new FormData();
        formData.append('module_zip', file);
        formData.append('action', 'upload');
        
        // Upload with progress
        this.uploadWithProgress(formData);
    }
    
    validateFile(file) {
        // Check file type
        const allowedTypes = ['.zip'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            this.showNotification('Invalid file type. Please upload a .zip file.', 'error');
            return false;
        }
        
        // Check file size (default 10MB, but respect server settings)
        const maxSize = 50 * 1024 * 1024; // 50MB fallback
        if (file.size > maxSize) {
            this.showNotification('File too large. Maximum size is 50MB.', 'error');
            return false;
        }
        
        if (file.size === 0) {
            this.showNotification('File is empty. Please select a valid module package.', 'error');
            return false;
        }
        
        return true;
    }
    
    uploadWithProgress(formData) {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                this.updateProgress(percentComplete, `Uploading... ${percentComplete}%`);
            }
        });
        
        // Load start
        xhr.addEventListener('loadstart', () => {
            this.updateProgress(0, 'Starting upload...');
        });
        
        // Response handling
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    this.handleUploadResponse(response);
                } catch (e) {
                    console.error('JSON parse error:', e);
                    this.handleUploadError('Invalid server response: ' + xhr.responseText.substring(0, 100));
                }
            } else {
                this.handleUploadError(`Server error: HTTP ${xhr.status}`);
            }
        });
        
        // Error handling
        xhr.addEventListener('error', () => {
            this.handleUploadError('Network error: Unable to connect to server');
        });
        
        xhr.addEventListener('timeout', () => {
            this.handleUploadError('Upload timeout: Server took too long to respond');
        });
        
        // Send request
        xhr.open('POST', this.apiBaseUrl);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 60000; // 60 second timeout
        xhr.send(formData);
        
        this.currentUpload = xhr;
    }
    
    handleUploadResponse(response) {
        this.uploadInProgress = false;
        this.currentUpload = null;
        
        if (response.success) {
            this.updateProgress(100, 'Installation complete!');
            
            setTimeout(() => {
                this.showUploadResult(response, 'success');
            }, 1000);
            
            this.showNotification(
                `Module "${response.module}" v${response.version} installed successfully!`,
                'success'
            );
            
            // Refresh page after successful installation
            setTimeout(() => {
                if (confirm('Module installed successfully! Reload page to see changes?')) {
                    window.location.reload();
                }
            }, 2000);
            
        } else {
            this.handleUploadError(response.error || 'Installation failed for unknown reason');
        }
    }
    
    handleUploadError(error) {
        this.uploadInProgress = false;
        this.currentUpload = null;
        
        console.error('Upload error:', error);
        
        this.showUploadResult({ error }, 'error');
        this.showNotification(`Installation failed: ${error}`, 'error');
    }
    
    showUploadProgress() {
        const uploadZone = document.getElementById('uploadZone');
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadResult = document.getElementById('uploadResult');
        
        if (uploadZone) uploadZone.style.display = 'none';
        if (uploadProgress) uploadProgress.style.display = 'block';
        if (uploadResult) uploadResult.style.display = 'none';
        
        this.updateProgress(0, 'Preparing upload...');
    }
    
    updateProgress(percent, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }
        
        if (progressText) {
            progressText.textContent = text || 'Processing...';
        }
    }
    
    showUploadResult(response, type) {
        const resultDiv = document.getElementById('uploadResult');
        const progressDiv = document.getElementById('uploadProgress');
        
        if (progressDiv) progressDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'block';
        
        if (type === 'success') {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-check-circle" style="font-size: 24px; color: #10b981; flex-shrink: 0;"></i>
                        <div>
                            <h4 style="margin: 0; color: #065f46;">Module Installed Successfully!</h4>
                            <p style="margin: 4px 0 0; color: #047857;">
                                ${response.module} v${response.version} is now available.
                            </p>
                        </div>
                    </div>
                    <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <button onclick="admin.activateModule('${response.module}')" class="btn-success">
                            <i class="fas fa-play"></i> Activate Now
                        </button>
                        <button onclick="admin.resetUpload()" class="btn-secondary">
                            <i class="fas fa-plus"></i> Install Another
                        </button>
                        <button onclick="window.location.reload()" class="btn-primary">
                            <i class="fas fa-refresh"></i> Reload Page
                        </button>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-error">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #dc2626; flex-shrink: 0;"></i>
                        <div>
                            <h4 style="margin: 0; color: #991b1b;">Installation Failed</h4>
                            <p style="margin: 4px 0 0; color: #b91c1c; word-break: break-word;">
                                ${response.error || 'Unknown error occurred'}
                            </p>
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <button onclick="admin.resetUpload()" class="btn-secondary">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    resetUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const uploadProgress = document.getElementById('uploadProgress');
        const uploadResult = document.getElementById('uploadResult');
        const fileInput = document.getElementById('moduleFile');
        
        if (uploadZone) uploadZone.style.display = 'block';
        if (uploadProgress) uploadProgress.style.display = 'none';
        if (uploadResult) uploadResult.style.display = 'none';
        if (fileInput) fileInput.value = '';
        
        this.uploadInProgress = false;
        this.currentUpload = null;
    }
    
    cancelUpload() {
        if (this.currentUpload) {
            this.currentUpload.abort();
            this.currentUpload = null;
        }
        
        this.uploadInProgress = false;
        this.resetUpload();
        this.showNotification('Upload cancelled', 'warning');
    }
    
    // Module Management
    activateModule(moduleName) {
        if (!moduleName) {
            this.showNotification('Module name is required', 'error');
            return;
        }
        
        this.moduleAction('activate', moduleName, 'Activating module...', 'Module activated successfully');
    }
    
    deactivateModule(moduleName) {
        if (!moduleName) {
            this.showNotification('Module name is required', 'error');
            return;
        }
        
        this.moduleAction('deactivate', moduleName, 'Deactivating module...', 'Module deactivated successfully');
    }
    
    deleteModule(moduleName) {
        if (!moduleName) {
            this.showNotification('Module name is required', 'error');
            return;
        }
        
        if (confirm(`Are you sure you want to delete the module "${moduleName}"?\n\nThis action cannot be undone and will remove all module files.`)) {
            this.moduleAction('delete', moduleName, 'Deleting module...', 'Module deleted successfully');
        }
    }
    
    moduleAction(action, moduleName, loadingText, successText) {
        // Show loading notification
        this.showNotification(loadingText, 'info');
        
        // Disable module card
        const moduleCard = document.querySelector(`[data-module="${moduleName}"]`);
        if (moduleCard) {
            moduleCard.style.opacity = '0.5';
            moduleCard.style.pointerEvents = 'none';
            
            // Add loading indicator
            const loadingIcon = document.createElement('div');
            loadingIcon.className = 'module-loading';
            loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            loadingIcon.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.9);
                padding: 8px;
                border-radius: 50%;
                z-index: 10;
            `;
            moduleCard.style.position = 'relative';
            moduleCard.appendChild(loadingIcon);
        }
        
        // Build URL with proper encoding
        const url = `${this.apiBaseUrl.split('?')[0]}?admin=true&action=${encodeURIComponent(action)}&module=${encodeURIComponent(moduleName)}`;
        
        // Send request
        fetch(url, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }
            
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.showNotification(successText, 'success');
                
                // For delete action, remove the card immediately
                if (action === 'delete' && moduleCard) {
                    moduleCard.style.transition = 'all 0.3s ease';
                    moduleCard.style.transform = 'scale(0)';
                    moduleCard.style.opacity = '0';
                    
                    setTimeout(() => {
                        moduleCard.remove();
                        // Update stats
                        this.updateModuleStats();
                    }, 300);
                } else {
                    // Refresh page for activate/deactivate
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                
            } else {
                throw new Error(data.error || 'Unknown server error');
            }
        })
        .catch(error => {
            console.error('Module action error:', error);
            this.showNotification(`Action failed: ${error.message}`, 'error');
            
            // Re-enable module card
            if (moduleCard) {
                moduleCard.style.opacity = '';
                moduleCard.style.pointerEvents = '';
                
                // Remove loading indicator
                const loadingIcon = moduleCard.querySelector('.module-loading');
                if (loadingIcon) {
                    loadingIcon.remove();
                }
            }
        });
    }
    
    updateModuleStats() {
        // Update the stats in the header
        const moduleCards = document.querySelectorAll('.module-card');
        const activeCards = document.querySelectorAll('.module-card.active');
        
        const totalStat = document.querySelector('.section-stats .stat strong');
        const activeStat = document.querySelector('.section-stats .stat:last-child strong');
        
        if (totalStat) totalStat.textContent = moduleCards.length;
        if (activeStat) activeStat.textContent = activeCards.length;
    }
    
    refreshModulesGrid() {
        // Simple page reload - in production this could be optimized
        window.location.reload();
    }
    
    // System Information
    showSystemInfo() {
        const modal = document.getElementById('systemInfoModal');
        const content = document.getElementById('systemInfoContent');
        
        if (!modal || !content) {
            console.error('System info modal not found');
            return;
        }
        
        // Show modal with loading
        modal.style.display = 'flex';
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div class="loading-spinner"></div>
                <p>Loading system information...</p>
            </div>
        `;
        
        // Fetch system info
        fetch(`${this.apiBaseUrl}?action=system_info`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const info = data.data;
                content.innerHTML = `
                    <div class="system-info-grid">
                        <div class="info-section">
                            <h4><i class="fas fa-server"></i> System</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">FlowWork Version:</span>
                                    <span class="info-value">${info.flowwork_version}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">PHP Version:</span>
                                    <span class="info-value">${info.php_version}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Server Software:</span>
                                    <span class="info-value">${info.server_software}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Memory Limit:</span>
                                    <span class="info-value">${info.memory_limit}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Upload Max Size:</span>
                                    <span class="info-value">${info.upload_max_filesize}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Max Execution Time:</span>
                                    <span class="info-value">${info.max_execution_time}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4><i class="fas fa-puzzle-piece"></i> Modules</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Total Modules:</span>
                                    <span class="info-value">${info.modules_total}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Active Modules:</span>
                                    <span class="info-value">${info.modules_active}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4><i class="fas fa-hdd"></i> Storage</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Available Disk Space:</span>
                                    <span class="info-value">${info.disk_space}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4><i class="fas fa-clock"></i> Current Time</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Server Time:</span>
                                    <span class="info-value">${info.current_time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <style>
                    .system-info-grid {
                        display: grid;
                        gap: 24px;
                    }
                    .info-section h4 {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 12px;
                        color: var(--gray-900);
                        font-size: 16px;
                    }
                    .info-grid {
                        display: grid;
                        gap: 8px;
                    }
                    .info-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 12px;
                        background: var(--gray-50);
                        border-radius: 6px;
                    }
                    .info-label {
                        color: var(--gray-600);
                        font-size: 14px;
                    }
                    .info-value {
                        color: var(--gray-900);
                        font-weight: 500;
                        font-size: 14px;
                    }
                    </style>
                `;
            } else {
                content.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: var(--danger);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 12px;"></i>
                        <p>Failed to load system information</p>
                        <p style="font-size: 14px; color: var(--gray-600);">${data.error || 'Unknown error'}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('System info error:', error);
            content.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <p>Error loading system information</p>
                    <p style="font-size: 14px; color: var(--gray-600);">${error.message}</p>
                </div>
            `;
        });
    }
    
    showModuleInfo(moduleName) {
        const modal = document.getElementById('moduleInfoModal');
        const content = document.getElementById('moduleInfoContent');
        
        if (!modal || !content) {
            console.error('Module info modal not found');
            return;
        }
        
        // Find module data from the page
        const moduleCard = document.querySelector(`[data-module="${moduleName}"]`);
        if (!moduleCard) {
            this.showNotification('Module information not found', 'error');
            return;
        }
        
        // Extract module information
        const moduleIcon = moduleCard.querySelector('.module-icon')?.textContent || '📦';
        const moduleDisplayName = moduleCard.querySelector('.module-name')?.textContent || moduleName;
        const moduleVersion = moduleCard.querySelector('.module-version')?.textContent || 'v1.0.0';
        const moduleAuthor = moduleCard.querySelector('.module-author')?.textContent || 'by Unknown';
        const moduleDescription = moduleCard.querySelector('.module-description p')?.textContent || 'No description available';
        const moduleStatus = moduleCard.querySelector('.status-badge')?.textContent.trim() || 'Unknown';
        const installedDate = moduleCard.querySelector('.meta-item')?.textContent.replace('Installed: ', '') || 'Unknown';
        
        // Show modal
        modal.style.display = 'flex';
        content.innerHTML = `
            <div class="module-details">
                <div class="module-header-detail">
                    <div class="module-icon-large">${moduleIcon}</div>
                    <div class="module-info-detail">
                        <h3>${moduleDisplayName}</h3>
                        <div class="module-meta-detail">
                            <span class="badge">${moduleVersion}</span>
                            <span class="badge ${moduleStatus.toLowerCase().includes('active') ? 'active' : 'inactive'}">${moduleStatus}</span>
                        </div>
                        <p class="module-author-detail">${moduleAuthor}</p>
                    </div>
                </div>
                
                <div class="module-description-detail">
                    <h4>Description</h4>
                    <p>${moduleDescription}</p>
                </div>
                
                <div class="module-stats-detail">
                    <h4>Installation Details</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Module ID:</span>
                            <span class="stat-value">${moduleName}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Installed:</span>
                            <span class="stat-value">${installedDate}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Status:</span>
                            <span class="stat-value">${moduleStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
            .module-details {
                display: grid;
                gap: 24px;
            }
            .module-header-detail {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: var(--gray-50);
                border-radius: 8px;
            }
            .module-icon-large {
                font-size: 48px;
                flex-shrink: 0;
            }
            .module-info-detail h3 {
                margin: 0 0 8px 0;
                font-size: 20px;
                color: var(--gray-900);
            }
            .module-meta-detail {
                display: flex;
                gap: 8px;
                margin-bottom: 4px;
            }
            .badge {
                padding: 2px 8px;
                background: var(--gray-200);
                border-radius: 12px;
                font-size: 12px;
                color: var(--gray-700);
            }
            .badge.active {
                background: #dcfce7;
                color: #166534;
            }
            .badge.inactive {
                background: var(--gray-100);
                color: var(--gray-600);
            }
            .module-author-detail {
                font-size: 14px;
                color: var(--gray-600);
                margin: 0;
            }
            .module-description-detail h4,
            .module-stats-detail h4 {
                margin: 0 0 12px 0;
                font-size: 16px;
                color: var(--gray-900);
            }
            .module-description-detail p {
                margin: 0;
                color: var(--gray-600);
                line-height: 1.6;
            }
            .stats-grid {
                display: grid;
                gap: 8px;
            }
            .stat-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 12px;
                background: var(--gray-50);
                border-radius: 6px;
            }
            .stat-label {
                color: var(--gray-600);
                font-size: 14px;
            }
            .stat-value {
                color: var(--gray-900);
                font-weight: 500;
                font-size: 14px;
            }
            </style>
        `;
    }
    
    // Modal Management
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Notification System
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notifications');
        if (!container) {
            console.warn('Notifications container not found');
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        const titleMap = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        
        notification.innerHTML = `
            <i class="fas ${iconMap[type]} notification-icon ${type}"></i>
            <div class="notification-content">
                <div class="notification-title">${titleMap[type]}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Show notification with animation
       setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove notification
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    // Limit number of notifications
    const notifications = container.children;
    if (notifications.length > 5) {
        const oldest = notifications[0];
        oldest.classList.remove('show');
        setTimeout(() => {
            if (oldest.parentNode) {
                oldest.parentNode.removeChild(oldest);
            }
        }, 300);
    }
}

// Utility Methods
formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// Debug methods
debug(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        console.log('🔧 FlowWork Debug:', message, data);
    }
}

// Health check
async healthCheck() {
    try {
        const response = await fetch(`${this.apiBaseUrl}?action=system_info`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.success;
        }
        return false;
    } catch (e) {
        return false;
    }
}
}

// Global functions for easy access and backward compatibility
function selectFile() {
if (window.admin) {
    document.getElementById('moduleFile')?.click();
}
}

function cancelUpload() {
if (window.admin) {
    admin.cancelUpload();
}
}

function activateModule(moduleName) {
if (window.admin) {
    admin.activateModule(moduleName);
}
}

function deactivateModule(moduleName) {
if (window.admin) {
    admin.deactivateModule(moduleName);
}
}

function deleteModule(moduleName) {
if (window.admin) {
    admin.deleteModule(moduleName);
}
}

function showSystemInfo() {
if (window.admin) {
    admin.showSystemInfo();
}
}

function showModuleInfo(moduleName) {
if (window.admin) {
    admin.showModuleInfo(moduleName);
}
}

function closeModal(modalId) {
if (window.admin) {
    admin.closeModal(modalId);
}
}

// Enhanced global functions with better UX
function showGlobalLoading(message, subtext) {
const overlay = document.getElementById('loadingOverlay');
const text = document.getElementById('loadingText');
const subText = document.getElementById('loadingSubtext');

if (overlay) {
    if (text) text.textContent = message || 'Processing...';
    if (subText) subText.textContent = subtext || 'Please wait';
    overlay.style.display = 'flex';
}
}

function hideGlobalLoading() {
const overlay = document.getElementById('loadingOverlay');
if (overlay) {
    overlay.style.display = 'none';
}
}

// Initialize admin when DOM is ready
let admin;
document.addEventListener('DOMContentLoaded', function() {
try {
    admin = new FlowWorkAdmin();
    window.admin = admin; // Make it globally accessible
    
    // Initial health check
    admin.healthCheck().then(isHealthy => {
        if (!isHealthy) {
            admin.showNotification('System health check failed. Some features may not work properly.', 'warning', 10000);
        }
    });
    
    // Auto-update stats every 30 seconds
    setInterval(() => {
        admin.updateModuleStats();
    }, 30000);
    
} catch (error) {
    console.error('Failed to initialize FlowWork Admin:', error);
    
    // Fallback notification
    const container = document.createElement('div');
    container.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 16px;
            border-radius: 8px;
            max-width: 400px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">
                <i class="fas fa-exclamation-triangle"></i> Admin Panel Error
            </h4>
            <p style="margin: 0; font-size: 13px;">
                Failed to initialize admin panel. Please refresh the page.
            </p>
            <button onclick="window.location.reload()" style="
                margin-top: 8px;
                padding: 4px 8px;
                border: none;
                background: #dc2626;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">
                Refresh Page
            </button>
        </div>
    `;
    document.body.appendChild(container);
}
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
if (!document.hidden && window.admin) {
    // Page became visible again, do a quick health check
    admin.healthCheck().then(isHealthy => {
        if (!isHealthy) {
            console.warn('Health check failed after page visibility change');
        }
    });
}
});

// Handle online/offline status
window.addEventListener('online', function() {
if (window.admin) {
    admin.showNotification('Connection restored', 'success', 3000);
}
});

window.addEventListener('offline', function() {
if (window.admin) {
    admin.showNotification('Connection lost. Some features may not work.', 'warning', 10000);
}
});

// Performance monitoring
if (window.performance && window.performance.mark) {
window.performance.mark('flowwork-admin-js-loaded');
}

console.log('🎛️ FlowWork Admin JavaScript loaded successfully');

// Export for module system integration
if (typeof module !== 'undefined' && module.exports) {
module.exports = FlowWorkAdmin;
}

// AMD support
if (typeof define === 'function' && define.amd) {
define([], function() {
    return FlowWorkAdmin;
});
}
