// 📄 FlowWork Documents Management System
class Documents {
    constructor() {
        this.documents = [];
        this.currentDocument = null;
        this.editor = null;
        this.isEditing = false;
        this.autoSaveInterval = null;
        
        this.documentTypes = {
            'meeting-minutes': {
                name: 'Meeting Minutes',
                icon: 'fas fa-clipboard-list',
                color: 'blue',
                template: this.getMeetingMinutesTemplate()
            },
            'budget-report': {
                name: 'Budget Report',
                icon: 'fas fa-chart-pie',
                color: 'green',
                template: this.getBudgetReportTemplate()
            },
            'project-proposal': {
                name: 'Project Proposal',
                icon: 'fas fa-lightbulb',
                color: 'purple',
                template: this.getProjectProposalTemplate()
            },
            'policy-document': {
                name: 'Policy Document',
                icon: 'fas fa-file-contract',
                color: 'red',
                template: this.getPolicyDocumentTemplate()
            },
            'general': {
                name: 'General Document',
                icon: 'fas fa-file-alt',
                color: 'gray',
                template: this.getGeneralTemplate()
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadDocuments();
        this.setupAutoSave();
        console.log('📄 Documents system initialized');
    }
    
    loadDocuments() {
        // Load from storage or create sample documents
        const savedDocuments = Utils.getFromStorage('user_documents', []);
        
        if (savedDocuments.length === 0) {
            this.documents = this.createSampleDocuments();
            this.saveDocuments();
        } else {
            this.documents = savedDocuments.map(doc => ({
                ...doc,
                createdAt: new Date(doc.createdAt),
                updatedAt: new Date(doc.updatedAt),
                lastOpenedAt: doc.lastOpenedAt ? new Date(doc.lastOpenedAt) : null
            }));
        }
        
        this.renderDocuments();
    }
    
    createSampleDocuments() {
        const now = new Date();
        return [
            {
                id: 'doc-1',
                title: 'Meeting Minutes Q4 Budget Review',
                type: 'meeting-minutes',
                content: this.getMeetingMinutesTemplate(),
                size: 15420,
                createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
                updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
                lastOpenedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
                author: 'โล่',
                tags: ['budget', 'meeting', 'Q4'],
                status: 'published',
                collaborators: ['เอ', 'บี'],
                aiGenerated: false
            },
            {
                id: 'doc-2',
                title: 'Budget Analysis Report 2567',
                type: 'budget-report',
                content: this.getBudgetReportTemplate(),
                size: 28150,
                createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
                updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
                lastOpenedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
                author: 'โล่',
                tags: ['budget', 'analysis', '2567'],
                status: 'draft',
                collaborators: ['เอ'],
                aiGenerated: true
            },
            {
                id: 'doc-3',
                title: 'FlowWork Project Proposal',
                type: 'project-proposal',
                content: this.getProjectProposalTemplate(),
                size: 45200,
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                lastOpenedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
                author: 'โล่',
                tags: ['project', 'proposal', 'flowwork'],
                status: 'review',
                collaborators: ['เอ', 'บี', 'ซี'],
                aiGenerated: false
            }
        ];
    }
    
    renderDocuments() {
        const container = document.getElementById('documentsGrid');
        if (!container) return;
        
        if (this.documents.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }
        
        container.innerHTML = this.documents.map(doc => this.renderDocumentCard(doc)).join('');
    }
    
    renderDocumentCard(doc) {
        const docType = this.documentTypes[doc.type] || this.documentTypes.general;
        const timeAgo = Utils.timeAgo(doc.updatedAt);
        const formattedSize = Utils.formatFileSize(doc.size);
        
        return `
            <div class="document-card" onclick="Documents.openDocument('${doc.id}')">
                <div class="document-icon bg-${docType.color}-100">
                    <i class="${docType.icon} text-${docType.color}-600"></i>
                </div>
                
                <div class="document-title">${doc.title}</div>
                
                <div class="document-meta">
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span>${formattedSize}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                        ${doc.aiGenerated ? '<span class="text-purple-600"><i class="fas fa-robot"></i> AI</span>' : ''}
                    </div>
                    
                    <div class="flex items-center space-x-1">
                        <div class="status-indicator ${doc.status === 'published' ? 'bg-green-100 text-green-700' : 
                                                      doc.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 
                                                      'bg-blue-100 text-blue-700'}">
                            ${doc.status}
                        </div>
                        
                        <div class="flex -space-x-1">
                            ${doc.collaborators.slice(0, 3).map(name => `
                                <div class="w-5 h-5 bg-gray-400 rounded-full border border-white text-xs text-white flex items-center justify-center">
                                    ${name.charAt(0)}
                                </div>
                            `).join('')}
                            ${doc.collaborators.length > 3 ? `
                                <div class="w-5 h-5 bg-gray-300 rounded-full border border-white text-xs text-gray-600 flex items-center justify-center">
                                    +${doc.collaborators.length - 3}
                                </div>
                            ` : ''}
                        </div>
                        
                        <button onclick="event.stopPropagation(); Documents.showDocumentMenu('${doc.id}')" 
                                class="p-1 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-ellipsis-v text-xs"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mt-2 flex flex-wrap gap-1">
                    ${doc.tags.slice(0, 3).map(tag => `
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getEmptyState() {
        return `
            <div class="col-span-full">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3 class="empty-state-title">No Documents Yet</h3>
                    <p class="empty-state-subtitle">Create your first document to get started</p>
                    <button onclick="Documents.createNew()" class="btn btn-primary mt-4">
                        <i class="fas fa-plus mr-2"></i>Create Document
                    </button>
                </div>
            </div>
        `;
    }
    
    createNew(type = 'general') {
        const docType = this.documentTypes[type] || this.documentTypes.general;
        
        // Show document type selector modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-2xl w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Create New Document</h2>
                    <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                    <input type="text" id="newDocTitle" placeholder="Enter document title..." 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Document Type</label>
                    <div class="grid grid-cols-2 gap-3">
                        ${Object.entries(this.documentTypes).map(([key, docType]) => `
                            <div class="doc-type-option p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50"
                                 onclick="selectDocType('${key}')">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-${docType.color}-100 rounded-lg flex items-center justify-center">
                                        <i class="${docType.icon} text-${docType.color}-600"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900">${docType.name}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button onclick="this.closest('.fixed').remove()" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button onclick="Documents.createDocument()" class="btn btn-primary">
                        <i class="fas fa-plus mr-2"></i>Create Document
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-focus title input
        setTimeout(() => {
            document.getElementById('newDocTitle').focus();
        }, 100);
        
        // Global function for type selection
        window.selectDocType = function(typeKey) {
            document.querySelectorAll('.doc-type-option').forEach(option => {
                option.classList.remove('border-purple-500', 'bg-purple-100');
            });
            event.currentTarget.classList.add('border-purple-500', 'bg-purple-100');
            event.currentTarget.setAttribute('data-selected', 'true');
        };
        
        Utils.trackEvent('document_create_modal_opened');
    }
    
    createDocument() {
        const titleInput = document.getElementById('newDocTitle');
        const selectedTypeElement = document.querySelector('.doc-type-option[data-selected="true"]');
        
        const title = titleInput.value.trim();
        const docType = selectedTypeElement ? 
            selectedTypeElement.onclick.toString().match(/'([^']+)'/)[1] : 'general';
        
        if (!title) {
            Utils.showNotification('Please enter a document title', 'warning');
            return;
        }
        
        const newDoc = {
            id: `doc-${Date.now()}`,
            title: title,
            type: docType,
            content: this.documentTypes[docType].template,
            size: this.documentTypes[docType].template.length,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastOpenedAt: null,
            author: 'โล่', // In real app, get from auth
            tags: [],
            status: 'draft',
            collaborators: [],
            aiGenerated: false
        };
        
        this.documents.unshift(newDoc);
        this.saveDocuments();
        this.renderDocuments();
        
        // Close modal
        document.querySelector('.fixed').remove();
        
        // Open the new document
        setTimeout(() => {
            this.openDocument(newDoc.id);
        }, 300);
        
        Utils.showNotification(`Document "${title}" created successfully`, 'success');
        Utils.trackEvent('document_created', { type: docType, title: title.substring(0, 50) });
    }
    
    openDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) {
            Utils.showNotification('Document not found', 'error');
            return;
        }
        
        // Update last opened time
        doc.lastOpenedAt = new Date();
        this.saveDocuments();
        
        this.currentDocument = doc;
        this.showDocumentEditor();
        
        Utils.trackEvent('document_opened', { 
            docId, 
            type: doc.type, 
            size: doc.size 
        });
    }
    
    showDocumentEditor() {
        if (!this.currentDocument) return;
        
        // Create editor modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-white z-50';
        modal.innerHTML = this.getEditorHTML();
        
        document.body.appendChild(modal);
        
        // Initialize editor
        this.initializeEditor();
        
        // Start auto-save
        this.startAutoSave();
    }
    
    getEditorHTML() {
        const doc = this.currentDocument;
        const docType = this.documentTypes[doc.type] || this.documentTypes.general;
        
        return `
            <!-- Editor Header -->
            <div class="border-b border-gray-200 bg-white px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button onclick="Documents.closeEditor()" class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-times text-gray-600"></i>
                        </button>
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-${docType.color}-100 rounded-lg flex items-center justify-center">
                                <i class="${docType.icon} text-${docType.color}-600 text-sm"></i>
                            </div>
                            <div>
                                <input type="text" id="docTitle" value="${doc.title}" 
                                       class="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1">
                                <div class="text-sm text-gray-500">
                                    ${docType.name} • Last saved: <span id="lastSaved">just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                        <!-- Collaboration -->
                        <div class="flex items-center space-x-2">
                            <div class="flex -space-x-1">
                                ${doc.collaborators.map(name => `
                                    <div class="w-8 h-8 bg-gray-400 rounded-full border-2 border-white text-sm text-white flex items-center justify-center">
                                        ${name.charAt(0)}
                                    </div>
                                `).join('')}
                            </div>
                            <button onclick="Documents.inviteCollaborator()" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        </div>
                        
                        <!-- AI Assistant -->
                        <button onclick="Documents.openAIAssistant()" class="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                            <i class="fas fa-robot"></i>
                            <span class="hidden md:block">AI Assistant</span>
                        </button>
                        
                        <!-- Export -->
                        <div class="relative">
                            <button onclick="Documents.showExportMenu()" class="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                               <i class="fas fa-download"></i>
                               <span class="hidden md:block">Export</span>
                           </button>
                       </div>
                       
                       <!-- Save -->
                       <button onclick="Documents.saveDocument()" class="btn btn-primary">
                           <i class="fas fa-save mr-2"></i>Save
                       </button>
                   </div>
               </div>
           </div>
           
           <!-- Editor Content -->
           <div class="flex h-screen">
               <!-- Main Editor -->
               <div class="flex-1 flex flex-col">
                   <div class="flex-1 p-6 overflow-y-auto">
                       <div id="documentEditor" class="max-w-4xl mx-auto min-h-full">
                           <!-- Editor will be initialized here -->
                       </div>
                   </div>
                   
                   <!-- Status Bar -->
                   <div class="border-t border-gray-200 bg-gray-50 px-6 py-2">
                       <div class="flex items-center justify-between text-sm text-gray-500">
                           <div class="flex items-center space-x-4">
                               <span id="wordCount">0 words</span>
                               <span id="charCount">0 characters</span>
                               <span class="flex items-center space-x-1">
                                   <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                   <span>Auto-saved</span>
                               </span>
                           </div>
                           <div class="flex items-center space-x-2">
                               <span>Document ID: ${doc.id}</span>
                               <span>•</span>
                               <span>Created: ${doc.createdAt.toLocaleDateString('th-TH')}</span>
                           </div>
                       </div>
                   </div>
               </div>
               
               <!-- AI Assistant Sidebar (Initially Hidden) -->
               <div id="aiAssistantSidebar" class="w-80 border-l border-gray-200 bg-gray-50 hidden flex-col">
                   <div class="p-4 border-b border-gray-200 bg-white">
                       <h3 class="font-semibold text-gray-900 flex items-center">
                           <i class="fas fa-robot text-purple-600 mr-2"></i>
                           AI Writing Assistant
                       </h3>
                   </div>
                   <div class="flex-1 p-4 space-y-4">
                       <!-- AI suggestions will be populated here -->
                   </div>
               </div>
           </div>
       `;
   }
   
   initializeEditor() {
       const editorContainer = document.getElementById('documentEditor');
       if (!editorContainer) return;
       
       // Create simple rich text editor
       editorContainer.innerHTML = `
           <!-- Toolbar -->
           <div class="border border-gray-300 rounded-t-lg bg-white p-2 flex items-center space-x-2 flex-wrap">
               <button onclick="Documents.formatText('bold')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-bold"></i>
               </button>
               <button onclick="Documents.formatText('italic')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-italic"></i>
               </button>
               <button onclick="Documents.formatText('underline')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-underline"></i>
               </button>
               <div class="border-l border-gray-300 h-6"></div>
               <select onchange="Documents.formatText('fontSize', this.value)" class="text-sm border-none">
                   <option value="12px">12pt</option>
                   <option value="14px" selected>14pt</option>
                   <option value="16px">16pt</option>
                   <option value="18px">18pt</option>
                   <option value="24px">24pt</option>
               </select>
               <div class="border-l border-gray-300 h-6"></div>
               <button onclick="Documents.formatText('justifyLeft')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-align-left"></i>
               </button>
               <button onclick="Documents.formatText('justifyCenter')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-align-center"></i>
               </button>
               <button onclick="Documents.formatText('justifyRight')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-align-right"></i>
               </button>
               <div class="border-l border-gray-300 h-6"></div>
               <button onclick="Documents.formatText('insertUnorderedList')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-list-ul"></i>
               </button>
               <button onclick="Documents.formatText('insertOrderedList')" class="p-2 hover:bg-gray-100 rounded">
                   <i class="fas fa-list-ol"></i>
               </button>
               <div class="border-l border-gray-300 h-6"></div>
               <button onclick="Documents.askAI('improve')" class="p-2 hover:bg-purple-100 rounded text-purple-600">
                   <i class="fas fa-magic"></i> AI Improve
               </button>
               <button onclick="Documents.askAI('summarize')" class="p-2 hover:bg-purple-100 rounded text-purple-600">
                   <i class="fas fa-compress-alt"></i> Summarize
               </button>
           </div>
           
           <!-- Editor Content -->
           <div id="editorContent" 
                contenteditable="true" 
                class="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-96 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                style="font-family: 'Noto Sans Thai', sans-serif; line-height: 1.6;"
                oninput="Documents.updateWordCount(); Documents.markAsModified();"
                onpaste="Documents.handlePaste(event)">
               ${this.currentDocument.content}
           </div>
       `;
       
       // Update word count initially
       this.updateWordCount();
       
       // Focus editor
       setTimeout(() => {
           document.getElementById('editorContent').focus();
       }, 100);
   }
   
   formatText(command, value = null) {
       document.execCommand(command, false, value);
       document.getElementById('editorContent').focus();
       this.markAsModified();
   }
   
   updateWordCount() {
       const content = document.getElementById('editorContent');
       if (!content) return;
       
       const text = content.innerText || content.textContent || '';
       const words = text.trim().split(/\s+/).filter(word => word.length > 0);
       const chars = text.length;
       
       const wordCountEl = document.getElementById('wordCount');
       const charCountEl = document.getElementById('charCount');
       
       if (wordCountEl) wordCountEl.textContent = `${words.length} words`;
       if (charCountEl) charCountEl.textContent = `${chars} characters`;
   }
   
   markAsModified() {
       this.isEditing = true;
       // Update last saved indicator
       const lastSavedEl = document.getElementById('lastSaved');
       if (lastSavedEl) {
           lastSavedEl.textContent = 'unsaved changes';
           lastSavedEl.className = 'text-orange-600';
       }
   }
   
   handlePaste(event) {
       event.preventDefault();
       
       // Get plain text and insert it
       const text = (event.clipboardData || window.clipboardData).getData('text');
       const selection = window.getSelection();
       
       if (selection.rangeCount) {
           const range = selection.getRangeAt(0);
           range.deleteContents();
           range.insertNode(document.createTextNode(text));
           range.collapse(false);
           selection.removeAllRanges();
           selection.addRange(range);
       }
       
       this.markAsModified();
   }
   
   saveDocument() {
       if (!this.currentDocument) return;
       
       const titleEl = document.getElementById('docTitle');
       const contentEl = document.getElementById('editorContent');
       
       if (titleEl) this.currentDocument.title = titleEl.value;
       if (contentEl) this.currentDocument.content = contentEl.innerHTML;
       
       this.currentDocument.updatedAt = new Date();
       this.currentDocument.size = this.currentDocument.content.length;
       
       this.saveDocuments();
       this.isEditing = false;
       
       // Update UI
       const lastSavedEl = document.getElementById('lastSaved');
       if (lastSavedEl) {
           lastSavedEl.textContent = 'just now';
           lastSavedEl.className = 'text-green-600';
       }
       
       Utils.showNotification('Document saved successfully', 'success');
       Utils.trackEvent('document_saved', { 
           docId: this.currentDocument.id, 
           size: this.currentDocument.size 
       });
   }
   
   closeEditor() {
       if (this.isEditing) {
           if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
               return;
           }
       }
       
       this.stopAutoSave();
       
       // Remove editor modal
       const modal = document.querySelector('.fixed.inset-0.bg-white');
       if (modal) {
           modal.remove();
       }
       
       this.currentDocument = null;
       this.isEditing = false;
       
       // Refresh documents list
       this.renderDocuments();
       
       Utils.trackEvent('document_editor_closed');
   }
   
   startAutoSave() {
       this.stopAutoSave(); // Clear any existing interval
       
       this.autoSaveInterval = setInterval(() => {
           if (this.isEditing && this.currentDocument) {
               this.saveDocument();
           }
       }, 30000); // Auto-save every 30 seconds
   }
   
   stopAutoSave() {
       if (this.autoSaveInterval) {
           clearInterval(this.autoSaveInterval);
           this.autoSaveInterval = null;
       }
   }
   
   setupAutoSave() {
       // Setup global auto-save for documents
       setInterval(() => {
           this.saveDocuments();
       }, 60000); // Save documents list every minute
   }
   
   saveDocuments() {
       Utils.saveToStorage('user_documents', this.documents);
   }
   
   // AI Assistant Functions
   openAIAssistant() {
       const sidebar = document.getElementById('aiAssistantSidebar');
       if (sidebar) {
           sidebar.classList.toggle('hidden');
           sidebar.classList.toggle('flex');
           
           if (!sidebar.classList.contains('hidden')) {
               this.loadAIAssistantContent();
           }
       }
   }
   
   loadAIAssistantContent() {
       const sidebar = document.getElementById('aiAssistantSidebar');
       const contentArea = sidebar.querySelector('.flex-1.p-4');
       
       contentArea.innerHTML = `
           <div class="space-y-4">
               <div class="bg-white rounded-lg p-4 border border-gray-200">
                   <h4 class="font-medium text-gray-900 mb-3">Quick Actions</h4>
                   <div class="space-y-2">
                       <button onclick="Documents.askAI('improve')" class="w-full text-left p-2 hover:bg-purple-50 rounded text-sm">
                           <i class="fas fa-magic text-purple-600 mr-2"></i>Improve Writing
                       </button>
                       <button onclick="Documents.askAI('summarize')" class="w-full text-left p-2 hover:bg-purple-50 rounded text-sm">
                           <i class="fas fa-compress-alt text-purple-600 mr-2"></i>Summarize Content
                       </button>
                       <button onclick="Documents.askAI('translate')" class="w-full text-left p-2 hover:bg-purple-50 rounded text-sm">
                           <i class="fas fa-language text-purple-600 mr-2"></i>Translate
                       </button>
                       <button onclick="Documents.askAI('expand')" class="w-full text-left p-2 hover:bg-purple-50 rounded text-sm">
                           <i class="fas fa-expand-alt text-purple-600 mr-2"></i>Expand Ideas
                       </button>
                   </div>
               </div>
               
               <div class="bg-white rounded-lg p-4 border border-gray-200">
                   <h4 class="font-medium text-gray-900 mb-3">AI Chat</h4>
                   <div id="aiChatMessages" class="space-y-2 mb-3 max-h-40 overflow-y-auto">
                       <div class="text-sm text-gray-500 italic">Ask me anything about your document...</div>
                   </div>
                   <div class="flex space-x-2">
                       <input type="text" id="aiChatInput" placeholder="Ask AI..." 
                              class="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onkeydown="if(event.key==='Enter') Documents.sendAIMessage()">
                       <button onclick="Documents.sendAIMessage()" class="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                           <i class="fas fa-paper-plane text-sm"></i>
                       </button>
                   </div>
               </div>
               
               <div class="bg-white rounded-lg p-4 border border-gray-200">
                   <h4 class="font-medium text-gray-900 mb-3">Writing Statistics</h4>
                   <div class="space-y-2 text-sm">
                       <div class="flex justify-between">
                           <span class="text-gray-600">Readability:</span>
                           <span class="text-green-600 font-medium">Good</span>
                       </div>
                       <div class="flex justify-between">
                           <span class="text-gray-600">Tone:</span>
                           <span class="text-blue-600 font-medium">Professional</span>
                       </div>
                       <div class="flex justify-between">
                           <span class="text-gray-600">Completeness:</span>
                           <span class="text-yellow-600 font-medium">75%</span>
                       </div>
                   </div>
               </div>
           </div>
       `;
   }
   
   askAI(action) {
       const content = document.getElementById('editorContent');
       if (!content) return;
       
       const selectedText = window.getSelection().toString();
       const fullText = content.innerText || content.textContent || '';
       const textToProcess = selectedText || fullText;
       
       if (!textToProcess.trim()) {
           Utils.showNotification('Please select text or add content first', 'warning');
           return;
       }
       
       Utils.showNotification(`AI is ${action}ing your content...`, 'info');
       
       // Simulate AI processing
       setTimeout(() => {
           let result = '';
           
           switch (action) {
               case 'improve':
                   result = this.simulateAIImprovement(textToProcess);
                   break;
               case 'summarize':
                   result = this.simulateAISummary(textToProcess);
                   break;
               case 'translate':
                   result = this.simulateAITranslation(textToProcess);
                   break;
               case 'expand':
                   result = this.simulateAIExpansion(textToProcess);
                   break;
           }
           
           this.showAIResult(action, result);
       }, 2000);
       
       Utils.trackEvent('ai_assistant_used', { 
           action, 
           textLength: textToProcess.length,
           model: AIModels.currentModel 
       });
   }
   
   simulateAIImprovement(text) {
       return `✨ **AI Improved Version:**\n\n${text}\n\n**AI Suggestions:**\n• Consider using more active voice\n• Add specific examples to support your points\n• Break long sentences into shorter ones for better readability`;
   }
   
   simulateAISummary(text) {
       return `📝 **AI Summary:**\n\nKey points from your document:\n• Main topic discussed\n• Important decisions or recommendations\n• Action items identified\n• Next steps outlined\n\n*Summary generated from ${text.length} characters of content*`;
   }
   
   simulateAITranslation(text) {
       return `🌐 **AI Translation (Thai ↔ English):**\n\n${text}\n\n*Translation provided by ${AIModels.currentModel}. Please review for accuracy.*`;
   }
   
   simulateAIExpansion(text) {
       return `💡 **AI Expanded Ideas:**\n\nBased on your content, consider adding:\n• Background context and relevant data\n• Detailed examples and case studies\n• Potential challenges and solutions\n• Implementation timeline and resources needed\n• Stakeholder analysis and communication plan`;
   }
   
   showAIResult(action, result) {
       // Create result modal
       const modal = document.createElement('div');
       modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
       modal.innerHTML = `
           <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
               <div class="flex justify-between items-center mb-4">
                   <h3 class="text-lg font-semibold text-gray-900 capitalize">AI ${action} Result</h3>
                   <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                       <i class="fas fa-times text-gray-600"></i>
                   </button>
               </div>
               
               <div class="bg-gray-50 rounded-lg p-4 mb-4">
                   <pre class="whitespace-pre-wrap text-sm text-gray-800 font-sans">${result}</pre>
               </div>
               
               <div class="flex justify-end space-x-3">
                   <button onclick="this.closest('.fixed').remove()" class="btn btn-secondary">
                       Close
                   </button>
                   <button onclick="Documents.insertAIResult('${result.replace(/'/g, "\\'")}'); this.closest('.fixed').remove();" class="btn btn-primary">
                       <i class="fas fa-plus mr-2"></i>Insert into Document
                   </button>
               </div>
           </div>
       `;
       
       document.body.appendChild(modal);
       
       Utils.showNotification(`AI ${action} completed!`, 'success');
   }
   
   insertAIResult(result) {
       const content = document.getElementById('editorContent');
       if (!content) return;
       
       // Insert at cursor position
       const selection = window.getSelection();
       if (selection.rangeCount) {
           const range = selection.getRangeAt(0);
           const resultNode = document.createElement('div');
           resultNode.innerHTML = `<br><div style="border-left: 4px solid #7c3aed; padding-left: 12px; margin: 16px 0; background: #faf5ff; padding: 12px; border-radius: 8px;">${result.replace(/\n/g, '<br>')}</div><br>`;
           range.insertNode(resultNode);
       }
       
       this.markAsModified();
       Utils.showNotification('AI result inserted into document', 'success');
   }
   
   sendAIMessage() {
       const input = document.getElementById('aiChatInput');
       const messagesContainer = document.getElementById('aiChatMessages');
       
       if (!input || !messagesContainer) return;
       
       const message = input.value.trim();
       if (!message) return;
       
       // Add user message
       const userMsg = document.createElement('div');
       userMsg.className = 'text-sm bg-purple-100 text-purple-800 p-2 rounded-lg';
       userMsg.textContent = message;
       messagesContainer.appendChild(userMsg);
       
       // Clear input
       input.value = '';
       
       // Simulate AI response
       setTimeout(() => {
           const aiMsg = document.createElement('div');
           aiMsg.className = 'text-sm bg-gray-100 text-gray-800 p-2 rounded-lg';
           aiMsg.textContent = `Based on your document, I suggest focusing on the key points and ensuring clarity in your writing. Would you like me to help improve any specific section?`;
           messagesContainer.appendChild(aiMsg);
           
           // Scroll to bottom
           messagesContainer.scrollTop = messagesContainer.scrollHeight;
       }, 1000);
       
       Utils.trackEvent('ai_chat_message', { messageLength: message.length });
   }
   
   // Export and sharing functions
   showExportMenu() {
       const menu = document.createElement('div');
       menu.className = 'fixed top-20 right-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 min-w-48';
       menu.innerHTML = `
           <button onclick="Documents.exportDocument('pdf')" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
               <i class="fas fa-file-pdf text-red-500 mr-2"></i>Export as PDF
           </button>
           <button onclick="Documents.exportDocument('docx')" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
               <i class="fas fa-file-word text-blue-500 mr-2"></i>Export as Word
           </button>
           <button onclick="Documents.exportDocument('html')" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
               <i class="fas fa-code text-green-500 mr-2"></i>Export as HTML
           </button>
           <button onclick="Documents.exportDocument('txt')" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
               <i class="fas fa-file-alt text-gray-500 mr-2"></i>Export as Text
           </button>
           <hr class="my-2">
           <button onclick="Documents.shareDocument()" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
               <i class="fas fa-share-alt text-purple-500 mr-2"></i>Share with Team
           </button>
       `;
       
       document.body.appendChild(menu);
       
       // Close menu when clicking outside
       setTimeout(() => {
           document.addEventListener('click', function closeMenu(e) {
               if (!menu.contains(e.target)) {
                   menu.remove();
                   document.removeEventListener('click', closeMenu);
               }
           });
       }, 100);
   }
   
   exportDocument(format) {
       if (!this.currentDocument) return;
       
       const content = document.getElementById('editorContent');
       let exportData = '';
       let fileName = `${this.currentDocument.title}.${format}`;
       let mimeType = '';
       
       switch (format) {
           case 'pdf':
               Utils.showNotification('PDF export would integrate with a PDF generation service', 'info');
               return;
           case 'docx':
               Utils.showNotification('Word export would integrate with Office Online API', 'info');
               return;
           case 'html':
               exportData = `<!DOCTYPE html><html><head><title>${this.currentDocument.title}</title></head><body>${content.innerHTML}</body></html>`;
               mimeType = 'text/html';
               break;
           case 'txt':
               exportData = content.innerText || content.textContent || '';
               mimeType = 'text/plain';
               break;
       }
       
       // Create download
       const blob = new Blob([exportData], { type: mimeType });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = fileName;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
       
       // Close export menu
       document.querySelector('.fixed.top-20')?.remove();
       
       Utils.showNotification(`Document exported as ${format.toUpperCase()}`, 'success');
       Utils.trackEvent('document_exported', { format, docId: this.currentDocument.id });
   }
   
   shareDocument() {
       if (!this.currentDocument) return;
       
       // Close export menu
       document.querySelector('.fixed.top-20')?.remove();
       
       // Show share modal
       const modal = document.createElement('div');
       modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
       modal.innerHTML = `
           <div class="bg-white rounded-xl max-w-md w-full p-6">
               <h3 class="text-lg font-semibold text-gray-900 mb-4">Share Document</h3>
               
               <div class="space-y-4">
                   <div>
                       <label class="block text-sm font-medium text-gray-700 mb-2">Share with team members:</label>
                       <div class="space-y-2">
                           <label class="flex items-center">
                               <input type="checkbox" class="mr-2" checked> เอ (Developer)
                           </label>
                           <label class="flex items-center">
                               <input type="checkbox" class="mr-2"> บี (Analyst)
                           </label>
                           <label class="flex items-center">
                               <input type="checkbox" class="mr-2"> ซี (Designer)
                           </label>
                       </div>
                   </div>
                   
                   <div>
                       <label class="block text-sm font-medium text-gray-700 mb-2">Permission level:</label>
                       <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                           <option>Can view</option>
                           <option>Can comment</option>
                           <option selected>Can edit</option>
                       </select>
                   </div>
                   
                   <div>
                       <label class="block text-sm font-medium text-gray-700 mb-2">Message (optional):</label>
                       <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Add a message..."></textarea>
                   </div>
               </div>
               
               <div class="flex justify-end space-x-3 mt-6">
                   <button onclick="this.closest('.fixed').remove()" class="btn btn-secondary">Cancel</button>
                   <button onclick="Documents.confirmShare(); this.closest('.fixed').remove();" class="btn btn-primary">
                       <i class="fas fa-share-alt mr-2"></i>Share
                   </button>
               </div>
           </div>
       `;
       
       document.body.appendChild(modal);
   }
   
   confirmShare() {
       Utils.showNotification('Document shared with team members successfully!', 'success');
       Utils.trackEvent('document_shared', { docId: this.currentDocument?.id });
   }
   
   inviteCollaborator() {
       Utils.showNotification('Collaboration feature - invite system would be here', 'info');
   }
   
   showDocumentMenu(docId) {
       // Show context menu for document actions
       Utils.showNotification('Document menu - delete, duplicate, share options', 'info');
   }
   
   uploadFile() {
       Utils.showNotification('File upload feature - drag & drop or file picker', 'info');
   }
   
   // Template functions
   getMeetingMinutesTemplate() {
       return `<h1>Meeting Minutes</h1>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('th-TH')}</p>
<p><strong>Time:</strong> </p>
<p><strong>Attendees:</strong> </p>
<p><strong>Meeting Type:</strong> </p>

<h2>Agenda</h2>
<ol>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ol>

<h2>Discussion Points</h2>
<p>Key points discussed during the meeting...</p>

<h2>Decisions Made</h2>
<ul>
<li>Decision 1</li>
<li>Decision 2</li>
</ul>

<h2>Action Items</h2>
<table border="1" style="width: 100%; border-collapse: collapse;">
<tr>
<th>Task</th>
<th>Assigned To</th>
<th>Due Date</th>
<th>Status</th>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</table>

<h2>Next Meeting</h2>
<p><strong>Date:</strong> </p>
<p><strong>Agenda Items:</strong> </p>`;
   }
   
   getBudgetReportTemplate() {
       return `<h1>Budget Report</h1>
<p><strong>Reporting Period:</strong> </p>
<p><strong>Department:</strong> </p>
<p><strong>Prepared By:</strong> </p>

<h2>Executive Summary</h2>
<p>Brief overview of budget performance...</p>

<h2>Budget vs Actual</h2>
<table border="1" style="width: 100%; border-collapse: collapse;">
<tr>
<th>Category</th>
<th>Budget</th>
<th>Actual</th>
<th>Variance</th>
<th>%</th>
</tr>
<tr>
<td>Revenue</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>Expenses</td>
<td></td>
<td></td>
<td>
<td></td>
<td></td>
</tr>
</table>

<h2>Key Findings</h2>
<ul>
<li>Finding 1</li>
<li>Finding 2</li>
<li>Finding 3</li>
</ul>

<h2>Recommendations</h2>
<ol>
<li>Recommendation 1</li>
<li>Recommendation 2</li>
<li>Recommendation 3</li>
</ol>

<h2>Next Steps</h2>
<p>Action items and timeline for next period...</p>`;
   }
   
   getProjectProposalTemplate() {
       return `<h1>Project Proposal</h1>
<p><strong>Project Name:</strong> </p>
<p><strong>Submitted By:</strong> </p>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('th-TH')}</p>
<p><strong>Requested Budget:</strong> </p>

<h2>Project Overview</h2>
<p>Brief description of the project...</p>

<h2>Objectives</h2>
<ul>
<li>Objective 1</li>
<li>Objective 2</li>
<li>Objective 3</li>
</ul>

<h2>Scope of Work</h2>
<p>Detailed description of what will be accomplished...</p>

<h2>Timeline</h2>
<table border="1" style="width: 100%; border-collapse: collapse;">
<tr>
<th>Phase</th>
<th>Description</th>
<th>Duration</th>
<th>Deliverables</th>
</tr>
<tr>
<td>Phase 1</td>
<td></td>
<td></td>
<td></td>
</tr>
</table>

<h2>Resources Required</h2>
<ul>
<li>Human Resources</li>
<li>Technology</li>
<li>Budget</li>
</ul>

<h2>Risk Assessment</h2>
<p>Potential risks and mitigation strategies...</p>

<h2>Expected Outcomes</h2>
<p>What success looks like...</p>`;
   }
   
   getPolicyDocumentTemplate() {
       return `<h1>Policy Document</h1>
<p><strong>Policy Title:</strong> </p>
<p><strong>Policy Number:</strong> </p>
<p><strong>Effective Date:</strong> </p>
<p><strong>Review Date:</strong> </p>
<p><strong>Approved By:</strong> </p>

<h2>Purpose</h2>
<p>The purpose of this policy is to...</p>

<h2>Scope</h2>
<p>This policy applies to...</p>

<h2>Definitions</h2>
<ul>
<li><strong>Term 1:</strong> Definition</li>
<li><strong>Term 2:</strong> Definition</li>
</ul>

<h2>Policy Statement</h2>
<p>The organization's position on this matter...</p>

<h2>Procedures</h2>
<ol>
<li>Step 1</li>
<li>Step 2</li>
<li>Step 3</li>
</ol>

<h2>Responsibilities</h2>
<ul>
<li><strong>Management:</strong> Responsibility description</li>
<li><strong>Employees:</strong> Responsibility description</li>
</ul>

<h2>Compliance</h2>
<p>Consequences of non-compliance...</p>

<h2>Related Documents</h2>
<ul>
<li>Document 1</li>
<li>Document 2</li>
</ul>`;
   }
   
   getGeneralTemplate() {
       return `<h1>Document Title</h1>
<p><strong>Author:</strong> </p>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('th-TH')}</p>

<h2>Introduction</h2>
<p>Introduction to your document...</p>

<h2>Main Content</h2>
<p>Your main content goes here...</p>

<h2>Conclusion</h2>
<p>Summary and closing thoughts...</p>`;
   }
}

// Initialize Documents system
window.Documents = new Documents();

// Global functions for onclick handlers
window.Documents.createNew = window.Documents.createNew.bind(window.Documents);
window.Documents.uploadFile = window.Documents.uploadFile.bind(window.Documents);
window.Documents.openDocument = window.Documents.openDocument.bind(window.Documents);
window.Documents.showDocumentMenu = window.Documents.showDocumentMenu.bind(window.Documents);
window.Documents.createDocument = window.Documents.createDocument.bind(window.Documents);
window.Documents.saveDocument = window.Documents.saveDocument.bind(window.Documents);
window.Documents.closeEditor = window.Documents.closeEditor.bind(window.Documents);
window.Documents.formatText = window.Documents.formatText.bind(window.Documents);
window.Documents.updateWordCount = window.Documents.updateWordCount.bind(window.Documents);
window.Documents.markAsModified = window.Documents.markAsModified.bind(window.Documents);
window.Documents.handlePaste = window.Documents.handlePaste.bind(window.Documents);
window.Documents.openAIAssistant = window.Documents.openAIAssistant.bind(window.Documents);
window.Documents.askAI = window.Documents.askAI.bind(window.Documents);
window.Documents.sendAIMessage = window.Documents.sendAIMessage.bind(window.Documents);
window.Documents.insertAIResult = window.Documents.insertAIResult.bind(window.Documents);
window.Documents.showExportMenu = window.Documents.showExportMenu.bind(window.Documents);
window.Documents.exportDocument = window.Documents.exportDocument.bind(window.Documents);
window.Documents.shareDocument = window.Documents.shareDocument.bind(window.Documents);
window.Documents.confirmShare = window.Documents.confirmShare.bind(window.Documents);
window.Documents.inviteCollaborator = window.Documents.inviteCollaborator.bind(window.Documents);