// 🧭 FlowWork Navigation System
class Navigation {
    constructor() {
        this.currentView = 'dashboard';
        this.viewHistory = [];
        this.maxHistory = 10;
        
        this.views = {
            'dashboard': {
                title: 'Dashboard',
                icon: 'fas fa-home',
                component: 'DashboardView',
                requiresAuth: false
            },
            'ai-research': {
                title: 'AI Research',
                icon: 'fas fa-brain',
                component: 'AIResearchView',
                requiresAuth: true
            },
            'documents': {
                title: 'Documents',
                icon: 'fas fa-file-alt',
                component: 'DocumentsView',
                requiresAuth: true
            },
            'team-workspace': {
                title: 'Team Workspace',
                icon: 'fas fa-users',
                component: 'TeamWorkspaceView',
                requiresAuth: true
            },
            'meeting-hub': {
                title: 'Meeting Hub',
                icon: 'fas fa-microphone',
                component: 'MeetingHubView',
                requiresAuth: true
            },
            'live-recording': {
                title: 'Live Recording',
                icon: 'fas fa-record-vinyl',
                component: 'LiveRecordingView',
                requiresAuth: true
            },
            'upload-recording': {
                title: 'Upload Recording',
                icon: 'fas fa-upload',
                component: 'UploadRecordingView',
                requiresAuth: true
            },
            'meeting-chat': {
                title: 'Meeting AI Chat',
                icon: 'fas fa-comments',
                component: 'MeetingChatView',
                requiresAuth: true
            },
            'action-items': {
                title: 'Action Items',
                icon: 'fas fa-tasks',
                component: 'ActionItemsView',
                requiresAuth: true
            },
            'analytics': {
                title: 'Analytics',
                icon: 'fas fa-chart-bar',
                component: 'AnalyticsView',
                requiresAuth: true
            },
            'integrations': {
                title: 'Integrations',
                icon: 'fas fa-plug',
                component: 'IntegrationsView',
                requiresAuth: true
            },
            'settings': {
                title: 'Settings',
                icon: 'fas fa-cog',
                component: 'SettingsView',
                requiresAuth: true
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupBreadcrumbs();
        this.loadViewComponents();
        console.log('🧭 Navigation system initialized');
    }
    
    isValidView(viewKey) {
        return Object.keys(this.views).includes(viewKey);
    }
    
    showView(viewKey, params = {}) {
        if (!this.isValidView(viewKey)) {
            console.warn(`Invalid view: ${viewKey}`);
            return false;
        }
        
        const view = this.views[viewKey];
        
        // Check authentication if required
        if (view.requiresAuth && !this.isAuthenticated()) {
            this.showAuthRequired();
            return false;
        }
        
        // Add to history
        if (this.currentView !== viewKey) {
            this.addToHistory(this.currentView);
        }
        
        // Hide current view
        this.hideCurrentView();
        
        // Show new view
        this.currentView = viewKey;
        this.showCurrentView(params);
        
        // Update navigation state
        this.updateActiveNavigation();
        this.updateBreadcrumbs();
        this.updatePageTitle();
        this.updateURL(viewKey, params);
        
        // Track navigation
        Utils.trackEvent('navigation', {
            from: this.viewHistory[this.viewHistory.length - 1] || 'none',
            to: viewKey,
            params
        });
        
        console.log(`🧭 Navigated to: ${viewKey}`);
        return true;
    }
    
    hideCurrentView() {
        const currentViewEl = document.querySelector('.view-container.active');
        if (currentViewEl) {
            currentViewEl.classList.remove('active');
        }
    }
    
    showCurrentView(params = {}) {
        const viewEl = document.getElementById(`${this.currentView}-view`);
        if (viewEl) {
            viewEl.classList.add('active');
            
            // Load view content if not already loaded
            if (!viewEl.hasAttribute('data-loaded')) {
                this.loadViewContent(this.currentView, viewEl, params);
            } else {
                // Update existing view with new params
                this.updateViewContent(this.currentView, viewEl, params);
            }
            
            // Apply fade-in animation
            Utils.fadeIn(viewEl);
        } else {
            console.error(`View element not found: ${this.currentView}-view`);
        }
    }
    
    loadViewContent(viewKey, container, params = {}) {
        container.setAttribute('data-loaded', 'true');
        
        // Load view-specific content
        switch(viewKey) {
            case 'dashboard':
                this.loadDashboardContent(container);
                break;
            case 'ai-research':
                this.loadAIResearchContent(container);
                break;
            case 'documents':
                this.loadDocumentsContent(container);
                break;
            case 'team-workspace':
                this.loadTeamWorkspaceContent(container);
                break;
            case 'meeting-hub':
                this.loadMeetingHubContent(container);
                break;
            case 'live-recording':
                this.loadLiveRecordingContent(container);
                break;
            case 'upload-recording':
                this.loadUploadRecordingContent(container);
                break;
            case 'meeting-chat':
                this.loadMeetingChatContent(container);
                break;
            case 'action-items':
                this.loadActionItemsContent(container);
                break;
            case 'analytics':
                this.loadAnalyticsContent(container);
                break;
            case 'integrations':
                this.loadIntegrationsContent(container);
                break;
            case 'settings':
                this.loadSettingsContent(container);
                break;
            default:
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-construction"></i>
                        </div>
                        <h3 class="empty-state-title">Under Construction</h3>
                        <p class="empty-state-subtitle">This feature is coming soon!</p>
                    </div>
                `;
        }
    }
    
    updateViewContent(viewKey, container, params = {}) {
        // Update existing view content with new parameters
        if (params.refresh) {
            container.removeAttribute('data-loaded');
            this.loadViewContent(viewKey, container, params);
        }
    }
    
    // Dashboard Content
    loadDashboardContent(container) {
        container.innerHTML = `
            <!-- 📊 Quick Overview Cards -->
            <div class="dashboard-overview">
                <!-- Today's Priority -->
                <div class="widget priority-widget">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <i class="fas fa-exclamation-circle text-red-500"></i>
                            Today's Priority
                        </h3>
                    </div>
                    <div class="widget-value text-red-600">3</div>
                    <p class="widget-subtitle">Urgent tasks pending</p>
                    <div class="mt-3">
                        <div class="text-xs text-red-600 font-medium">Budget Report Due: 2 hours</div>
                    </div>
                </div>

                <!-- AI Usage Today -->
                <div class="widget ai-widget">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <i class="fas fa-brain text-purple-500"></i>
                            AI Usage
                        </h3>
                    </div>
                    <div class="widget-value" id="aiUsageValue">24</div>
                    <p class="widget-subtitle">Queries today</p>
                    <div class="mt-3 flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-xs text-green-600">45 credits saved</span>
                    </div>
                </div>

                <!-- Meeting Efficiency -->
                <div class="widget efficiency-widget">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <i class="fas fa-chart-line text-green-500"></i>
                            Meeting Efficiency
                        </h3>
                    </div>
                    <div class="widget-value text-green-600" id="efficiencyValue">94%</div>
                    <p class="widget-subtitle">This week average</p>
                    <div class="mt-3">
                        <div class="text-xs text-green-600 font-medium">↑ 12% vs last week</div>
                    </div>
                </div>

                <!-- Team Activity -->
                <div class="widget team-widget">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <i class="fas fa-users text-blue-500"></i>
                            Team Activity
                        </h3>
                    </div>
                    <div class="widget-value text-blue-600" id="teamOnlineValue">8</div>
                    <p class="widget-subtitle">Members online</p>
                    <div class="mt-3 flex -space-x-1">
                        <div class="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                        <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                        <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        <div class="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">+4</div>
                    </div>
                </div>
            </div>

            <!-- 🤖 AI Command Center -->
            <div class="ai-command-center">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="section-title">
                        <i class="fas fa-rocket text-purple-600"></i>
                        AI Command Center
                        <span class="nav-badge new">All Models Ready</span>
                    </h2>
                    <div class="status-indicator ai-processing">AI Active</div>
                </div>

                <!-- Quick AI Actions -->
                <div class="ai-actions-grid">
                    <div class="quick-action" onclick="Navigation.showView('ai-research')">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <i class="fas fa-search text-purple-600"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">AI Research</h3>
                                <p class="text-sm text-gray-600">Deep analysis & insights</p>
                            </div>
                        </div>
                    </div>

                    <div class="quick-action" onclick="Meeting.startLiveRecording()">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <i class="fas fa-microphone text-blue-600"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Meeting Analysis</h3>
                                <p class="text-sm text-gray-600">Record & transcribe</p>
                            </div>
                        </div>
                    </div>

                    <div class="quick-action" onclick="Navigation.showView('documents')">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <i class="fas fa-edit text-green-600"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Smart Editor</h3>
                                <p class="text-sm text-gray-600">AI-powered writing</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Model Performance -->
                <div id="aiModelPerformance" class="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 class="font-semibold text-gray-900 mb-3">AI Model Performance Today</h4>
                    <!-- Content will be loaded by AIModels.updatePerformanceStats() -->
                </div>
            </div>

            <!-- 📅 Today's Agenda -->
            <div class="agenda-section">
                <h2 class="section-title">
                    <i class="fas fa-calendar-day text-orange-500"></i>
                    Today's Agenda
                    <span class="nav-badge priority">3 meetings</span>
                </h2>

                <div class="space-y-4">
                    <!-- Urgent Meeting -->
                    <div class="urgent-meeting">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-video text-red-600"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-red-900">Budget Review Meeting</h3>
                                    <p class="text-sm text-red-700">With finance team • Room 301</p>
                                    <p class="text-xs text-red-600 font-medium">เริ่มใน 15 นาทีิ</p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="btn btn-danger text-sm">
                                    <i class="fas fa-video mr-2"></i>Join
                                </button>
                                <button onclick="Meeting.startLiveRecording()" class="btn btn-secondary text-sm">
                                    <i class="fas fa-record-vinyl mr-2"></i>Record
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Other Meetings -->
                    <div class="upcoming-meetings">
                        <div class="card p-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-blue-600"></i>
                                </div>
                                <div>
                                    <h3 class="font-medium text-blue-900">Team Standup</h3>
                                    <p class="text-sm text-blue-700">15:00 - 15:30</p>
                                </div>
                            </div>
                        </div>

                        <div class="card p-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-handshake text-green-600"></i>
                                </div>
                                <div>
                                    <h3 class="font-medium text-green-900">Client Meeting</h3>
                                    <p class="text-sm text-green-700">16:30 - 17:30</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📈 Recent Activity & Suggestions -->
            <div class="grid-2">
                <!-- Recent Research -->
                <div class="card p-6">
                    <h2 class="section-title">
                        <i class="fas fa-history text-gray-600"></i>
                        Recent Research
                    </h2>
                    
                    <div class="space-y-3">
                        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-file-alt text-purple-600 text-xs"></i>
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900 text-sm">รายงานงบประมาณ Q1</div>
                                <div class="text-xs text-gray-500">2 ชั่วโมงที่แล้ว • GPT-4 • 25 credits</div>
                            </div>
                            <button class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-external-link-alt text-xs"></i>
                            </button>
                        </div>

                        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-bar text-green-600 text-xs"></i>
                           </div>
                           <div class="flex-1">
                               <div class="font-medium text-gray-900 text-sm">ข้อมูลการใช้งานระบบ</div>
                               <div class="text-xs text-gray-500">5 ชั่วโมงที่แล้ว • Claude-3 • 15 credits</div>
                           </div>
                           <button class="text-gray-400 hover:text-gray-600">
                               <i class="fas fa-external-link-alt text-xs"></i>
                           </button>
                       </div>

                       <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                           <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                               <i class="fas fa-gavel text-blue-600 text-xs"></i>
                           </div>
                           <div class="flex-1">
                               <div class="font-medium text-gray-900 text-sm">กฎหมายแรงงาน 2567</div>
                               <div class="text-xs text-gray-500">1 วันที่แล้ว • Gemini • 8 credits</div>
                           </div>
                           <button class="text-gray-400 hover:text-gray-600">
                               <i class="fas fa-external-link-alt text-xs"></i>
                           </button>
                       </div>
                   </div>
               </div>

               <!-- AI Suggestions -->
               <div class="card p-6">
                   <h2 class="section-title">
                       <i class="fas fa-lightbulb text-yellow-500"></i>
                       AI Suggestions
                   </h2>
                   
                   <div class="space-y-3">
                       <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                           <div class="flex items-start space-x-3">
                               <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                   <i class="fas fa-exclamation text-yellow-600 text-xs"></i>
                               </div>
                               <div>
                                   <h3 class="font-medium text-yellow-900 text-sm">Prepare for Budget Meeting</h3>
                                   <p class="text-xs text-yellow-700 mt-1">AI suggests reviewing Q3 expenses and preparing cost analysis</p>
                                   <button class="text-xs text-yellow-600 font-medium mt-2 hover:text-yellow-800">
                                       Start Research →
                                   </button>
                               </div>
                           </div>
                       </div>

                       <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                           <div class="flex items-start space-x-3">
                               <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                   <i class="fas fa-sync text-blue-600 text-xs"></i>
                               </div>
                               <div>
                                   <h3 class="font-medium text-blue-900 text-sm">Update Team Documents</h3>
                                   <p class="text-xs text-blue-700 mt-1">3 documents need updates based on recent meeting decisions</p>
                                   <button class="text-xs text-blue-600 font-medium mt-2 hover:text-blue-800">
                                       Review Documents →
                                   </button>
                               </div>
                           </div>
                       </div>

                       <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                           <div class="flex items-start space-x-3">
                               <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                   <i class="fas fa-award text-green-600 text-xs"></i>
                               </div>
                               <div>
                                   <h3 class="font-medium text-green-900 text-sm">Efficiency Achievement</h3>
                                   <p class="text-xs text-green-700 mt-1">You've saved 2.5 hours this week using AI automation</p>
                                   <button class="text-xs text-green-600 font-medium mt-2 hover:text-green-800">
                                       View Report →
                                   </button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       `;
       
       // Initialize dashboard components
       AIModels.updatePerformanceStats();
   }
   
   // AI Research Content
   loadAIResearchContent(container) {
       container.innerHTML = `
           <div class="research-interface">
               <div class="flex items-center justify-between mb-6">
                   <h1 class="section-title">
                       <button onclick="Navigation.goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                           <i class="fas fa-arrow-left text-gray-600"></i>
                       </button>
                       <i class="fas fa-brain text-purple-600"></i>
                       AI Research Intelligence
                       <span class="nav-badge new">Multi-Model</span>
                   </h1>
               </div>

               <!-- Enhanced Search Interface -->
               <div class="mb-8">
                   <div class="relative">
                       <textarea 
                           id="researchQuery"
                           placeholder="Ask me anything... เช่น 'ขั้นตอนการขอจดทะเบียนธุรกิจใหม่ตามกฎหมายไทย' หรือ 'วิเคราะห์งบประมาณของหน่วยงาน'"
                           class="research-query"
                           onkeydown="handleResearchKeydown(event)"></textarea>
                       
                       <div class="absolute bottom-4 right-4 flex items-center space-x-3">
                           <div class="flex items-center space-x-2 text-sm text-gray-500">
                               <span>Model:</span>
                               <span id="currentModelDisplay" class="font-medium text-purple-600">${AIModels.currentModel}</span>
                           </div>
                           <button class="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                               <i class="fas fa-microphone"></i>
                           </button>
                           <button class="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                               <i class="fas fa-paperclip"></i>
                           </button>
                           <button onclick="performAIResearch()" class="btn btn-primary">
                               <i class="fas fa-paper-plane mr-2"></i>Research
                           </button>
                       </div>
                   </div>
               </div>

               <!-- Research Filters -->
               <div class="research-filters">
                   <div class="text-sm text-gray-600 mb-3 flex items-center">
                       <i class="fas fa-filter mr-2"></i>Research Focus:
                   </div>
                   <div class="flex flex-wrap gap-2">
                       <button class="filter-tag active">
                           <i class="fas fa-university mr-1"></i>Government
                       </button>
                       <button class="filter-tag">
                           <i class="fas fa-graduation-cap mr-1"></i>Academic
                       </button>
                       <button class="filter-tag">
                           <i class="fas fa-newspaper mr-1"></i>News
                       </button>
                       <button class="filter-tag">
                           <i class="fas fa-flag mr-1"></i>Thai Only
                       </button>
                       <button class="filter-tag">
                           <i class="fas fa-comments mr-1"></i>Meeting Knowledge
                       </button>
                   </div>
               </div>

               <!-- AI Response Area -->
               <div id="aiResponseArea" class="hidden">
                   <!-- Content will be populated by AI research -->
               </div>

               <!-- Suggested Research Topics -->
               <div class="card p-6 mt-8">
                   <h3 class="section-title">
                       <i class="fas fa-lightbulb text-blue-600"></i>
                       Popular Research Topics for Government Officials
                   </h3>
                   <div class="grid-2">
                       <div class="quick-action" onclick="suggestedResearch('การขอจดทะเบียนธุรกิจใหม่')">
                           <div class="font-medium text-blue-900">การขอจดทะเบียนธุรกิจใหม่</div>
                           <div class="text-sm text-blue-700 mt-1">ขั้นตอนและเอกสารที่จำเป็น</div>
                       </div>
                       <div class="quick-action" onclick="suggestedResearch('กฎหมายแรงงาน 2567')">
                           <div class="font-medium text-blue-900">กฎหมายแรงงาน 2567</div>
                           <div class="text-sm text-blue-700 mt-1">การปรับปรุงล่าสุด</div>
                       </div>
                       <div class="quick-action" onclick="suggestedResearch('ระเบียบการเบิกค่าใช้จ่าย')">
                           <div class="font-medium text-blue-900">ระเบียบการเบิกค่าใช้จ่าย</div>
                           <div class="text-sm text-blue-700 mt-1">หลักเกณฑ์และแนวปฏิบัติ</div>
                       </div>
                       <div class="quick-action" onclick="suggestedResearch('นโยบายรัฐบาลดิจิทัล')">
                           <div class="font-medium text-blue-900">นโยบายรัฐบาลดิจิทัล</div>
                           <div class="text-sm text-blue-700 mt-1">แผนพัฒนาประเทศ</div>
                       </div>
                   </div>
               </div>
           </div>
       `;
   }
   
   // Documents Content
   loadDocumentsContent(container) {
       container.innerHTML = `
           <div class="documents-header">
               <h1 class="section-title">
                   <i class="fas fa-file-alt text-blue-600"></i>
                   Documents
                   <span class="nav-count">24</span>
               </h1>
               <div class="flex space-x-2">
                   <button onclick="Documents.createNew()" class="btn btn-primary">
                       <i class="fas fa-plus mr-2"></i>New Document
                   </button>
                   <button onclick="Documents.uploadFile()" class="btn btn-secondary">
                       <i class="fas fa-upload mr-2"></i>Upload
                   </button>
               </div>
           </div>

           <!-- Documents Grid -->
           <div class="documents-grid" id="documentsGrid">
               <!-- Content will be loaded by Documents.loadDocuments() -->
           </div>
       `;
       
       // Load documents
       Documents.loadDocuments();
   }
   
   // Team Workspace Content
   loadTeamWorkspaceContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-users"></i>
               </div>
               <h3 class="empty-state-title">Team Workspace</h3>
               <p class="empty-state-subtitle">Collaborate with your team in real-time</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-plus mr-2"></i>Create Workspace
               </button>
           </div>
       `;
   }
   
   // Meeting Hub Content
   loadMeetingHubContent(container) {
       container.innerHTML = `
           <div class="section">
               <h1 class="section-title">
                   <i class="fas fa-microphone text-purple-600"></i>
                   Meeting Intelligence Hub
                   <span class="nav-badge ai">AI Powered</span>
               </h1>
               <p class="section-subtitle">Manage all your meetings with AI-powered insights and automation</p>
           </div>

           <!-- Meeting Actions -->
           <div class="grid-3 mb-8">
               <div class="quick-action" onclick="Meeting.startLiveRecording()">
                   <div class="flex items-center space-x-3">
                       <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                           <i class="fas fa-record-vinyl text-red-600"></i>
                       </div>
                       <div>
                           <h3 class="font-semibold text-gray-900">Start Live Recording</h3>
                           <p class="text-sm text-gray-600">Record & transcribe in real-time</p>
                       </div>
                   </div>
               </div>

               <div class="quick-action" onclick="Navigation.showView('upload-recording')">
                   <div class="flex items-center space-x-3">
                       <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                           <i class="fas fa-upload text-blue-600"></i>
                       </div>
                       <div>
                           <h3 class="font-semibold text-gray-900">Upload Recording</h3>
                           <p class="text-sm text-gray-600">Process existing audio files</p>
                       </div>
                   </div>
               </div>

               <div class="quick-action" onclick="Navigation.showView('meeting-chat')">
                   <div class="flex items-center space-x-3">
                       <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                           <i class="fas fa-comments text-purple-600"></i>
                       </div>
                       <div>
                           <h3 class="font-semibold text-gray-900">Ask Meeting AI</h3>
                           <p class="text-sm text-gray-600">Chat about past meetings</p>
                       </div>
                   </div>
               </div>
           </div>

           <!-- Recent Meetings -->
           <div class="card p-6">
               <h2 class="section-title">
                   <i class="fas fa-history text-gray-600"></i>
                   Recent Meetings
               </h2>
               <div class="space-y-4">
                   <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                       <div class="flex items-center space-x-3">
                           <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                               <i class="fas fa-check text-green-600"></i>
                           </div>
                           <div>
                               <div class="font-medium text-gray-900">Budget Planning Meeting</div>
                               <div class="text-sm text-gray-500">Yesterday, 14:00 • 45 min • 3 participants</div>
                           </div>
                       </div>
                       <div class="flex space-x-2">
                           <button class="text-sm text-blue-600 hover:text-blue-800">View Summary</button>
                           <button class="text-sm text-gray-600 hover:text-gray-800">Download</button>
                       </div>
                   </div>

                   <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                       <div class="flex items-center space-x-3">
                           <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                               <i class="fas fa-check text-green-600"></i>
                           </div>
                           <div>
                               <div class="font-medium text-gray-900">Team Standup</div>
                               <div class="text-sm text-gray-500">Monday, 15:00 • 30 min • 8 participants</div>
                           </div>
                       </div>
                       <div class="flex space-x-2">
                           <button class="text-sm text-blue-600 hover:text-blue-800">View Summary</button>
                           <button class="text-sm text-gray-600 hover:text-gray-800">Download</button>
                       </div>
                   </div>
               </div>
           </div>
       `;
   }
   
   // Live Recording Content
   loadLiveRecordingContent(container) {
       container.innerHTML = `
           <div class="recording-status">
               <div class="flex items-center justify-between mb-6">
                   <h1 class="section-title">
                       <button onclick="Navigation.goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                           <i class="fas fa-arrow-left text-gray-600"></i>
                       </button>
                       <i class="fas fa-record-vinyl text-red-500 animate-pulse"></i>
                       Live Recording in Progress
                   </h1>
                   <button onclick="Meeting.stopLiveRecording()" class="btn btn-danger">
                       <i class="fas fa-stop mr-2"></i>Stop Recording
                   </button>
               </div>
               
               <div class="recording-stats">
                   <div class="text-center">
                       <div class="text-red-600 font-medium mb-1">Duration:</div>
                       <div id="recordingTimer" class="recording-timer">00:00</div>
                   </div>
                   <div class="text-center">
                       <div class="text-red-600 font-medium mb-1">Participants:</div>
                       <div class="text-2xl font-bold text-red-900">3</div>
                       <div class="text-xs text-red-600">detected</div>
                   </div>
                   <div class="text-center">
                       <div class="text-red-600 font-medium mb-1">Language:</div>
                       <div class="text-lg font-semibold text-red-900">Thai/English</div>
                       <div class="text-xs text-red-600">auto-detect</div>
                   </div>
               </div>
               
               <div class="transcript-container">
                   <div class="text-sm font-medium text-red-700 mb-3 flex items-center">
                       <i class="fas fa-waveform-lines mr-2"></i>Real-time Transcription:
                   </div>
                   <div id="liveTranscript" class="min-h-24 max-h-40 overflow-y-auto text-sm bg-gray-50 p-3 rounded border">
                       <div class="text-gray-400 italic flex items-center">
                           <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                           Listening for speech...
                       </div>
                   </div>
               </div>

               <!-- Real-time AI Insights -->
               <div class="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                   <div class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                       <i class="fas fa-brain mr-2"></i>AI Real-time Insights:
                   </div>
                   <div id="realTimeInsights" class="space-y-2">
                       <div class="text-sm text-purple-600">• Detecting key topics and decisions...</div>
                       <div class="text-sm text-purple-600">• Identifying action items automatically...</div>
                       <div class="text-sm text-purple-600">• Monitoring meeting efficiency...</div>
                   </div>
               </div>
           </div>
       `;
       
       // Start recording if not already started
       if (!Meeting.isRecording) {
           Meeting.startLiveRecording();
       }
   }
   
   // Upload Recording Content
   loadUploadRecordingContent(container) {
       container.innerHTML = `
           <div class="section">
               <h1 class="section-title">
                   <button onclick="Navigation.goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                       <i class="fas fa-arrow-left text-gray-600"></i>
                   </button>
                   <i class="fas fa-upload text-blue-600"></i>
                   Upload Meeting Recording
               </h1>
               <p class="section-subtitle">Upload audio or video files for AI-powered transcription and analysis</p>
           </div>

           <!-- Meeting Type Selection -->
           <div class="card p-6 mb-6">
               <h4 class="text-sm font-medium text-gray-700 mb-3">เลือกประเภทการประชุม:</h4>
               <div class="grid-2">
                   <div class="quick-action" onclick="selectMeetingType('government')">
                       <div class="flex items-center space-x-3">
                           <i class="fas fa-university text-purple-600"></i>
                           <div>
                               <div class="font-medium">Government Meeting</div>
                               <div class="text-sm text-gray-500">ประชุมราชการ หน่วยงานรัฐ</div>
                           </div>
                       </div>
                   </div>
                   <div class="quick-action" onclick="selectMeetingType('team')">
                       <div class="flex items-center space-x-3">
                           <i class="fas fa-users text-blue-600"></i>
                           <div>
                               <div class="font-medium">Team Standup</div>
                               <div class="text-sm text-gray-500">ประชุมทีมประจำ</div>
                           </div>
                       </div>
                   </div>
                   <div class="quick-action" onclick="selectMeetingType('project')">
                       <div class="flex items-center space-x-3">
                           <i class="fas fa-project-diagram text-green-600"></i>
                           <div>
                               <div class="font-medium">Project Review</div>
                               <div class="text-sm text-gray-500">ทบทวนโครงการ</div>
                           </div>
                       </div>
                   </div>
                   <div class="quick-action" onclick="selectMeetingType('budget')">
                       <div class="flex items-center space-x-3">
                           <i class="fas fa-dollar-sign text-yellow-600"></i>
                           <div>
                               <div class="font-medium">Budget Discussion</div>
                               <div class="text-sm text-gray-500">หารือเรื่องงบประมาณ</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

           <!-- Upload Area -->
           <div class="card p-8">
               <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                   <div class="flex flex-col items-center">
                       <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                       <p class="text-lg font-medium text-gray-700 mb-2">ลากไฟล์เสียงมาวางที่นี่</p>
                       <p class="text-sm text-gray-500 mb-4">รองรับ MP3, WAV, M4A, MP4 (สูงสุด 2GB)</p>
                       <button onclick="Meeting.simulateUpload()" class="btn btn-primary">
                           <i class="fas fa-folder-open mr-2"></i>เลือกไฟล์
                       </button>
                   </div>
               </div>

               <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <div class="flex items-center space-x-2">
                       <i class="fas fa-globe text-blue-600"></i>
                       <span class="text-sm text-blue-800">รองรับ: ไทย, English, 中文, 日本語</span>
                   </div>
               </div>
           </div>
       `;
   }

   // Other view content methods...
   loadMeetingChatContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-comments"></i>
               </div>
               <h3 class="empty-state-title">Meeting AI Chat</h3>
               <p class="empty-state-subtitle">Ask questions about your meeting history</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-plus mr-2"></i>Start Conversation
               </button>
           </div>
       `;
   }

   loadActionItemsContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-tasks"></i>
               </div>
               <h3 class="empty-state-title">Action Items</h3>
               <p class="empty-state-subtitle">Track tasks from your meetings</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-plus mr-2"></i>Add Task
               </button>
           </div>
       `;
   }

   loadAnalyticsContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-chart-bar"></i>
               </div>
               <h3 class="empty-state-title">Analytics Dashboard</h3>
               <p class="empty-state-subtitle">Insights about your team's productivity</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-chart-line mr-2"></i>View Reports
               </button>
           </div>
       `;
   }

   loadIntegrationsContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-plug"></i>
               </div>
               <h3 class="empty-state-title">Integrations</h3>
               <p class="empty-state-subtitle">Connect FlowWork with your favorite tools</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-plus mr-2"></i>Add Integration
               </button>
           </div>
       `;
   }

   loadSettingsContent(container) {
       container.innerHTML = `
           <div class="empty-state">
               <div class="empty-state-icon">
                   <i class="fas fa-cog"></i>
               </div>
               <h3 class="empty-state-title">Settings</h3>
               <p class="empty-state-subtitle">Customize your FlowWork experience</p>
               <button class="btn btn-primary mt-4">
                   <i class="fas fa-user-cog mr-2"></i>Manage Account
               </button>
           </div>
       `;
   }
   
   // Navigation helpers
   updateActiveNavigation() {
       // Remove active class from all nav items
       document.querySelectorAll('.nav-item').forEach(item => {
           item.classList.remove('active');
       });
       
       // Add active class to current view
       const activeNavItem = document.querySelector(`[onclick*="${this.currentView}"]`);
       if (activeNavItem && activeNavItem.classList.contains('nav-item')) {
           activeNavItem.classList.add('active');
       }
   }
   
   updatePageTitle() {
       const view = this.views[this.currentView];
       if (view) {
           document.title = `${view.title} - FlowWork`;
       }
   }
   
   updateURL(viewKey, params = {}) {
       Utils.updateURL(viewKey, params);
   }
   
   setupBreadcrumbs() {
       // Implementation for breadcrumbs navigation
       this.breadcrumbContainer = document.getElementById('breadcrumbs');
   }
   
   updateBreadcrumbs() {
       if (!this.breadcrumbContainer) return;
       
       const view = this.views[this.currentView];
       const breadcrumbs = ['Dashboard'];
       
       if (this.currentView !== 'dashboard') {
           breadcrumbs.push(view.title);
       }
       
       this.breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => 
           index === breadcrumbs.length - 1 
               ? `<span class="text-gray-900 font-medium">${crumb}</span>`
               : `<a href="#" class="text-gray-500 hover:text-gray-700">${crumb}</a>`
       ).join(' <i class="fas fa-chevron-right text-gray-400 mx-2"></i> ');
   }
   
