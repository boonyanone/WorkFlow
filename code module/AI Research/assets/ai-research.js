/**
 * AI Research Module - Complete JavaScript Implementation
 * Version: 1.0.2
 */

console.log('✅ AI Research Script Loading...');

// FlowWork AI Research Class
class FlowWorkAIResearch {
    constructor() {
        this.name = 'AI Research';
        this.initialized = false;
        this.currentModel = 'auto';
        this.currentPersona = null;
        this.isResearching = false;
        this.lastResults = null;
        
        // Default personas
        this.personas = {
            'student': {
                name: 'นักเรียน/นักศึกษา',
                icon: '🎓',
                description: 'สำหรับทำรายงาน การบ้าน และเตรียมสอบ',
                prompt: 'คุณเป็นผู้ช่วยวิจัยสำหรับนักเรียนและนักศึกษา โดยให้ข้อมูลที่เป็นประโยชน์สำหรับการทำรายงาน การบ้าน และการเตรียมสอบ'
            },
            'business': {
                name: 'พนักงานบริษัท',
                icon: '💼',
                description: 'วิเคราะห์ตลาด แผนธุรกิจ และกลยุทธ์องค์กร',
                prompt: 'คุณเป็นที่ปรึกษาธุรกิจที่ช่วยวิเคราะห์ตลาด สร้างแผนธุรกิจ และให้คำแนะนำเชิงกลยุทธ์สำหรับองค์กร'
            },
            'government': {
                name: 'ข้าราชการ',
                icon: '🏛️',
                description: 'รายงานวิชาการ นโยบายสาธารณะ และระเบียบราชการ',
                prompt: 'คุณเป็นผู้เชียวชาญด้านการบริหารราชการ ช่วยจัดทำรายงานวิชาการ วิเคราะห์นโยบายสาธารณะ และให้คำแนะนำเรื่องระเบียบราชการ'
            },
            'researcher': {
                name: 'นักวิจัย',
                icon: '🔬',
                description: 'งานวิจัยเชิงวิชาการ การทบทวนวรรณกรรม และการวิเคราะห์ข้อมูล',
                prompt: 'คุณเป็นผู้ช่วยวิจัยระดับสูง ช่วยในการทำงานวิจัยเชิงวิชาการ การทบทวนวรรณกรรม และการวิเคราะห์ข้อมูลอย่างลึกซึ้ง'
            },
            'general': {
                name: 'บุคคลทั่วไป',
                icon: '👥',
                description: 'คำถามทั่วไป การเงินส่วนตัว และการตัดสินใจในชีวิต',
                prompt: 'คุณเป็นผู้ช่วยส่วนตัวที่เป็นมิตร ช่วยตอบคำถามทั่วไป ให้คำแนะนำด้านการเงินส่วนตัว และช่วยในการตัดสินใจในชีวิตประจำวัน'
            },
            'organization': {
                name: 'องค์กร/SME',
                icon: '🏢',
                description: 'การวางแผนเชิงกลยุทธ์ การจัดการทีมงาน และการเติบโตของธุรกิจ',
                prompt: 'คุณเป็นที่ปรึกษาระดับผู้บริหารสำหรับองค์กรและ SME ช่วยในการวางแผนเชิงกลยุทธ์ การจัดการทีมงาน และการขับเคลื่อนการเติบโตของธุรกิจ'
            }
        };
        
        // Model costs
        this.modelCosts = {
            'auto': 6,
            'gpt-4': 8,
            'claude': 5,
            'gemini': 2,
            'typhoon': 3
        };
    }
    
    init() {
        console.log('🧠 AI Research Module initializing...');
        
        try {
            this.loadPersonas();
            this.setupEventListeners();
            this.updateCostEstimate();
            this.initialized = true;
            
            console.log('✅ AI Research Module initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ AI Research initialization error:', error);
            return false;
        }
    }
    
