/**
 * AI Research Module - Frontend JavaScript Controller (FIXED NAMING CONFLICTS)
 * Enhanced for proper FlowWork integration without conflicts
 * 
 * @version 1.0.4
 * @author FlowWork Team
 */

// ✅ Prevent multiple loading
(function() {
    'use strict';
    
    // Check if already loaded
    if (window.aiResearchLoaded) {
        console.warn('⚠️ AI Research script already loaded, skipping...');
        return;
    }
    
    // Mark as loading
    window.aiResearchLoaded = true;
    
    class AIResearchModuleCore {
        constructor() {
            this.name = 'AI Research';
            this.version = '1.0.4';
            this.moduleId = 'ai-research';
            this.instanceName = 'AIResearch';
            
            // Prevent multiple initialization
            if (window[this.instanceName] && window[this.instanceName].initialized) {
                console.warn('🧠 AI Research already initialized');
                return window[this.instanceName];
            }
            
            // Initialize properties
            this.currentPersona = 'general';
            this.currentModel = 'auto';
            this.isProcessing = false;
            this.currentQuery = '';
            this.lastResult = null;
            this.container = null;
            this.initialized = false;
            
            this.initializeConfig();
            this.setupPersonas();
            this.setupAIModels();
            
            console.log('🧠 AI Research Module Core initialized (v1.0.4 - FIXED)');
        }
        
        /**
         * Initialize configuration and detect environment
         */
        initializeConfig() {
            try {
                if (typeof window !== 'undefined' && window.FlowWorkConfig && Array.isArray(window.FlowWorkConfig.modules)) {
                    this.isStandalone = false;
                    console.log('🧠 AI Research: Running in FlowWork environment');
                } else {
                    this.isStandalone = true;
                    console.log('🧠 AI Research: Running in standalone mode');
                }
            } catch (error) {
                this.isStandalone = true;
                console.warn('🧠 AI Research: Config detection failed, using standalone mode');
            }
        }
        
        /**
         * Setup Personas Configuration
         */
        setupPersonas() {
            this.personas = {
                student: {
                    name: 'นักเรียน/นักศึกษา',
                    icon: '🎓',
                    description: 'สำหรับทำรายงาน การบ้าน และเตรียมสอบ',
                    color: 'blue'
                },
                business: {
                    name: 'พนักงานบริษัท', 
                    icon: '💼',
                    description: 'วิเคราะห์ตลาด แผนธุรกิจ และกลยุทธ์องค์กร',
                    color: 'purple'
                },
                government: {
                    name: 'ข้าราชการ',
                    icon: '🏛️', 
                    description: 'รายงานวิชาการ นโยบายสาธารณะ และระเบียบราชการ',
                    color: 'green'
                },
                researcher: {
                    name: 'นักวิจัย',
                    icon: '🔬',
                    description: 'งานวิจัยเชิงวิชาการ การทบทวนวรรณกรรม และการวิเคราะห์ข้อมูล',
                    color: 'indigo'
                },
                general: {
                    name: 'บุคคลทั่วไป',
                    icon: '👥',
                    description: 'คำถามทั่วไป การเงินส่วนตัว และการตัดสินใจในชีวิต',
                    color: 'gray'
                },
                organization: {
                    name: 'องค์กร/SME',
                    icon: '🏢',
                    description: 'การวางแผนเชิงกลยุทธ์ การจัดการทีมงาน และการเติบโตของธุรกิจ',
                    color: 'orange'
                }
            };
        }
        
        /**
         * Setup AI Models Configuration
         */
        setupAIModels() {
            this.aiModels = {
                auto: { name: 'Auto Select', cost: '5-8', icon: '🎯', description: 'ระบบเลือกให้อัตโนมัติ' },
               'gpt-4': { name: 'GPT-4', cost: '8', icon: '🧠', description: 'คุณภาพสูงสุด วิเคราะห์ลึก' },
               claude: { name: 'Claude', cost: '5', icon: '🤖', description: 'การวิเคราะห์บริบทยาว' },
               gemini: { name: 'Gemini', cost: '2', icon: '💎', description: 'ประหยัด เร็ว' }
           };
        }
        
        /**
         * Initialize Module
         */
        init() {
            try {
                if (this.initialized) {
                    console.log('🧠 AI Research: Already initialized');
                    return true;
                }
                
                this.bindEvents();
                this.setupEventListeners();
                
                this.initialized = true;
                console.log('✅ AI Research Module initialized successfully');
                return true;
            } catch (error) {
                console.error('❌ AI Research Module initialization failed:', error);
                return false;
            }
        }
        
        /**
         * Render Module Interface
         */
        render(container) {
            try {
                if (!container) {
                    console.error('❌ No container provided for AI Research');
                    return false;
                }
                
                console.log('🎨 Rendering AI Research Module...');
                
                this.container = container;
                container.innerHTML = this.getFullInterface();
                
                // Initialize interface after DOM is ready
                setTimeout(() => {
                    this.initializeInterface();
                }, 100);
                
                console.log('✅ AI Research interface rendered successfully');
                return true;
                
            } catch (error) {
                console.error('❌ AI Research render error:', error);
                if (container) {
                    container.innerHTML = this.getErrorTemplate(error.message);
                }
                return false;
            }
        }
        
        /**
         * Get Full Interface HTML
         */
        getFullInterface() {
            return `
                <div id="aiResearchModule" class="ai-research-module">
                    
                    <!-- Module Header -->
                    <div class="module-header">
                        <div class="header-left">
                            <button class="back-button" onclick="FlowWork.loadModule('dashboard')">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <div class="module-title">
                                <h1><i class="fas fa-brain"></i> AI Research Assistant</h1>
                                <p>ระบบวิจัยด้วย AI แบบ Multi-provider (FIXED VERSION)</p>
                            </div>
                        </div>
                        <div class="header-right">
                            <div class="credits-display">
                                <i class="fas fa-coins"></i>
                                <span id="userCredits">1,246</span>
                                <small>credits</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Research Form -->
                    <div class="research-form-container">
                        <div class="research-form">
                            
                            <!-- Success Message -->
                            <div style="background: var(--green-50); border: 1px solid var(--green-200); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                                <h4 style="color: var(--green-800); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-check-circle"></i> ✅ Module Loading Fixed!
                                </h4>
                                <p style="color: var(--green-700); margin: 0; font-size: 14px;">
                                    Naming conflicts resolved. AI Research Module is now working properly.
                                </p>
                            </div>
                            
                            <!-- Persona Selection -->
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="fas fa-user-circle"></i>
                                    เลือก Persona (บทบาทการใช้งาน)
                                </label>
                                <div class="persona-grid" id="personaGrid">
                                    <!-- Personas will be loaded by JavaScript -->
                                </div>
                            </div>
                            
                            <!-- AI Model Selection -->
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="fas fa-robot"></i>
                                    เลือก AI Model
                                </label>
                                <div class="ai-model-selector">
                                    <div class="model-option active" data-model="auto">
                                        <div class="model-icon">🎯</div>
                                        <div class="model-info">
                                            <h4>Auto Select</h4>
                                            <p>ระบบเลือกให้อัตโนมัติ</p>
                                            <span class="cost">~5-8 credits</span>
                                        </div>
                                    </div>
                                    <div class="model-option" data-model="gpt-4">
                                        <div class="model-icon">🧠</div>
                                        <div class="model-info">
                                            <h4>GPT-4</h4>
                                            <p>คุณภาพสูงสุด วิเคราะห์ลึก</p>
                                            <span class="cost">8 credits</span>
                                        </div>
                                    </div>
                                    <div class="model-option" data-model="claude">
                                        <div class="model-icon">🤖</div>
                                        <div class="model-info">
                                            <h4>Claude</h4>
                                            <p>การวิเคราะห์บริบทยาว</p>
                                            <span class="cost">5 credits</span>
                                        </div>
                                    </div>
                                    <div class="model-option" data-model="gemini">
                                        <div class="model-icon">💎</div>
                                        <div class="model-info">
                                            <h4>Gemini</h4>
                                            <p>ประหยัด เร็ว</p>
                                            <span class="cost">2 credits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Query Input -->
                            <div class="form-section">
                                <label class="section-label">
                                    <i class="fas fa-search"></i>
                                    คำถามหรือหัวข้อที่ต้องการวิจัย
                                </label>
                                <div class="query-input-container">
                                    <textarea 
                                        id="researchQuery" 
                                        class="query-input"
                                        placeholder="ตัวอย่าง: วิเคราะห์แนวโน้มการลงทุนใน Cryptocurrency ในประเทศไทย 2025"
                                        rows="4"
                                        maxlength="10000"></textarea>
                                    <div class="input-footer">
                                        <span class="char-count">0/10,000</span>
                                        <div class="quick-suggestions">
                                            <button type="button" class="suggestion-btn" onclick="window.AIResearch.useSuggestion('วิเคราะห์แนวโน้มตลาดหุ้นไทย 2025')">
                                                📈 แนวโน้มตลาดหุ้น
                                            </button>
                                            <button type="button" class="suggestion-btn" onclick="window.AIResearch.useSuggestion('กลยุทธ์การตลาดดิจิทัลสำหรับ SME')">
                                                💼 กลยุทธ์การตลาด
                                            </button>
                                            <button type="button" class="suggestion-btn" onclick="window.AIResearch.useSuggestion('แนวโน้มเทคโนโลยี AI ในปี 2025')">
                                                🤖 เทคโนโลยี AI
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Advanced Options -->
                            <div class="form-section">
                                <button class="advanced-toggle" onclick="window.AIResearch.toggleAdvancedOptions()">
                                    <i class="fas fa-cog"></i>
                                    ตัวเลือกขั้นสูง
                                    <i class="fas fa-chevron-down toggle-icon"></i>
                                </button>
                                <div id="advancedOptions" class="advanced-options">
                                    <div class="option-row">
                                        <label>ความลึกของการวิจัย:</label>
                                        <div class="depth-slider">
                                            <input type="range" id="researchDepth" min="1" max="5" value="3">
                                            <div class="depth-labels">
                                                <span>เร็ว</span>
                                                <span>ปกติ</span>
                                                <span>ลึก</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="option-row">
                                        <label>ภาษาผลลัพธ์:</label>
                                        <select id="outputLanguage">
                                            <option value="thai">ภาษาไทย</option>
                                            <option value="english">English</option>
                                            <option value="both">ทั้งสองภาษา</option>
                                        </select>
                                    </div>
                                    <div class="option-row">
                                        <label>แหล่งข้อมูลที่ต้องการ:</label>
                                        <div class="source-checkboxes">
                                            <label><input type="checkbox" checked> ราชการ (.go.th)</label>
                                            <label><input type="checkbox" checked> วิชาการ (.ac.th)</label>
                                            <label><input type="checkbox" checked> สื่อข่าว</label>
                                            <label><input type="checkbox"> Social Media</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="form-actions">
                                <div class="cost-estimate">
                                    <span class="estimate-label">ค่าใช้จ่ายประมาณ:</span>
                                    <span id="costEstimate" class="estimate-value">5-8 credits</span>
                                </div>
                                <button type="button" id="startResearchBtn" class="start-research-btn" onclick="window.AIResearch.startResearch()">
                                    <i class="fas fa-rocket"></i>
                                    เริ่มวิจัยด้วย AI (DEMO)
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Research Progress -->
                    <div id="researchProgress" class="research-progress" style="display: none;">
                        <div class="progress-header">
                            <h3><i class="fas fa-cog fa-spin"></i> กำลังวิจัยด้วย AI...</h3>
                            <button class="cancel-btn" onclick="window.AIResearch.cancelResearch()">
                                <i class="fas fa-times"></i> ยกเลิก
                            </button>
                        </div>
                        
                        <div class="progress-steps">
                            <div class="step active">
                                <i class="fas fa-search"></i>
                                <span>ค้นหาแหล่งข้อมูล</span>
                            </div>
                            <div class="step">
                                <i class="fas fa-robot"></i>
                                <span>ประมวลผลด้วย AI</span>
                            </div>
                            <div class="step">
                                <i class="fas fa-check-circle"></i>
                                <span>จัดรูปแบบผลลัพธ์</span>
                            </div>
                        </div>
                        
                        <div class="progress-details">
                            <div class="progress-bar">
                                <div id="progressFill" class="progress-fill"></div>
                            </div>
                            <div id="progressText" class="progress-text">กำลังค้นหาแหล่งข้อมูล...</div>
                            
                            <div class="sources-found">
                                <h4>แหล่งข้อมูลที่พบ:</h4>
                                <div id="sourcesList" class="sources-list">
                                    <!-- Sources will be added dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Research Results -->
                    <div id="researchResults" class="research-results" style="display: none;">
                        <div class="results-header">
                            <div class="results-info">
                                <h3 id="resultsTitle">ผลการวิจัย (DEMO)</h3>
                                <div class="results-meta">
                                    <span id="resultsCost">ใช้ 8 credits</span>
                                    <span id="resultsDuration">เวลา 2.5 วินาที</span>
                                    <span id="resultsModel">GPT-4</span>
                                </div>
                            </div>
                            <div class="results-actions">
                                <button class="btn-secondary" onclick="window.AIResearch.shareWithTeam()">
                                    <i class="fas fa-users"></i> แชร์กับทีม
                                </button>
                                <button class="btn-primary" onclick="window.AIResearch.exportResults()">
                                    <i class="fas fa-download"></i> ส่งออก
                                </button>
                                <button class="btn-secondary" onclick="window.AIResearch.newResearch()">
                                    <i class="fas fa-plus"></i> วิจัยใหม่
                                </button>
                            </div>
                        </div>
                        
                        <div class="results-content">
                            <div id="resultsText" class="results-text">
                                <!-- AI generated content will be displayed here -->
                            </div>
                        </div>
                        
                        <div class="results-footer">
                            <div class="sources-section">
                                <h4>แหล่งอ้างอิง:</h4>
                                <div id="resultsSources" class="sources-grid">
                                    <!-- Sources will be displayed here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            `;
        }
        
        /**
         * Initialize Interface after rendering
         */
        initializeInterface() {
            try {
                console.log('🔄 Initializing AI Research interface...');
                
                this.loadPersonas();
                this.attachEventHandlers();
                this.updateUI();
                
                this.showNotification('🧠 AI Research Module พร้อมใช้งาน! (FIXED)', 'success');
                
                console.log('✅ AI Research interface initialized successfully');
                
            } catch (error) {
                console.error('❌ Interface initialization failed:', error);
                this.showNotification('เกิดข้อผิดพลาดในการเตรียม Interface', 'error');
            }
        }
        
        /**
         * Load Personas into UI
         */
        loadPersonas() {
            const personaGrid = document.getElementById('personaGrid');
            if (!personaGrid) {
                console.warn('⚠️ Persona grid not found');
                return;
            }
            
            let html = '';
            Object.entries(this.personas).forEach(([key, persona]) => {
                const isActive = key === this.currentPersona ? 'active' : '';
                html += `
                    <div class="persona-card ${isActive}" data-persona="${key}" onclick="window.AIResearch.selectPersona('${key}')">
                        <div class="persona-icon">${persona.icon}</div>
                        <div class="persona-name">${persona.name}</div>
                        <div class="persona-description">${persona.description}</div>
                    </div>
                `;
            });
            
            personaGrid.innerHTML = html;
            console.log('✅ Personas loaded successfully');
        }
        
        /**
         * Select Persona
         */
        selectPersona(personaKey) {
            if (!this.personas[personaKey]) {
                console.error('❌ Invalid persona:', personaKey);
                return;
            }
            
            this.currentPersona = personaKey;
            
            // Update UI
            document.querySelectorAll('.persona-card').forEach(card => {
                card.classList.remove('active');
            });
            
            const selectedCard = document.querySelector(`[data-persona="${personaKey}"]`);
            if (selectedCard) {
                selectedCard.classList.add('active');
            }
            
            this.updateCostEstimate();
            
            const persona = this.personas[personaKey];
            this.showNotification(`เลือก Persona: ${persona.name}`, 'success');
            
            console.log(`🎭 Persona selected: ${personaKey}`);
        }
        
        /**
         * Select AI Model
         */
        selectAIModel(modelKey) {
            if (!this.aiModels[modelKey]) {
                console.error('❌ Invalid model:', modelKey);
                return;
            }
            
            this.currentModel = modelKey;
            this.updateModelSelection();
            this.updateCostEstimate();
            
            const model = this.aiModels[modelKey];
            this.showNotification(`เลือก AI Model: ${model.name}`, 'info');
            
            console.log(`🤖 AI Model selected: ${modelKey}`);
        }
        
        /**
         * Update Model Selection UI
         */
        updateModelSelection() {
            document.querySelectorAll('.model-option').forEach(option => {
                option.classList.remove('active');
            });
            
            const selectedOption = document.querySelector(`[data-model="${this.currentModel}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
        }
        
        /**
         * Update Cost Estimate
         */
        updateCostEstimate() {
            const costElement = document.getElementById('costEstimate');
            if (!costElement) return;
            
            const model = this.aiModels[this.currentModel];
            costElement.textContent = `${model.cost} credits`;
        }
        
        /**
         * Toggle Advanced Options
         */
        toggleAdvancedOptions() {
            const toggle = document.querySelector('.advanced-toggle');
            const options = document.getElementById('advancedOptions');
            
            if (options && toggle) {
                const isOpen = options.classList.contains('open');
                if (isOpen) {
                    options.classList.remove('open');
                    toggle.classList.remove('open');
                    options.style.display = 'none';
                } else {
                    options.classList.add('open');
                    toggle.classList.add('open');
                    options.style.display = 'block';
                }
                
                console.log(`🔧 Advanced options ${isOpen ? 'closed' : 'opened'}`);
            }
        }
        
        /**
         * Use Suggestion
         */
        useSuggestion(suggestion) {
            const queryInput = document.getElementById('researchQuery');
            if (queryInput) {
                queryInput.value = suggestion;
                queryInput.focus();
                
                // Update character count
                const charCount = document.querySelector('.char-count');
                if (charCount) {
                    charCount.textContent = `${suggestion.length}/10,000`;
                }
            }
            
            this.showNotification('ใช้คำแนะนำ: ' + suggestion.substring(0, 50) + '...', 'info');
            console.log('💡 Suggestion used:', suggestion);
        }
        
        /**
         * Start Research - DEMO VERSION
         */
        async startResearch() {
            const query = document.getElementById('researchQuery')?.value?.trim();
            
            if (!query) {
                this.showNotification('กรุณาใส่คำถามหรือหัวข้อที่ต้องการวิจัย', 'warning');
                return;
            }
            
            if (this.isProcessing) {
                this.showNotification('กำลังประมวลผลอยู่ กรุณารอสักครู่', 'info');
                return;
            }
            
            this.currentQuery = query;
            this.isProcessing = true;
            
            console.log('🚀 Starting AI research (DEMO):', query);
            
            // Hide form, show progress
            this.showProgress();
            
            try {
                // Simulate AI processing
                await this.processResearch(query);
                
                // Show results
                this.showResults();
                
                console.log('✅ Research completed successfully (DEMO)');
                
            } catch (error) {
                console.error('❌ Research failed:', error);
                this.showNotification('เกิดข้อผิดพลาดในการวิจัย กรุณาลองใหม่อีกครั้ง', 'error');
                this.hideProgress();
            } finally {
                this.isProcessing = false;
            }
        }
        
        /**
         * Process Research - DEMO VERSION
         */
        async processResearch(query) {
            const persona = this.personas[this.currentPersona];
            const model = this.aiModels[this.currentModel];
            
            console.log(`🔄 Processing research with ${model.name} for ${persona.name} (DEMO)`);
            
            // Simulate progress steps
            await this.simulateProgress([
                { step: 1, text: 'กำลังค้นหาแหล่งข้อมูล...', duration: 1200 },
                { step: 2, text: `กำลังประมวลผลด้วย ${model.name}...`, duration: 1800 },
                { step: 3, text: 'กำลังจัดรูปแบบผลลัพธ์...', duration: 1000 }
            ]);
            
            // Generate comprehensive mock result
            this.lastResult = {
                query: query,
                persona: persona.name,
                model: model.name,
                cost: parseInt(model.cost.split('-')[0]) || parseInt(model.cost),
                duration: '2.8 วินาที',
                content: this.generateMockResult(query, persona, model),
                sources: this.generateMockSources(),
                timestamp: new Date()
            };
            
            // Update credits
            this.updateCredits(this.lastResult.cost);
        }
        
        /**
         * Generate Mock Result
         */
        generateMockResult(query, persona, model) {
            const timestamp = new Date().toLocaleString('th-TH');
            
            return `# 🧠 ผลการวิจัย AI: ${query}
 
 **📊 ข้อมูลการวิจัย (DEMO MODE)**
 - 🎭 **Persona**: ${persona.name} 
 - 🤖 **AI Model**: ${model.name}
 - ⏱️ **เวลาประมวลผล**: ${this.lastResult?.duration || '2.8 วินาที'}
 - 💰 **ค่าใช้จ่าย**: ${this.lastResult?.cost || 5} credits
 - 📅 **วันที่**: ${timestamp}
 
 ---
 
 ## 📋 สรุปผลการศึกษา
 
 จากการวิเคราะห์โดย **${model.name}** สำหรับ **${persona.name}** เกี่ยวกับ "${query}" พบข้อมูลดังนี้:
 
 ### 🔍 การวิเคราะห์หลัก
 
 ระบบ AI ได้ทำการรวบรวมและวิเคราะห์ข้อมูลจากแหล่งที่เชื่อถือได้ พบว่าหัวข้อที่สอบถามมีความสำคัญและมีการพัฒนาอย่างต่อเนื่อง
 
 **จุดสำคัญที่พบ:**
 1. **แนวโน้มปัจจุบัน** - มีการเปลี่ยนแปลงที่สำคัญในช่วงที่ผ่านมา
 2. **ปัจจัยสำคัญ** - มีหลายประเด็นที่ต้องพิจารณาอย่างรอบคอบ  
 3. **โอกาสและความท้าทาย** - เห็นทั้งโอกาสในการเติบโตและความท้าทายที่ต้องเผชิญ
 
 ### 📊 การวิเคราะห์เชิงลึก
 
 **สำหรับ ${persona.name}:**
 - การประยุกต์ใช้ในบริบทที่เหมาะสม
 - ข้อควรพิจารณาเฉพาะด้าน
 - แนวทางการดำเนินการที่แนะนำ
 
 ### 💡 ข้อเสนอแนะ
 
 1. **ระยะสั้น** - ควรติดตามข้อมูลเพิ่มเติมและประเมินสถานการณ์
 2. **ระยะกลาง** - มีการวางแผนและเตรียมความพร้อม
 3. **ระยะยาว** - ปรับกลยุทธ์ตามการเปลี่ยนแปลงของสถานการณ์
 
 ### 🔗 แหล่งข้อมูลที่ใช้อ้างอิง
 
 - ธนาคารแห่งประเทศไทย (ข้อมูลเศรษฐกิจ)
 - หอการค้าไทย (สถิติการค้า)
 - กระทรวงพาณิชย์ (นโยบายการค้า) 
 - สำนักงานสถิติแห่งชาติ (ข้อมูลสถิติ)
 - งานวิจัยจากมหาวิทยาลัยชั้นนำ
 
 ---
 
 **⚠️ ข้อจำกัด**: นี่คือผลลัพธ์ตัวอย่างจากระบบ Demo ข้อมูลจริงจะมาจากการเชื่อมต่อกับ AI และแหล่งข้อมูลต่างๆ
 
 **🤖 ประมวลผลโดย**: ${model.name} | **🎭 สำหรับ**: ${persona.name}  
 **📊 ความเชื่อมั่น**: สูง | **🔄 สถานะ**: Demo Mode (FIXED)
 **✅ Status**: No naming conflicts`;
        }
        
        /**
         * Generate Mock Sources
         */
        generateMockSources() {
            return [
                { name: 'ธนาคารแห่งประเทศไทย', url: 'https://www.bot.or.th', trust: 'high' },
                { name: 'หอการค้าไทย', url: 'https://www.thaichamber.org', trust: 'high' },
                { name: 'กระทรวงพาณิชย์', url: 'https://www.moc.go.th', trust: 'high' },
                { name: 'สำนักงานสถิติแห่งชาติ', url: 'https://www.nso.go.th', trust: 'high' }
            ];
        }
        
        /**
         * Show Progress
         */
        showProgress() {
            const formContainer = document.querySelector('.research-form-container');
            const progressContainer = document.getElementById('researchProgress');
            
            if (formContainer) formContainer.style.display = 'none';
            if (progressContainer) progressContainer.style.display = 'block';
            
            // Reset progress
            this.updateProgress(0, 'เริ่มต้นการวิจัย...');
            this.updateProgressSteps(1);
            
            console.log('📊 Showing research progress');
        }
        
        /**
         * Hide Progress
         */
        hideProgress() {
            const formContainer = document.querySelector('.research-form-container');
            const progressContainer = document.getElementById('researchProgress');
            
            if (formContainer) formContainer.style.display = 'block';
            if (progressContainer) progressContainer.style.display = 'none';
        }
        
        /**
         * Simulate Progress
         */
        async simulateProgress(steps) {
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                
                this.updateProgressSteps(step.step);
                this.updateProgress((i + 1) * 33, step.text);
                
                // Add sources gradually
                if (step.step === 1) {
                    await this.addMockSources();
                }
                
                await this.delay(step.duration);
            }
            
            this.updateProgress(100, 'การวิจัยเสร็จสมบูรณ์!');
            await this.delay(500);
        }
        
        /**
         * Update Progress
         */
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
        
        /**
         * Update Progress Steps
         */
        updateProgressSteps(activeStep) {
            const steps = document.querySelectorAll('.progress-steps .step');
            steps.forEach((step, index) => {
                if (index + 1 <= activeStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }
        
        /**
         * Add Mock Sources
         */
        async addMockSources() {
            const sourcesList = document.getElementById('sourcesList');
            if (!sourcesList) return;
            
            const sources = this.generateMockSources();
            
            for (const source of sources) {
                const sourceItem = document.createElement('div');
                sourceItem.className = 'source-item';
                sourceItem.innerHTML = `
                    <span class="source-name">${source.name}</span>
                    <span class="trust-badge trust-${source.trust}">
                        ${source.trust === 'high' ? 'เชื่อถือได้สูง' : 'เชื่อถือได้ปานกลาง'}
                    </span>
                `;
                sourcesList.appendChild(sourceItem);
                
                await this.delay(200);
            }
        }
        
        /**
         * Show Results
         */
        showResults() {
            const progressContainer = document.getElementById('researchProgress');
            const resultsContainer = document.getElementById('researchResults');
            
            if (progressContainer) progressContainer.style.display = 'none';
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                this.populateResults();
            }
            
            // Scroll to results smoothly
            resultsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Show success notification
            this.showNotification('🎉 การวิจัยเสร็จสมบูรณ์! (DEMO)', 'success');
            
            console.log('📊 Showing research results (DEMO)');
        }
        
        /**
         * Populate Results
         */
        populateResults() {
            if (!this.lastResult) return;
            
            // Update header
            const titleEl = document.getElementById('resultsTitle');
            const costEl = document.getElementById('resultsCost');
            const durationEl = document.getElementById('resultsDuration');
            const modelEl = document.getElementById('resultsModel');
            
            if (titleEl) titleEl.textContent = `ผลการวิจัย: ${this.lastResult.query.substring(0, 50)}... (DEMO)`;
            if (costEl) costEl.textContent = `ใช้ ${this.lastResult.cost} credits`;
            if (durationEl) durationEl.textContent = `เวลา ${this.lastResult.duration}`;
            if (modelEl) modelEl.textContent = this.lastResult.model;
            
            // Update content
            const contentEl = document.getElementById('resultsText');
            if (contentEl) {
                contentEl.innerHTML = this.formatResultContent(this.lastResult.content);
            }
            
            // Update sources
            const sourcesEl = document.getElementById('resultsSources');
            if (sourcesEl && this.lastResult.sources) {
                sourcesEl.innerHTML = this.lastResult.sources.map(source => `
                    <div class="source-card">
                        <div class="source-title">${source.name}</div>
                        <div class="source-url">${source.url}</div>
                    </div>
                `).join('');
            }
        }
        
        /**
         * Format Result Content
         */
        formatResultContent(content) {
            // Convert markdown-like syntax to HTML
            return content
                .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^\*\*(.+)\*\*$/gm, '<strong>$1</strong>')
                .replace(/^\*\*(.+)\*\*:/gm, '<strong>$1:</strong>')
                .replace(/^(\d+)\. \*\*(.+)\*\* - (.+)$/gm, '<li><strong>$2</strong> - $3</li>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(.+)$/gm, '<p>$1</p>')
                .replace(/<p><h/g, '<h')
                .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
                .replace(/<p><li>/g, '<ul><li>')
                .replace(/<\/li><\/p>/g, '</li></ul>');
        }
        
        /**
         * New Research
         */
        newResearch() {
            // Reset form
            const formContainer = document.querySelector('.research-form-container');
            const progressContainer = document.getElementById('researchProgress');
            const resultsContainer = document.getElementById('researchResults');
            
            if (formContainer) formContainer.style.display = 'block';
            if (progressContainer) progressContainer.style.display = 'none';
            if (resultsContainer) resultsContainer.style.display = 'none';
            
            // Clear query
            const queryInput = document.getElementById('researchQuery');
            if (queryInput) {
                queryInput.value = '';
                queryInput.focus();
            }
            
            // Reset state
            this.currentQuery = '';
            this.lastResult = null;
            this.isProcessing = false;
            
            this.showNotification('เริ่มการวิจัยใหม่', 'info');
        }
        
        /**
         * Cancel Research
         */
        cancelResearch() {
            this.isProcessing = false;
            this.hideProgress();
            this.showNotification('ยกเลิกการวิจัย', 'warning');
        }
        
        /**
         * Export Functions (DEMO)
         */
        exportResults() {
            this.showNotification('กำลังส่งออกผลการวิจัย... (DEMO)', 'info');
            
            setTimeout(() => {
                this.showNotification('ส่งออกสำเร็จ! (DEMO)', 'success');
            }, 2000);
        }
        
        shareWithTeam() {
            this.showNotification('แชร์กับทีมสำเร็จ! (DEMO)', 'success');
        }
        
        /**
         * Event Handlers
         */
        attachEventHandlers() {
            // Start research button
            const startBtn = document.getElementById('startResearchBtn');
            if (startBtn) {
                startBtn.addEventListener('click', () => this.startResearch());
            }
            
            // Character count for query input
            const queryInput = document.getElementById('researchQuery');
            if (queryInput) {
                queryInput.addEventListener('input', (e) => {
                    const charCount = document.querySelector('.char-count');
                    if (charCount) {
                        charCount.textContent = `${e.target.value.length}/10,000`;
                    }
                });
                
                // Enter key to search
                queryInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        this.startResearch();
                    }
                });
            }
            
            // AI Model selection
            document.addEventListener('click', (e) => {
                if (e.target.closest('.model-option')) {
                    const option = e.target.closest('.model-option');
                    const model = option.getAttribute('data-model');
                    if (model) {
                        this.selectAIModel(model);
                    }
                }
            });
            
            console.log('🔗 Event handlers attached');
        }
        
        bindEvents() {
            // Global keyboard shortcuts for AI Research
            document.addEventListener('keydown', (e) => {
                // Ctrl+R for new research (when in AI Research)
                if ((e.ctrlKey || e.metaKey) && e.key === 'r' && this.container) {
                    e.preventDefault();
                    this.newResearch();
                }
            });
        }
        
        setupEventListeners() {
            console.log('🎧 Event listeners setup completed');
        }
        
        updateUI() {
            this.updateCostEstimate();
            this.updateModelSelection();
            console.log('🎨 UI updated');
        }
        
        updateCredits(cost) {
            const creditsElement = document.getElementById('userCredits');
            if (creditsElement) {
                const currentCredits = parseInt(creditsElement.textContent.replace(',', ''));
                const newCredits = Math.max(0, currentCredits - cost);
                creditsElement.textContent = newCredits.toLocaleString();
            }
            
            // Also update header credits if exists
            const headerCredits = document.getElementById('creditsCount');
            if (headerCredits) {
                const currentCredits = parseInt(headerCredits.textContent.replace(',', ''));
                const newCredits = Math.max(0, currentCredits - cost);
                headerCredits.textContent = newCredits.toLocaleString();
            }
        }
        
        /**
         * Utility Functions
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        showNotification(message, type = 'info') {
            if (window.FlowWork && window.FlowWork.showNotification) {
                window.FlowWork.showNotification(message, type);
            } else {
                console.log(`📢 ${type.toUpperCase()}: ${message}`);
            }
        }
        
        getErrorTemplate(error) {
            return `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 24px;">⚠️</div>
                    <h2 style="font-size: 28px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">
                        AI Research Module Error
                    </h2>
                    <p style="color: var(--gray-600); margin: 16px 0 32px; font-size: 16px;">
                        ${error}
                    </p>
                    <button onclick="window.location.reload()" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                        <i class="fas fa-refresh" style="margin-right: 8px;"></i>รีโหลดหน้า
                    </button>
                </div>
            `;
        }
        
        destroy() {
            this.initialized = false;
            this.container = null;
            this.currentQuery = '';
            this.lastResult = null;
            this.isProcessing = false;
            
            console.log('🧠 AI Research Module destroyed');
        }
    }
    
    // ✅ Create single instance with conflict prevention
    if (!window.AIResearch) {
        window.AIResearch = new AIResearchModuleCore();
        console.log('✅ AI Research instance created (FIXED)');
    } else {
        console.log('ℹ️ AI Research instance already exists, using existing one');
    }
    
    // ✅ Alternative naming for compatibility (without conflicts)
    if (!window.Airesearch) {
        window.Airesearch = window.AIResearch;
    }
    
    // ✅ Module Registration with FlowWork System
    if (typeof window.FlowWork !== 'undefined') {
        window.FlowWork.modules = window.FlowWork.modules || {};
        window.FlowWork.modules['ai-research'] = window.AIResearch;
        console.log('✅ AI Research registered with FlowWork (FIXED)');
    }
    
    // ✅ Signal module ready
    if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('aiResearchReady', { 
            detail: { 
                name: 'ai-research', 
                instance: window.AIResearch 
            } 
        }));
        
        window.dispatchEvent(new CustomEvent('moduleReady', { 
            detail: { 
                name: 'ai-research', 
                instance: window.AIResearch 
            } 
        }));
    }
    
    // ✅ Auto-initialization
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🧠 DOM loaded, initializing AI Research (FIXED)...');
        if (window.AIResearch && typeof window.AIResearch.init === 'function') {
            window.AIResearch.init();
        }
    });
    
    console.log('🎯 AI Research Module loaded successfully! (v1.0.4 - NAMING CONFLICTS FIXED)');
    console.log('📋 Features: Full Interface ✅ | Enhanced Demo ✅ | Error Handling ✅ | FlowWork Integration ✅ | No Conflicts ✅');
    
 })();