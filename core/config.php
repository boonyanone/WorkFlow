<?php
/**
 * FlowWork Configuration Manager
 */

class FlowWorkConfig {
    
    private $config = [];
    private $configFile = '';
    
    public function __construct() {
        $this->configFile = DATA_PATH . '/settings.json';
        $this->loadConfig();
    }
    
    private function loadConfig() {
        if (file_exists($this->configFile)) {
            $json = file_get_contents($this->configFile);
            $this->config = json_decode($json, true) ?? [];
        } else {
            $this->createDefaultConfig();
        }
    }
    
    private function createDefaultConfig() {
        $this->config = [
            'system' => [
                'version' => FLOWWORK_VERSION,
                'installed' => date('Y-m-d H:i:s'),
                'timezone' => 'Asia/Bangkok'
            ],
            'modules' => [
                'auto_load' => true,
                'allow_upload' => true,
                'max_file_size' => '10MB'
            ],
            'security' => [
                'admin_password' => null,
                'allowed_ips' => []
            ]
        ];
        
        $this->saveConfig();
    }
    
    public function get($key, $default = null) {
        $keys = explode('.', $key);
        $value = $this->config;
        
        foreach ($keys as $k) {
            if (isset($value[$k])) {
                $value = $value[$k];
            } else {
                return $default;
            }
        }
        
        return $value;
    }
    
    public function set($key, $value) {
        $keys = explode('.', $key);
        $config = &$this->config;
        
        foreach ($keys as $k) {
            if (!isset($config[$k])) {
                $config[$k] = [];
            }
            $config = &$config[$k];
        }
        
        $config = $value;
        $this->saveConfig();
    }
    
    private function saveConfig() {
        if (!is_dir(DATA_PATH)) {
            mkdir(DATA_PATH, 0755, true);
        }
        
        file_put_contents($this->configFile, json_encode($this->config, JSON_PRETTY_PRINT));
    }
}