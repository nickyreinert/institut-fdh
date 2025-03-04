class SystemInfo {
    static hasWebRTC() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    static async getSystemInfo() {
        const info = [
            "SYSTEM INFORMATION",
            "==================",
            "",
            // Basic browser info
            `User Agent: ${navigator.userAgent}`,
            `Platform: ${navigator.platform}`,
            `Language: ${navigator.language}`,
            `Languages: ${JSON.stringify(navigator.languages)}`,
            `Do Not Track: ${navigator.doNotTrack}`,
            `Cookies Enabled: ${navigator.cookieEnabled}`,
            
            // Screen and window info
            `Screen: ${window.screen.width}x${window.screen.height}`,
            `Window Inner: ${window.innerWidth}x${window.innerHeight}`,
            `Color Depth: ${window.screen.colorDepth}`,
            `Pixel Depth: ${window.screen.pixelDepth}`,
            `Device Pixel Ratio: ${window.devicePixelRatio}`,
            
            // Location and network
            `Protocol: ${window.location.protocol}`,
            `Host: ${window.location.host}`,
            `Pathname: ${window.location.pathname}`,
            `Online Status: ${navigator.onLine}`,
            `Connection Type: ${navigator.connection?.effectiveType || 'Unknown'}`,
            `Connection Speed: ${navigator.connection?.downlink || 'Unknown'} Mbps`,
            `RTT: ${navigator.connection?.rtt || 'Unknown'} ms`,
            
            // Hardware info
            `CPU Cores: ${navigator.hardwareConcurrency || 'Unknown'}`,
            `Max Touch Points: ${navigator.maxTouchPoints}`,
            `Device Memory: ${navigator.deviceMemory || 'Unknown'} GB`,
            `Battery: ${navigator.getBattery ? 'Supported' : 'Not Supported'}`,
            `WebGL Vendor: ${SystemInfo.getWebGLInfo()}`,
            
            // Media capabilities
            `Audio: ${SystemInfo.getAudioCapabilities()}`,
            `Video: ${SystemInfo.getVideoCapabilities()}`,
            `Speakers: ${navigator.mediaDevices ? 'Available' : 'Not Available'}`,
            `Microphone: ${navigator.mediaDevices ? 'Available' : 'Not Available'}`,
            `Camera: ${navigator.mediaDevices ? 'Available' : 'Not Available'}`,
            
            // Storage info
            `Storage Quota: ${await SystemInfo.getStorageQuota()}`,
            `IndexedDB: ${window.indexedDB ? 'Available' : 'Not Available'}`,
            `LocalStorage: ${window.localStorage ? 'Available' : 'Not Available'}`,
            `SessionStorage: ${window.sessionStorage ? 'Available' : 'Not Available'}`,
            
            // Clipboard content (if available)
            // `Clipboard: ${await SystemInfo.getClipboardContent()}`,
            
            // System preferences
            `Color Scheme: ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}`,
            `Reduced Motion: ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Yes' : 'No'}`,
            `High Contrast: ${window.matchMedia('(prefers-contrast: high)').matches ? 'Yes' : 'No'}`,
            
            // Performance metrics
            `Memory: ${SystemInfo.getMemoryInfo()}`,
            `Network Type: ${SystemInfo.getNetworkType()}`,
            
            // Permissions
            `Notifications: ${await SystemInfo.getPermissionStatus('notifications')}`,
            `Geolocation: ${await SystemInfo.getPermissionStatus('geolocation')}`,
            `Camera: ${await SystemInfo.getPermissionStatus('camera')}`,
            `Microphone: ${await SystemInfo.getPermissionStatus('microphone')}`,
            
            // Browser features
            `WebGL: ${SystemInfo.hasWebGL()}`,
            `WebRTC: ${SystemInfo.hasWebRTC()}`,
            `WebAssembly: ${typeof WebAssembly !== 'undefined'}`,
            `SharedArrayBuffer: ${typeof SharedArrayBuffer !== 'undefined'}`,
            `ServiceWorker: ${navigator.serviceWorker ? 'Supported' : 'Not Supported'}`
        ];
        
        return info.join('\n');
    }

    static async getClipboardContent() {
        try {
            return await navigator.clipboard.readText();
        } catch {
            return 'Access Denied';
        }
    }

    static async getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'Unable to fetch';
        }
    }

    static getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        } catch {
            return 'Not Available';
        }
    }

    static getMemoryInfo() {
        if (performance.memory) {
            return `Total: ${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)}MB, ` +
                   `Used: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB, ` +
                   `Limit: ${Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)}MB`;
        }
        return 'Not Available';
    }

    static async getPermissionStatus(permission) {
        try {
            const result = await navigator.permissions.query({name: permission});
            return result.state;
        } catch {
            return 'Not Available';
        }
    }

    static async getStorageQuota() {
        if (navigator.storage && navigator.storage.estimate) {
            const {quota, usage} = await navigator.storage.estimate();
            return `${Math.round(usage/1024/1024)}MB used of ${Math.round(quota/1024/1024)}MB`;
        }
        return 'Not Available';
    }

    static getAudioCapabilities() {
        const audioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
        const audio = document.createElement('audio');
        return audioTypes
            .filter(type => audio.canPlayType(type))
            .join(', ');
    }

    static getVideoCapabilities() {
        const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        const video = document.createElement('video');
        return videoTypes
            .filter(type => video.canPlayType(type))
            .join(', ');
    }

    static getNetworkType() {
        if (navigator.connection) {
            return `${navigator.connection.effectiveType} ` +
                   `(${navigator.connection.downlink}Mbps, ` +
                   `RTT: ${navigator.connection.rtt}ms)`;
        }
        return 'Not Available';
    }

    static hasWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!(gl && gl instanceof WebGLRenderingContext);
        } catch {
            return false;
        }
    }
}

export default SystemInfo;

export async function showSystemInfoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content system-info-content">
            <div class="modal-header">
                S3CR3T.TXT
            </div>
            <div class="modal-body system-info-body">
                <pre>${await SystemInfo.getSystemInfo()}</pre>
            </div>
            <div class="modal-footer">
                <div class="button">Close</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add close handler
    const closeBtn = modal.querySelector('.button');
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    // Close on Escape
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}
