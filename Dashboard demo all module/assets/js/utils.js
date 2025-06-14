// 🛠️ FlowWork Utility Functions
class Utils {
    
    // 🔔 Notification System
    static showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
       
        notification.innerHTML = `
            <div class="notification-content">
                <div class="flex items-start space-x-3">
                    <i class="fas ${icons[type] || 'fa-bell'} text-lg mt-0.5"></i>
                    <div class="flex-1">
                        <div class="font-medium text-sm">${message}</div>
                        <div class="text-xs opacity-75 mt-1">${new Date().toLocaleTimeString()}</div>
                    </div>
                    <button onclick="this.closest('.notification').remove()" class="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add notification to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    // ⏰ Time Utilities
    static updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    static formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    static timeAgo(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return 'เมื่อสักครู่';
        if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
        return `${Math.floor(diff / 86400)} วันที่แล้ว`;
    }
    
    // 💾 Storage Utilities
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save failed:', error);
            return false;
        }
    }
    
    static getFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage read failed:', error);
            return defaultValue;
        }
    }
    
    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove failed:', error);
            return false;
        }
    }
    
    // 🎨 UI Utilities
    static addLoadingState(element, text = 'Loading...') {
        const originalContent = element.innerHTML;
        element.setAttribute('data-original-content', originalContent);
        element.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>${text}</span>
            </div>
        `;
        element.disabled = true;
    }
    
    static removeLoadingState(element) {
        const originalContent = element.getAttribute('data-original-content');
        if (originalContent) {
            element.innerHTML = originalContent;
            element.removeAttribute('data-original-content');
        }
        element.disabled = false;
    }
    
    static typeWriter(element, text, speed = 30) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // 📱 Device Detection
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
    
    // 🔍 Search Utilities
    static highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 💰 Credits Utilities
    static updateCreditsDisplay(newAmount) {
        const creditsElement = document.getElementById('creditsCount');
        if (creditsElement) {
            const currentAmount = parseInt(creditsElement.textContent);
            const difference = newAmount - currentAmount;
            
            // Animate the change
            creditsElement.style.transform = 'scale(1.1)';
            creditsElement.textContent = newAmount.toLocaleString();
            
            // Show change indicator
            if (difference !== 0) {
                const changeIndicator = document.createElement('span');
                changeIndicator.className = `credits-change ${difference > 0 ? 'positive' : 'negative'}`;
                changeIndicator.textContent = `${difference > 0 ? '+' : ''}${difference}`;
                creditsElement.parentNode.appendChild(changeIndicator);
                
                setTimeout(() => {
                    if (changeIndicator.parentNode) {
                        changeIndicator.parentNode.removeChild(changeIndicator);
                    }
                }, 2000);
            }
            
            setTimeout(() => {
                creditsElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // 📊 Analytics Utilities
    static trackEvent(event, data = {}) {
        // In real app, this would send to analytics service
        console.log('Event tracked:', event, data);
        
        // Store locally for demo purposes
        const events = this.getFromStorage('analytics_events', []);
        events.push({
            event,
            data,
            timestamp: new Date().toISOString(),
            user: 'โล่' // In real app, get from auth
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        this.saveToStorage('analytics_events', events);
    }
    
    // 🔄 API Simulation
    static async simulateAPICall(data, delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: data,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    }
    
    // 🎯 URL Utilities
    static updateURL(view, params = {}) {
        const url = new URL(window.location);
        url.hash = view;
        
        // Add parameters
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        
        window.history.pushState({}, '', url);
    }
    
    static getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
    
    // 📁 File Utilities
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    static getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            pdf: 'fa-file-pdf text-red-500',
            doc: 'fa-file-word text-blue-500',
            docx: 'fa-file-word text-blue-500',
            xls: 'fa-file-excel text-green-500',
            xlsx: 'fa-file-excel text-green-500',
            ppt: 'fa-file-powerpoint text-orange-500',
            pptx: 'fa-file-powerpoint text-orange-500',
            txt: 'fa-file-alt text-gray-500',
            mp3: 'fa-file-audio text-purple-500',
            wav: 'fa-file-audio text-purple-500',
            mp4: 'fa-file-video text-red-500',
            jpg: 'fa-file-image text-blue-500',
            png: 'fa-file-image text-blue-500',
            zip: 'fa-file-archive text-yellow-500'
        };
        
        return iconMap[extension] || 'fa-file text-gray-500';
    }
    
    // 🌈 Color Utilities
    static getStatusColor(status) {
        const colorMap = {
            online: 'var(--success)',
            busy: 'var(--warning)', 
            away: 'var(--error)',
            offline: 'var(--gray-400)',
            recording: 'var(--error)',
            processing: 'var(--primary)',
            completed: 'var(--success)'
        };
        
        return colorMap[status] || 'var(--gray-400)';
    }
    
    // 🎭 Animation Utilities
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }
    
    static fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }
    
    // 🔧 Validation Utilities
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validateThaiText(text) {
        const thaiRegex = /[\u0E00-\u0E7F]/;
        return thaiRegex.test(text);
    }
    
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
 }
 
 // 🎨 CSS-in-JS for dynamic notifications
 const notificationStyles = `
 .notification {
    position: fixed;
    top: 120px;
    right: 24px;
    max-width: 400px;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(12px);
 }
 
 .notification.show {
    transform: translateX(0);
 }
 
 .notification.fade-out {
    transform: translateX(100%);
    opacity: 0;
 }
 
 .notification-success {
    background: rgba(236, 253, 245, 0.95);
    border: 1px solid var(--success-200);
    color: var(--success-800);
 }
 
 .notification-info {
    background: rgba(239, 246, 255, 0.95);
    border: 1px solid var(--info-200);
    color: var(--info-800);
 }
 
 .notification-warning {
    background: rgba(255, 251, 235, 0.95);
    border: 1px solid var(--warning-200);
    color: var(--warning-800);
 }
 
 .notification-error {
    background: rgba(254, 242, 242, 0.95);
    border: 1px solid var(--error-200);
    color: var(--error-800);
 }
 
 .search-highlight {
    background: rgba(124, 58, 237, 0.2);
    color: var(--primary);
    padding: 2px 4px;
    border-radius: 4px;
 }
 
 .credits-change {
    position: absolute;
    top: -20px;
    right: 0;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 6px;
    animation: fadeInUp 0.3s ease, fadeOut 0.3s ease 1.7s;
 }
 
 .credits-change.positive {
    background: var(--success-100);
    color: var(--success-700);
 }
 
 .credits-change.negative {
    background: var(--error-100);
    color: var(--error-700);
 }
 
 @keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
 }
 `;
 
 // Add styles to document
 if (!document.getElementById('utils-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'utils-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
 }
 
 // Export for module systems (future)
 if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
 }