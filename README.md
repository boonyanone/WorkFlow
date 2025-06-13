# FlowWork - AI Assistant Platform

<!-- 
🚨 IMPORTANT DEVELOPMENT GUIDELINES FOR AI ASSISTANTS 🚨

การพัฒนา FlowWork ต้องปฏิบัติตามหนักแนวทางเหล่านี้:

1. 📝 **แก้ไขเฉพาะส่วนที่ระบุ** - ห้ามเขียนโค้ดใหม่ทั้งหมด เพียงแก้ไขส่วนที่ขอให้อัปเดตเท่านั้น
2. 🎯 **ยึดตามแผนงาน** - ทำงานตามแผนที่กำหนดไว้ ไม่เปลี่ยนแปลงโครงสร้างหลักโดยไม่ได้รับอนุญาต
3. 🔧 **อัปเดตส่วนย่อย** - แก้ไขทีละไฟล์ ทีละฟังก์ชัน เพื่อลดความเสี่ยงในการผิดพลาด
4. ✅ **ตรวจสอบก่อนแก้ไข** - ศึกษาโค้ดที่มีอยู่แล้วให้เข้าใจก่อนทำการแก้ไข
5. 🧩 **รักษาความเข้ากันได้** - การแก้ไขต้องไม่ทำลายฟีเจอร์ที่ทำงานได้แล้ว
6. 📋 **อ้างอิงแผนงาน** - ใช้ chat-context.md และแผนงานที่มีอยู่เป็นหลัก
7. 🔄 **ทดสอบหลังแก้ไข** - ตรวจสอบว่าการแก้ไขไม่กระทบระบบเดิม

⚠️ หากไม่แน่ใจ ให้ถามก่อนแก้ไข อย่าสมมติหรือเดาเอาเอง
✨ เป้าหมาย: พัฒนาระบบที่เสถียร ใช้งานได้จริง และตรงตามวัตถุประสงค์

Current Phase: Phase 2 - AI Research Module Development
Last Updated: 2025-06-13
-->

Thai-focused modular AI platform with pay-per-use model.


📋 FlowWork 3.0 - Development Summary & Next Phase Plan
✅ Phase 1: Core System - COMPLETED
Status: ✅ READY FOR PRODUCTION
🎯 Achievements

✅ Modular Architecture - WordPress-style plugin system
✅ Admin Panel - Complete module management (upload, install, activate, delete)
✅ Template System - Responsive, modern UI framework
✅ Module Manager - Full lifecycle management with JSON registry
✅ Dashboard Module - Working example module (installed & active)
✅ File Upload System - ZIP package installation with progress tracking
✅ Error Handling - Comprehensive error management and user feedback

🏗️ Technical Stack

Backend: PHP 8.0+, MySQL, JSON-based configuration
Frontend: Pure CSS (no frameworks), Vanilla JavaScript, Font Awesome
Architecture: Modular plugin system with hook-based communication
File Structure: Organized core + modules separation

📁 File Structure
flowwork/
├── index.php              # Main application entry point
├── admin.php              # Admin panel (module management)
├── core/                  # Core system components
│   ├── config.php         # Configuration management
│   ├── module-manager.php # Module lifecycle management
│   └── installer.php      # ZIP package installer
├── assets/                # Core UI assets
│   ├── core.css          # Main app styles
│   ├── admin.css         # Admin panel styles
│   └── admin.js          # Admin panel JavaScript
├── data/                  # System data storage
│   ├── modules.json       # Module registry
│   └── settings.json      # System configuration
└── modules/installed/     # Installed modules directory
    └── dashboard/         # Dashboard module (example)
🔧 Key Features Working

✅ Module installation from ZIP packages
✅ Module activation/deactivation system
✅ Admin interface with drag & drop upload
✅ System health monitoring
✅ Real-time notifications
✅ Module information display
✅ Error handling and recovery


🎯 Phase 2: AI Research Module - NEXT SPRINT
Status: 🔄 READY TO START
📋 Sprint Goal
Create the core AI Research Module that enables multi-AI research capabilities with persona-based interactions and credit system.
🎨 Module Design
ai-research/
├── manifest.json                 # Module metadata
├── ai-research.php              # Main module controller
├── ui/                          # User interface components
│   ├── research-interface.html  # Main research form
│   ├── persona-selector.html    # AI persona selection
│   ├── results-viewer.html      # Research results display
│   └── credit-manager.html      # Credit usage tracking
├── assets/                      # Module assets
│   ├── ai-research.css         # Module-specific styles
│   └── ai-research.js          # Module JavaScript
├── api/                        # Backend API handlers
│   ├── research-handler.php    # Main research processing
│   ├── ai-integrations.php     # Multi-AI API integration
│   ├── credit-calculator.php   # Cost calculation
│   └── export-manager.php      # Document export
└── config/                     # Module configuration
    ├── personas.json           # AI persona definitions
    └── ai-providers.json       # AI service configurations
