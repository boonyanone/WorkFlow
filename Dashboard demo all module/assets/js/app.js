// 🚀 FlowWork Main Application
class App {
    constructor() {
        this.currentView = 'dashboard';
        this.sidebarCollapsed = false;
        this.isMobile = Utils.isMobile();
        
        this.init();
    }
    
    init() {
        console.log('🚀 FlowWork v2.1 initializing...');
        
        this.setupEventListeners();
        this.loadInitialView();
        this.startPeriodicUpdates();
        
        // Track app start
        Utils.trackEvent('app_started', {
            version: '2.1',
            device: this.isMobile ? 'mobile' : 'desktop'
        });
        
        // Welcome notification
        setTimeout(() => {
            Utils.showNotification('Welcome to FlowWork! AI-powered collaboration platform is ready.', 'success');
        }, 1000);
        
        console.log('✅ FlowWork initialized successfully!');
    }
    
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Click outside handlers
        document.addEventListener('click', this.handleOutsideClicks.bind(this));
        
        // Before unload
        window.addEventListener('beforeunload', () => {
            Utils.trackEvent('app_closed', {
                session_duration: Date.now() - this.startTime
            });
        });
        
        this.startTime = Date.now();
    }
    
    handleKeyboardShortcuts(e) {
        // Global shortcuts
        if ((e.ctrlKey || e.metaKey)) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    this.focusGlobalSearch();
                    break;
                case 'b':
                    e.preventDefault();
                    this.toggleSidebar();
                    break;
                case '/':
                    e.preventDefault();
                    this.showShortcutsHelp();
                    break;
                case '1':
                case '2':
                case '3':
                    e.preventDefault();
                    AIModels.selectByNumber(parseInt(e.key));
                    break;
            }
        }
        
        // Escape key
        if (e.key === 'Escape') {
            this.handleEscape();
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = Utils.isMobile();
        
        if (wasMobile !== this.isMobile) {
            this.updateLayoutForDevice();
        }
    }
    
    updateLayoutForDevice() {
        const sidebar = document.getElementById('sidebar');
        const contentArea = document.getElementById('contentArea');
        const rightPanel = document.getElementById('rightPanel');
        
        if (this.isMobile) {
            sidebar.classList.add('mobile-hidden');
            contentArea.classList.add('mobile-full');
            rightPanel.classList.add('mobile-hidden');
        } else {
            sidebar.classList.remove('mobile-hidden', 'mobile-show');
            contentArea.classList.remove('mobile-full');
            rightPanel.classList.remove('mobile-hidden');
        }
    }
    
    handleOutsideClicks(e) {
        // Close AI model dropdown
        if (!e.target.closest('.ai-model-selector')) {
            AIModels.closeDropdown();
        }
        
        // Close mobile sidebar
        if (this.isMobile && !e.target.closest('.sidebar') && !e.target.closest('[onclick*="toggleSidebar"]')) {
            this.closeMobileSidebar();
        }
    }
    
    handleEscape() {
        // Close dropdowns
        AIModels.closeDropdown();
        
        // Stop recording if active
        if (Meeting.isRecording) {
            Meeting.stopLiveRecording();
        }
        
        // Close mobile sidebar
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
    }
    
    loadInitialView() {
        // Check URL hash for initial view
        const hash = window.location.hash.slice(1);
        if (hash && Navigation.isValidView(hash)) {
            Navigation.showView(hash);
        } else {
            Navigation.showView('dashboard');
        }
    }
    
    startPeriodicUpdates() {
        // Update time every second
        Utils.updateCurrentTime();
        setInterval(() => {
            Utils.updateCurrentTime();
        }, 1000);
        
        // Update credits and stats every 30 seconds
        setInterval(() => {
            this.updateSystemStats();
        }, 30000);
    }
    
    updateSystemStats() {
        // In real app, this would fetch from API
        const mockStats = {
            credits: Utils.getFromStorage('current_credits', 1246),
            aiUsage: Utils.getFromStorage('daily_ai_usage', 24),
            meetingEfficiency: Utils.getFromStorage('meeting_efficiency', 94),
            teamOnline: Utils.getFromStorage('team_online', 8)
        };
        
        // Update UI if elements exist
        this.updateStatsDisplay(mockStats);
    }
    
    updateStatsDisplay(stats) {
        // Update credit count
        const creditsElement = document.getElementById('creditsCount');
        if (creditsElement && creditsElement.textContent !== stats.credits.toString()) {
            Utils.updateCreditsDisplay(stats.credits);
        }
        
        // Update other stats in widgets
        this.updateWidgetValues(stats);
    }
    
    updateWidgetValues(stats) {
        const widgets = {
            'aiUsageValue': stats.aiUsage,
            'efficiencyValue': `${stats.meetingEfficiency}%`,
            'teamOnlineValue': stats.teamOnline
        };
        
        Object.entries(widgets).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    // Global search handler
    handleGlobalSearch(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const query = event.target.value.trim();
            if (query) {
                this.performGlobalSearch(query);
            }
        }
    }
    
    performGlobalSearch(query) {
        Utils.showNotification(`Searching: "${query}"`, 'info');
        Utils.trackEvent('global_search', { query, model: AIModels.currentModel });
        
        // Switch to AI Research view and perform search
        Navigation.showView('ai-research');
        
        setTimeout(() => {
            const researchQuery = document.getElementById('researchQuery');
            if (researchQuery) {
                researchQuery.value = query;
                researchQuery.focus();
            }
        }, 300);
    }
    
    focusGlobalSearch() {
        const searchInput = document.querySelector('.search-enhanced');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Sidebar management
    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }
    
    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-show');
        
        Utils.trackEvent('sidebar_toggle', { 
            device: 'mobile',
            action: sidebar.classList.contains('mobile-show') ? 'open' : 'close'
        });
    }
    
    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-show');
    }
    
    toggleDesktopSidebar() {
        const sidebar = document.getElementById('sidebar');
        const contentArea = document.getElementById('contentArea');
        
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            contentArea.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            contentArea.classList.remove('sidebar-collapsed');
        }
        
        Utils.trackEvent('sidebar_toggle', { 
            device: 'desktop',
            collapsed: this.sidebarCollapsed
        });
        
        // Save preference
        Utils.saveToStorage('sidebar_collapsed', this.sidebarCollapsed);
    }
    
    // Help and shortcuts
    showShortcutsHelp() {
        const shortcuts = `
            <div class="shortcuts-help">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    <div><kbd>Ctrl+K</kbd> Global Search</div>
                    <div><kbd>Ctrl+B</kbd> Toggle Sidebar</div>
                    <div><kbd>Ctrl+/</kbd> Show Shortcuts</div>
                    <div><kbd>Ctrl+1/2/3</kbd> Switch AI Model</div>
                    <div><kbd>Esc</kbd> Close/Cancel</div>
                </div>
            </div>
        `;
        
        Utils.showNotification(shortcuts, 'info', 8000);
    }
    
    handleEscape() {
        // Implementation already exists above
    }
    
    // Error handling
    handleError(error, context = '') {
        console.error(`FlowWork Error ${context}:`, error);
        Utils.showNotification(`เกิดข้อผิดพลาด: ${error.message}`, 'error');
        Utils.trackEvent('error', { 
            message: error.message, 
            context,
            stack: error.stack 
        });
    }
    
    // Cleanup
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleOutsideClicks);
        
        Utils.trackEvent('app_destroyed');
        console.log('🔄 FlowWork app destroyed');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.FlowWorkApp = new App();
});

// Global error handler
window.addEventListener('error', (event) => {
    if (window.FlowWorkApp) {
        window.FlowWorkApp.handleError(event.error, 'global');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (window.FlowWorkApp) {
        window.FlowWorkApp.handleError(new Error(event.reason), 'promise');
    }
});