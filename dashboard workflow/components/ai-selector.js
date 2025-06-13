// 🧠 AI Research Module - FlowWork
// Version: 1.0.0
// Dependencies: notifications.js, utils.js

const AIResearchModule = {
    name: 'AI Research',
    version: '1.0.0',
    dependencies: ['notifications', 'utils'],
    
    // 🎯 Module State
    state: {
        selectedModel: 'GPT-4',
        currentQuery: '',
        lastResponse: null,
        isProcessing: false
    },
    
    // 🚀 Initialize Module
    init() {
        console.log('🧠 AI Research Module initialized');
        this.bindEvents();
        return true;
    },
    
    // 🎨 Render Module Interface
    render(container) {
        if (!container) {
            console.error('AI Research: No container provided');
            return false;
        }
        
        container.innerHTML = this.getTemplate();
        this.attachEventListeners();
        this.loadSuggestions();
        
        // Focus on search input
        setTimeout(() => {
            const searchInput = document.getElementById('researchQuery');
            if (searchInput) searchInput.focus();
        }, 300);
        
        return true;
    },
    
    // 🧹 Cleanup Module
    destroy() {
        console.log('🧠 AI Research Module destroyed');
        this.unbindEvents();
        this.state = {
            selectedModel: 'GPT-4',
            currentQuery: '',
            lastResponse: null,
            isProcessing: false
        };
    },
    
    // 📋 Module Template
    getTemplate() {
        return `
            <div class="ai-research-module">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold text-gray-900 flex items-center">
                        <button onclick="FlowWork.goBack()" class="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i class="fas fa-arrow-left text-gray-600"></i>
                        </button>
                        <i class="fas fa-brain text-purple-600 mr-3"></i>
                        AI Research Intelligence
                    </h1>
                </div>
                
                <!-- Header Controls -->
                <div class="research-header-controls">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Advanced AI Research</h2>
                        <p class="text-sm text-gray-600">Multi-model intelligence for deep analysis</p>
                    </div>
                    <div class="research-model-selector">
                        <div class="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-brain text-white text-xs"></i>
                        </div>
                        <div>
                            <div class="font-semibold text-sm text-purple-900" id="currentResearchModel">${this.state.selectedModel}</div>
                            <div class="text-xs text-purple-600">฿0.08/query • Best accuracy</div>
                        </div>
                        <button onclick="AIResearch.toggleModelSelector()" class="text-purple-600 hover:text-purple-800">
                            <i class="fas fa-chevron-down text-xs"></i>
                        </button>
                    </div>
                </div>
    
                <!-- Search Interface -->
                <div class="bg-white rounded-lg p-6 border-2 border-purple-200 shadow-sm mb-8">
                    <div class="relative">
                        <textarea 
                            id="researchQuery"
                            placeholder="Ask me anything... เช่น 'ขั้นตอนการขอจดทะเบียนธุรกิจใหม่ตามกฎหมายไทย'"
                            class="w-full h-24 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-500 focus:outline-none"
                            onkeydown="AIResearch.handleKeydown(event)"></textarea>
                        
                        <div class="absolute bottom-4 right-4 flex items-center space-x-3">
                            <span class="text-sm text-gray-500">Ctrl+Enter to search</span>
                            <button onclick="AIResearch.performResearch()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all">
                                <i class="fas fa-paper-plane mr-2"></i>Research
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Suggestion Categories -->
                <div class="suggestion-categories">
                    ${this.getSuggestionsTemplate()}
                </div>
    
                <!-- Response Area -->
                <div id="aiResponseArea" class="hidden bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mt-8">
                    <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="flex-1">
                            <div id="aiResponseText" class="text-gray-900 leading-relaxed"></div>
                            <div class="mt-6 pt-4 border-t border-purple-200">
                                <div class="flex flex-wrap gap-2">
                                    <button onclick="AIResearch.exportToGoogleDocs()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                        <i class="fab fa-google-drive mr-2"></i>Export to Google Docs
                                    </button>
                                    <button onclick="AIResearch.exportToWord()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                        <i class="fab fa-microsoft mr-2"></i>Export to Word
                                    </button>
                                    <button onclick="AIResearch.shareWithTeam()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                        <i class="fas fa-share-alt mr-2"></i>Share with Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // 🎨 Suggestions Template
    getSuggestionsTemplate() {
        const categories = [
            {
                title: 'ธุรกิจและกฎหมาย',
                icon: 'fas fa-building text-purple-600',
                items: [
                    { title: 'การจดทะเบียนธุรกิจ', desc: 'ขั้นตอนและเอกสารที่จำเป็น', query: 'ขั้นตอนการขอจดทะเบียนธุรกิจใหม่ตามกฎหมายไทย' },
                    { title: 'กฎหมายแรงงาน 2567', desc: 'การปรับปรุงล่าสุด', query: 'กฎหมายแรงงาน 2567 การเปลี่ยนแปลงใหม่' },
                    { title: 'ภาษีเงินได้นิติบุคคล', desc: 'อัตราและการคำนวณ', query: 'ภาษีเงินได้นิติบุคคล อัตราและการคำนวณ' }
                ]
            },
            {
                title: 'การเงินและการลงทุน',
                icon: 'fas fa-chart-line text-green-600',
                items: [
                    { title: 'การวิเคราะห์งบการเงิน', desc: 'อัตราส่วนทางการเงินที่สำคัญ', query: 'การวิเคราะห์งบการเงิน อัตราส่วนทางการเงินที่สำคัญ' },
                    { title: 'แผนธุรกิจ Startup', desc: 'การเริ่มต้นทำอย่างไร', query: 'แผนธุรกิจสำหรับ startup เริ่มต้นทำอย่างไร' },
                    { title: 'แหล่งเงินทุน', desc: 'VC และ Angel Investor', query: 'การหาแหล่งเงินทุน VC Angel Investor ในไทย' }
                ]
            },
            {
                title: 'เทคโนโลยีและ AI',
                icon: 'fas fa-laptop-code text-blue-600',
                items: [
                    { title: 'เทรนด์ AI 2025', desc: 'สำหรับธุรกิจไทย', query: 'เทรนด์ AI ในปี 2025 ที่ธุรกิจไทยควรรู้' },
                    { title: 'AI ในองค์กร', desc: 'กรณีศึกษาไทย', query: 'การนำ AI มาใช้ในองค์กร กรณีศึกษาประเทศไทย' },
                    { title: 'Cybersecurity SME', desc: 'มาตรการป้องกัน', query: 'cybersecurity สำหรับ SME ไทย มาตรการป้องกันที่จำเป็น' }
                ]
            }
        ];
        
        return categories.map(category => `
            <div class="suggestion-category">
                <h3 class="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <i class="${category.icon} mr-2"></i>
                    ${category.title}
                </h3>
                ${category.items.map(item => `
                    <div class="suggestion-item" onclick="AIResearch.useSuggestion('${item.query}')">
                        <div class="font-medium text-purple-900">${item.title}</div>
                        <div class="text-sm text-purple-700">${item.desc}</div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    },
    
    // 🎯 Core Functions
    handleKeydown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            this.performResearch();
        }
    },
    
    performResearch() {
        const query = document.getElementById('researchQuery').value.trim();
        if (!query) {
            FlowWork.showNotification('Please enter a research query', 'warning');
            return;
        }

        this.state.currentQuery = query;
        this.state.isProcessing = true;

        const responseArea = document.getElementById('aiResponseArea');
        const responseText = document.getElementById('aiResponseText');

        responseArea.classList.remove('hidden');
        responseText.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                <span class="text-gray-600">Analyzing with ${this.state.selectedModel}...</span>
            </div>
        `;

        // Simulate AI processing
        setTimeout(() => {
            this.displayResults(query);
        }, 2000);
    },
    
    displayResults(query) {
        const responseText = document.getElementById('aiResponseText');
        
        const response = `ผลการค้นหาจากระบบ AI สำหรับ "${query}":

**การวิเคราะห์ด้วย ${this.state.selectedModel}:**

เนื่องจากเป็น demo version ข้อมูลจริงจะมาจากการเชื่อมต่อกับ AI models และแหล่งข้อมูลต่างๆ รวมถึง:

**🏛️ หน่วยงานราชการ**: เอกสารจากกระทรวงต่างๆ
**📚 ฐานข้อมูลกฎหมาย**: ระเบียบและประกาศต่างๆ
**💼 ประวัติการประชุม**: ข้อมูลจากการประชุมที่ผ่านมา
**🔍 แหล่งข้อมูลออนไลน์**: เว็บไซต์ราชการและข้อมูลอ้างอิง

ระบบจะให้คำตอบที่ตรงประเด็น พร้อม citation และ follow-up questions

💡 **AI Model Used**: ${this.state.selectedModel}
🎯 **Search Confidence**: High
📊 **Sources Found**: Multiple official sources
⏱️ **Processing Time**: 2.4 seconds`;

        this.typeWriterEffect(responseText, response, 25);
        this.state.lastResponse = response;
        this.state.isProcessing = false;
        
        // Update usage stats
        FlowWork.updateAIUsageStats();
    },
    
    useSuggestion(query) {
        document.getElementById('researchQuery').value = query;
        this.performResearch();
    },
    
    toggleModelSelector() {
        FlowWork.showNotification('Model selector - feature coming soon!', 'info');
    },
    
    // 📤 Export Functions
    exportToGoogleDocs() {
        FlowWork.showNotification('Exporting to Google Docs... This will open in a new tab.', 'success');
        setTimeout(() => {
            FlowWork.showNotification('Document exported successfully to Google Docs!', 'success');
        }, 2000);
    },

    exportToWord() {
        FlowWork.showNotification('Generating Word document... Download will start shortly.', 'success');
        setTimeout(() => {
            FlowWork.showNotification('Word document downloaded successfully!', 'success');
        }, 2000);
    },

    shareWithTeam() {
        FlowWork.showNotification('Sharing with team members... Notifications sent!', 'success');
        setTimeout(() => {
            FlowWork.showNotification('Document shared with 8 team members!', 'success');
        }, 1500);
    },
    
    // 🛠️ Helper Functions
    typeWriterEffect(element, text, speed) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    },
    
    bindEvents() {
        // Global event listeners if needed
    },
    
    unbindEvents() {
        // Remove global event listeners
    },
    
    attachEventListeners() {
        // Attach module-specific event listeners
        const searchInput = document.getElementById('researchQuery');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
    },
    
    loadSuggestions() {
        // Load suggestion categories (already in template)
        console.log('🎯 AI Research suggestions loaded');
    }
};

// 🚀 Export Module
export default AIResearchModule;

// 🌐 Global Access (for onclick handlers)
window.AIResearch = AIResearchModule;