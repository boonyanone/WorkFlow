/**
 * FlowWork Admin Panel JavaScript
 * Handles module management, uploads, and UI interactions
 */

class FlowWorkAdmin {
    constructor() {
        this.uploadInProgress = false;
        this.currentUpload = null;
        
        this.init();
    }
    
    init() {
        console.log('🎛️ FlowWork Admin Panel initializing...');
        
        // Initialize upload functionality
        this.initUpload();
        
        // Initialize event listeners
        this.initEventListeners();
        
        console.log('✅ Admin Panel ready!');
    }
    
    initUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('moduleFile');
        
        if (!uploadZone || !fileInput) return;
        
        // Drag & Drop events
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
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
        uploadZone.addEventListener('click', () => {
            if (!this.uploadInProgress) {
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
    }
    
    // File Upload Handling
    handleFileUpload(file) {
        // Validate file
        if (!this.validateFile(file)) {
            return;
        }
        
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
        if (!file.name.toLowerCase().endsWith('.zip')) {
            this.showNotification('Invalid file type. Please upload a .zip file.', 'error');
            return false;
        }
        
        // Check file size (10MB default)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showNotification('File too large. Maximum size is 10MB.', 'error');
            return false;
        }
        
        return true;
    }
    
    uploadWithProgress(formData) {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                this.updateProgress(percentComplete, 'Uploading...');
            }
        });
        
        // Response handling
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    this.handleUploadResponse(response);
                } catch (e) {
                    this.handleUploadError('Invalid server response');
                }
            } else {
                this.handleUploadError(`Server error: ${xhr.status}`);
            }
        });
        
        // Error handling
        xhr.addEventListener('error', () => {
            this.handleUploadError('Network error occurred');
        });
        
        // Send request
        xhr.open('POST', window.location.href);
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
                this.refreshModulesGrid();
            }, 1000);
            
            this.showNotification(
                `Module "${response.module}" v${response.version} installed successfully!`,
                'success'
            );
        } else {
            this.handleUploadError(response.error || 'Installation failed');
        }
    }
    
    handleUploadError(error) {
        this.uploadInProgress = false;
        this.currentUpload = null;
        
        this.showUploadResult({ error }, 'error');
        this.showNotification(`Installation failed: ${error}`, 'error');
        
        console.error('Upload error:', error);
    }
    
    showUploadProgress() {
        document.getElementById('uploadZone').style.display = 'none';
        document.getElementById('uploadProgress').style.display = 'block';
        document.getElementById('uploadResult').style.display = 'none';
        
        this.updateProgress(0, 'Preparing upload...');
    }
    
    updateProgress(percent, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${Math.round(percent)}%`;
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }
    
    showUploadResult(response, type) {
        const resultDiv = document.getElementById('uploadResult');
        const progressDiv = document.getElementById('uploadProgress');
        
        progressDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        
        if (type === 'success') {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-check-circle" style="font-size: 24px; color: #10b981;"></i>
                        <div>
                            <h4 style="margin: 0; color: #065f46;">Module Installed Successfully!</h4>
                            <p style="margin: 4px 0 0; color: #047857;">
                                ${response.module} v${response.version} is now available.
                            </p>
                        </div>
                    </div>
                    <div style="margin-top: 16px; display: flex; gap: 8px;">
                        <button onclick="admin.activateModule('${response.module}')" class="btn-success">
                            <i class="fas fa-play"></i> Activate Now
                        </button>
                        <button onclick="admin.resetUpload()" class="btn-secondary">
                            <i class="fas fa-plus"></i> Install Another
                        </button>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-error">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #dc2626;"></i>
                        <div>
                            <h4 style="margin: 0; color: #991b1b;">Installation Failed</h4>
                            <p style="margin: 4px 0 0; color: #b91c1c;">
                                ${response.error}
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
        document.getElementById('uploadZone').style.display = 'block';
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('uploadResult').style.display = 'none';
        document.getElementById('moduleFile').value = '';
        
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
        this.moduleAction('activate', moduleName, 'Activating module...', 'Module activated successfully');
    }
    
    deactivateModule(moduleName) {
        this.moduleAction('deactivate', moduleName, 'Deactivating module...', 'Module deactivated successfully');
    }
    
    deleteModule(moduleName) {
        if (confirm(`Are you sure you want to delete the module "${moduleName}"?\n\nThis action cannot be undone.`)) {
            this.moduleAction('delete', moduleName, 'Deleting module...', 'Module deleted successfully');
        }
    }
    
    moduleAction(action, moduleName, loadingText, successText) {
        // Show loading state
        this.showNotification(loadingText, 'info');
        
        // Disable module card
        const moduleCard = document.querySelector(`[data-module="${moduleName}"]`);
        if (moduleCard) {
            moduleCard.style.opacity = '0.5';
            moduleCard.style.pointerEvents = 'none';
        }
        
        // Send request
        fetch(`?action=${action}&module=${encodeURIComponent(moduleName)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.showNotification(successText, 'success');
                    
                    // Refresh modules grid
                    setTimeout(() => {
                        this.refreshModulesGrid();
                    }, 1000);
                } else {
                    this.showNotification(`Action failed: ${data.error}`, 'error');
                    
                    // Re-enable module card
                    if (moduleCard) {
                        moduleCard.style.opacity = '';
                        moduleCard.style.pointerEvents = '';
                    }
                }
            })
            .catch(error => {
                this.showNotification(`Network error: ${error.message}`, 'error');
                
                // Re-enable module card
                if (moduleCard) {
                    moduleCard.style.opacity = '';
                    moduleCard.style.pointerEvents = '';
                }
            });
    }
    
    refreshModulesGrid() {
        // Simple page reload for now
        // In production, this could be a partial refresh
        window.location.reload();
    }
    
    // System Information
    showSystemInfo() {
        const modal = document.getElementById('systemInfoModal');
        const content = document.getElementById('systemInfoContent');
        
        // Show modal with loading
        modal.style.display = 'flex';
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div class="loading-spinner"></div>
                <p>Loading system information...</p>
            </div>
        `;
        
        // Fetch system info
        fetch('?action=system_info')
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
                                        <span class="info-label">Memory Limit:</span>
                                        <span class="info-value">${info.memory_limit}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Upload Max Size:</span>
                                        <span class="info-value">${info.upload_max_filesize}</span>
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
                        </div>
                    `;
                }
            })
            .catch(error => {
                content.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: var(--danger);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 32px; margin-bottom: 12px;"></i>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            });
    }
    
    showModuleInfo(moduleName) {
        const modal = document.getElementById('moduleInfoModal');
        const content = document.getElementById('moduleInfoContent');
        
        // Find module data from the page
        const moduleCard = document.querySelector(`[data-module="${moduleName}"]`);
        if (!moduleCard) return;
        
        // Extract module information
        const moduleIcon = moduleCard.querySelector('.module-icon').textContent;
        const moduleName_display = moduleCard.querySelector('.module-name').textContent;
        const moduleVersion = moduleCard.querySelector('.module-version').textContent;
        const moduleAuthor = moduleCard.querySelector('.module-author').textContent;
        const moduleDescription = moduleCard.querySelector('.module-description p').textContent;
        const moduleStatus = moduleCard.querySelector('.status-badge').textContent.trim();
        const installedDate = moduleCard.querySelector('.meta-item').textContent.replace('Installed: ', '');
        
        // Show modal
        modal.style.display = 'flex';
        content.innerHTML = `
            <div class="module-details">
                <div class="module-header-detail">
                    <div class="module-icon-large">${moduleIcon}</div>
                    <div class="module-info-detail">
                        <h3>${moduleName_display}</h3>
                        <div class="module-meta-detail">
                            <span class="badge">${moduleVersion}</span>
                            <span class="badge">${moduleStatus}</span>
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
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="fas ${iconMap[type]} notification-icon ${type}"></i>
            <div class="notification-content">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    getNotificationTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }
}

// Global functions for easy access
function selectFile() {
    document.getElementById('moduleFile').click();
}

function cancelUpload() {
    admin.cancelUpload();
}

function activateModule(moduleName) {
    admin.activateModule(moduleName);
}

function deactivateModule(moduleName) {
    admin.deactivateModule(moduleName);
}

function deleteModule(moduleName) {
    admin.deleteModule(moduleName);
}

function showSystemInfo() {
    admin.showSystemInfo();
}

function showModuleInfo(moduleName) {
    admin.showModuleInfo(moduleName);
}

function closeModal(modalId) {
    admin.closeModal(modalId);
}

// Initialize admin when DOM is ready
let admin;
document.addEventListener('DOMContentLoaded', function() {
    admin = new FlowWorkAdmin();
});

console.log('🎛️ FlowWork Admin JavaScript loaded');