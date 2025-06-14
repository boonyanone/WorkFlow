// 🎙️ FlowWork Meeting Intelligence System
class Meeting {
    constructor() {
        this.isRecording = false;
        this.recordingTimer = 0;
        this.recordingInterval = null;
        this.selectedMeetingType = '';
        this.currentSession = null;
        
        this.meetingTypes = {
            government: {
                name: 'Government Meeting',
                icon: 'fas fa-university',
                color: 'purple',
                templates: ['budget-review', 'policy-discussion', 'progress-report']
            },
            team: {
                name: 'Team Standup',
                icon: 'fas fa-users',
                color: 'blue',
                templates: ['daily-standup', 'sprint-review', 'retrospective']
            },
            project: {
                name: 'Project Review',
                icon: 'fas fa-project-diagram',
                color: 'green',
                templates: ['milestone-review', 'status-update', 'planning']
            },
            budget: {
                name: 'Budget Discussion',
                icon: 'fas fa-dollar-sign',
                color: 'yellow',
                templates: ['budget-planning', 'expense-review', 'allocation']
            }
        };
        
        this.transcriptSamples = [
            "ครับ เรามาเริ่มการประชุมกันครับ วันนี้เราจะพูดถึงความคืบหน้าของโครงการ FlowWork",
            "ตอนนี้ผลงานด้านเทคนิคเป็นอย่างไร มีปัญหาอะไรที่ต้องแก้ไขมั้ยครับ",
            "สำหรับเรื่องงบประมาณ เราควรจะปรับแผนการใช้จ่ายใหม่ให้เหมาะสม",
            "ผมคิดว่าเราควรจะกำหนดประชุมครั้งถัดไปในสัปดาห์หน้าครับ",
            "มีใครมีข้อสงสัยเพิ่มเติมเกี่ยวกับแผนงานนี้มั้ยครับ",
            "เราต้องดูเรื่อง timeline ให้ชัดเจนขึ้น เพื่อไม่ให้เกิดความล่าช้า",
            "สำหรับ action items วันนี้ ผมจะสรุปส่งให้ทุกคนทางอีเมลครับ"
        ];
        
        this.insightsSamples = [
            "• พบการตัดสินใจ 2 เรื่อง: งบประมาณและกำหนดการ",
            "• ตรวจพบ Action Item: กำหนดประชุมครั้งถัดไป",
            "• คะแนนประสิทธิภาพการประชุม: 88% (ดีเยี่ยม)",
            "• ระยะเวลาการพูดสมดุล: ผู้เข้าร่วมทุกคนมีส่วนร่วม",
            "• หัวข้อหลัก: โครงการ FlowWork, งบประมาณ, แผนงาน",
            "• ตรวจพบคำสำคัญ: deadline, budget, timeline, action",
            "• แนะนำ: ควรมีการติดตามผลใน 1 สัปดาห์"
        ];
        
        this.init();
    }
    
    init() {
        this.loadSavedSessions();
        console.log('🎙️ Meeting Intelligence system initialized');
    }
    
    startLiveRecording() {
        if (this.isRecording) {
            Utils.showNotification('Recording is already in progress', 'warning');
            return;
        }
        
        this.isRecording = true;
        this.recordingTimer = 0;
        
        // Create new session
        this.currentSession = {
            id: Date.now(),
            type: this.selectedMeetingType || 'general',
            startTime: new Date(),
            participants: 3,
            language: 'Thai/English',
            transcript: [],
            insights: [],
            actionItems: []
        };
        
        // Navigate to live recording view
        Navigation.showView('live-recording');
        
        // Start timer
        this.recordingInterval = setInterval(() => {
            this.recordingTimer++;
            this.updateRecordingTimer();
            
            // Simulate live transcription every 8 seconds
            if (this.recordingTimer % 8 === 0) {
                this.addLiveTranscription();
            }
            
            // Simulate AI insights every 15 seconds
            if (this.recordingTimer % 15 === 0) {
                this.addRealTimeInsight();
            }
        }, 1000);
        
        Utils.showNotification('Live recording started! AI is transcribing in real-time.', 'success');
        Utils.trackEvent('meeting_recording_started', {
            type: this.selectedMeetingType,
            expectedDuration: 'unknown'
        });
    }
    
