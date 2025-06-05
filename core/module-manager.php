<?php
/**
 * FlowWork Module Manager
 * Handles module loading, activation, and management
 */

class FlowWorkModuleManager {
    
    private $config;
    private $modulesFile;
    private $activeModules = [];
    
    public function __construct($config) {
        $this->config = $config;
        $this->modulesFile = DATA_PATH . '/modules.json';
        $this->loadModulesRegistry();
    }
    
    private function loadModulesRegistry() {
        if (file_exists($this->modulesFile)) {
            $json = file_get_contents($this->modulesFile);
            $this->activeModules = json_decode($json, true) ?? [];
        } else {
            $this->createModulesRegistry();
        }
    }
    
    private function createModulesRegistry() {
        if (!is_dir(DATA_PATH)) {
            mkdir(DATA_PATH, 0755, true);
        }
        
        $this->activeModules = [];
        $this->saveModulesRegistry();
    }
    
    private function saveModulesRegistry() {
        file_put_contents($this->modulesFile, json_encode($this->activeModules, JSON_PRETTY_PRINT));
    }
    
    public function getActiveModules() {
        return array_filter($this->activeModules, function($module) {
            return $module['active'] ?? false;
        });
    }
    
    public function getAllModules() {
        return $this->activeModules;
    }
    
    public function activateModule($moduleName) {
        if (isset($this->activeModules[$moduleName])) {
            $this->activeModules[$moduleName]['active'] = true;
            $this->saveModulesRegistry();
            return true;
        }
        return false;
    }
    
    public function deactivateModule($moduleName) {
        if (isset($this->activeModules[$moduleName])) {
            $this->activeModules[$moduleName]['active'] = false;
            $this->saveModulesRegistry();
            return true;
        }
        return false;
    }
    
    public function installModule($modulePath) {
        $manifest = $this->loadModuleManifest($modulePath);
        if (!$manifest) {
            throw new Exception('Invalid module: manifest.json not found or invalid');
        }
        
        // Validate module
        $this->validateModule($manifest);
        
        // Register module
        $this->activeModules[$manifest['name']] = [
            'name' => $manifest['name'],
            'version' => $manifest['version'],
            'display_name' => $manifest['display_name'],
            'description' => $manifest['description'],
            'icon' => $manifest['icon'] ?? '📦',
            'author' => $manifest['author'] ?? 'Unknown',
            'active' => false,
            'installed_at' => date('Y-m-d H:i:s'),
            'path' => $modulePath,
            'assets' => $manifest['assets'] ?? [],
            'permissions' => $manifest['permissions'] ?? []
        ];
        
        $this->saveModulesRegistry();
        return true;
    }
    
    public function deleteModule($moduleName) {
        if (isset($this->activeModules[$moduleName])) {
            // Deactivate first
            $this->deactivateModule($moduleName);
            
            // Remove from registry
            unset($this->activeModules[$moduleName]);
            $this->saveModulesRegistry();
            
            // Delete module files
            $modulePath = MODULES_PATH . '/' . $moduleName;
            if (is_dir($modulePath)) {
                $this->deleteDirectory($modulePath);
            }
            
            return true;
        }
        return false;
    }
    
    private function loadModuleManifest($modulePath) {
        $manifestFile = $modulePath . '/manifest.json';
        if (file_exists($manifestFile)) {
            $json = file_get_contents($manifestFile);
            return json_decode($json, true);
        }
        return null;
    }
    
    private function validateModule($manifest) {
        $required = ['name', 'version', 'display_name'];
        foreach ($required as $field) {
            if (!isset($manifest[$field])) {
                throw new Exception("Module validation failed: missing '$field' in manifest.json");
            }
        }
        
        // Check version compatibility
        if (isset($manifest['requires']['core_version'])) {
            $requiredVersion = $manifest['requires']['core_version'];
            if (version_compare(FLOWWORK_VERSION, str_replace('>=', '', $requiredVersion), '<')) {
                throw new Exception("Module requires FlowWork $requiredVersion or higher");
            }
        }
        
        return true;
    }
    
    public function loadActiveModules() {
        $activeModules = $this->getActiveModules();
        
        foreach ($activeModules as $module) {
            $this->loadModule($module);
        }
    }
    
    private function loadModule($module) {
        $modulePath = MODULES_PATH . '/' . $module['name'];
        $moduleFile = $modulePath . '/' . $module['name'] . '.php';
        
        if (file_exists($moduleFile)) {
            require_once $moduleFile;
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