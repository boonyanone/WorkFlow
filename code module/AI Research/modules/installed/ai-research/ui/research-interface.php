<?php
/**
 * AI Research Interface Template
 */

// Security check
if (!defined('FLOWWORK_VERSION')) {
    exit('Access denied');
}

// Get current user data
$currentUser = wp_get_current_user();
$userCredits = get_user_meta($currentUser->ID, 'flowwork_credits', true) ?: 1246;
?>

<div id="aiResearchModule" class="ai-research-module">
    
    <!-- Module Header -->
    <div class="module-header">
        <div class="header-left">
            <button class="back-button" onclick="FlowWork.loadModule('dashboard')">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div class="module-title">
                <h1><i class="fas fa-brain"></i> AI Research Assistant</h1>
                <p>ระบบวิจัยด้วย AI แบบ Multi-provider</p>
            </div>
        </div>
        <div class="header-right">
            <div class="credits-display">
                <i class="fas fa-coins"></i>
                <span id="userCredits"><?php echo number_format($userCredits); ?></span>
                <small>credits</small>
            </div>
        </div>
    </div>
    
    <!-- Research Form -->
    <div class="research-form-container">
        <div class="research-form">
            
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
                            <button type="button" class="suggestion-btn" onclick="AIResearch.useSuggestion('วิเคราะห์แนวโน้มตลาดหุ้นไทย 2025')">
                                📈 แนวโน้มตลาดหุ้น
                            </button>
                            <button type="button" class="suggestion-btn" onclick="AIResearch.useSuggestion('กลยุทธ์การตลาดดิจิทัลสำหรับ SME')">
                                💼 กลยุทธ์การตลาด
                            </button>
                            <button type="button" class="suggestion-btn" onclick="AIResearch.useSuggestion('แนวโน้มเทคโนโลยี AI ในปี 2025')">
                                🤖 เทคโนโลยี AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Advanced Options (Collapsible) -->
            <div class="form-section">
                <button class="advanced-toggle" onclick="toggleAdvancedOptions()">
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
                <button type="button" id="startResearchBtn" class="start-research-btn" onclick="AIResearch.startResearch()">
                    <i class="fas fa-rocket"></i>
                    เริ่มวิจัยด้วย AI
                </button>
            </div>
            
        </div>
    </div>
    
    <!-- Research Progress (Hidden by default) -->
    <div id="researchProgress" class="research-progress" style="display: none;">
        <div class="progress-header">
            <h3><i class="fas fa-cog fa-spin"></i> กำลังวิจัยด้วย AI...</h3>
            <button class="cancel-btn" onclick="AIResearch.cancelResearch()">
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
    
    <!-- Research Results (Hidden by default) -->
    <div id="researchResults" class="research-results" style="display: none;">
        <div class="results-header">
            <div class="results-info">
                <h3 id="resultsTitle">ผลการวิจัย</h3>
                <div class="results-meta">
                    <span id="resultsCost">ใช้ 8 credits</span>
                    <span id="resultsDuration">เวลา 2.5 นาที</span>
                    <span id="resultsModel">GPT-4</span>
                </div>
            </div>
            <div class="results-actions">
                <button class="btn-secondary" onclick="AIResearch.shareWithTeam()">
                    <i class="fas fa-users"></i> แชร์กับทีม
                </button>
                <button class="btn-primary" onclick="AIResearch.exportResults()">
                    <i class="fas fa-download"></i> ส่งออก
                </button>
                <button class="btn-secondary" onclick="AIResearch.newResearch()">
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
    
    <!-- Export Modal (Hidden by default) -->
    <div id="exportModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-download"></i> ส่งออกผลการวิจัย</h3>
                <button class="modal-close" onclick="AIResearch.closeExportModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="export-options">
                    <div class="export-option" onclick="AIResearch.exportTo('google_docs')">
                        <i class="fab fa-google-drive"></i>
                        <h4>Google Docs</h4>
                        <p>แก้ไขร่วมกันได้ Real-time</p>
                    </div>
                    <div class="export-option" onclick="AIResearch.exportTo('word')">
                        <i class="fab fa-microsoft"></i>
                        <h4>Microsoft Word</h4>
                        <p>ไฟล์ .docx พร้อมจัดรูปแบบ</p>
                    </div>
                    <div class="export-option" onclick="AIResearch.exportTo('pdf')">
                        <i class="fas fa-file-pdf"></i>
                        <h4>PDF Report</h4>
                        <p>รายงานพร้อมส่งมอบ</p>
                    </div>
                    <div class="export-option" onclick="AIResearch.exportTo('powerpoint')">
                        <i class="fab fa-microsoft"></i>
                        <h4>PowerPoint</h4>
                        <p>สไลด์นำเสนออัตโนมัติ</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Team Share Modal (Hidden by default) -->
    <div id="teamModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
            <h3><i class="fas fa-users"></i> แชร์กับทีม</h3>
               <button class="modal-close" onclick="AIResearch.closeTeamModal()">
                   <i class="fas fa-times"></i>
               </button>
           </div>
           <div class="modal-body">
               <div class="team-options">
                   <div class="option-section">
                       <h4>สร้างทีมใหม่</h4>
                       <div class="team-form">
                           <input type="text" id="teamName" placeholder="ชื่อทีม เช่น ทีมการตลาดดิจิทัล">
                           <div class="team-members">
                               <label>เชิญสมาชิก:</label>
                               <div class="member-input">
                                   <input type="email" id="memberEmail" placeholder="email@company.com">
                                   <button onclick="AIResearch.addTeamMember()">
                                       <i class="fas fa-plus"></i>
                                   </button>
                               </div>
                               <div id="membersList" class="members-list">
                                   <!-- Added members will appear here -->
                               </div>
                           </div>
                           <div class="team-settings">
                               <label>
                                   <input type="checkbox" checked>
                                   สร้าง Google Chat Space อัตโนมัติ
                               </label>
                               <label>
                                   <input type="checkbox" checked>
                                   สร้าง Google Docs สำหรับแก้ไขร่วมกัน
                               </label>
                               <label>
                                   <input type="checkbox" checked>
                                   ส่งอีเมลเชิญเข้าทีม
                               </label>
                           </div>
                           <button class="create-team-btn" onclick="AIResearch.createTeam()">
                               <i class="fas fa-rocket"></i> สร้างทีมและแชร์
                           </button>
                       </div>
                   </div>
                   
                   <div class="divider">หรือ</div>
                   
                   <div class="option-section">
                       <h4>แชร์กับทีมที่มีอยู่</h4>
                       <div id="existingTeams" class="existing-teams">
                           <!-- Existing teams will be loaded here -->
                       </div>
                   </div>
               </div>
           </div>
       </div>
   </div>
   
</div>

<script>
// Initialize module when loaded
document.addEventListener('DOMContentLoaded', function() {
   if (typeof AIResearch !== 'undefined') {
       AIResearch.init();
   }
});
</script>