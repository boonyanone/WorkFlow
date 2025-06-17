<?php
/**
 * Export Manager
 * Handles document export in various formats
 * 
 * @version 1.0.0
 * @author FlowWork Team
 */

class ExportManager {
    
    private $tempDir;
    private $supportedFormats;
    
    public function __construct() {
        $this->tempDir = sys_get_temp_dir() . '/flowwork_exports/';
        $this->supportedFormats = ['html', 'pdf', 'word', 'txt'];
        $this->ensureTempDirectory();
    }
    
    private function ensureTempDirectory() {
        if (!is_dir($this->tempDir)) {
            mkdir($this->tempDir, 0755, true);
        }
    }
    
    public function exportResearch($researchData, $format = 'html') {
        if (!in_array($format, $this->supportedFormats)) {
            throw new Exception('Unsupported export format: ' . $format);
        }
        
        switch ($format) {
            case 'html':
                return $this->exportToHTML($researchData);
                
            case 'pdf':
                return $this->exportToPDF($researchData);
                
            case 'word':
                return $this->exportToWord($researchData);
                
            case 'txt':
                return $this->exportToText($researchData);
                
            default:
                throw new Exception('Export format not implemented: ' . $format);
        }
    }
    
    private function exportToHTML($data) {
        $html = $this->generateHTMLContent($data);
        
        $filename = 'research_' . date('Y-m-d_H-i-s') . '.html';
        $filepath = $this->tempDir . $filename;
        
        file_put_contents($filepath, $html);
        
        return [
            'filename' => $filename,
            'filepath' => $filepath,
            'size' => filesize($filepath),
            'mime_type' => 'text/html'
        ];
    }
    
    private function exportToPDF($data) {
        // For now, we'll create a simple HTML-to-PDF conversion
        // In production, you might want to use libraries like TCPDF, mPDF, or Puppeteer
        
        $html = $this->generateHTMLContent($data, true); // PDF-optimized
        
        $filename = 'research_' . date('Y-m-d_H-i-s') . '.pdf';
        $filepath = $this->tempDir . $filename;
        
        // Simple PDF generation (mock)
        // In production, implement actual PDF library
        $pdfContent = $this->htmlToPDFMock($html);
        file_put_contents($filepath, $pdfContent);
        
        return [
            'filename' => $filename,
            'filepath' => $filepath,
            'size' => filesize($filepath),
            'mime_type' => 'application/pdf'
        ];
    }
    
