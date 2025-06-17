// 🎯 FlowWork Pure CSS System - Backend Integrated Version

// Dashboard Module
const DashboardModule = {
    name: 'Dashboard',
    version: '1.0.0',
    
    init() {
        console.log('📊 Dashboard Module (Backend Integrated) initialized');
        return true;
    },
    
    render(container) {
        if (!container) return false;
        
        container.innerHTML = `
            <div class="dashboard-module">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">
                        Welcome back, พี่โล่! 👋
                    </h1>
                    <div class="dashboard-date">
                        ${new Date().toLocaleDateString('th-TH', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="quick-actions">
                    <div class="action-card" onclick="FlowWork.loadModule('ai-research')">
                        <div class="card-header">
                            <i class="fas fa-brain card-icon"></i>
                            <span class="card-badge">Coming Soon</span>
                        </div>
                        <h3 class="card-title">AI Research</h3>
                        <p class="card-description">Ask AI anything, get instant insights</p>
                    </div>
                    
                    <div class="action-card red" onclick="FlowWork.showNotification('Live Recording module coming soon...', 'info')">
                        <div class="card-header">
                            <i class="fas fa-record-vinyl card-icon"></i>
                            <span class="card-badge">Phase 2</span>
                        </div>
                        <h3 class="card-title">Start Recording</h3>
                        <p class="card-description">Record & transcribe meetings instantly</p>
                    </div>
                    
                    <div class="action-card blue" onclick="window.location.href='?admin=true'">
                        <div class="card-header">
                            <i class="fas fa-cog card-icon"></i>
                            <span class="card-badge">Ready</span>
                        </div>
                        <h3 class="card-title">Admin Panel</h3>
                        <p class="card-description">Manage modules and system settings</p>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Modules</h3>
                            <i class="fas fa-puzzle-piece stat-icon"></i>
                        </div>
                        <div class="stat-value">${window.FlowWorkConfig?.modules?.length || 0}</div>
                        <p class="stat-label">Installed</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">System</h3>
                            <i class="fas fa-server stat-icon blue"></i>
                        </div>
                        <div class="stat-value blue">${window.FlowWorkConfig?.hasError ? '⚠️' : '✅'}</div>
                        <p class="stat-label">${window.FlowWorkConfig?.hasError ? 'Error' : 'Healthy'}</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Version</h3>
                            <i class="fas fa-code-branch stat-icon green"></i>
                        </div>
                        <div class="stat-value green">${window.FlowWorkConfig?.version || '3.0'}</div>
                        <p class="stat-label">FlowWork</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Credits</h3>
                            <i class="fas fa-coins stat-icon orange"></i>
                        </div>
                        <div class="stat-value orange">1,246</div>
                        <p class="stat-label">Available</p>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="activity-section">
                    <h3 class="activity-title">System Status</h3>
                    <div class="activity-list">
                        <div class="activity-item purple">
                            <div class="activity-icon">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">FlowWork Dashboard deployed</div>
                                <div class="activity-time">Pure CSS system with backend integration - Just now</div>
                            </div>
                            <button class="activity-btn" onclick="window.location.reload()">Refresh</button>
                        </div>
                        
                        <div class="activity-item blue">
                            <div class="activity-icon blue">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">Admin panel ready</div>
                                <div class="activity-time">Module management system active</div>
                            </div>
                            <button class="activity-btn blue" onclick="window.location.href='?admin=true'">Open</button>
                        </div>
                        
                        <div class="activity-item green">
                            <div class="activity-icon green">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">Security enabled</div>
                                <div class="activity-time">Core files protected, production mode active</div>
                            </div>
                            <button class="activity-btn green">Secure</button>
                        </div>
                   </div>
               </div>
           </div>
       `;
       
       return true;
   },
   
   destroy() {
       console.log('📊 Dashboard Module destroyed');
   }
};

// Announcement Manager
class AnnouncementManager {
   constructor() {
       this.bar = null;
       this.storageKey = 'flowwork_announcement_dismissed';
   }
   