    loadPersonas() {
        const personaGrid = document.getElementById('personaGrid');
        if (!personaGrid) return;
        
        let html = '';
        for (const [key, persona] of Object.entries(this.personas)) {
            html += `
                <div class="persona-card" data-persona="${key}" onclick="AIResearch.selectPersona('${key}')">
                    <div class="persona-icon">${persona.icon}</div>
                    <div class="persona-info">
                        <h4>${persona.name}</h4>
                        <p>${persona.description}</p>
                    </div>
                </div>
            `;
        }
        personaGrid.innerHTML = html;
        
        // Select first persona by default
        this.selectPersona('student');
    }
    
    setupEventListeners() {
        // Model selection
        document.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const model = e.currentTarget.dataset.model;
                this.selectModel(model);
            });
        });
        
        // Query textarea character count
        const queryInput = document.getElementById('researchQuery');
        if (queryInput) {
            queryInput.addEventListener('input', (e) => {
                this.updateCharacterCount(e.target.value.length);
                this.updateCostEstimate();
            });
        }
        
        // Advanced options toggle
        const advancedToggle = document.querySelector('.advanced-toggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', this.toggleAdvancedOptions);
        }
        
        // Research depth slider
        const depthSlider = document.getElementById('researchDepth');
        if (depthSlider) {
            depthSlider.addEventListener('input', this.updateCostEstimate.bind(this));
        }
    }
    
    selectPersona(personaKey) {
        // Remove active class from all personas
        document.querySelectorAll('.persona-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to selected persona
        const selectedCard = document.querySelector(`[data-persona="${personaKey}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
            this.currentPersona = personaKey;
        }
        
        console.log('Selected persona:', personaKey);
    }
    
    selectModel(model) {
        // Remove active class from all models
        document.querySelectorAll('.model-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected model
        const selectedOption = document.querySelector(`[data-model="${model}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
            this.currentModel = model;
            this.updateCostEstimate();
        }
        
        console.log('Selected model:', model);
    }
    
    updateCharacterCount(count) {
        const charCountElement = document.querySelector('.char-count');
        if (charCountElement) {
            charCountElement.textContent = `${count}/10,000`;
        }
    }
    
    updateCostEstimate() {
        const costElement = document.getElementById('costEstimate');
        if (!costElement) return;
        
        let baseCost = this.modelCosts[this.currentModel] || 6;
        
        // Adjust cost based on research depth
        const depthSlider = document.getElementById('researchDepth');
        if (depthSlider) {
            const depth = parseInt(depthSlider.value);
            const multiplier = 0.7 + (depth * 0.15); // 0.85x to 1.55x
            baseCost = Math.round(baseCost * multiplier);
        }
        
        if (this.currentModel === 'auto') {
            costElement.textContent = `${baseCost-2}-${baseCost+2} credits`;
        } else {
            costElement.textContent = `${baseCost} credits`;
        }
    }
    
    toggleAdvancedOptions() {
        const advancedOptions = document.getElementById('advancedOptions');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        if (advancedOptions && toggleIcon) {
            advancedOptions.classList.toggle('show');
            toggleIcon.classList.toggle('rotated');
        }
    }
    
    useSuggestion(suggestion) {
        const queryInput = document.getElementById('researchQuery');
        if (queryInput) {
            queryInput.value = suggestion;
            this.updateCharacterCount(suggestion.length);
            this.updateCostEstimate();
            queryInput.focus();
        }
    }
    
    async startResearch() {
        const query = document.getElementById('researchQuery')?.value?.trim();
        
        if (!query) {
            alert('กรุณาใส่คำถามหรือหัวข้อที่ต้องการวิจัย');
            return;
        }
        
        if (!this.currentPersona) {
            alert('กรุณาเลือก Persona');
            return;
        }
        
        console.log('🚀 Starting AI Research...');
        console.log('Query:', query);
        console.log('Persona:', this.currentPersona);
        console.log('Model:', this.currentModel);
        
        try {
            this.isResearching = true;
            this.showProgressScreen();
            
            // Check if real API is available, otherwise simulate
            const hasAPIKey = await this.checkAPIAvailability();
            
            if (hasAPIKey) {
                await this.performRealResearch(query);
            } else {
                console.log('📝 No API keys configured, using simulation');
                await this.simulateResearch(query);
            }
            
        } catch (error) {
            console.error('Research error:', error);
            alert('เกิดข้อผิดพลาดในการวิจัย กรุณาลองใหม่อีกครั้ง');
            this.hideProgressScreen();
        } finally {
            this.isResearching = false;
        }
    }
    
    showProgressScreen() {
        const formContainer = document.querySelector('.research-form-container');
        const progressContainer = document.getElementById('researchProgress');
        
        if (formContainer) formContainer.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'block';
        
        // Disable start button
        const startBtn = document.getElementById('startResearchBtn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังวิจัย...';
        }
    }
    
    hideProgressScreen() {
        const formContainer = document.querySelector('.research-form-container');
        const progressContainer = document.getElementById('researchProgress');
        
        if (formContainer) formContainer.style.display = 'block';
        if (progressContainer) progressContainer.style.display = 'none';
        
        // Enable start button
        const startBtn = document.getElementById('startResearchBtn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fas fa-rocket"></i> เริ่มวิจัยด้วย AI';
        }
    }
    
    async simulateResearch(query) {
        const steps = [
            { text: 'กำลังค้นหาแหล่งข้อมูล...', progress: 20 },
            { text: 'พบแหล่งข้อมูล 12 แหล่ง', progress: 40 },
            { text: 'กำลังประมวลผลด้วย AI...', progress: 60 },
            { text: 'กำลังจัดรูปแบบผลลัพธ์...', progress: 80 },
            { text: 'เสร็จสิ้น!', progress: 100 }
        ];
        
        for (const step of steps) {
            await this.updateProgress(step.text, step.progress);
            await this.delay(800 + Math.random() * 400); // Random delay 800-1200ms
        }
        
        // Show mock results
        this.showResults(query);
    }
    
    async updateProgress(text, progress) {
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        
        if (progressText) progressText.textContent = text;
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        // Update step indicators
        const steps = document.querySelectorAll('.progress-steps .step');
        steps.forEach((step, index) => {
            if (progress >= (index + 1) * 33) {
                step.classList.add('completed');
            }
        });
    }
    
    showResults(query) {
        const progressContainer = document.getElementById('researchProgress');
        const resultsContainer = document.getElementById('researchResults');
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'block';
        
        // Mock research results
        const mockResults = this.generateMockResults(query);
        
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsText = document.getElementById('resultsText');
        const resultsCost = document.getElementById('resultsCost');
        const resultsModel = document.getElementById('resultsModel');
        const resultsDuration = document.getElementById('resultsDuration');
        
        if (resultsTitle) resultsTitle.textContent = `ผลการวิจัย: ${query}`;
        if (resultsText) resultsText.innerHTML = mockResults;
        if (resultsCost) resultsCost.textContent = `ใช้ ${this.modelCosts[this.currentModel]} credits`;
        if (resultsModel) resultsModel.textContent = this.currentModel.toUpperCase();
        if (resultsDuration) resultsDuration.textContent = 'เวลา 2.3 นาที';
        
        this.lastResults = {
            query,
            content: mockResults,
            cost: this.modelCosts[this.currentModel],
            model: this.currentModel,
            timestamp: new Date()
        };
    }
    
    generateMockResults(query) {
        return `
            <div class="research-summary">
                <h4>📋 สรุปผลการวิจัย</h4>
                <p>จากการวิจัยเรื่อง "${query}" โดยใช้ AI Model ${this.currentModel.toUpperCase()} และ Persona ${this.personas[this.currentPersona].name}</p>
                
                <h4>🔍 ข้อมูลสำคัญ</h4>
                <ul>
                    <li>ข้อมูลจากแหล่งที่เชื่อถือได้ 12 แหล่ง</li>
                    <li>การวิเคราะห์เชิงลึกตามบทบาท ${this.personas[this.currentPersona].name}</li>
                    <li>ข้อมูลอัพเดทล่าสุดจากปี 2024-2025</li>
                </ul>
                
                <h4>📊 ผลการวิเคราะห์</h4>
                <p>นี่คือตัวอย่างผลการวิจัยที่จะถูกสร้างโดย AI จริง เมื่อเชื่อมต่อกับ API แล้ว ผลลัพธ์จะมีความละเอียดและแม่นยำมากขึ้น พร้อมการอ้างอิงแหล่งที่มาที่ชัดเจน</p>
                
                <div class="next-steps">
                    <h4>🎯 ขั้นตอนต่อไป</h4>
                    <ol>
                        <li>ทบทวนข้อมูลที่ได้รับ</li>
                        <li>เปรียบเทียบกับแหล่งข้อมูลเพิ่มเติม</li>
                        <li>นำไปประยุกต์ใช้ตามวัตถุประสงค์</li>
                    </ol>
                </div>
            </div>
        `;
    }
    
    cancelResearch() {
        if (this.isResearching) {
            this.isResearching = false;
            this.hideProgressScreen();
            console.log('Research cancelled by user');
        }
    }
    
    newResearch() {
        const resultsContainer = document.getElementById('researchResults');
        const formContainer = document.querySelector('.research-form-container');
        
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (formContainer) formContainer.style.display = 'block';
        
        // Clear previous query
        const queryInput = document.getElementById('researchQuery');
        if (queryInput) {
            queryInput.value = '';
            this.updateCharacterCount(0);
        }
        
        this.updateCostEstimate();
    }
    
    exportResults() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.style.display = 'block';
        }
    }
    
    closeExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.style.display = 'none';
        }
    }
    
    exportTo(format) {
        console.log(`Exporting to ${format}...`);
        alert(`การส่งออกไปยัง ${format} จะพร้อมใช้งานเมื่อระบบเสร็จสมบูรณ์`);
        this.closeExportModal();
    }
    
    shareWithTeam() {
        const teamModal = document.getElementById('teamModal');
        if (teamModal) {
            teamModal.style.display = 'block';
        }
    }
    
    closeTeamModal() {
        const teamModal = document.getElementById('teamModal');
        if (teamModal) {
            teamModal.style.display = 'none';
        }
    }
    
    addTeamMember() {
        const emailInput = document.getElementById('memberEmail');
        const membersList = document.getElementById('membersList');
        
        if (emailInput && membersList && emailInput.value.trim()) {
            const email = emailInput.value.trim();
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member-item';
            memberDiv.innerHTML = `
                <span>${email}</span>
                <button onclick="this.parentElement.remove()" class="remove-member">
                    <i class="fas fa-times"></i>
                </button>
            `;
            membersList.appendChild(memberDiv);
            emailInput.value = '';
        }
    }
    
    createTeam() {
        const teamName = document.getElementById('teamName')?.value?.trim();
        
        if (!teamName) {
            alert('กรุณาใส่ชื่อทีม');
            return;
        }
        
        console.log('Creating team:', teamName);
        alert('การสร้างทีมจะพร้อมใช้งานเมื่อระบบเสร็จสมบูรณ์');
        this.closeTeamModal();
    }
    
    async checkAPIAvailability() {
        try {
            const response = await fetch(this.getAPIEndpoint('status'));
            const result = await response.json();
            
            if (result.success && result.data.providers) {
                return Object.keys(result.data.providers).length > 0;
            }
            return false;
        } catch (error) {
            console.log('API check failed:', error);
            return false;
        }
    }
    
    async performRealResearch(query) {
        try {
            // Update progress
            await this.updateProgress('กำลังเตรียมข้อมูล...', 10);
            
            // Get research options
            const options = this.getResearchOptions();
            
            // Prepare request data
            const requestData = {
                query: query,
                persona: this.currentPersona,
                model: this.currentModel,
                depth: options.depth,
                language: options.language,
                temperature: 0.7,
                max_tokens: 2000,
                sources: options.sources
            };
            
            await this.updateProgress('กำลังส่งคำขอไปยัง AI...', 30);
            
            // Make API call
            const response = await fetch(this.getAPIEndpoint('research'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            await this.updateProgress('กำลังรอผลตอบกลับ...', 60);
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API request failed');
            }
            
            await this.updateProgress('กำลังประมวลผลลัพธ์...', 90);
            await this.delay(500);
            
            await this.updateProgress('เสร็จสิ้น!', 100);
            
            // Show results
            this.showRealResults(query, result.data);
            
        } catch (error) {
            console.error('Real research error:', error);
            
            // Fallback to simulation
            console.log('Falling back to simulation...');
            await this.simulateResearch(query);
        }
    }
    
    getResearchOptions() {
        const depthSlider = document.getElementById('researchDepth');
        const languageSelect = document.getElementById('outputLanguage');
        const sourceCheckboxes = document.querySelectorAll('.source-checkboxes input[type="checkbox"]');
        
        const depth = depthSlider ? parseInt(depthSlider.value) : 3;
        const language = languageSelect ? languageSelect.value : 'thai';
        
        const sources = [];
        sourceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                sources.push(checkbox.closest('label').textContent.trim().split(' ')[0]);
            }
        });
        
        return { depth, language, sources };
    }
    
    getAPIEndpoint(action) {
        // Try to get base URL from current page
        const currentURL = window.location.href;
        const basePath = currentURL.substring(0, currentURL.lastIndexOf('/'));
        
        // Different possible paths where the API might be
        const possiblePaths = [
            '/modules/installed/ai-research/api-endpoints.php',
            '/code module/AI Research/api-endpoints.php',
            '/wp-admin/admin-ajax.php'
        ];
        
        // For now, use the direct path
        return `${basePath}/code module/AI Research/api-endpoints.php?action=${action}`;
    }
    
    showRealResults(query, data) {
        const progressContainer = document.getElementById('researchProgress');
        const resultsContainer = document.getElementById('researchResults');
        
        if (progressContainer) progressContainer.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'block';
        
        // Update results display
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsText = document.getElementById('resultsText');
        const resultsCost = document.getElementById('resultsCost');
        const resultsModel = document.getElementById('resultsModel');
        const resultsDuration = document.getElementById('resultsDuration');
        const resultsSources = document.getElementById('resultsSources');
        
        if (resultsTitle) resultsTitle.textContent = `ผลการวิจัย: ${query}`;
        if (resultsText) resultsText.innerHTML = this.formatAIContent(data.content);
        if (resultsCost) resultsCost.textContent = `ใช้ ${data.cost} credits`;
        if (resultsModel) resultsModel.textContent = `${data.provider.toUpperCase()} (${data.model})`;
        if (resultsDuration) resultsDuration.textContent = 'เวลา 2.3 นาที';
        
        // Update sources
        if (resultsSources && data.sources) {
            let sourcesHTML = '';
            data.sources.forEach(source => {
                const trustClass = source.trust === 'high' ? 'high-trust' : 'medium-trust';
                sourcesHTML += `
                    <div class="source-item ${trustClass}">
                        <h5>${source.title}</h5>
                        <a href="${source.url}" target="_blank">${source.url}</a>
                        <span class="trust-badge">${source.trust === 'high' ? 'เชื่อถือได้สูง' : 'เชื่อถือได้ปานกลาง'}</span>
                    </div>
                `;
            });
            resultsSources.innerHTML = sourcesHTML;
        }
        
        // Update user credits display
        if (data.remaining_credits !== undefined) {
            const creditsDisplay = document.getElementById('userCredits');
            if (creditsDisplay) {
                creditsDisplay.textContent = data.remaining_credits.toLocaleString();
            }
        }
        
        this.lastResults = {
            query,
            content: data.content,
            cost: data.cost,
            model: data.model,
            provider: data.provider,
            timestamp: new Date()
        };
    }
    
    formatAIContent(content) {
        // Basic formatting for AI-generated content
        let formatted = content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
            
        // Wrap in paragraph tags
        if (!formatted.startsWith('<p>')) {
            formatted = '<p>' + formatted + '</p>';
        }
        
        return formatted;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    render(container) {
        // This method is for compatibility with the module system
        if (!container) return false;
        
        // Module content will be rendered by PHP template
        return true;
    }
}

// Create global instance
window.AIResearch = new FlowWorkAIResearch();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.AIResearch && !window.AIResearch.initialized) {
        window.AIResearch.init();
    }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    if (window.AIResearch && !window.AIResearch.initialized) {
        window.AIResearch.init();
    }
}

// Signal module is ready
window.dispatchEvent(new CustomEvent('aiResearchReady', { 
    detail: { 
        name: 'ai-research', 
        instance: window.AIResearch,
        version: '1.0.2'
    } 
}));

console.log('✅ AI Research Script Loaded Successfully!');