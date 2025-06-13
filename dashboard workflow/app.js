// 🏗️ FlowWork Module Manager
// Version: 2.0.0
// Core system for loading and managing modules

class FlowWorkModuleManager {
    constructor() {
        this.modules = new Map();
        this.activeModule = null;
        this.container = null;
        this.eventBus = new EventTarget();
        
        console.log('🚀 FlowWork Module Manager initialized');
    }
    
    // 🎯 Initialize System
    async init(containerSelector = '#contentArea') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('❌ Container not found:', containerSelector);
            return false;
        }
        
        // Setup global FlowWork object
        window.FlowWork = {
            loadModule: (name) => this.loadModule(name),
            goBack: () => this.goBack(),
            showNotification: (msg, type) => this.showNotification(msg, type),
            updateAIUsageStats: () => this.updateAIUsageStats(),
            eventBus: this.eventBus
        };
        
        console.log('✅ FlowWork Module Manager ready');
        return true;
    }
    
    // 📥 Load Module
    async loadModule(moduleName) {
        try {
            console.log(`📦 Loading module: ${moduleName}`);
            
            // Show loading state
            this.showLoadingState(moduleName);
            
            // Unload current module
            if (this.activeModule) {
                await this.unloadModule(this.activeModule);
            }
            
            // Check if module already cached
            if (!this.modules.has(moduleName)) {
                // Dynamic import
                const moduleFile = await import(`./modules/${moduleName}.js`);
                const module = moduleFile.default;
                
                // Validate module
                if (!this.validateModule(module)) {
                    throw new Error(`Invalid module: ${moduleName}`);
                }
                
                // Cache module
                this.modules.set(moduleName, module);
                console.log(`✅ Module cached: ${moduleName}`);
            }
            
            // Get module
            const module = this.modules.get(moduleName);
            
            // Initialize module
            if (module.init) {
                await module.init();
            }
            
            // Render module
            if (module.render) {
                const success = await module.render(this.container);
                if (!success) {
                    throw new Error(`Failed to render module: ${moduleName}`);
                }
            }
            
            // Set as active
            this.activeModule = moduleName;
            this.updateNavigation(moduleName);
            
            // Emit event
            this.emit('module.loaded', { module: moduleName });
            
            console.log(`🎉 Module loaded successfully: ${moduleName}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to load module ${moduleName}:`, error);
            this.showErrorState(moduleName, error.message);
            return false;
        }
    }
    
    // 📤 Unload Module
    async unloadModule(moduleName) {
        if (!moduleName || !this.modules.has(moduleName)) {
            return false;
        }
        
        try {
            const module = this.modules.get(moduleName);
            
            // Call destroy method
            if (module.destroy) {
                await module.destroy();
            }
            
            // Clear container
            if (this.container) {
                this.container.innerHTML = '';
            }
            
            console.log(`🗑️ Module unloaded: ${moduleName}`);
            this.emit('module.unloaded', { module: moduleName });
            
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to unload module ${moduleName}:`, error);
            return false;
        }
    }
    
    // ✅ Validate Module
    validateModule(module) {
        if (!module || typeof module !== 'object') {
            return false;
        }
        
        // Required properties
        const required = ['name'];
        for (const prop of required) {
            if (!module[prop]) {
                console.error(`❌ Module missing required property: ${prop}`);
                return false;
            }
        }
        
        // Optional but recommended
        const recommended = ['render', 'init', 'destroy'];
        for (const prop of recommended) {
            if (!module[prop]) {
                console.warn(`⚠️ Module missing recommended method: ${prop}`);
            }
        }
        
        return true;
    }
    
    // 🎨 Show Loading State
    showLoadingState(moduleName) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="loading-state flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Loading ${moduleName}</h3>
                    <p class="text-gray-600">Please wait while we prepare your workspace...</p>
                </div>
            </div>
        `;
    }
    
    // ❌ Show Error State
    showErrorState(moduleName, error) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="error-state flex items-center justify-center min-h-96">
                <div class="text-center max-w-md">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Failed to Load ${moduleName}</h3>
                    <p class="text-gray-600 mb-4">${error}</p>
                    <div class="flex justify-center space-x-3">
                        <button onclick="FlowWork.loadModule('dashboard')" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            <i class="fas fa-home mr-2"></i>Go to Dashboard
                        </button>
                        <button onclick="location.reload()" class="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                            <i class="fas fa-refresh mr-2"></i>Reload
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 🧭 Update Navigation
    updateNavigation(activeModule) {
        // Remove active from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Module to menu mapping
        const menuMap = {
            'dashboard': 'a[onclick*="dashboard"]',
            'ai-research': 'a[onclick*="ai-research"]',
            'meeting-hub': 'a[onclick*="meeting-hub"]',
            'live-recording': 'a[onclick*="live-recording"]',
            'documents': 'a[onclick*="documents"]',
            'team-workspace': 'a[onclick*="team-workspace"]',
            'action-items': 'a[onclick*="action-items"]',
            'analytics': 'a[onclick*="analytics"]',
            'integrations': 'a[onclick*="integrations"]',
            'settings': 'a[onclick*="settings"]'
        };
        
        const selector = menuMap[activeModule];
        if (selector) {
            const menuItem = document.querySelector(selector);
            if (menuItem) {
                menuItem.classList.add('active');
            }
        }
    }
    
    // 🔙 Go Back
    goBack() {
        // Load dashboard as default
        this.loadModule('dashboard');
    }
    
    // 📢 Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-6 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-500 translate-x-full max-w-sm ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
            type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-gray-100 text-gray-800 border border-gray-200'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'info' ? 'fa-info-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-times-circle' :
                    'fa-bell'
                } text-lg mt-0.5"></i>
                <div>
                    <div class="font-medium text-sm">${message}</div>
                    <div class="text-xs opacity-75 mt-1">${new Date().toLocaleTimeString()}</div>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="ml-2 text-current opacity-50 hover:opacity-100">
                    <i class="fas fa-times text-sm"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
    
    // 📊 Update AI Usage Stats
    updateAIUsageStats() {
        const modelCosts = {
            'GPT-4': 8,
            'Claude-3': 5,
            'Gemini': 2
        };
        
        const cost = modelCosts['GPT-4'] || 5; // Default cost
        const creditsElement = document.getElementById('creditsCount');
        
        if (creditsElement) {
            const currentCredits = parseInt(creditsElement.textContent);
            const newCredits = Math.max(0, currentCredits - cost);
            creditsElement.textContent = newCredits.toString();
        }
        
        this.showNotification(`Query completed! Used ${cost} credits`, 'success');
    }
    
    // 📡 Event System
    emit(eventName, data) {
        this.eventBus.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
    
    on(eventName, callback) {
        this.eventBus.addEventListener(eventName, callback);
    }
    
    off(eventName, callback) {
        this.eventBus.removeEventListener(eventName, callback);
    }
    
    // 📋 Get Module Info
    getActiveModule() {
        return this.activeModule;
    }
    
    getLoadedModules() {
        return Array.from(this.modules.keys());
    }
    
    getModuleState(moduleName) {
        const module = this.modules.get(moduleName);
        return module ? module.state : null;
    }
}

// 🎯 Create global instance
const FlowWorkManager = new FlowWorkModuleManager();

// 🚀 Export for use
export default FlowWorkManager;

// 🌐 Make available globally
window.FlowWorkManager = FlowWorkManager;