   init() {
       this.bar = document.getElementById('announcementBar');
       const closeBtn = document.getElementById('closeAnnouncement');
       
       if (!this.bar || !closeBtn) return false;
       
       closeBtn.addEventListener('click', () => this.dismiss());
       
       const dismissed = localStorage.getItem(this.storageKey);
       if (!dismissed) {
           setTimeout(() => this.show(), 1000);
       }
       
       console.log('📢 AnnouncementManager initialized');
       return true;
   }
   
   show() {
       if (!this.bar) return;
       this.bar.classList.add('show');
       document.body.classList.add('has-announcement');
   }
   
   dismiss() {
       if (!this.bar) return;
       this.bar.classList.remove('show');
       document.body.classList.remove('has-announcement');
       localStorage.setItem(this.storageKey, Date.now().toString());
   }
}

// Module Manager - Backend Integrated
class ModuleManager {
   constructor() {
       this.activeModule = null;
       this.container = null;
       this.modules = new Map();
       this.config = window.FlowWorkConfig || {};
       
       // Register dashboard module
       this.modules.set('dashboard', DashboardModule);
       
       // Register backend modules
       if (this.config.modules && Array.isArray(this.config.modules)) {
           this.config.modules.forEach(module => {
               console.log('📦 Backend module available:', module.name);
               // Backend modules will be loaded dynamically
           });
       }
   }
   
   async init(containerSelector = '#contentArea') {
       this.container = document.querySelector(containerSelector);
       if (!this.container) {
           console.error('❌ Container not found:', containerSelector);
           return false;
       }
       
       // Create global FlowWork object
       window.FlowWork = {
           loadModule: (name) => this.loadModule(name),
           showNotification: (msg, type) => this.showNotification(msg, type),
           updateAIUsageStats: () => this.updateAIUsageStats(),
           config: this.config
       };
       
       console.log('✅ Module Manager ready');
       console.log('🔧 FlowWork Config:', this.config);
       return true;
   }
   
   async loadModule(moduleName) {
       try {
           console.log(`📦 Loading module: ${moduleName}`);
           
           // Show loading for non-dashboard modules
           if (moduleName !== 'dashboard') {
               this.showLoadingState(moduleName);
           }
           
           // Unload current module
           if (this.activeModule && this.activeModule !== moduleName) {
               await this.unloadModule(this.activeModule);
           }
           
           // Check for dashboard
           if (moduleName === 'dashboard') {
               const module = this.modules.get('dashboard');
               if (module) {
                   if (module.init) await module.init();
                   if (module.render) {
                       const success = await module.render(this.container);
                       if (success) {
                           this.activeModule = moduleName;
                           this.updateNavigation(moduleName);
                           console.log(`🎉 Dashboard loaded successfully`);
                           return true;
                       }
                   }
               }
           }
           
           // Check for backend modules
           const backendModule = this.config.modules?.find(m => m.name === moduleName);
           if (backendModule) {
               // Try to load module script if available
               if (backendModule.assets && backendModule.assets.js) {
                   try {
                       await this.loadModuleScript(backendModule);
                       // Module should register itself
                       const module = this.modules.get(moduleName);
                       if (module && module.render) {
                           const success = await module.render(this.container);
                           if (success) {
                               this.activeModule = moduleName;
                               this.updateNavigation(moduleName);
                               console.log(`🎉 Module loaded: ${moduleName}`);
                               return true;
                           }
                       }
                   } catch (e) {
                       console.error(`❌ Failed to load module script:`, e);
                   }
               }
               
               // Fallback: Show module placeholder
               this.showModulePlaceholder(backendModule);
               this.activeModule = moduleName;
               this.updateNavigation(moduleName);
               return true;
           }
           
           // Module not found - show coming soon
           this.showComingSoon(moduleName);
           
       } catch (error) {
           console.error(`❌ Failed to load module ${moduleName}:`, error);
           this.showErrorState(moduleName, error.message);
           return false;
       }
   }
   
