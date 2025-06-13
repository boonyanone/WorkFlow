// 📊 Dashboard Module - FlowWork
// Version: 1.0.0

const DashboardModule = {
    name: 'Dashboard',
    version: '1.0.0',
    dependencies: [],
    
    state: {
        widgets: [],
        stats: {
            aiQueries: 24,
            meetings: 12,
            efficiency: 94,
            teamMembers: 8
        }
    },
    
    init() {
        console.log('📊 Dashboard Module initialized');
        return true;
    },
    
    render(container) {
        if (!container) return false;
        
        container.innerHTML = this.getTemplate();
        this.loadStats();
        this.attachEventListeners();
        
        return true;
    },
    
    destroy() {
        console.log('📊 Dashboard Module destroyed');
    },
    
    getTemplate() {
        return `
            <div class="dashboard-module">
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">
                        Welcome back, โล่! 👋
                    </h1>
                    <div class="text-sm text-gray-500">
                        ${new Date().toLocaleDateString('th-TH', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all" onclick="FlowWork.loadModule('ai-research')">
                        <div class="flex items-center justify-between mb-4">
                            <i class="fas fa-brain text-2xl"></i>
                            <span class="text-purple-200 text-sm">Most Used</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">AI Research</h3>
                        <p class="text-purple-100 text-sm">Ask AI anything, get instant insights</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all" onclick="FlowWork.loadModule('live-recording')">
                        <div class="flex items-center justify-between mb-4">
                            <i class="fas fa-record-vinyl text-2xl"></i>
                            <span class="text-red-200 text-sm">Live</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Start Recording</h3>
                        <p class="text-red-100 text-sm">Record & transcribe meetings instantly</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all" onclick="FlowWork.loadModule('meeting-hub')">
                        <div class="flex items-center justify-between mb-4">
                            <i class="fas fa-microphone text-2xl"></i>
                            <span class="text-blue-200 text-sm">Hub</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Meeting Hub</h3>
                        <p class="text-blue-100 text-sm">Manage all your meetings in one place</p>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-600">AI Queries</h3>
                            <i class="fas fa-brain text-purple-500"></i>
                        </div>
                        <div class="text-3xl font-bold text-purple-600 mb-2">${this.state.stats.aiQueries}</div>
                        <p class="text-sm text-gray-500">Today</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-600">Meetings</h3>
                            <i class="fas fa-video text-blue-500"></i>
                        </div>
                        <div class="text-3xl font-bold text-blue-600 mb-2">${this.state.stats.meetings}</div>
                        <p class="text-sm text-gray-500">This week</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-600">Efficiency</h3>
                            <i class="fas fa-chart-line text-green-500"></i>
                        </div>
                        <div class="text-3xl font-bold text-green-600 mb-2">${this.state.stats.efficiency}%</div>
                        <p class="text-sm text-gray-500">Average</p>
                    </div>
                    
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-600">Team</h3>
                            <i class="fas fa-users text-orange-500"></i>
                        </div>
                        <div class="text-3xl font-bold text-orange-600 mb-2">${this.state.stats.teamMembers}</div>
                        <p class="text-sm text-gray-500">Members online</p>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-brain text-purple-600"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">AI Research completed</div>
                                <div class="text-sm text-gray-500">Business registration process - 2 hours ago</div>
                            </div>
                            <button class="text-purple-600 hover:text-purple-800 text-sm font-medium">View</button>
                        </div>
                        
                        <div class="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-video text-blue-600"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Meeting recorded</div>
                                <div class="text-sm text-gray-500">Budget review meeting - 4 hours ago</div>
                            </div>
                            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                        </div>
                        
                        <div class="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">Task completed</div>
                                <div class="text-sm text-gray-500">UI design review finished - 1 day ago</div>
                            </div>
                            <button class="text-green-600 hover:text-green-800 text-sm font-medium">View</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    loadStats() {
        // Simulate loading stats
        console.log('📊 Loading dashboard stats...');
    },
    
    attachEventListeners() {
        // Add any event listeners specific to dashboard
        console.log('📊 Dashboard event listeners attached');
    }
};

export default DashboardModule;