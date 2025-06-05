<?php
/**
 * FlowWork Module Installer
 * Handles module installation from ZIP files
 */

class FlowWorkInstaller {
    
    private $uploadPath;
    private $moduleManager;
    
    public function __construct($moduleManager = null) {
        $this->uploadPath = DATA_PATH . '/uploads';
        $this->moduleManager = $moduleManager;
        
        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }
    
    public function installFromZip($zipFile) {
        try {
            // Validate file
            if (!file_exists($zipFile)) {
                throw new Exception('Upload file not found');
            }
            
            // Extract ZIP
            $extractPath = $this->extractZip($zipFile);
            if (!$extractPath) {
                throw new Exception('Failed to extract module package');
            }
            
            // Load and validate manifest
            $manifest = $this->loadManifest($extractPath);
            if (!$manifest) {
                throw new Exception('Invalid module: manifest.json not found');
            }
            
            // Install module files
            $installPath = $this->installModuleFiles($extractPath, $manifest['name']);
            
            // Register module
            if ($this->moduleManager) {
                $this->moduleManager->installModule($installPath);
            }
            
            // Cleanup temp files
            $this->cleanup($extractPath);
            
            return [
                'success' => true,
                'module' => $manifest['name'],
                'version' => $manifest['version'],
                'message' => 'Module installed successfully'
            ];
            
        } catch (Exception $e) {
            // Cleanup on error
            if (isset($extractPath)) {
                $this->cleanup($extractPath);
            }
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    private function extractZip($zipFile) {
        $zip = new ZipArchive();
        $result = $zip->open($zipFile);
        
        if ($result === TRUE) {
            $extractPath = $this->uploadPath . '/temp_' . uniqid();
            mkdir($extractPath, 0755, true);
            
            $zip->extractTo($extractPath);
            $zip->close();
            
            return $extractPath;
        }
        
        return false;
    }
    
    private function loadManifest($extractPath) {
        // Look for manifest.json in extracted files
        $manifestFile = $this->findManifestFile($extractPath);
        if ($manifestFile && file_exists($manifestFile)) {
            $json = file_get_contents($manifestFile);
            return json_decode($json, true);
        }
        return null;
    }
    
    private function findManifestFile($path) {
        // Check root
        if (file_exists($path . '/manifest.json')) {
            return $path . '/manifest.json';
        }
        
        // Check subdirectories
        $dirs = glob($path . '/*', GLOB_ONLYDIR);
        foreach ($dirs as $dir) {
            if (file_exists($dir . '/manifest.json')) {
                return $dir . '/manifest.json';
            }
        }
        
        return null;
    }
    
    private function installModuleFiles($extractPath, $moduleName) {
        $installPath = MODULES_PATH . '/' . $moduleName;
        
        // Create module directory
        if (!is_dir(MODULES_PATH)) {
            mkdir(MODULES_PATH, 0755, true);
        }
        
        if (is_dir($installPath)) {
            $this->deleteDirectory($installPath);
        }
        
        mkdir($installPath, 0755, true);
        
        // Find module source directory
        $sourceDir = $this->findModuleSource($extractPath);
        if (!$sourceDir) {
            throw new Exception('Module source files not found');
        }
        
        // Copy files
        $this->copyDirectory($sourceDir, $installPath);
        
        return $installPath;
    }
    
    private function findModuleSource($extractPath) {
        // Check if manifest is in root
        if (file_exists($extractPath . '/manifest.json')) {
            return $extractPath;
        }
        
        // Check subdirectories
        $dirs = glob($extractPath . '/*', GLOB_ONLYDIR);
        foreach ($dirs as $dir) {
            if (file_exists($dir . '/manifest.json')) {
                return $dir;
            }
        }
        
        return null;
    }
    
    private function copyDirectory($source, $destination) {
        if (!is_dir($source)) return false;
        
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }
        
        $files = scandir($source);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $sourcePath = $source . '/' . $file;
            $destPath = $destination . '/' . $file;
            
            if (is_dir($sourcePath)) {
                $this->copyDirectory($sourcePath, $destPath);
            } else {
                copy($sourcePath, $destPath);
            }
        }
        
        return true;
    }
    
    private function cleanup($path) {
        if (is_dir($path)) {
            $this->deleteDirectory($path);
        }
    }
    
    private function deleteDirectory($dir) {
        if (!is_dir($dir)) return false;
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                unlink($path);
            }
        }
        
        return rmdir($dir);
    }
}