    stopLiveRecording() {
        if (!this.isRecording) {
            Utils.showNotification('No recording in progress', 'warning');
            return;
        }
        
        this.isRecording = false;
        clearInterval(this.recordingInterval);
        
        // Complete current session
        if (this.currentSession) {
            this.currentSession.endTime = new Date();
            this.currentSession.duration = this.recordingTimer;
            this.saveSession(this.currentSession);
        }
        
        Utils.showNotification('Recording stopped. Processing meeting summary...', 'info');
        
        // Show processing and then summary
        setTimeout(() => {
            this.showMeetingSummary();
        }, 2000);
        
        Utils.trackEvent('meeting_recording_stopped', {
            duration: this.recordingTimer,
            transcriptLength: this.currentSession?.transcript.length || 0,
            actionItems: this.currentSession?.actionItems.length || 0
        });
    }
    
    updateRecordingTimer() {
        const timerElement = document.getElementById('recordingTimer');
        if (timerElement) {
            timerElement.textContent = Utils.formatDuration(this.recordingTimer);
        }
    }
    
    addLiveTranscription() {
        const transcriptDiv = document.getElementById('liveTranscript');
        if (!transcriptDiv) return;
        
        // Clear initial message
        if (transcriptDiv.querySelector('.text-gray-400')) {
            transcriptDiv.innerHTML = '';
        }
        
        const randomTranscript = this.transcriptSamples[
            Math.floor(Math.random() * this.transcriptSamples.length)
        ];
        
        const transcriptEntry = document.createElement('div');
        transcriptEntry.className = 'transcript-entry';
        transcriptEntry.innerHTML = `
            <div class="transcript-meta">
                <span class="text-xs font-medium text-purple-600">[${new Date().toLocaleTimeString()}]</span>
                <span class="text-xs text-gray-500">Speaker ${Math.floor(Math.random() * 3) + 1}</span>
            </div>
            <div class="transcript-text">${randomTranscript}</div>
        `;
        
        transcriptDiv.appendChild(transcriptEntry);
        transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
        
        // Add to session
        if (this.currentSession) {
            this.currentSession.transcript.push({
                time: new Date(),
                speaker: `Speaker ${Math.floor(Math.random() * 3) + 1}`,
                text: randomTranscript
            });
        }
    }
    
    addRealTimeInsight() {
        const insightsDiv = document.getElementById('realTimeInsights');
        if (!insightsDiv) return;
        
        const randomInsight = this.insightsSamples[
            Math.floor(Math.random() * this.insightsSamples.length)
        ];
        
        const insightElement = document.createElement('div');
        insightElement.className = 'text-sm text-purple-600 fade-in';
        insightElement.textContent = randomInsight;
        
        insightsDiv.appendChild(insightElement);
        
        // Keep only last 5 insights
        while (insightsDiv.children.length > 5) {
            insightsDiv.removeChild(insightsDiv.firstChild);
        }
        
        // Add to session
        if (this.currentSession) {
            this.currentSession.insights.push({
                time: new Date(),
                insight: randomInsight
            });
        }
    }
    
    showMeetingSummary() {
        if (!this.currentSession) return;
        
        // Generate action items
        this.generateActionItems();
        
        // Show summary in a modal or new view
        const summary = this.generateSummaryHTML();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-900 flex items-center">
                            <i class="fas fa-brain text-purple-600 mr-3"></i>
                            AI Meeting Summary
                            <span class="nav-badge new ml-3">Enhanced</span>
                        </h2>
                        <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-times text-gray-600"></i>
                        </button>
                    </div>
                    ${summary}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Return to dashboard after showing summary
        setTimeout(() => {
            Navigation.showView('dashboard');
        }, 1000);
        
        Utils.showNotification('Meeting summary ready! AI has generated action items.', 'success');
    }
    