   addToHistory(viewKey) {
       this.viewHistory.push(viewKey);
       if (this.viewHistory.length > this.maxHistory) {
           this.viewHistory.shift();
       }
   }
   
   goBack() {
       if (this.viewHistory.length > 0) {
           const previousView = this.viewHistory.pop();
           this.showView(previousView);
       } else {
           this.showView('dashboard');
       }
   }
   
   isAuthenticated() {
       // In real app, check JWT token or session
       return Utils.getFromStorage('user_authenticated', true);
   }
   
   showAuthRequired() {
       Utils.showNotification('Please log in to access this feature', 'warning');
   }
   
   loadViewComponents() {
       // Initialize view-specific components
       console.log('📄 View components loaded');
   }
}

// Initialize Navigation system
window.Navigation = new Navigation();

// Global functions for onclick handlers
window.Navigation.showView = window.Navigation.showView.bind(window.Navigation);
window.Navigation.goBack = window.Navigation.goBack.bind(window.Navigation);

// Research functions (global for onclick handlers)
window.handleResearchKeydown = function(event) {
   if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
       event.preventDefault();
       performAIResearch();
   }
};

window.performAIResearch = function() {
   const query = document.getElementById('researchQuery').value.trim();
   if (!query) {
       Utils.showNotification('Please enter a research query', 'warning');
       return;
   }
   
   // Show AI processing
   const responseArea = document.getElementById('aiResponseArea');
   responseArea.classList.remove('hidden');
   responseArea.innerHTML = `
       <div class="ai-response">
           <div class="flex items-start space-x-4">
               <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                   <i class="fas fa-robot"></i>
               </div>
               <div class="flex-1">
                   <div class="flex items-center space-x-3 mb-4">
                       <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                       <span class="text-gray-600">Analyzing with ${AIModels.currentModel}...</span>
                   </div>
               </div>
           </div>
       </div>
   `;
   
   // Simulate AI processing
   setTimeout(() => {
       displayAIResearchResults(query);
   }, 2000);
   
   Utils.trackEvent('ai_research_query', { 
       query: query.substring(0, 50), 
       model: AIModels.currentModel 
   });
};

