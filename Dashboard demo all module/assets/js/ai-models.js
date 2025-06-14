// 🤖 FlowWork AI Models Management
class AIModels {
    constructor() {
        this.currentModel = 'GPT-4';
        this.dropdownOpen = false;
        this.models = {
            'GPT-4': {
                name: 'GPT-4 Turbo',
                price: '฿0.08/query',
                description: 'Complex reasoning',
                icon: 'fas fa-brain',
                color: 'green',
                costPerQuery: 8,
                strengths: ['Complex analysis', 'Creative writing', 'Code generation'],
                bestFor: 'Deep research and complex problem solving'
            },
            'Claude-3': {
                name: 'Claude-3 Sonnet',
                price: '฿0.05/query',
                description: 'Balanced performance',
                icon: 'fas fa-robot',
                color: 'blue',
                costPerQuery: 5,
                strengths: ['Balanced reasoning', 'Document analysis', 'Conversations'],
                bestFor: 'General purpose and document processing'
            },
            'Gemini': {
                name: 'Gemini Pro',
                price: '฿0.02/query',
                description: 'Cost effective',
                icon: 'fas fa-gem',
                color: 'purple',
                costPerQuery: 2,
                strengths: ['Fast responses', 'Basic queries', 'Translations'],
                bestFor: 'Quick answers and simple tasks'
            }
        };
        
        this.usage = {
            'GPT-4': { queries: 12, spent: 0.96, accuracy: 92 },
            'Claude-3': { queries: 8, spent: 0.40, accuracy: 89 },
            'Gemini': { queries: 4, spent: 0.08, accuracy: 85 }
        };
        
        this.init();
    }
    
    init() {
        // Load saved model preference
        const savedModel = Utils.getFromStorage('preferred_ai_model', 'GPT-4');
        this.selectModel(savedModel);
        
        // Update UI
        this.updateModelDisplay();
        this.updatePerformanceStats();
        
        console.log('🤖 AI Models system initialized');
    }
    
    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        const dropdown = document.getElementById('aiModelDropdown');
        const selector = document.querySelector('.ai-model-selector');
        
        if (this.dropdownOpen) {
            dropdown.classList.add('show');
            selector.classList.add('active');
            this.updateDropdownContent();
        } else {
            dropdown.classList.remove('show');
            selector.classList.remove('active');
        }
        