   async loadModuleScript(module) {
       return new Promise((resolve, reject) => {
           const script = document.createElement('script');
           script.src = `modules/installed/${module.name}/${module.assets.js}`;
           script.onload = () => resolve();
           script.onerror = () => reject(new Error(`Failed to load ${module.name} script`));
           document.head.appendChild(script);
       });
   }
   
   showModulePlaceholder(module) {
       if (!this.container) return;
       
       this.container.innerHTML = `
           <div style="text-align: center; padding: 60px 20px;">
               <div style="font-size: 64px; margin-bottom: 24px;">${module.icon || '📦'}</div>
               <h2 style="font-size: 28px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">
                   ${module.display_name}
               </h2>
               <p style="color: var(--gray-600); margin: 16px 0 32px; font-size: 16px; line-height: 1.5;">
                   ${module.description}
               </p>
               
               <div style="background: var(--green-50); border: 1px solid var(--green-200); border-radius: 12px; padding: 24px; margin: 32px auto; max-width: 500px;">
                   <h4 style="color: var(--green-800); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                       <i class="fas fa-check-circle"></i> Module Installed
                   </h4>
                   <p style="color: var(--green-700); margin: 0; font-size: 14px;">
                       ${module.display_name} v${module.version} is installed and ready. 
                       Module interface will be available in the next update.
                   </p>
               </div>
               
               <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                   <button onclick="window.location.href='?admin=true'" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                       <i class="fas fa-cog" style="margin-right: 8px;"></i>Manage in Admin
                   </button>
                   <button onclick="FlowWork.loadModule('dashboard')" style="background: var(--gray-100); color: var(--gray-700); padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                       <i class="fas fa-home" style="margin-right: 8px;"></i>Back to Dashboard
                   </button>
               </div>
           </div>
       `;
   }
   
   showComingSoon(moduleName) {
       if (!this.container) return;
       
       this.container.innerHTML = `
           <div style="text-align: center; padding: 60px 20px;">
               <div style="font-size: 64px; margin-bottom: 24px;">🚀</div>
               <h2 style="font-size: 28px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">
                   ${moduleName}
               </h2>
               <p style="color: var(--gray-600); margin: 16px 0 32px; font-size: 16px;">
                   This module is coming soon in the next phase of development!
               </p>
               
               <div style="background: var(--blue-50); border: 1px solid var(--blue-200); border-radius: 12px; padding: 24px; margin: 32px auto; max-width: 500px;">
                   <h4 style="color: var(--blue-800); margin-bottom: 8px;">🔄 Development Status</h4>
                   <p style="color: var(--blue-700); margin: 0; font-size: 14px;">
                       ${moduleName} is planned for Phase 2 development. 
                       Currently focusing on core dashboard and module system.
                   </p>
               </div>
               
               <button onclick="FlowWork.loadModule('dashboard')" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                   <i class="fas fa-home" style="margin-right: 8px;"></i>Back to Dashboard
               </button>
           </div>
       `;
       
       this.showNotification(`${moduleName} coming soon in Phase 2!`, 'info');
   }
   
   showLoadingState(moduleName) {
       if (!this.container) return;
       
       this.container.innerHTML = `
           <div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
               <div style="text-center">
                   <div style="width: 64px; height: 64px; border: 4px solid var(--gray-200); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                   <h3 style="font-size: 20px; font-weight: 600; color: var(--gray-900); margin-bottom: 8px;">Loading ${moduleName}</h3>
                   <p style="color: var(--gray-600);">Please wait while we prepare the module...</p>
               </div>
           </div>
       `;
   }
   
