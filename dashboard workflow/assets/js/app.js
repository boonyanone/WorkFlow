// 🎯 FlowWork Pure CSS System - NO FRAMEWORKS!

// Dashboard Module
const DashboardModule = {
    name: 'Dashboard',
    version: '1.0.0',
    
    init() {
        console.log('📊 Dashboard Module (Pure CSS) initialized');
        return true;
    },
    
    render(container) {
        if (!container) return false;
        
        container.innerHTML = `
            <div class="dashboard-module">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">
                        Welcome back, โล่! 👋
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
                            <span class="card-badge">Most Used</span>
                        </div>
                        <h3 class="card-title">AI Research</h3>
                        <p class="card-description">Ask AI anything, get instant insights</p>
                    </div>
                    
                    <div class="action-card red" onclick="FlowWork.showNotification('Live Recording module coming soon...', 'info')">
                        <div class="card-header">
                            <i class="fas fa-record-vinyl card-icon"></i>
                            <span class="card-badge">Live</span>
                        </div>
                        <h3 class="card-title">Start Recording</h3>
                        <p class="card-description">Record & transcribe meetings instantly</p>
                    </div>
                    
                    <div class="action-card blue" onclick="FlowWork.showNotification('Meeting Hub module coming soon...', 'info')">
                        <div class="card-header">
                            <i class="fas fa-microphone card-icon"></i>
                            <span class="card-badge">Hub</span>
                        </div>
                        <h3 class="card-title">Meeting Hub</h3>
                        <p class="card-description">Manage all your meetings in one place</p>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">AI Queries</h3>
                            <i class="fas fa-brain stat-icon"></i>
                        </div>
                        <div class="stat-value">24</div>
                        <p class="stat-label">Today</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Meetings</h3>
                            <i class="fas fa-video stat-icon blue"></i>
                        </div>
                        <div class="stat-value blue">12</div>
                        <p class="stat-label">This week</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Efficiency</h3>
                            <i class="fas fa-chart-line stat-icon green"></i>
                        </div>
                        <div class="stat-value green">94%</div>
                        <p class="stat-label">Average</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <h3 class="stat-title">Team</h3>
                            <i class="fas fa-users stat-icon orange"></i>
                        </div>
                        <div class="stat-value orange">8</div>
                        <p class="stat-label">Members online</p>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="activity-section">
                    <h3 class="activity-title">Recent Activity</h3>
                    <div class="activity-list">
                        <div class="activity-item purple">
                            <div class="activity-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">AI Research completed</div>
                                <div class="activity-time">Business registration process - 2 hours ago</div>
                            </div>
                            <button class="activity-btn">View</button>
                        </div>
                        
                        <div class="activity-item blue">
                            <div class="activity-icon blue">
                                <i class="fas fa-video"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">Meeting recorded</div>
                                <div class="activity-time">Budget review meeting - 4 hours ago</div>
                            </div>
                            <button class="activity-btn blue">View</button>
                        </div>
                        
                        <div class="activity-item green">
                            <div class="activity-icon green">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-text">Task completed</div>
                                <div class="activity-time">UI design review finished - 1 day ago</div>
                            </div>
                            <button class="activity-btn green">View</button>
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

// Module Manager
class ModuleManager {
    constructor() {
        this.activeModule = null;
        this.container = null;
        this.modules = new Map();
        this.modules.set('dashboard', DashboardModule);
    }
    
    async init(containerSelector = '#contentArea') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('❌ Container not found:', containerSelector);
            return false;
        }
        
        window.FlowWork = {
            loadModule: (name) => this.loadModule(name),
            showNotification: (msg, type) => this.showNotification(msg, type),
            updateAIUsageStats: () => this.updateAIUsageStats(),
        };
        
        console.log('✅ Module Manager ready');
        return true;
    }
    
    async loadModule(moduleName) {
        try {
            console.log(`📦 Loading module: ${moduleName}`);
            
            const module = this.modules.get(moduleName);
            if (!module) {
                if (moduleName === 'ai-research') {
                    FlowWork.showNotification('AI Research module coming soon!', 'info');
                    throw new Error('AI Research module coming soon!');
                }
                throw new Error(`Module not found: ${moduleName}`);
            }
            
            if (module.init) {
                await module.init();
            }
            
            if (module.render) {
                const success = await module.render(this.container);
                if (!success) {
                    throw new Error(`Failed to render module: ${moduleName}`);
                }
            }
            
            this.activeModule = moduleName;
            this.updateNavigation(moduleName);
            
            console.log(`🎉 Module loaded successfully: ${moduleName}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to load module ${moduleName}:`, error);
            this.showErrorState(moduleName, error.message);
            return false;
        }
    }
    
    updateNavigation(activeModule) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const menuMap = {
            'dashboard': '.nav-item[onclick*="dashboard"]',
            'ai-research': '.nav-item[onclick*="ai-research"]'
        };
        
        const selector = menuMap[activeModule];
        if (selector) {
            const menuItem = document.querySelector(selector);
            if (menuItem) {
                menuItem.classList.add('active');
            }
        }
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
    
    showErrorState(moduleName, error) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
                <div style="text-center; max-width: 400px;">
                    <div style="width: 64px; height: 64px; background: var(--blue-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                        <i class="fas fa-info-circle" style="color: var(--blue-600); font-size: 24px;"></i>
                    </div>
                    <h3 style="font-size: 20px; font-weight: 600; color: var(--gray-900); margin-bottom: 8px;">${moduleName}</h3>
                    <p style="color: var(--gray-600); margin-bottom: 24px;">${error}</p>
                    <button onclick="FlowWork.loadModule('dashboard')" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;">
                        <i class="fas fa-home" style="margin-right: 8px;"></i>Back to Dashboard
                    </button>
                </div>
            </div>
        `;
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
    sidebar.classList.toggle('mobile-show');
}

// Initialize Everything
const moduleManager = new ModuleManager();
const announcementManager = new AnnouncementManager();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Starting FlowWork Pure CSS System...');
    
    try {
        const success = await moduleManager.init('#contentArea');
        
        if (success) {
            announcementManager.init();
            await moduleManager.loadModule('dashboard');
            
            setTimeout(() => {
                SidebarSettings.init();
            }, 200);
            
            setInterval(updateCurrentTime, 1000);
            updateCurrentTime();
            
            setTimeout(() => {
                if (window.FlowWork) {
                    window.FlowWork.showNotification('🎉 FlowWork Pure CSS System Ready!', 'success');
                }
            }, 1500);
            
            console.log('✅ FlowWork Pure CSS System initialized successfully');
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        SidebarSettings.toggle();
    }
});

console.log('🎯 FlowWork Pure CSS System Loaded - No Framework Dependencies!');