window.displayAIResearchResults = function(query) {
   const mockResponse = `ผลการวิเคราะห์จาก AI สำหรับ "${query}":

**ข้อมูลสำคัญที่พบ:**
- กระบวนการหลักมี 3 ขั้นตอนสำคัญ
- ระยะเวลาดำเนินการโดยเฉลี่ย 1-3 วันทำการ
- ค่าใช้จ่ายที่เกี่ยวข้องอยู่ในช่วง 500-1,000 บาท

**คำแนะนำจาก AI:**
ระบบแนะนำให้ศึกษาข้อมูลเพิ่มเติมจากแหล่งราชการที่เชื่อถือได้ และเตรียมเอกสารให้ครบถ้วนก่อนดำเนินการ

**แหล่งข้อมูลอ้างอิง:**
- เว็บไซต์ราชการที่เกี่ยวข้อง
- คู่มือการปฏิบัติงานล่าสุด
- ประสบการณ์จากการประชุมทีมที่ผ่านมา`;

   const responseArea = document.getElementById('aiResponseArea');
   responseArea.innerHTML = `
       <div class="ai-response">
           <div class="flex items-start space-x-4">
               <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                   <i class="fas fa-robot"></i>
               </div>
               <div class="flex-1">
                   <div id="aiResponseText" class="text-gray-900 leading-relaxed mb-4"></div>
                   <div class="flex flex-wrap gap-2 mb-4">
                       <div class="inline-flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs">
                           <div class="w-2 h-2 rounded-full bg-green-500"></div>
                           <span class="font-medium">ข้อมูลราชการ</span>
                           <span class="text-gray-500">official</span>
                       </div>
                       <div class="inline-flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs">
                           <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                           <span class="font-medium">AI Model: ${AIModels.currentModel}</span>
                           <span class="text-gray-500">analysis</span>
                       </div>
                   </div>
                   <div class="pt-4 border-t border-purple-200">
                       <div class="flex flex-wrap gap-2">
                           <button onclick="exportToGoogleDocs()" class="btn btn-primary text-sm">
                               <i class="fab fa-google-drive mr-2"></i>Export to Google Docs
                           </button>
                           <button onclick="exportToWord()" class="btn btn-secondary text-sm">
                               <i class="fab fa-microsoft mr-2"></i>Export to Word
                           </button>
                           <button onclick="shareWithTeam()" class="btn btn-secondary text-sm">
                               <i class="fas fa-share-alt mr-2"></i>Share with Team
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       <!-- Follow-up Questions -->
       <div class="bg-gray-50 rounded-xl p-4 mt-6">
           <div class="text-sm text-gray-600 mb-3 flex items-center">
               <i class="fas fa-lightbulb mr-2"></i>Follow-up Questions:
           </div>
           <div class="space-y-2">
               <button onclick="suggestedResearch('ค่าธรรมเนียมการจดทะเบียนแต่ละประเภท')" class="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-sm transition-all">
                   <i class="fas fa-arrow-right text-purple-500 mr-2"></i>ค่าธรรมเนียมการจดทะเบียนแต่ละประเภท
               </button>
               <button onclick="suggestedResearch('เอกสารเพิ่มเติมสำหรับธุรกิจต่างชาติ')" class="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-sm transition-all">
                   <i class="fas fa-arrow-right text-purple-500 mr-2"></i>เอกสารเพิ่มเติมสำหรับธุรกิจต่างชาติ
               </button>
               <button onclick="suggestedResearch('ขั้นตอนการต่ออายุใบทะเบียน')" class="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-sm transition-all">
                   <i class="fas fa-arrow-right text-purple-500 mr-2"></i>ขั้นตอนการต่ออายุใบทะเบียน
               </button>
           </div>
       </div>
   `;
   
   // Type writer effect for response
   Utils.typeWriter(document.getElementById('aiResponseText'), mockResponse, 25);
   
   // Scroll to response
   responseArea.scrollIntoView({ behavior: 'smooth' });
   
   // Track AI usage
   const cost = AIModels.calculateCost(query.length);
   AIModels.trackUsage(AIModels.currentModel, cost, true);
   Utils.updateCreditsDisplay(
       parseInt(document.getElementById('creditsCount').textContent) - cost
   );
   
   Utils.showNotification(`Research completed! Used ${cost} credits with ${AIModels.currentModel}`, 'success');
};