    private function exportToWord($data) {
        // Simple Word document generation
        // In production, use libraries like PHPWord
        
        $content = $this->generateWordContent($data);
        
        $filename = 'research_' . date('Y-m-d_H-i-s') . '.docx';
        $filepath = $this->tempDir . $filename;
        
        // Mock Word file creation
        file_put_contents($filepath, $content);
        
        return [
            'filename' => $filename,
            'filepath' => $filepath,
            'size' => filesize($filepath),
            'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
    }
    
    private function exportToText($data) {
        $content = $this->generateTextContent($data);
        
        $filename = 'research_' . date('Y-m-d_H-i-s') . '.txt';
        $filepath = $this->tempDir . $filename;
        
        file_put_contents($filepath, $content);
        
        return [
            'filename' => $filename,
            'filepath' => $filepath,
            'size' => filesize($filepath),
            'mime_type' => 'text/plain'
        ];
    }
    
    private function generateHTMLContent($data, $pdfOptimized = false) {
        $title = htmlspecialchars($data['topic'] ?? 'AI Research Results');
        $summary = htmlspecialchars($data['summary'] ?? '');
        $content = nl2br(htmlspecialchars($data['content'] ?? ''));
        $timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
        $persona = $data['persona'] ?? 'researcher';
        
        $css = $pdfOptimized ? $this->getPDFOptimizedCSS() : $this->getWebOptimizedCSS();
        
        $sourcesHTML = '';
        if (!empty($data['sources'])) {
            $sourcesHTML = '<h2>แหล่งข้อมูลอ้างอิง</h2><ul>';
            foreach ($data['sources'] as $source) {
                $url = htmlspecialchars($source['url']);
                $title = htmlspecialchars($source['title']);
                $sourcesHTML .= "<li><a href=\"{$url}\" target=\"_blank\">{$title}</a></li>";
            }
            $sourcesHTML .= '</ul>';
        }
        
        return "
<!DOCTYPE html>
<html lang=\"th\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{$title}</title>
    <style>{$css}</style>
</head>
<body>
    <div class=\"container\">
        <header class=\"document-header\">
            <h1>{$title}</h1>
            <div class=\"meta-info\">
                <span class=\"persona\">บุคลิก AI: {$persona}</span>
                <span class=\"timestamp\">วันที่: {$timestamp}</span>
            </div>
        </header>
        
        <main class=\"document-content\">
            <section class=\"summary-section\">
                <h2>สรุปสำคัญ</h2>
                <div class=\"summary\">{$summary}</div>
            </section>
            
            <section class=\"content-section\">
                <h2>รายละเอียดการวิจัย</h2>
                <div class=\"research-content\">{$content}</div>
            </section>
            
            <section class=\"sources-section\">
                {$sourcesHTML}
            </section>
        </main>
        
        <footer class=\"document-footer\">
            <p>สร้างโดย FlowWork AI Research Assistant</p>
            <p>เว็บไซต์: https://work.flow.in.th</p>
        </footer>
    </div>
</body>
</html>";
    }
    
    private function getWebOptimizedCSS() {
        return "
body {
    font-family: 'Noto Sans Thai', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.document-header {
    border-bottom: 3px solid #6366f1;
    padding-bottom: 20px;
    margin-bottom: 30px;
}

.document-header h1 {
    color: #6366f1;
    margin-bottom: 10px;
}

.meta-info {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #666;
}

.document-content section {
    margin-bottom: 30px;
}

.document-content h2 {
    color: #374151;
    border-left: 4px solid #6366f1;
    padding-left: 15px;
    margin-bottom: 15px;
}

.summary {
    background: #f0f4ff;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #6366f1;
}

.research-content {
    text-align: justify;
}

.sources-section ul {
    list-style-type: none;
    padding: 0;
}

.sources-section li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.sources-section a {
    color: #6366f1;
    text-decoration: none;
}

.sources-section a:hover {
    text-decoration: underline;
}

.document-footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    color: #888;
    font-size: 12px;
}";
    }
    
    private function getPDFOptimizedCSS() {
        return "
body {
    font-family: 'Noto Sans Thai', Arial, sans-serif;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 100%;
}

.document-header {
    border-bottom: 2px solid #333;
    padding-bottom: 15px;
    margin-bottom: 25px;
}

.document-header h1 {
    color: #333;
    margin-bottom: 8px;
    font-size: 24px;
}

.meta-info {
    font-size: 12px;
    color: #666;
}

.document-content h2 {
    color: #000;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin: 20px 0 10px 0;
}

.summary {
    background: #f5f5f5;
    padding: 15px;
    margin: 10px 0;
    border-left: 3px solid #333;
}

.document-footer {
    text-align: center;
    margin-top: 30px;
    font-size: 10px;
    color: #666;
}";
    }
    
    private function generateWordContent($data) {
        // Simple RTF format for Word compatibility
        $title = $data['topic'] ?? 'AI Research Results';
        $summary = $data['summary'] ?? '';
        $content = $data['content'] ?? '';
        $timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
        
        $rtf = "{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}";
        $rtf .= "\\f0\\fs24 ";
        $rtf .= "{\\b\\fs32 " . $title . "\\par}";
        $rtf .= "{\\fs20 วันที่: " . $timestamp . "\\par\\par}";
        $rtf .= "{\\b สรุปสำคัญ\\par}";
        $rtf .= $summary . "\\par\\par";
        $rtf .= "{\\b รายละเอียดการวิจัย\\par}";
        $rtf .= $content . "\\par\\par";
        $rtf .= "{\\fs16 สร้างโดย FlowWork AI Research Assistant\\par}";
        $rtf .= "}";
        
        return $rtf;
    }
    
    private function generateTextContent($data) {
        $title = $data['topic'] ?? 'AI Research Results';
        $summary = $data['summary'] ?? '';
        $content = $data['content'] ?? '';
        $timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
        
        $text = strtoupper($title) . "\n";
        $text .= str_repeat("=", strlen($title)) . "\n\n";
        $text .= "วันที่: " . $timestamp . "\n\n";
        $text .= "สรุปสำคัญ\n";
        $text .= str_repeat("-", 12) . "\n";
        $text .= $summary . "\n\n";
        $text .= "รายละเอียดการวิจัย\n";
        $text .= str_repeat("-", 20) . "\n";
        $text .= $content . "\n\n";
        
        if (!empty($data['sources'])) {
            $text .= "แหล่งข้อมูลอ้างอิง\n";
            $text .= str_repeat("-", 17) . "\n";
            foreach ($data['sources'] as $i => $source) {
                $text .= ($i + 1) . ". " . $source['title'] . " (" . $source['url'] . ")\n";
            }
            $text .= "\n";
        }
        
        $text .= str_repeat("-", 50) . "\n";
        $text .= "สร้างโดย FlowWork AI Research Assistant\n";
        $text .= "เว็บไซต์: https://work.flow.in.th\n";
        
        return $text;
    }
    
    private function htmlToPDFMock($html) {
        // Mock PDF content (in production, use actual PDF library)
        return "%PDF-1.4\nMock PDF content for: " . strip_tags($html);
    }
    
    public function downloadFile($filepath, $filename, $mimeType) {
        if (!file_exists($filepath)) {
            throw new Exception('Export file not found');
        }
        
        // Set headers for download
        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filepath));
        header('Cache-Control: no-cache');
        