    generateActionItems() {
        if (!this.currentSession) return;
        
        const sampleActionItems = [
            {
                task: 'ปรับปรุง API documentation',
                assignee: 'น้องเอ',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
                priority: 'High',
                source: 'Discussed in technical review section'
            },
            {
                task: 'เตรียมรายงานงบประมาณ Q1',
                assignee: 'พี่โล่',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
                priority: 'Urgent',
                source: 'Required for next meeting'
            },
            {
                task: 'ทดสอบระบบใหม่กับผู้ใช้',
                assignee: 'ทีม QA',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
                priority: 'Medium',
                source: 'Part of development cycle'
            }
        ];
        
        this.currentSession.actionItems = sampleActionItems;
    }
    
    generateSummaryHTML() {
        const session = this.currentSession;
        const duration = Utils.formatDuration(session.duration);
        
        return `
            <!-- AI Insights Panel -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-purple-900 mb-2 flex items-center">
                    <i class="fas fa-lightbulb text-purple-600 mr-2"></i>AI Insights
                </h4>
                <div class="grid md:grid-cols-3 gap-4 text-sm">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${session.actionItems.length}</div>
                        <div class="text-purple-700">Action Items</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">3</div>
                        <div class="text-purple-700">Decisions Made</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">85%</div>
                        <div class="text-purple-700">Confidence Score</div>
                    </div>
                </div>
            </div>

            <!-- Meeting Details -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="card p-4">
                    <h4 class="font-medium text-gray-900 mb-3">Meeting Details</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Duration:</span>
                            <span class="font-medium">${duration}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Participants:</span>
                            <span class="font-medium">${session.participants}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Language:</span>
                            <span class="font-medium">${session.language}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Type:</span>
                            <span class="font-medium">${this.meetingTypes[session.type]?.name || 'General'}</span>
                        </div>
                    </div>
                </div>

                <div class="card p-4">
                    <h4 class="font-medium text-gray-900 mb-3">AI Analysis</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Key Topics:</span>
                            <span class="font-medium">Budget, Timeline, Goals</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Sentiment:</span>
                            <span class="font-medium text-green-600">Positive</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Efficiency:</span>
                            <span class="font-medium text-green-600">High</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Follow-up Required:</span>
                            <span class="font-medium text-orange-600">Yes</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Auto-Generated Action Items -->
            <div class="border-l-4 border-green-500 pl-4 mb-6">
                <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    ✅ Action Items 
                    <span class="nav-badge new ml-2">Auto-Generated</span>
                </h4>
                <div class="space-y-3">
                    ${session.actionItems.map(item => `
                        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input type="checkbox" class="mt-1">
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">${item.assignee}: ${item.task}</div>
                                <div class="text-sm text-gray-600">
                                    Deadline: ${item.deadline.toLocaleDateString('th-TH')} • 
                                    Priority: ${item.priority}
                                </div>
                                <div class="text-xs text-purple-600 mt-1">
                                    <i class="fas fa-robot mr-1"></i>AI จะส่งอีเมลเตือนอัตโนมัติ 1 วันก่อนครบกำหนด
                                </div>
                            </div>
                            <div class="flex space-x-1">
                                <button class="p-1 text-gray-400 hover:text-blue-600" title="Send Email">
                                    <i class="fas fa-envelope text-xs"></i>
                                </button>
                                <button class="p-1 text-gray-400 hover:text-green-600" title="Add to Calendar">
                                    <i class="fas fa-calendar-plus text-xs"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Export Options -->
            <div class="pt-6 border-t border-gray-200">
                <h4 class="font-medium text-gray-900 mb-3">📤 Export & Automation</h4>
                <div class="grid md:grid-cols-2 gap-3">
                    <button onclick="exportToGoogleDocs()" class="btn btn-primary text-sm">
                        <i class="fab fa-google-drive mr-2"></i>Google Docs
                    </button>
                    <button onclick="exportToWord()" class="btn btn-secondary text-sm">
                        <i class="fab fa-microsoft mr-2"></i>Word
                    </button>
                    <button class="btn btn-secondary text-sm">
                        <i class="fas fa-file-pdf mr-2"></i>PDF Report
                    </button>
                    <button onclick="shareWithTeam()" class="btn btn-secondary text-sm">
                        <i class="fas fa-share-alt mr-2"></i>Share with Team
                    </button>
                </div>
            </div>
        `;
    }
    
    simulateUpload() {
        Utils.showNotification('File upload simulation - Processing would happen here', 'info');
        
        // Simulate file processing
        setTimeout(() => {
            Utils.showNotification('Meeting file uploaded! AI is processing transcription...', 'success');
            
            // Show processing modal
            const processingModal = document.createElement('div');
            processingModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
            processingModal.innerHTML = `
                <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-cog text-purple-600 text-2xl animate-spin"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Processing Meeting Audio</h3>
                        <p class="text-gray-600 mb-4">AI is transcribing and analyzing your meeting...</p>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: 0%" id="uploadProgress"></div>
                        </div>
                        <div class="text-sm text-gray-500 mt-2" id="uploadStatus">Initializing...</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(processingModal);
            
            // Simulate progress
            let progress = 0;
            const progressBar = document.getElementById('uploadProgress');
            const statusText = document.getElementById('uploadStatus');
            const statuses = [
                'Analyzing audio quality...',
                'Detecting speakers...',
                'Transcribing speech...',
                'Generating insights...',
                'Creating action items...',
                'Finalizing summary...'
            ];
            
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = `${progress}%`;
                statusText.textContent = statuses[Math.floor((progress / 100) * statuses.length)];
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        document.body.removeChild(processingModal);
                        Utils.showNotification('Meeting processing complete! Summary is ready.', 'success');
                       
                        // Create a mock session for the uploaded file
                        this.currentSession = {
                            id: Date.now(),
                            type: this.selectedMeetingType || 'general',
                            startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
                            endTime: new Date(),
                            duration: 2700, // 45 minutes in seconds
                            participants: 4,
                            language: 'Thai/English',
                            transcript: [],
                            insights: [],
                            actionItems: []
                        };
                        
                        this.generateActionItems();
                        this.showMeetingSummary();
                    }, 1000);
                }
            }, 200);
            
        }, 1000);
    }
    
    saveSession(session) {
        const sessions = Utils.getFromStorage('meeting_sessions', []);
        sessions.unshift(session); // Add to beginning
        
        // Keep only last 50 sessions
        if (sessions.length > 50) {
            sessions.splice(50);
        }
        
        Utils.saveToStorage('meeting_sessions', sessions);
        Utils.trackEvent('meeting_session_saved', {
            duration: session.duration,
            type: session.type,
            actionItems: session.actionItems.length
        });
    }
    
    loadSavedSessions() {
        return Utils.getFromStorage('meeting_sessions', []);
    }
    
    getMeetingHistory() {
        return this.loadSavedSessions().map(session => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
            formattedDuration: Utils.formatDuration(session.duration),
            timeAgo: Utils.timeAgo(new Date(session.startTime))
        }));
    }
    
    deleteMeeting(sessionId) {
        const sessions = this.loadSavedSessions();
        const filteredSessions = sessions.filter(session => session.id !== sessionId);
        Utils.saveToStorage('meeting_sessions', filteredSessions);
        Utils.showNotification('Meeting deleted successfully', 'success');
        Utils.trackEvent('meeting_deleted', { sessionId });
    }
    
    exportMeetingData(sessionId, format = 'json') {
        const sessions = this.loadSavedSessions();
        const session = sessions.find(s => s.id === sessionId);
        
        if (!session) {
            Utils.showNotification('Meeting not found', 'error');
            return;
        }
        
        let exportData;
        let fileName;
        let mimeType;
        
        switch (format) {
            case 'json':
                exportData = JSON.stringify(session, null, 2);
                fileName = `meeting-${sessionId}.json`;
                mimeType = 'application/json';
                break;
            case 'txt':
                exportData = this.formatAsText(session);
                fileName = `meeting-${sessionId}.txt`;
                mimeType = 'text/plain';
                break;
            case 'csv':
                exportData = this.formatAsCSV(session);
                fileName = `meeting-${sessionId}.csv`;
                mimeType = 'text/csv';
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
        
        Utils.showNotification(`Meeting exported as ${format.toUpperCase()}`, 'success');
        Utils.trackEvent('meeting_exported', { format, sessionId });
    }
    
    formatAsText(session) {
        const startTime = new Date(session.startTime).toLocaleString('th-TH');
        const duration = Utils.formatDuration(session.duration);
        
        let text = `=== MEETING SUMMARY ===\n\n`;
        text += `Date: ${startTime}\n`;
        text += `Duration: ${duration}\n`;
        text += `Participants: ${session.participants}\n`;
        text += `Type: ${this.meetingTypes[session.type]?.name || session.type}\n`;
        text += `Language: ${session.language}\n\n`;
        
        text += `=== TRANSCRIPT ===\n\n`;
        session.transcript.forEach(entry => {
            const time = new Date(entry.time).toLocaleTimeString('th-TH');
            text += `[${time}] ${entry.speaker}: ${entry.text}\n\n`;
        });
        
        text += `=== ACTION ITEMS ===\n\n`;
        session.actionItems.forEach((item, index) => {
            text += `${index + 1}. ${item.task}\n`;
            text += `   Assigned to: ${item.assignee}\n`;
            text += `   Deadline: ${new Date(item.deadline).toLocaleDateString('th-TH')}\n`;
            text += `   Priority: ${item.priority}\n\n`;
        });
        
        text += `=== AI INSIGHTS ===\n\n`;
        session.insights.forEach(insight => {
            const time = new Date(insight.time).toLocaleTimeString('th-TH');
            text += `[${time}] ${insight.insight}\n`;
        });
        
        return text;
    }
    
    formatAsCSV(session) {
        let csv = 'Type,Time,Speaker,Content\n';
        
        // Add transcript entries
        session.transcript.forEach(entry => {
            const time = new Date(entry.time).toISOString();
            csv += `Transcript,"${time}","${entry.speaker}","${entry.text.replace(/"/g, '""')}"\n`;
        });
        
        // Add action items
        session.actionItems.forEach(item => {
            const deadline = new Date(item.deadline).toISOString();
            csv += `Action Item,"${deadline}","${item.assignee}","${item.task.replace(/"/g, '""')} (Priority: ${item.priority})"\n`;
        });
        
        // Add insights
        session.insights.forEach(insight => {
            const time = new Date(insight.time).toISOString();
            csv += `AI Insight,"${time}","System","${insight.insight.replace(/"/g, '""')}"\n`;
        });
        
        return csv;
    }
    
    // Meeting analysis and search
    searchMeetings(query) {
        const sessions = this.loadSavedSessions();
        const results = sessions.filter(session => {
            const searchText = `
                ${session.type} 
                ${session.transcript.map(t => t.text).join(' ')} 
                ${session.actionItems.map(a => a.task).join(' ')}
                ${session.insights.map(i => i.insight).join(' ')}
            `.toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        });
        
        Utils.trackEvent('meeting_search', { 
            query: query.substring(0, 50), 
            resultsCount: results.length 
        });
        
        return results;
    }
    
    getMeetingAnalytics() {
        const sessions = this.loadSavedSessions();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const recentSessions = sessions.filter(s => new Date(s.startTime) > oneWeekAgo);
        const monthlySessions = sessions.filter(s => new Date(s.startTime) > oneMonthAgo);
        
        return {
            totalMeetings: sessions.length,
            weeklyMeetings: recentSessions.length,
            monthlyMeetings: monthlySessions.length,
            averageDuration: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length || 0,
            totalActionItems: sessions.reduce((sum, s) => sum + (s.actionItems?.length || 0), 0),
            meetingTypes: this.getMeetingTypeBreakdown(sessions),
            efficiency: this.calculateMeetingEfficiency(recentSessions)
        };
    }
    
    getMeetingTypeBreakdown(sessions) {
        const breakdown = {};
        sessions.forEach(session => {
            breakdown[session.type] = (breakdown[session.type] || 0) + 1;
        });
        return breakdown;
    }
    
    calculateMeetingEfficiency(sessions) {
        if (sessions.length === 0) return 0;
        
        // Simple efficiency calculation based on:
        // - Duration vs action items ratio
        // - Participant engagement (mock)
        // - Follow-up completion (mock)
        
        const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
        const avgActionItems = sessions.reduce((sum, s) => sum + (s.actionItems?.length || 0), 0) / sessions.length;
        
        // Assume efficiency improves with more action items per hour
        const actionItemsPerHour = avgActionItems / (avgDuration / 3600);
        const efficiency = Math.min(95, Math.max(60, actionItemsPerHour * 20 + 70));
        
        return Math.round(efficiency);
    }
    
    // Integration with other systems
    syncWithCalendar(session) {
        // Create calendar event with meeting summary
        const event = {
            title: `Meeting Summary - ${this.meetingTypes[session.type]?.name || 'General'}`,
            start: session.startTime,
            end: session.endTime,
            description: this.generateCalendarDescription(session),
            attendees: Array.from({ length: session.participants }, (_, i) => `participant${i + 1}@company.com`)
        };
        
        Utils.showNotification('Calendar event created with meeting summary', 'success');
        Utils.trackEvent('meeting_calendar_sync', { sessionId: session.id });
        
        return event;
    }
    
    generateCalendarDescription(session) {
        let description = `Meeting Summary:\n\n`;
        description += `Duration: ${Utils.formatDuration(session.duration)}\n`;
        description += `Participants: ${session.participants}\n\n`;
        
        if (session.actionItems.length > 0) {
            description += `Action Items:\n`;
            session.actionItems.forEach((item, index) => {
                description += `${index + 1}. ${item.task} (${item.assignee}) - Due: ${new Date(item.deadline).toLocaleDateString()}\n`;
            });
        }
        
        return description;
    }
    
    // Notification and reminder system
    scheduleReminders(session) {
        session.actionItems.forEach(item => {
            const reminderTime = new Date(item.deadline.getTime() - 24 * 60 * 60 * 1000); // 1 day before
            
            if (reminderTime > new Date()) {
                // In a real app, this would schedule actual notifications
                Utils.trackEvent('reminder_scheduled', {
                    taskId: `${session.id}-${item.task}`,
                    reminderTime: reminderTime.toISOString(),
                    assignee: item.assignee
                });
            }
        });
    }
    
    // Team collaboration features
    shareSessionWithTeam(sessionId, teamMembers = []) {
        const session = this.loadSavedSessions().find(s => s.id === sessionId);
        if (!session) return;
        
        // Generate shareable link (mock)
        const shareUrl = `https://flowwork.app/meetings/${sessionId}`;
        
        // Create share payload
        const shareData = {
            title: `Meeting Summary - ${new Date(session.startTime).toLocaleDateString()}`,
            summary: `${session.actionItems.length} action items, ${Utils.formatDuration(session.duration)} duration`,
            url: shareUrl,
            sharedWith: teamMembers,
            sharedAt: new Date().toISOString()
        };
        
        Utils.showNotification(`Meeting shared with ${teamMembers.length} team members`, 'success');
        Utils.trackEvent('meeting_shared', {
            sessionId,
            recipientCount: teamMembers.length
        });
        
        return shareData;
    }
 }
 
 // Initialize Meeting system
 window.Meeting = new Meeting();
 
 // Global functions for onclick handlers
 window.Meeting.startLiveRecording = window.Meeting.startLiveRecording.bind(window.Meeting);
 window.Meeting.stopLiveRecording = window.Meeting.stopLiveRecording.bind(window.Meeting);
 window.Meeting.simulateUpload = window.Meeting.simulateUpload.bind(window.Meeting);