window.suggestedResearch = function(query) {
   document.getElementById('researchQuery').value = query;
   performAIResearch();
};

// Export functions
window.exportToGoogleDocs = function() {
   Utils.showNotification('Exporting to Google Docs... This will open in a new tab.', 'success');
};

window.exportToWord = function() {
   Utils.showNotification('Generating Word document... Download will start shortly.', 'success');
};

window.shareWithTeam = function() {
   Utils.showNotification('Sharing with team members... Notifications sent!', 'success');
};

// Meeting type selection
window.selectMeetingType = function(type) {
   document.querySelectorAll('.quick-action').forEach(card => {
       card.classList.remove('selected');
   });
   event.currentTarget.classList.add('selected');
   Utils.showNotification(`Selected: ${type} meeting type`, 'info');
};
// เพิ่มในส่วนท้ายของไฟล์ navigation.js

// Force load dashboard content when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Ensure dashboard content is loaded
    setTimeout(() => {
        const dashboardView = document.getElementById('dashboard-view');
        if (dashboardView && !dashboardView.hasAttribute('data-loaded')) {
            Navigation.loadDashboardContent(dashboardView);
        }
        
        // Make sure dashboard is active
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });
        dashboardView.classList.add('active');
        
        console.log('✅ Dashboard force loaded');
    }, 500);
});