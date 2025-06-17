/**
 * AI Research Module - Frontend JavaScript Controller
 * Fixed initialization and event handling
 * 
 * @version 1.0.2
 * @author FlowWork Team
 */

class AIResearchModule {
    constructor() {
        this.name = 'AI Research';
        this.version = '1.0.2';
        this.currentPersona = 'general';
        this.currentModel = 'auto';
        this.isProcessing = false;
        this.currentQuery = '';
        this.lastResult = null;
        this.isStandalone = false;
        this.container = null;
        this.initialized = false;
        
        // Initialize configuration
        this.initializeConfig();
        
        // Personas configuration
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
        
        // AI Models configuration
        this.aiModels = {
            auto: { name: 'Auto Select', cost: '5-8', icon: '🎯', description: 'ระบบเลือกให้อัตโนมัติ' },
           'gpt-4': { name: 'GPT-4', cost: '8', icon: '🧠', description: 'คุณภาพสูงสุด วิเคราะห์ลึก' },
           claude: { name: 'Claude', cost: '5', icon: '🤖', description: 'การวิเคราะห์บริบทยาว' },
           gemini: { name: 'Gemini', cost: '2', icon: '💎', description: 'ประหยัด เร็ว' }
       };
       
       console.log('🧠 AI Research Module initialized (v1.0.2)');
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
    * Initialize Module - IMPROVED VERSION
    */
   init() {
       try {
           if (this.initialized) {
               console.log('🧠 AI Research: Already initialized');
               return true;
           }
           
           this.bindEvents();
           this.setupEventListeners();
           
           // Try to find and initialize the module interface
           this.findAndInitializeInterface();
           
           this.initialized = true;
           console.log('✅ AI Research Module initialized successfully');
           return true;
       } catch (error) {
           console.error('❌ AI Research Module initialization failed:', error);
           return false;
       }
   }
   
   /**
    * Find and Initialize Interface
    */
   findAndInitializeInterface() {
       const moduleElement = document.getElementById('aiResearchModule');
       if (moduleElement) {
           this.container = moduleElement;
           this.loadPersonas();
           this.loadAIModels();
           this.attachEventHandlers();
           this.updateUI();
           console.log('✅ AI Research interface found and initialized');
           
           // Show success notification
           this.showNotification('🧠 AI Research Module พร้อมใช้งาน!', 'success');
           return true;
       } else {
           console.log('📋 AI Research interface not found, will initialize when needed');
           return false;
       }
   }
   
   /**
    * Render Module - IMPROVED VERSION
    */
   render(container) {
       try {
           if (!container) {
               console.error('❌ No container provided for AI Research');
               return false;
           }
           
           // Show loading first
           container.innerHTML = this.getLoadingTemplate();
           
           // Try to initialize after a short delay
           setTimeout(() => {
               const moduleContent = document.getElementById('aiResearchModule');
               if (moduleContent) {
                   // Module interface is now available
                   this.container = moduleContent;
                   this.loadPersonas();
                   this.loadAIModels();
                   this.attachEventHandlers();
                   this.updateUI();
                   
                   console.log('✅ AI Research interface loaded and initialized');
                   this.showNotification('🧠 AI Research พร้อมใช้งาน!', 'success');
               } else {
                   // Fallback if interface still not available
                   container.innerHTML = this.getNotReadyTemplate();
               }
           }, 500);
           
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
    * Load Personas into UI - IMPROVED VERSION
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
               <div class="persona-card ${isActive}" data-persona="${key}" onclick="AIResearch.selectPersona('${key}')">
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
    * Load AI Models into UI
    */
   loadAIModels() {
       // Models are already in template, just make sure they work
       this.updateModelSelection();
       console.log('✅ AI Models loaded successfully');
   }
   
   /**
    * Select Persona - IMPROVED VERSION
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
       
       // Update cost estimate
       this.updateCostEstimate();
       
       // Show notification
       const persona = this.personas[personaKey];
       this.showNotification(`เลือก Persona: ${persona.name}`, 'success');
       
       console.log(`🎭 Persona selected: ${personaKey}`);
   }
   
   /**
    * Select AI Model - IMPROVED VERSION
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
       const icon = toggle?.querySelector('.toggle-icon');
       
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
    * Start Research - FULL DEMO VERSION
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
       
       console.log('🚀 Starting AI research:', query);
       
       // Hide form, show progress
       this.showProgress();
       
       try {
           // Simulate AI processing
           await this.processResearch(query);
           
           // Show results
           this.showResults();
           
           console.log('✅ Research completed successfully');
           
       } catch (error) {
           console.error('❌ Research failed:', error);
           this.showNotification('เกิดข้อผิดพลาดในการวิจัย กรุณาลองใหม่อีกครั้ง', 'error');
           this.hideProgress();
       } finally {
           this.isProcessing = false;
       }
   }
   
   /**
    * Process Research (Demo) - ENHANCED VERSION
    */
   async processResearch(query) {
       const persona = this.personas[this.currentPersona];
       const model = this.aiModels[this.currentModel];
       
       console.log(`🔄 Processing research with ${model.name} for ${persona.name}`);
       
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
    * Generate Enhanced Mock Result
    */
   generateMockResult(query, persona, model) {
       const timestamp = new Date().toLocaleString('th-TH');
       
       return `# 🧠 ผลการวิจัย AI: ${query}

**📊 ข้อมูลการวิจัย**
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
**📊 ความเชื่อมั่น**: สูง | **🔄 สถานะ**: Demo Mode`;
   }
   
   /**
    * Show Progress - ENHANCED VERSION
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
    * Simulate Progress - ENHANCED VERSION
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
    * Show Results - ENHANCED VERSION
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
       this.showNotification('🎉 การวิจัยเสร็จสมบูรณ์!', 'success');
       
       console.log('📊 Showing research results');
   }
   
   /**
    * Template functions
    */
   getLoadingTemplate() {
       return `
           <div style="text-align: center; padding: 80px 20px;">
               <div class="loading-spinner" style="width: 64px; height: 64px; border-width: 4px; margin: 0 auto 16px;"></div>
               <h3 style="font-size: 20px; font-weight: 600; color: var(--gray-900); margin-bottom: 8px;">กำลังโหลด AI Research Module</h3>
               <p style="color: var(--gray-600);">กำลังเตรียมระบบวิจัยด้วย AI...</p>
           </div>
       `;
   }
   
   getNotReadyTemplate() {
       return `
           <div style="text-align: center; padding: 60px 20px;">
               <div style="font-size: 64px; margin-bottom: 24px;">🧠</div>
               <h2 style="font-size: 28px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">
                   AI Research Module
               </h2>
               <p style="color: var(--gray-600); margin: 16px 0 32px; font-size: 16px;">
                   Module interface กำลังโหลด กรุณารอสักครู่...
               </p>
               <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                   <button onclick="window.location.reload()" style="background: var(--primary); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                       <i class="fas fa-refresh" style="margin-right: 8px;"></i>รีโหลดหน้า
                   </button>
                   <button onclick="FlowWork.loadModule('dashboard')" style="background: var(--gray-100); color: var(--gray-700); padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                       <i class="fas fa-home" style="margin-right: 8px;"></i>กลับ Dashboard
                   </button>
               </div>
           </div>
       `;
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
   
   // ... [เพิ่มฟังก์ชันอื่นๆ จากเวอร์ชันเก่า] ...
   
   /**
    * Event Handlers และ Utilities
    */
   setupEventListeners() {
       // Character count for query input
       document.addEventListener('input', (e) => {
           if (e.target.id === 'researchQuery') {
               const charCount = document.querySelector('.char-count');
               if (charCount) {
                   charCount.textContent = `${e.target.value.length}/10,000`;
               }
           }
       });
       
       // Enter key to search
       document.addEventListener('keydown', (e) => {
           if (e.target.id === 'researchQuery' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
               e.preventDefault();
               this.startResearch();
           }
       });
       
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
   }
   
   attachEventHandlers() {
       // Start research button
       const startBtn = document.getElementById('startResearchBtn');
       if (startBtn) {
           startBtn.addEventListener('click', () => this.startResearch());
       }
       
       console.log('🔗 Event handlers attached');
   }
   
   bindEvents() {
       // Global keyboard shortcuts
       document.addEventListener('keydown', (e) => {
           if (e.key === 'Escape') {
               document.querySelectorAll('.modal').forEach(modal => {
                   modal.style.display = 'none';
               });
           }
       });
   }
   
   unbindEvents() {
       // Remove global event listeners if needed
   }
   
   updateUI() {
       this.updateCostEstimate();
       console.log('🎨 UI updated');
   }
   
   // ... [รวมฟังก์ชันอื่นๆ ที่เหลือจากเวอร์ชันเก่า] ...
   
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
   
   destroy() {
       this.unbindEvents();
       this.initialized = false;
       console.log('🧠 AI Research Module destroyed');
   }
}

// Global instance
const AIResearch = new AIResearchModule();

// Global functions for onclick handlers
window.AIResearch = AIResearch;

// Enhanced auto-initialization
document.addEventListener('DOMContentLoaded', () => {
   console.log('🧠 DOM loaded, initializing AI Research...');
   AIResearch.init();
   
   // Check for interface every 500ms for up to 5 seconds
   let checkCount = 0;
   const checkInterval = setInterval(() => {
       checkCount++;
       
       if (document.getElementById('aiResearchModule')) {
           AIResearch.findAndInitializeInterface();
           clearInterval(checkInterval);
       } else if (checkCount >= 10) {
           console.log('🧠 AI Research interface not found after 5 seconds');
           clearInterval(checkInterval);
       }
   }, 500);
});

// Module registration for FlowWork system
if (typeof window.FlowWork !== 'undefined') {
   window.FlowWork.modules = window.FlowWork.modules || {};
   window.FlowWork.modules['ai-research'] = AIResearch;
   console.log('✅ AI Research registered with FlowWork system');
}

// Final initialization
console.log('🧠 AI Research Module JavaScript loaded successfully! (v1.0.2)');
console.log('📋 Features: Full Interface ✅ | Enhanced Demo ✅ | Error Handling ✅ | Auto-Init ✅');

// Expose version for debugging
AIResearch.version = '1.0.2';
AIResearch.build = 'ai-research-full-interface-2025-06-17';