        Utils.trackEvent('ai_model_dropdown', { action: this.dropdownOpen ? 'open' : 'close' });
    }
    
    closeDropdown() {
        if (this.dropdownOpen) {
            this.dropdownOpen = false;
            const dropdown = document.getElementById('aiModelDropdown');
            const selector = document.querySelector('.ai-model-selector');
            
            dropdown.classList.remove('show');
            selector.classList.remove('active');
        }
    }
    
    selectModel(modelKey) {
        if (!this.models[modelKey]) {
            console.warn(`Unknown AI model: ${modelKey}`);
            return;
        }
        
        const previousModel = this.currentModel;
        this.currentModel = modelKey;
        
        // Update UI
        this.updateModelDisplay();
        this.updateDropdownSelection();
        
        // Save preference
        Utils.saveToStorage('preferred_ai_model', modelKey);
        
        // Close dropdown
        this.closeDropdown();
        
        // Show notification
        const model = this.models[modelKey];
        Utils.showNotification(
            `Switched to ${model.name} - ${model.description}`,
            'info'
        );
        
        // Track usage
        Utils.trackEvent('ai_model_selected', {
            from: previousModel,
            to: modelKey,
            cost: model.costPerQuery,
            reason: model.bestFor
        });
        
        console.log(`🔄 AI model switched: ${previousModel} → ${modelKey}`);
    }
    
    selectByNumber(number) {
        const modelKeys = Object.keys(this.models);
        if (number >= 1 && number <= modelKeys.length) {
            this.selectModel(modelKeys[number - 1]);
        }
    }
    
    updateModelDisplay() {
        const model = this.models[this.currentModel];
        
        const selectedModelEl = document.getElementById('selectedModel');
        const selectedPriceEl = document.getElementById('selectedPrice');
        const currentModelDisplayEl = document.getElementById('currentModelDisplay');
        
        if (selectedModelEl) selectedModelEl.textContent = this.currentModel;
        if (selectedPriceEl) selectedPriceEl.textContent = model.price;
        if (currentModelDisplayEl) currentModelDisplayEl.textContent = this.currentModel;
    }
    
    updateDropdownContent() {
        const dropdown = document.getElementById('aiModelDropdown');
        if (!dropdown) return;
        
        dropdown.innerHTML = Object.entries(this.models).map(([key, model]) => `
            <div class="ai-model-option ${key === this.currentModel ? 'selected' : ''}" 
                 onclick="AIModels.selectModel('${key}')">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-${model.color}-100 rounded-lg flex items-center justify-center">
                        <i class="${model.icon} text-${model.color}-600 text-xs"></i>
                    </div>
                    <div>
                        <div class="font-medium">${model.name}</div>
                        <div class="text-xs text-gray-500">${model.description}</div>
                    </div>
                </div>
                <div class="text-sm font-medium text-${model.color}-600">${model.price.split('/')[0]}</div>
            </div>
        `).join('');
    }
    
    updateDropdownSelection() {
        const options = document.querySelectorAll('.ai-model-option');
        options.forEach((option, index) => {
            const modelKey = Object.keys(this.models)[index];
            option.classList.toggle('selected', modelKey === this.currentModel);
        });
    }
    
    updatePerformanceStats() {
        const container = document.getElementById('aiModelPerformance');
        if (!container) return;
        
        container.innerHTML = Object.entries(this.usage).map(([modelKey, stats]) => {
            const model = this.models[modelKey];
            return `
                <div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-${model.color}-100 rounded-lg flex items-center justify-center">
                            <i class="${model.icon} text-${model.color}-600 text-xs"></i>
                        </div>
                        <div>
                            <div class="font-medium text-sm">${model.name}</div>
                            <div class="text-xs text-gray-500">${stats.queries} queries • ฿${stats.spent.toFixed(2)} spent</div>
                        </div>
                    </div>
                    <div class="text-sm font-medium text-${model.color}-600">${stats.accuracy}% accuracy</div>
                </div>
            `;
        }).join('');
    }
    
    // Smart model recommendation
    recommendModel(queryType, complexity = 'medium') {
        const recommendations = {
            'research': {
                high: 'GPT-4',
                medium: 'Claude-3',
                low: 'Gemini'
            },
            'chat': {
                high: 'Claude-3',
                medium: 'Claude-3',
                low: 'Gemini'
            },
            'translation': {
                high: 'GPT-4',
                medium: 'Gemini',
                low: 'Gemini'
            },
            'summary': {
                high: 'Claude-3',
                medium: 'Claude-3',
                low: 'Gemini'
            }
        };
        
        return recommendations[queryType]?.[complexity] || 'Claude-3';
    }
    
    // Cost calculation
    calculateCost(queryLength, modelKey = this.currentModel) {
        const model = this.models[modelKey];
        const baseCost = model.costPerQuery;
        
        // Adjust cost based on query length
        const lengthMultiplier = Math.max(1, Math.ceil(queryLength / 500));
        
        return baseCost * lengthMultiplier;
    }
    
    // Usage tracking
    trackUsage(modelKey, cost, success = true) {
        if (!this.usage[modelKey]) {
            this.usage[modelKey] = { queries: 0, spent: 0, accuracy: 0 };
        }
        
        this.usage[modelKey].queries++;
        this.usage[modelKey].spent += cost / 100; // Convert from credits to baht
        
        // Update accuracy (simplified)
        if (success) {
            this.usage[modelKey].accuracy = Math.min(95, this.usage[modelKey].accuracy + 0.5);
        } else {
            this.usage[modelKey].accuracy = Math.max(70, this.usage[modelKey].accuracy - 1);
        }
        
        // Save usage data
        Utils.saveToStorage('ai_model_usage', this.usage);
        
        // Update display
        this.updatePerformanceStats();
        
        Utils.trackEvent('ai_model_usage', {
            model: modelKey,
            cost,
            success,
            totalQueries: this.usage[modelKey].queries
        });
    }
    
    // Get model comparison
    getModelComparison() {
        return Object.entries(this.models).map(([key, model]) => ({
            key,
            name: model.name,
            cost: model.costPerQuery,
            usage: this.usage[key] || { queries: 0, spent: 0, accuracy: 0 },
            strengths: model.strengths,
            bestFor: model.bestFor
        }));
    }
    
    // Auto-select optimal model
    autoSelectOptimalModel(queryType, budget = 'medium') {
        const budgetLimits = {
            low: 3,      // Max 3 credits
            medium: 6,   // Max 6 credits  
            high: 10     // Max 10 credits
        };
        
        const maxCost = budgetLimits[budget];
        const recommended = this.recommendModel(queryType, budget);
        
        // Check if recommended model fits budget
        if (this.models[recommended].costPerQuery <= maxCost) {
            this.selectModel(recommended);
            return recommended;
        }
        
        // Find cheapest suitable model
        const suitableModels = Object.entries(this.models)
            .filter(([_, model]) => model.costPerQuery <= maxCost)
            .sort((a, b) => b[1].costPerQuery - a[1].costPerQuery); // Prefer higher quality within budget
        
        if (suitableModels.length > 0) {
            const selectedModel = suitableModels[0][0];
            this.selectModel(selectedModel);
            return selectedModel;
        }
        
        return this.currentModel; // Fallback to current
    }
    
    // Export usage statistics
    exportUsageStats() {
        const stats = {
            period: {
                start: Utils.getFromStorage('stats_period_start', new Date().toISOString()),
                end: new Date().toISOString()
            },
            models: this.getModelComparison(),
            totalSpent: Object.values(this.usage).reduce((sum, usage) => sum + usage.spent, 0),
            totalQueries: Object.values(this.usage).reduce((sum, usage) => sum + usage.queries, 0),
            averageAccuracy: Object.values(this.usage).reduce((sum, usage, _, array) => 
                sum + usage.accuracy / array.length, 0
            )
        };
        
        Utils.trackEvent('ai_stats_exported', { totalQueries: stats.totalQueries });
        
        return stats;
    }
}

// Initialize AI Models system
window.AIModels = new AIModels();

// Global functions for onclick handlers
window.AIModels.selectModel = window.AIModels.selectModel.bind(window.AIModels);
window.AIModels.toggleDropdown = window.AIModels.toggleDropdown.bind(window.AIModels);