   showErrorState(moduleName, error) {
       if (!this.container) return;
       
       this.container.innerHTML = `
           <div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
               <div style="text-center; max-width: 400px;">
                   <div style="width: 64px; height: 64px; background: var(--red-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                       <i class="fas fa-exclamation-triangle" style="color: var(--red-600); font-size: 24px;"></i>
                   </div>
                   <h3 style="font-size: 20px; font-weight: 600; color: var(--gray-900); margin-bottom: 8px;">Failed to Load ${moduleName}</h3>
                   <p style="color: var(--gray-600); margin-bottom: 24px;">${error}</p>
                   <div style="display: flex; justify-content: center; gap: 12px;">
                       <button onclick="FlowWork.loadModule('dashboard')" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                           <i class="fas fa-home" style="margin-right: 8px;"></i>Go to Dashboard
                       </button>
                       <button onclick="location.reload()" style="background: var(--gray-600); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                           <i class="fas fa-refresh" style="margin-right: 8px;"></i>Reload
                       </button>
                   </div>
               </div>
           </div>
       `;
   }
   
   async unloadModule(moduleName) {
       if (!moduleName || !this.modules.has(moduleName)) {
           return false;
       }
       
       try {
           const module = this.modules.get(moduleName);
           
           if (module && module.destroy) {
               await module.destroy();
           }
           
           console.log(`🗑️ Module unloaded: ${moduleName}`);
           return true;
           
       } catch (error) {
           console.error(`❌ Failed to unload module ${moduleName}:`, error);
           return false;
       }
   }
   
   updateNavigation(activeModule) {
       // Remove active from all nav items
       document.querySelectorAll('.nav-item').forEach(item => {
           item.classList.remove('active');
       });
       
       // Add active to current module nav item
       const navItems = document.querySelectorAll('.nav-item');
       navItems.forEach(item => {
           const onclick = item.getAttribute('onclick');
           if (onclick && onclick.includes(`'${activeModule}'`)) {
               item.classList.add('active');
           }
       });
   }
   
   showNotification(message, type = 'info') {
       const notification = document.createElement('div');
       notification.className = `notification ${type}`;
       
       const iconMap = {
           success: 'fa-check-circle',
           info: 'fa-info-circle',
           warning: 'fa-exclamation-triangle',
           error: 'fa-times-circle'
       };
       
       notification.innerHTML = `
           <div class="notification-content">
               <i class="fas ${iconMap[type] || iconMap.info} notification-icon ${type}"></i>
               <div class="notification-text">
                   <div class="notification-title">${message}</div>
                   <div class="notification-time">${new Date().toLocaleTimeString()}</div>
               </div>
               <button class="notification-close" onclick="this.closest('.notification').remove()">
                   <i class="fas fa-times"></i>
               </button>
           </div>
       `;
       
       document.body.appendChild(notification);
       setTimeout(() => notification.classList.add('show'), 100);
       setTimeout(() => {
           notification.classList.remove('show');
           setTimeout(() => {
               if (notification.parentNode) {
                   notification.parentNode.removeChild(notification);
               }
           }, 300);
       }, 5000);
   }
   
   updateAIUsageStats() {
       const creditsElement = document.getElementById('creditsCount');
       if (creditsElement) {
           const currentCredits = parseInt(creditsElement.textContent.replace(',', ''));
           const newCredits = Math.max(0, currentCredits - 5);
           creditsElement.textContent = newCredits.toLocaleString();
       }
       this.showNotification('Query completed! Used 5 credits', 'success');
   }
}

