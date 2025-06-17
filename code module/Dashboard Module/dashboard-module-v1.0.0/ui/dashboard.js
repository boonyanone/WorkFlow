/**
 * Dashboard Module JavaScript
 * Handles dashboard interactions and real-time updates
 */

const DashboardModule = {
    name: 'dashboard',
    version: '1.0.0',
    
    init() {
        console.log('📊 Dashboard Module initializing...');
        
        // Register with FlowWork
        this.registerWithFlowWork();
        
        // Initialize real-time updates
        this.initRealTimeUpdates();
        
        // Initialize event listeners
        this.initEventListeners();
        
        console.log('✅ Dashboard Module ready!');
        return true;
    },
    
    registerWithFlowWork() {
        // Register navigation item
        FlowWork.addNavItem({
            title: 'Dashboard',
            icon: 'fas fa-home',
            module: 'dashboard',
            priority: 1
        });
        
        // Register hooks
        FlowWork.addHook('dashboard.render', (data) => {
            this.onRender(data);
        });
    },
    
    render(container) {
        if (!container) return false;
        
        console.log('📊 Rendering Dashboard...');
        
        // Load dashboard content
        fetch('modules/installed/dashboard/ui/dashboard.html')
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;
                this.onRender();
            })
            .catch(error => {
                console.error('Failed to load dashboard:', error);
                container.innerHTML = `
                    <div style="text-align: center; padding: 80px 20px;">
                        <h2>Dashboard Loading Error</h2>
                        <p>Unable to load dashboard content.</p>
                        <button onclick="FlowWork.loadModule('dashboard')" style="margin-top: 16px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Retry
                        </button>
                    </div>
                `;
            });
        
        return true;
    },
    
    onRender() {
        // Called after dashboard is rendered
        this.updateStats();
        this.updateTeamStatus();
        this.initQuickActions();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    },
    
    initEventListeners() {
        // Handle quick action clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-card')) {
                const card = e.target.closest('.action-card');
                this.handleQuickActionClick(card);
            }
        });
    },
    
    initQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'hover');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'normal');
            });
        });
    },
    
    handleQuickActionClick(card) {
        const title = card.querySelector('.card-title').textContent;
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Handle different actions
        if (title === 'AI Research') {
            this.launchAIResearch();
        } else if (title === 'Start Recording') {
            this.launchRecording();
        } else if (title === 'Meeting Hub') {
            this.launchMeetingHub();
        }
    },
    
    launchAIResearch() {
        // Try to load AI Research module
        if (FlowWork.modules.find(m => m.name === 'ai-research')) {
            FlowWork.loadModule('ai-research');
        } else {
            FlowWork.showNotification('AI Research module not installed. Install from admin panel.', 'warning');
        }
    },
    
    launchRecording() {
        FlowWork.showNotification('Live Recording feature coming soon!', 'info');
    },
    
    launchMeetingHub() {
        FlowWork.showNotification('Meeting Hub feature coming soon!', 'info');
    },
    
    animateCard(card, state) {
        if (state === 'hover') {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    },
    
    initRealTimeUpdates() {
        // Set up real-time update intervals
        this.updateInterval = setInterval(() => {
            this.updateStats();
            this.updateTime();
        }, 30000); // Update every 30 seconds
        
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000); // Update time every second
    },
    
    startRealTimeUpdates() {
        // Called when dashboard is active
        console.log('📊 Starting real-time updates...');
    },
    
    stopRealTimeUpdates() {
        // Called when leaving dashboard
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    },
    
    updateStats() {
        // Simulate real-time stat updates
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            // Add subtle pulse animation
            stat.style.transform = 'scale(1.05)';
            setTimeout(() => {
                stat.style.transform = '';
            }, 200);
        });
    },
    
    updateTime() {
        const timeElements = document.querySelectorAll('.stat-value');
        const now = new Date();
        const timeString = now.toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        // Update time displays
        timeElements.forEach(element => {
            if (element.textContent.includes(':')) {
                element.textContent = timeString;
            }
        });
    },
    
    updateTeamStatus() {
        // Simulate team status updates
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            const avatar = member.querySelector('.member-avatar');
            
            // Add subtle pulse for online members
            if (avatar.classList.contains('online')) {
                avatar.style.animation = 'pulse 2s infinite';
            }
        });
    },
    
    // Notification system integration
    showNotification(message, type = 'info') {
        if (FlowWork.showNotification) {
            FlowWork.showNotification(message, type);
        }
    },
    
    // Cleanup
    destroy() {
        this.stopRealTimeUpdates();
        console.log('📊 Dashboard Module destroyed');
    }
};

// Add pulse animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

console.log('📊 Dashboard Module JavaScript loaded');