        // Output file
        readfile($filepath);
        
        // Clean up temp file
        unlink($filepath);
        
        exit;
    }
    
    public function handleRequest() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $action = $input['action'] ?? '';
            
            if ($action !== 'export') {
                throw new Exception('Invalid action');
            }
            
            $format = $input['format'] ?? 'html';
            $researchId = $input['research_id'] ?? '';
            
            // Load research data (mock for now)
            $researchData = $this->loadResearchData($researchId);
            
            // Export file
            $exportResult = $this->exportResearch($researchData, $format);
            
            // Download file
            $this->downloadFile(
                $exportResult['filepath'],
                $exportResult['filename'],
                $exportResult['mime_type']
            );
            
        } catch (Exception $e) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function loadResearchData($researchId) {
        // Mock research data (in production, load from database)
        return [
            'id' => $researchId,
            'topic' => 'แนวโน้มการใช้ AI ในธุรกิจไทย 2025',
            'summary' => 'การใช้งาน AI ในธุรกิจไทยมีการเติบโตอย่างรวดเร็ว โดยเฉพาะในภาคการเงิน การค้าปลีก และการผลิต',
            'content' => 'รายละเอียดการวิจัยพบว่า...\n\n1. ภาคการเงิน: ใช้ AI สำหรับการวิเคราะห์ความเสี่ยง\n2. การค้าปลีก: ระบบแนะนำสินค้า\n3. การผลิต: การควบคุมคุณภาพอัตโนมัติ',
            'sources' => [
                [
                    'title' => 'Thailand AI Report 2025',
                    'url' => 'https://example.com/ai-report-2025'
                ]
            ],
            'timestamp' => date('Y-m-d H:i:s'),
            'persona' => 'researcher'
        ];
    }
}

// Handle direct requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $exportManager = new ExportManager();
    $exportManager->handleRequest();
}
?>