// Sidebar Settings
const SidebarSettings = {
   mode: localStorage.getItem('sidebar-mode') || 'full',
   
   init() {
       console.log('🎛️ Initializing SidebarSettings with mode:', this.mode);
       this.apply();
   },
   
   toggle() {
       const modes = ['full', 'minimal', 'hidden'];
       const current = modes.indexOf(this.mode);
       this.mode = modes[(current + 1) % modes.length];
       localStorage.setItem('sidebar-mode', this.mode);
       this.apply();
       
       const modeNames = { full: 'Full View', minimal: 'Minimal View', hidden: 'Hidden' };
       
       if (window.FlowWork) {
           window.FlowWork.showNotification(`Workspace: ${modeNames[this.mode]}`, 'info');
       }
   },
   
   hide() {
       this.mode = 'hidden';
       localStorage.setItem('sidebar-mode', this.mode);
       this.apply();
       
       if (window.FlowWork) {
           window.FlowWork.showNotification('Workspace hidden', 'info');
       }
   },
   
   show() {
       this.mode = 'full';
       localStorage.setItem('sidebar-mode', this.mode);
       this.apply();
       
       if (window.FlowWork) {
           window.FlowWork.showNotification('Workspace restored', 'success');
       }
   },
   
   apply() {
       const sidebar = document.getElementById('rightPanel');
       const toggleBtn = document.getElementById('workspaceToggle');
       
       if (sidebar) {
           sidebar.className = `right-panel mode-${this.mode}`;
           
           if (toggleBtn) {
               if (this.mode === 'hidden') {
                   toggleBtn.classList.add('show');
               } else {
                   toggleBtn.classList.remove('show');
               }
           }
           
           const contentArea = document.querySelector('.content-area');
           if (contentArea) {
               if (this.mode === 'hidden') {
                   contentArea.style.marginRight = '0';
               } else if (this.mode === 'minimal') {
                   contentArea.style.marginRight = '220px';
               } else {
                   contentArea.style.marginRight = 'var(--right-panel-width)';
               }
           }
       }
   }
};

// Real-time Clock
function updateCurrentTime() {
   const now = new Date();
   const timeString = now.toLocaleTimeString('th-TH', { 
       hour: '2-digit', 
       minute: '2-digit'
   });
   const timeElement = document.getElementById('currentTime');
   if (timeElement) {
       timeElement.textContent = timeString;
   }
}

// Mobile Sidebar Toggle
function toggleMobileSidebar() {
   const sidebar = document.getElementById('sidebar');
   if (sidebar) {
       sidebar.classList.toggle('mobile-show');
   }
}

// Initialize Everything
const moduleManager = new ModuleManager();
const announcementManager = new AnnouncementManager();

document.addEventListener('DOMContentLoaded', async () => {
   console.log('🚀 Starting FlowWork Backend Integrated System...');
   
   try {
       // Initialize module manager
       const success = await moduleManager.init('#contentArea');
       
       if (success) {
           // Initialize announcement
           announcementManager.init();
           
           // Load dashboard
           await moduleManager.loadModule('dashboard');
           
           // Initialize sidebar settings
           setTimeout(() => {
               SidebarSettings.init();
           }, 200);
           
           // Start clock
           setInterval(updateCurrentTime, 1000);
           updateCurrentTime();
           
           // Welcome notification
           setTimeout(() => {
               if (window.FlowWork) {
                   window.FlowWork.showNotification('🎉 FlowWork Dashboard Ready!', 'success');
               }
           }, 1500);
           
           console.log('✅ FlowWork Backend Integrated System initialized successfully');
           console.log('📊 Available modules:', window.FlowWorkConfig?.modules?.length || 0);
       } else {
           console.error('❌ Failed to initialize FlowWork System');
       }
   } catch (error) {
       console.error('❌ Initialization error:', error);
   }
});

// Global Functions
window.SidebarSettings = SidebarSettings;
window.toggleMobileSidebar = toggleMobileSidebar;

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
   // Ctrl+K for search
   if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
       e.preventDefault();
       const searchInput = document.querySelector('.search-input');
       if (searchInput) searchInput.focus();
   }
   
   // Ctrl+B for sidebar toggle
   if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
       e.preventDefault();
       SidebarSettings.toggle();
   }
   
   // Ctrl+A for admin (when not in input)
   if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
       e.preventDefault();
       window.location.href = '?admin=true';
   }
});

// Global error handler
window.addEventListener('error', (e) => {
   console.error('Global error:', e.error);
   if (window.FlowWork) {
       window.FlowWork.showNotification('System error occurred. Check console for details.', 'error');
   }
});

// Performance monitoring
if (window.performance && window.performance.mark) {
   window.performance.mark('flowwork-app-js-loaded');
}

console.log('🎯 FlowWork Backend Integrated System Loaded Successfully!');
console.log('📋 Features: Dashboard ✅ | Admin Panel ✅ | Module System ✅ | Security ✅');