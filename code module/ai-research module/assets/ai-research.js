/**
 * AI Research Module JavaScript
 * Handles UI interactions and API communication
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

class AIResearchInterface {
    constructor() {
        this.selectedPersona = 'researcher';
        this.currentResearch = null;
        this.researchInProgress = false;
        this.apiBaseUrl = '/modules/installed/ai-research/api/';
        
        this.init();
    }
    
    init() {
        console.log('🧠 AI Research Interface initializing...');
        
        // Initialize UI components
        this.initPersonaSelection();
        this.initResearchForm();
        this.initCostCalculator();
        this.loadCreditBalance();
        
        console.log('✅ AI Research Interface ready!');
    }
    
    initPersonaSelection() {
        const personaCards = document.querySelectorAll('.persona-card');
        
        // Set default selection
        document.querySelector('[data-persona="researcher"]')?.classList.add('selected');
        
        personaCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove previous selection
                personaCards.forEach(c => c.classList.remove('selected'));
                
                // Add selection to clicked card
                card.classList.add('selected');
                this.selectedPersona = card.dataset.persona;
                
                console.log('🎭 Persona selected:', this.selectedPersona);
                
                // Update cost calculation
                this.updateCostEstimate();
            });
        });
    }
    
    initResearchForm() {
        const startBtn = document.getElementById('startResearchBtn');
        const cancelBtn = document.getElementById('cancelResearchBtn');
        const topicInput = document.getElementById('researchTopic');
        const depthSelect = document.getElementById('researchDepth');
        const languageSelect = document.getElementById('researchLanguage');
        const providerSelect = document.getElementById('aiProvider');
        
        // Start research button
        startBtn?.addEventListener('click', () => {
            this.startResearch();
        });
        
        // Cancel research button
        cancelBtn?.addEventListener('click', () => {
            this.cancelResearch();
        });
        
        // Update cost when options change
        [depthSelect, languageSelect, providerSelect].forEach(element => {
            element?.addEventListener('change', () => {
                this.updateCostEstimate();
            });
        });
        
        // Enable/disable start button based on input
        topicInput?.addEventListener('input', () => {
            const hasContent = topicInput.value.trim().length > 0;
            startBtn.disabled = !hasContent;
            
            if (hasContent) {
                startBtn.classList.remove('disabled');
            } else {
                startBtn.classList.add('disabled');
            }
        });
    }
    
    initCostCalculator() {
        this.updateCostEstimate();
    }
    
    updateCostEstimate() {
        const depth = document.getElementById('researchDepth')?.value || 'detailed';
        const language = document.getElementById('researchLanguage')?.value || 'th';
        const provider = document.getElementById('aiProvider')?.value || 'auto';
        
        // Calculate cost based on options
        let credits = 5; // Base cost
        
        switch (depth) {
            case 'basic':
                credits = 5;
                break;
            case 'detailed':
                credits = 8;
                break;
            case 'comprehensive':
                credits = 12;
                break;
        }
        
        // Language multiplier
        if (language === 'both') {
            credits = Math.ceil(credits * 1.5);
        }
        
        // Provider adjustment
        if (provider === 'claude') {
            credits = Math.ceil(credits * 1.2);
        }
        
        // Update UI
        const costElement = document.getElementById('estimatedCost');
        const costBaht = credits * 1.60;
        
        if (costElement) {
            costElement.textContent = `${credits} credits`;
        }
        
        const costBahtElement = document.querySelector('.cost-baht');
        if (costBahtElement) {
            costBahtElement.textContent = `(≈ ฿${costBaht.toFixed(2)})`;
        }
    }
    
    async loadCreditBalance() {
        try {
            const response = await fetch(`${this.apiBaseUrl}credit-calculator.php?action=get_balance`);
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('creditBalance').textContent = data.balance;
            } else {
                document.getElementById('creditBalance').textContent = '0';
            }
        } catch (error) {
            console.error('Failed to load credit balance:', error);
            document.getElementById('creditBalance').textContent = '...';
        }
    }
    
    async startResearch() {
        if (this.researchInProgress) return;
        
        // Get form data
        const topic = document.getElementById('researchTopic')?.value.trim();
        const details = document.getElementById('researchDetails')?.value.trim();
        const depth = document.getElementById('researchDepth')?.value;
        const language = document.getElementById('researchLanguage')?.value;
        const provider = document.getElementById('aiProvider')?.value;
        
        // Validation
        if (!topic) {
            this.showAlert('กรุณากรอกหัวข้อวิจัย', 'warning');
            return;
        }
        
        // Show progress
        this.showResearchProgress();
        this.researchInProgress = true;
        
        // Prepare research data
        const researchData = {
            topic: topic,
            details: details,
            persona: this.selectedPersona,
            depth: depth,
            language: language,
            provider: provider
        };
        
        try {
            console.log('🚀 Starting research:', researchData);
            
            // Start research process
            await this.processResearch(researchData);
            
        } catch (error) {
            console.error('Research failed:', error);
            this.showAlert('การวิจัยล้มเหลว: ' + error.message, 'error');
            this.hideResearchProgress();
            this.researchInProgress = false;
        }
    }
    
    async processResearch(data) {
        // Step 1: Analyze topic
        this.updateProgress(1, 'วิเคราะห์หัวข้อวิจัย...', 25);
        await this.delay(1000);
        
        // Step 2: Research
        this.updateProgress(2, 'ค้นหาและรวบรวมข้อมูล...', 50);
        
        const researchResult = await this.callResearchAPI(data);
        
        // Step 3: Synthesize
        this.updateProgress(3, 'สังเคราะห์และวิเคราะห์ผล...', 75);
        await this.delay(1500);
        
        // Step 4: Format
        this.updateProgress(4, 'จัดรูปแบบผลการวิจัย...', 100);
        await this.delay(800);
        
        // Show results
        this.showResearchResults(researchResult);
        this.researchInProgress = false;
    }
    
    async callResearchAPI(data) {
        const response = await fetch(`${this.apiBaseUrl}research-handler.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                action: 'start_research',
                ...data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Unknown error');
        }
        
        return result.data;
    }
    
    showResearchProgress() {
        document.querySelector('.research-input-section').style.display = 'none';
        document.getElementById('researchProgress').style.display = 'block';
        document.getElementById('researchResults').style.display = 'none';
        
        // Reset progress
        this.updateProgress(1, 'เริ่มต้นการวิจัย...', 0);
    }
    
    hideResearchProgress() {
        document.querySelector('.research-input-section').style.display = 'block';
        document.getElementById('researchProgress').style.display = 'none';
    }
    
    updateProgress(step, text, percentage) {
        // Update steps
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            
            if (index < step - 1) {
                stepEl.classList.add('completed');
            } else if (index === step - 1) {
                stepEl.classList.add('active');
            }
        });
        
        // Update text and progress bar
        document.getElementById('progressText').textContent = text;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }
    
    showResearchResults(data) {
        document.getElementById('researchProgress').style.display = 'none';
        
        const resultsContainer = document.getElementById('researchResults');
        resultsContainer.innerHTML = this.buildResultsHTML(data);
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('fade-in-up');
        
        // Initialize export buttons
        this.initExportButtons();
        
        // Update credit balance
        this.loadCreditBalance();
    }
    
    buildResultsHTML(data) {
        return `
            <div class="results-header">
                <h3><i class="fas fa-check-circle"></i> ผลการวิจัย</h3>
                <div class="results-actions">
                    <button class="btn-secondary" onclick="aiResearch.startNewResearch()">
                        <i class="fas fa-plus"></i> วิจัยใหม่
                    </button>
                    <button class="btn-secondary" onclick="aiResearch.shareResults()">
                        <i class="fas fa-share"></i> แชร์
                    </button>
                </div>
            </div>
            
            <div class="results-content">
                <div class="result-section">
                    <h4><i class="fas fa-lightbulb"></i> สรุปผลการวิจัย</h4>
                    <div class="result-text">${data.summary || 'ไม่มีข้อมูลสรุป'}</div>
                </div>
                
                <div class="result-section">
                    <h4><i class="fas fa-file-alt"></i> รายละเอียดการวิจัย</h4>
                    <div class="result-text">${data.content || 'ไม่มีเนื้อหา'}</div>
                </div>
                
                <div class="result-section">
                    <h4><i class="fas fa-link"></i> แหล่งข้อมูลอ้างอิง</h4>
                    <div class="result-text">${this.formatSources(data.sources)}</div>
                </div>
                
                <div class="export-options">
                    <h5>ส่งออกผลการวิจัย</h5>
                    <div class="export-buttons">
                        <button class="export-btn" data-format="word">
                            <i class="fas fa-file-word"></i> Word Document
                        </button>
                        <button class="export-btn" data-format="pdf">
                            <i class="fas fa-file-pdf"></i> PDF File
                        </button>
                        <button class="export-btn" data-format="html">
                            <i class="fas fa-code"></i> HTML Page
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    formatSources(sources) {
        if (!sources || sources.length === 0) {
            return 'ไม่มีแหล่งข้อมูลอ้างอิง';
        }
        
        return sources.map((source, index) => 
            `${index + 1}. <a href="${source.url}" target="_blank">${source.title}</a>`
        ).join('<br>');
    }
    
    initExportButtons() {
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.exportResults(format);
            });
        });
    }
    
    async exportResults(format) {
        try {
            const response = await fetch(`${this.apiBaseUrl}export-manager.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'export',
                    format: format,
                    research_id: this.currentResearch?.id
                })
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `research-results.${format === 'word' ? 'docx' : format}`;
                a.click();
                window.URL.revokeObjectURL(url);
                
                this.showAlert('ส่งออกเรียบร้อยแล้ว', 'success');
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showAlert('การส่งออกล้มเหลว', 'error');
        }
    }
    
    cancelResearch() {
        if (this.currentResearch) {
            // Cancel API request
            // Implementation depends on API design
        }
        
        this.researchInProgress = false;
        this.hideResearchProgress();
        this.showAlert('ยกเลิกการวิจัยแล้ว', 'info');
    }
    
    startNewResearch() {
        document.getElementById('researchResults').style.display = 'none';
        document.querySelector('.research-input-section').style.display = 'block';
        
        // Clear form
        document.getElementById('researchTopic').value = '';
        document.getElementById('researchDetails').value = '';
        
        // Reset to defaults
        document.getElementById('researchDepth').value = 'detailed';
        document.getElementById('researchLanguage').value = 'th';
        document.getElementById('aiProvider').value = 'auto';
       
       // Update cost estimate
       this.updateCostEstimate();
       
       this.showAlert('เริ่มการวิจัยใหม่', 'info');
   }
   
   shareResults() {
       if (navigator.share) {
           navigator.share({
               title: 'ผลการวิจัย - FlowWork AI',
               text: 'ผลการวิจัยจาก FlowWork AI Research Assistant',
               url: window.location.href
           });
       } else {
           // Fallback: copy to clipboard
           const url = window.location.href;
           navigator.clipboard.writeText(url).then(() => {
               this.showAlert('คัดลอกลิงก์แล้ว', 'success');
           });
       }
   }
   
   showAlert(message, type = 'info') {
       // Use FlowWork notification system if available
       if (window.admin && window.admin.showNotification) {
           window.admin.showNotification(message, type);
       } else {
           // Fallback alert
           alert(message);
       }
   }
   
   delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
   }
}

// Initialize when DOM is ready
let aiResearch;
document.addEventListener('DOMContentLoaded', function() {
   if (document.querySelector('.ai-research-container')) {
       aiResearch = new AIResearchInterface();
       window.aiResearch = aiResearch; // Make globally accessible
   }
});

// Export for module system
window.AIResearchInterface = AIResearchInterface;

console.log('🧠 AI Research JavaScript loaded');