🧠 Core Features to Implement
1. Persona Selection System

🎭 Research Personas: นักวิจัย, นักวิเคราะห์, นักเขียน, ที่ปรึกษา
🎯 Persona Profiles: แต่ละ persona มี prompt templates และ behavior patterns
🔄 Dynamic Prompting: ปรับ AI behavior ตาม persona ที่เลือก

2. Multi-AI Integration

🤖 OpenAI GPT-4: Advanced reasoning และ analysis
🧠 Anthropic Claude: Long-context research และ summarization
🇹🇭 Typhoon (SCB): Thai language optimization
⚖️ Load Balancing: Auto-select optimal AI based on task type

3. Research Interface

📝 Research Topic Input: รับ topic และ requirements
🎛️ Research Parameters: ความลึก, ภาษา, format ที่ต้องการ
📊 Progress Tracking: Real-time research progress display
🔄 Multi-step Research: Breaking complex topics into sub-queries

4. Credit System

💰 Cost Calculation: ฿1.60 per credit with transparent pricing
📊 Usage Tracking: Real-time credit consumption monitoring
💳 Team Credit Pool: Shared credits for team accounts
📈 Usage Analytics: Credit usage reports and forecasting

5. Results Management

📄 Multi-format Export: Word, PDF, HTML, Markdown
🔗 Source Citations: Automatic source linking and verification
📤 Team Sharing: Share research results with team members
💾 Research History: Save and retrieve previous research

🎯 Implementation Priority

Module Structure - Create basic module files and manifest
Research Interface - Build main UI for research input
AI Integration - Connect to OpenAI GPT-4 (primary)
Credit System - Implement cost calculation and tracking
Results Display - Show research results with formatting
Export System - Enable document export functionality
Persona System - Add persona selection and prompting
Multi-AI Support - Add Claude and Typhoon integration

💡 Technical Considerations

API Key Management: Secure storage and rotation
Rate Limiting: Prevent API abuse and manage costs
Error Handling: Graceful degradation when AI services fail
Thai Language: Optimize prompts and responses for Thai users
Mobile Responsive: Ensure module works on all devices

📊 Success Metrics

✅ Successful research query completion rate > 95%
✅ Average research time < 2 minutes
✅ User satisfaction with research quality > 4.5/5
✅ Credit cost accuracy within 5% of actual usage
✅ Export success rate > 98%


🚀 Ready for Next Sprint
Current Status: FlowWork 3.0 core system is production-ready and fully functional. Ready to begin AI Research Module development.
Next Action: Create AI Research Module with multi-AI integration and persona-based research capabilities.

Last Updated: June 13, 2025
Development Team: FlowWork Team
Version: 3.0.0


# FlowWork 3.0 - Context for AI Assistant

## Project Overview
- **Name**: FlowWork - Modular AI Platform
- **Version**: 3.0.0  
- **Target**: Thailand market
- **Business Model**: Pay-per-AI-use (฿1.60/credit)

## Architecture
- **Core System**: Module Manager + Admin Panel ✅
- **Template**: Dynamic loading system ✅
- **Modules**: Plugin-style architecture ✅

## Current Status
✅ **Completed**:
- Core infrastructure (index.php, admin.php, core/)
- Admin panel (upload, install, manage modules)
- Dashboard module (working example)
- Template foundation (responsive, modular)

🔄 **Testing Phase**:
- System integration testing
- Module installation testing
- UI/UX validation

🎯 **Next Phase**: AI Research Module
- Persona selection system
- Multi-AI integration (GPT-4, Claude, Typhoon)
- Cost calculation & credit system
- Results display & team sharing

## Key Technologies
- **Backend**: PHP 8.0+, MySQL
- **Frontend**: Pure CSS, Vanilla JavaScript
- **Architecture**: Modular, Plugin-based
- **AI Integration**: Multi-provider APIs

## Development Approach
- WordPress-style plugin system
- Module-based development
- Pay-per-use revenue model
- Thai language focus

## Recent Decisions
- Template + Module separation
- Plugin installation via ZIP
- No subscription fees (AI usage only)
- Admin panel for module management

---
*Last updated: 2025-06-05*
*For AI Assistant: This provides full context without needing to send all code files*
