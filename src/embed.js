(function() {
    'use strict';

    if (window.RAGChatWidget) {
        console.warn('RAGChatWidget already exists, skipping initialization');
        return;
    }

    function injectStyles() {
        if (document.getElementById('rag-chat-widget-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'rag-chat-widget-styles';
        style.textContent = `
            :root {
                --rag-primary-color: #3134db;
                --rag-primary-hover: #140d8a;
                --rag-primary-light: #a5b4fc;
                --rag-success-color: #10b981;
                --rag-error-color: #ef4444;
                --rag-warning-color: #f59e0b;
                --rag-background: #ffffff;
                --rag-surface: #f8fafc;
                --rag-surface-hover: #f1f5f9;
                --rag-surface-secondary: #e2e8f0;
                --rag-text-primary: #1e293b;
                --rag-text-secondary: #64748b;
                --rag-text-muted: #94a3b8;
                --rag-border-color: #e2e8f0;
                --rag-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --rag-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --rag-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                --rag-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }

            [data-rag-theme="dark"] {
                --rag-primary-color: #3c4eeb;
                --rag-primary-hover: #383a88;
                --rag-primary-light: #c7d2fe;
                --rag-background: #0f172a;
                --rag-surface: #1e293b;
                --rag-surface-hover: #334155;
                --rag-surface-secondary: #475569;
                --rag-text-primary: #f8fafc;
                --rag-text-secondary: #cbd5e1;
                --rag-text-muted: #94a3b8;
                --rag-border-color: #334155;
            }

            .rag-chat-widget-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 999999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .rag-chat-widget-embedded {
                position: relative;
                width: 100%;
                height: 100%;
                min-height: 500px;
                max-height: 800px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
            }

            .rag-chat-bubble {
                position: fixed;
                bottom: 100px;
                right: 24px;
                transform: scale(0.8) translateY(20px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                background: var(--rag-background);
                border: 1px solid var(--rag-border-color);
                border-radius: 16px;
                box-shadow: var(--rag-shadow-xl);
                backdrop-filter: blur(10px);
                overflow: hidden;
                width: 400px;
                height: 600px;
                display: none;
                flex-direction: column;
            }

            .rag-chat-bubble.rag-open {
                transform: scale(1) translateY(0);
                opacity: 1;
                display: flex;
            }

            .rag-chat-bubble.rag-embedded {
                position: relative;
                transform: scale(1) translateY(0);
                opacity: 1;
                width: 100%;
                height: 100%;
                border-radius: 12px;
                display: flex;
                bottom: auto;
                right: auto;
                max-width: 100%;
                min-height: 500px;
            }

            .rag-chat-button {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, var(--rag-primary-color), var(--rag-primary-hover));
                border: none;
                border-radius: 50%;
                width: 64px;
                height: 64px;
                color: white;
                cursor: pointer;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--rag-shadow-lg);
                font-size: 24px;
            }

            .rag-chat-button:hover {
                transform: scale(1.05) translateY(-2px);
                box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.2);
            }

            .rag-chat-button:active {
                transform: scale(0.95);
            }

            .rag-chat-header {
                background: linear-gradient(135deg, var(--rag-primary-color), var(--rag-primary-hover));
                color: white;
                padding: 16px 20px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .rag-chat-header.rag-embedded {
                border-radius: 12px 12px 0 0;
            }

            .rag-chat-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .rag-chat-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                font-size: 16px;
                overflow: hidden;
                flex-shrink: 0;
            }

            .rag-chat-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }

            .rag-chat-title {
                font-weight: 600;
                font-size: 15px;
                margin: 0;
                letter-spacing: -0.025em;
                line-height: 1.3;
            }

            .rag-chat-status {
                font-size: 12px;
                opacity: 0.9;
                margin: 2px 0 0 0;
                display: flex;
                align-items: center;
                gap: 6px;
                line-height: 1;
            }

            .rag-status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                display: inline-block;
                animation: rag-pulse-status 2s infinite;
            }

            @keyframes rag-pulse-status {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }

            .rag-close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                font-size: 14px;
            }

            .rag-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .rag-messages-area {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: var(--rag-surface);
                scrollbar-width: thin;
                scrollbar-color: var(--rag-border-color) transparent;
                scroll-behavior: smooth;
                min-height: 0;
            }

            .rag-messages-area::-webkit-scrollbar {
                width: 4px;
            }

            .rag-messages-area::-webkit-scrollbar-track {
                background: transparent;
            }

            .rag-messages-area::-webkit-scrollbar-thumb {
                background: var(--rag-border-color);
                border-radius: 4px;
            }

            .rag-messages-area::-webkit-scrollbar-thumb:hover {
                background: var(--rag-text-secondary);
            }

            .rag-message {
                margin-bottom: 16px;
                animation: rag-message-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            @keyframes rag-message-slide {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .rag-message-user {
                display: flex;
                justify-content: flex-end;
            }

            .rag-message-assistant {
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }

            .rag-message-content {
                max-width: calc(100% - 50px);
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
                word-break: break-word;
            }

            .rag-message-user .rag-message-content {
                background: linear-gradient(135deg, var(--rag-primary-color), var(--rag-primary-hover));
                color: white;
                border-radius: 16px 16px 4px 16px;
                box-shadow: var(--rag-shadow-sm);
                max-width: 75%;
            }

            .rag-message-assistant .rag-message-content {
                background: var(--rag-background);
                color: var(--rag-text-primary);
                border: 1px solid var(--rag-border-color);
                border-radius: 16px 16px 16px 4px;
                box-shadow: var(--rag-shadow-sm);
            }

            .rag-message-error .rag-message-content {
                background: #fef2f2;
                color: #dc2626;
                border: 1px solid #fecaca;
                border-radius: 16px 16px 16px 4px;
            }

            .rag-assistant-avatar {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, var(--rag-primary-color), var(--rag-primary-hover));
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: white;
                font-size: 14px;
                box-shadow: var(--rag-shadow-sm);
                overflow: hidden;
            }

            .rag-assistant-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }

            .rag-message-time {
                font-size: 11px;
                color: var(--rag-text-muted);
                margin-top: 4px;
                text-align: right;
            }

            .rag-message-assistant .rag-message-time {
                text-align: left;
            }

            .rag-quick-actions {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .rag-quick-action-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                text-align: left;
                background: var(--rag-surface-hover);
                border: 1px solid var(--rag-border-color);
                color: var(--rag-text-primary);
                font-size: 12px;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }

            .rag-quick-action-btn:hover {
                background: var(--rag-primary-color);
                color: white;
                border-color: var(--rag-primary-color);
                transform: translateY(-1px);
                box-shadow: var(--rag-shadow-md);
            }

            .rag-input-area {
                padding: 16px;
                border-top: 1px solid var(--rag-border-color);
                background: var(--rag-background);
                border-radius: 0 0 16px 16px;
                flex-shrink: 0;
            }

            .rag-input-area.rag-embedded {
                border-radius: 0 0 12px 12px;
            }

            .rag-input-container {
                display: flex;
                gap: 8px;
                align-items: flex-end;
                background: var(--rag-surface);
                padding: 4px;
                border-radius: 12px;
                border: 1px solid var(--rag-border-color);
                transition: all 0.2s ease;
            }

            .rag-input-container:focus-within {
                border-color: var(--rag-primary-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }

            .rag-message-input {
                flex: 1;
                border: none;
                border-radius: 10px;
                padding: 10px 12px;
                font-size: 14px;
                background: transparent;
                color: var(--rag-text-primary);
                resize: none;
                min-height: 20px;
                max-height: 80px;
                font-family: inherit;
                line-height: 1.4;
            }

            .rag-message-input:focus {
                outline: none;
            }

            .rag-message-input::placeholder {
                color: var(--rag-text-muted);
            }

            .rag-message-input:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .rag-send-btn {
                background: linear-gradient(135deg, var(--rag-primary-color), var(--rag-primary-hover));
                border: none;
                border-radius: 10px;
                color: white;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 14px;
                flex-shrink: 0;
            }

            .rag-send-btn:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: var(--rag-shadow-md);
            }

            .rag-send-btn:active {
                transform: scale(0.95);
            }

            .rag-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .rag-input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
                font-size: 11px;
                color: var(--rag-text-muted);
            }

            .rag-typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 0;
                justify-content: center;
            }

            .rag-typing-dot {
                width: 6px;
                height: 6px;
                background: var(--rag-text-secondary);
                border-radius: 50%;
                animation: rag-typing-bounce 1.4s infinite ease-in-out;
            }

            .rag-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .rag-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes rag-typing-bounce {
                0%, 80%, 100% { 
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% { 
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .rag-status-online .rag-status-dot { background: var(--rag-success-color); }
            .rag-status-offline .rag-status-dot { background: var(--rag-error-color); }
            .rag-status-limited .rag-status-dot { background: var(--rag-warning-color); }

            .rag-notification-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 700;
                box-shadow: var(--rag-shadow-md);
                animation: rag-badge-bounce 2s infinite;
            }

            @keyframes rag-badge-bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .rag-chat-widget-container {
                    bottom: 16px;
                    right: 16px;
                }

                .rag-chat-bubble {
                    bottom: 80px !important;
                    right: 16px !important;
                    left: 16px !important;
                    width: auto !important;
                    height: 70vh !important;
                    max-height: 500px !important;
                }

                .rag-chat-button {
                    width: 56px;
                    height: 56px;
                    font-size: 20px;
                }

                .rag-chat-header {
                    padding: 12px 16px;
                }

                .rag-chat-title {
                    font-size: 14px;
                }

                .rag-chat-status {
                    font-size: 11px;
                }

                .rag-chat-avatar {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                }

                .rag-messages-area {
                    padding: 12px;
                }

                .rag-message-content {
                    font-size: 13px;
                    padding: 10px 14px;
                    max-width: calc(100% - 45px);
                }

                .rag-message-user .rag-message-content {
                    max-width: 85%;
                }

                .rag-assistant-avatar {
                    width: 28px;
                    height: 28px;
                    font-size: 12px;
                }

                .rag-input-area {
                    padding: 12px;
                }

                .rag-message-input {
                    font-size: 13px;
                    padding: 8px 10px;
                }

                .rag-send-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 12px;
                }
            }

            /* Small mobile devices */
            @media (max-width: 480px) {
                .rag-chat-bubble {
                    height: 75vh !important;
                    max-height: 450px !important;
                }

                .rag-message-content {
                    font-size: 12px;
                    padding: 8px 12px;
                }

                .rag-quick-action-btn {
                    font-size: 11px;
                    padding: 6px 10px;
                }
            }

            /* Embedded widget specific styles */
            .rag-chat-widget-embedded {
                box-sizing: border-box;
            }

            .rag-chat-widget-embedded * {
                box-sizing: border-box;
            }

            /* Dark mode adjustments */
            [data-rag-theme="dark"] .rag-message-assistant .rag-message-content {
                background: var(--rag-surface);
                border-color: var(--rag-border-color);
            }

            [data-rag-theme="dark"] .rag-input-container {
                background: var(--rag-surface);
                border-color: var(--rag-border-color);
            }

            [data-rag-theme="dark"] .rag-quick-action-btn {
                background: var(--rag-surface);
                border-color: var(--rag-border-color);
            }

            /* Accessibility */
            @media (prefers-reduced-motion: reduce) {
                .rag-chat-bubble,
                .rag-chat-button,
                .rag-message,
                .rag-typing-dot,
                .rag-notification-badge {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }

            /* Focus styles for keyboard navigation */
            .rag-chat-button:focus,
            .rag-close-btn:focus,
            .rag-send-btn:focus,
            .rag-quick-action-btn:focus {
                outline: 2px solid var(--rag-primary-color);
                outline-offset: 2px;
            }

            .rag-message-input:focus {
                outline: none;
            }
        `;

        document.head.appendChild(style);
    }

    function loadFontAwesome() {
        if (document.querySelector('link[href*="font-awesome"]')) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            link.onload = () => resolve();
            link.onerror = () => reject();
            document.head.appendChild(link);
        });
    }

    function loadInterFont() {
        if (document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            link.onload = () => resolve();
            link.onerror = () => reject();
            document.head.appendChild(link);
        });
    }

    // Utility function to format time
    function formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }

    // RAG Chat Widget Class
    class RAGChatWidget {
        constructor(options = {}) {
            this.config = {
                apiUrl: options.apiUrl || 'https://rag-render-newy.onrender.com/api',
                title: options.title || 'AI Assistant',
                subtitle: options.subtitle || 'Online',
                theme: options.theme || 'auto',
                embedded: options.embedded || false,
                container: options.container || null,
                width: options.width || '400px',
                height: options.height || '600px',
                placeholder: options.placeholder || 'Ask me anything...',
                position: options.position || 'bottom-right',
                avatar: options.avatar || null,
                showTime: options.showTime !== false,
                ...options
            };

            this.isOpen = false;
            this.isLoading = false;
            this.conversationId = null;
            this.messages = [];
            this.isConnected = false;

            this.init();
        }

        async init() {
            try {
                await Promise.all([
                    loadFontAwesome().catch(() => console.warn('Font Awesome failed to load')),
                    loadInterFont().catch(() => console.warn('Inter font failed to load'))
                ]);

                this.createWidget();
                this.bindEvents();
                this.checkConnection();
                this.applyTheme();
            } catch (error) {
                console.error('RAG Chat Widget initialization failed:', error);
                this.createWidget();
                this.bindEvents();
                this.checkConnection();
                this.applyTheme();
            }
        }

        createWidget() {
            const container = this.config.container ? 
                document.getElementById(this.config.container) : 
                document.body;

            if (!container) {
                console.error('RAG Chat Widget: Container not found');
                return;
            }

            const widgetHTML = this.config.embedded ? 
                this.createEmbeddedWidget() : 
                this.createFloatingWidget();

            if (this.config.embedded) {
                container.innerHTML = widgetHTML;
            } else {
                const widgetDiv = document.createElement('div');
                widgetDiv.innerHTML = widgetHTML;
                container.appendChild(widgetDiv);
            }

            this.elements = {
                widget: document.getElementById('rag-chat-widget'),
                bubble: document.getElementById('rag-chat-bubble'),
                toggleBtn: document.getElementById('rag-chat-toggle-btn'),
                closeBtn: document.getElementById('rag-close-chat-btn'),
                messagesArea: document.getElementById('rag-messages-area'),
                messageInput: document.getElementById('rag-message-input'),
                sendBtn: document.getElementById('rag-send-btn'),
                statusIndicator: document.getElementById('rag-status-indicator'),
                charCount: document.getElementById('rag-char-count')
            };
        }

        createFloatingWidget() {
            return `
                <div class="rag-chat-widget-container" id="rag-chat-widget">
                    <div class="rag-chat-bubble" id="rag-chat-bubble">
                        ${this.createChatContent()}
                    </div>
                    <button class="rag-chat-button" id="rag-chat-toggle-btn" aria-label="Open chat">
                        <i class="fas fa-comments" id="rag-chat-icon"></i>
                        <i class="fas fa-times" id="rag-close-icon" style="display: none;"></i>
                        <div class="rag-notification-badge" id="rag-notification-badge" style="display: none;">1</div>
                    </button>
                </div>
            `;
        }

        createEmbeddedWidget() {
            return `
                <div class="rag-chat-widget-embedded" id="rag-chat-widget">
                    <div class="rag-chat-bubble rag-embedded" id="rag-chat-bubble">
                        ${this.createChatContent(true)}
                    </div>
                </div>
            `;
        }

        createChatContent(embedded = false) {
            const avatarContent = this.config.avatar ? 
                `<img src="${this.config.avatar}" alt="Assistant" />` : 
                `<i class="fas fa-sparkles"></i>`;

            return `
                <div class="rag-chat-header ${embedded ? 'rag-embedded' : ''}">
                    <div class="rag-chat-header-info">
                        <div class="rag-chat-avatar">
                            ${avatarContent}
                        </div>
                        <div>
                            <h3 class="rag-chat-title">${this.config.title}</h3>
                            <p class="rag-chat-status">
                                <span class="rag-status-dot"></span>
                                <span id="rag-status-indicator">Connecting...</span>
                            </p>
                        </div>
                    </div>
                    ${!embedded ? '<button class="rag-close-btn" id="rag-close-chat-btn" aria-label="Close chat"><i class="fas fa-times"></i></button>' : ''}
                </div>

                <div class="rag-messages-area" id="rag-messages-area">
                    <div class="rag-message rag-message-assistant">
                        <div class="rag-assistant-avatar">
                            ${avatarContent}
                        </div>
                        <div class="rag-message-content">
                            <p>Hello! I'm your AI assistant. I'm here to help answer your questions and provide support.</p>
                            ${this.config.showTime ? `<div class="rag-message-time">${formatTime(new Date())}</div>` : ''}
                            <div class="rag-quick-actions">
                                <button class="rag-quick-action-btn" data-query="How can you help me?">
                                    <i class="fas fa-question-circle"></i>
                                    How can you help me?
                                </button>
                                <button class="rag-quick-action-btn" data-query="What can you do?">
                                    <i class="fas fa-star"></i>
                                    What can you do?
                                </button>
                                <button class="rag-quick-action-btn" data-query="I need support">
                                    <i class="fas fa-headset"></i>
                                    I need support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rag-input-area ${embedded ? 'rag-embedded' : ''}">
                    <div class="rag-input-container">
                        <textarea 
                            class="rag-message-input" 
                            id="rag-message-input" 
                            placeholder="${this.config.placeholder}"
                            rows="1"
                            maxlength="2000"
                            aria-label="Message input"
                        ></textarea>
                        <button class="rag-send-btn" id="rag-send-btn" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="rag-input-footer">
                        <span>Powered by AI</span>
                        <span id="rag-char-count">0/2000</span>
                    </div>
                </div>
            `;
        }

        bindEvents() {
            if (this.elements.toggleBtn) {
                this.elements.toggleBtn.addEventListener('click', () => this.toggleChat());
            }

            if (this.elements.closeBtn) {
                this.elements.closeBtn.addEventListener('click', () => this.closeChat());
            }

            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());

            this.elements.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.elements.messageInput.addEventListener('input', (e) => {
                this.updateCharCount(e.target.value.length);
                this.autoResize(e.target);
            });

            this.elements.messagesArea.addEventListener('click', (e) => {
                if (e.target.closest('.rag-quick-action-btn')) {
                    const btn = e.target.closest('.rag-quick-action-btn');
                    const query = btn.getAttribute('data-query');
                    this.sendQuickMessage(query);
                }
            });

            if (!this.config.embedded) {
                document.addEventListener('click', (e) => {
                    if (!this.elements.widget.contains(e.target) && this.isOpen) {
                        setTimeout(() => this.closeChat(), 150);
                    }
                });
            }

            if (this.config.embedded) {
                window.addEventListener('resize', () => {
                    this.scrollToBottom();
                });
            }
        }

        toggleChat() {
            this.isOpen ? this.closeChat() : this.openChat();
        }

        openChat() {
            if (this.config.embedded) return;

            this.elements.bubble.style.display = 'flex';
            setTimeout(() => {
                this.elements.bubble.classList.add('rag-open');
            }, 10);

            const chatIcon = document.getElementById('rag-chat-icon');
            const closeIcon = document.getElementById('rag-close-icon');
            const badge = document.getElementById('rag-notification-badge');
            
            if (chatIcon) chatIcon.style.display = 'none';
            if (closeIcon) closeIcon.style.display = 'block';
            if (badge) badge.style.display = 'none';

            this.isOpen = true;
            setTimeout(() => this.elements.messageInput.focus(), 400);
        }

        closeChat() {
            if (this.config.embedded) return;

            this.elements.bubble.classList.remove('rag-open');
            setTimeout(() => {
                if (!this.isOpen) {
                    this.elements.bubble.style.display = 'none';
                }
            }, 400);

            const chatIcon = document.getElementById('rag-chat-icon');
            const closeIcon = document.getElementById('rag-close-icon');
            
            if (chatIcon) chatIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';

            this.isOpen = false;
        }

        async sendMessage() {
            const message = this.elements.messageInput.value.trim();
            if (!message || this.isLoading) return;

            this.addUserMessage(message);
            this.elements.messageInput.value = '';
            this.updateCharCount(0);
            this.autoResize(this.elements.messageInput);
            this.setLoading(true);

            try {
                const response = await this.callAPI(message);
                this.addAssistantMessage(response.content);
            } catch (error) {
                console.error('API call failed:', error);
                this.addErrorMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
            } finally {
                this.setLoading(false);
            }
        }

        sendQuickMessage(query) {
            this.elements.messageInput.value = query;
            this.sendMessage();
        }

        addUserMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'rag-message rag-message-user';
            const timeStr = this.config.showTime ? `<div class="rag-message-time">${formatTime(new Date())}</div>` : '';
            
            messageDiv.innerHTML = `
                <div class="rag-message-content">
                    ${this.escapeHtml(message)}
                    ${timeStr}
                </div>
            `;
            this.elements.messagesArea.appendChild(messageDiv);
            this.scrollToBottom();
        }

        addAssistantMessage(message) {
            this.removeTypingIndicator();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'rag-message rag-message-assistant';
            const timeStr = this.config.showTime ? `<div class="rag-message-time">${formatTime(new Date())}</div>` : '';
            
            const avatarContent = this.config.avatar ? 
                `<img src="${this.config.avatar}" alt="Assistant" />` : 
                `<i class="fas fa-sparkles"></i>`;

            messageDiv.innerHTML = `
                <div class="rag-assistant-avatar">
                    ${avatarContent}
                </div>
                <div class="rag-message-content">
                    ${this.formatMessage(message)}
                    ${timeStr}
                </div>
            `;
            this.elements.messagesArea.appendChild(messageDiv);
            this.scrollToBottom();
        }

        addErrorMessage(message) {
            this.removeTypingIndicator();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'rag-message rag-message-error';
            const timeStr = this.config.showTime ? `<div class="rag-message-time">${formatTime(new Date())}</div>` : '';
            
            messageDiv.innerHTML = `
                <div class="rag-assistant-avatar" style="background: var(--rag-error-color);">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="rag-message-content">
                    ${this.escapeHtml(message)}
                    ${timeStr}
                </div>
            `;
            this.elements.messagesArea.appendChild(messageDiv);
            this.scrollToBottom();
        }

        setLoading(loading) {
            this.isLoading = loading;
            this.elements.sendBtn.disabled = loading;
            this.elements.messageInput.disabled = loading;

            if (loading) {
                this.addTypingIndicator();
            } else {
                this.removeTypingIndicator();
            }
        }

        addTypingIndicator() {
            if (document.getElementById('rag-typing-indicator')) return;

            const typingDiv = document.createElement('div');
            typingDiv.className = 'rag-message rag-message-assistant';
            typingDiv.id = 'rag-typing-indicator';
            
            const avatarContent = this.config.avatar ? 
                `<img src="${this.config.avatar}" alt="Assistant" />` : 
                `<i class="fas fa-sparkles"></i>`;

            typingDiv.innerHTML = `
                <div class="rag-assistant-avatar">
                    ${avatarContent}
                </div>
                <div class="rag-message-content">
                    <div class="rag-typing-indicator">
                        <div class="rag-typing-dot"></div>
                        <div class="rag-typing-dot"></div>
                        <div class="rag-typing-dot"></div>
                    </div>
                </div>
            `;
            this.elements.messagesArea.appendChild(typingDiv);
            this.scrollToBottom();
        }

        removeTypingIndicator() {
            const typing = document.getElementById('rag-typing-indicator');
            if (typing) typing.remove();
        }

        async callAPI(message) {
            const apiMessages = [
                ...this.messages.slice(-8),
                { role: 'user', content: message }
            ];

            const requestPayload = {
                messages: apiMessages
            };

            try {
                const response = await fetch(`${this.config.apiUrl}/chat`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestPayload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                this.messages.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.message?.content || data.message || data.response }
                );

                if (this.messages.length > 10) {
                    this.messages = this.messages.slice(-10);
                }

                const responseContent = data.message?.content || data.message || data.response || 'I apologize, but I couldn\'t process your request properly.';
                return { content: responseContent };

            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }

        async checkConnection() {
            try {
                const response = await fetch(`${this.config.apiUrl}/health`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });
                this.updateStatus(response.ok ? 'online' : 'limited');
            } catch (error) {
                console.error('Health check failed:', error);
                this.updateStatus('offline');
            }
            setTimeout(() => this.checkConnection(), 30000);
        }

        updateStatus(status) {
            const indicator = this.elements.statusIndicator;
            const container = indicator?.parentElement;

            if (container) {
                container.className = `rag-chat-status rag-status-${status}`;
            }

            const statusText = {
                online: 'Online',
                limited: 'Limited',
                offline: 'Offline'
            };

            if (indicator) {
                indicator.textContent = statusText[status] || 'Unknown';
            }

            this.isConnected = status === 'online';
        }

        updateCharCount(count) {
            if (this.elements.charCount) {
                this.elements.charCount.textContent = `${count}/2000`;
                this.elements.charCount.style.color = count > 1800 ? 'var(--rag-error-color)' : 'var(--rag-text-muted)';
            }
        }

        autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
        }

        applyTheme() {
            if (this.config.theme === 'dark') {
                document.documentElement.setAttribute('data-rag-theme', 'dark');
            } else if (this.config.theme === 'light') {
                document.documentElement.setAttribute('data-rag-theme', 'light');
            } else if (this.config.theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-rag-theme', prefersDark ? 'dark' : 'light');
            }
        }

        scrollToBottom() {
            requestAnimationFrame(() => {
                this.elements.messagesArea.scrollTop = this.elements.messagesArea.scrollHeight;
            });
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        formatMessage(text) {
            text = this.escapeHtml(text);
            text = text.replace(/\n/g, '<br>');
            text = text.replace(/(https?:\/\/[^\s]+)/g, 
                '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--rag-primary-color); text-decoration: underline;">$1</a>'
            );
            return text;
        }

        // Public API methods
        open() {
            this.openChat();
        }

        close() {
            this.closeChat();
        }

        toggle() {
            this.toggleChat();
        }

        destroy() {
            if (this.elements.widget) {
                this.elements.widget.remove();
            }
            const styles = document.getElementById('rag-chat-widget-styles');
            if (styles) {
                styles.remove();
            }
        }

        updateAvatar(avatarUrl) {
            this.config.avatar = avatarUrl;
            const avatars = document.querySelectorAll('.rag-chat-avatar, .rag-assistant-avatar');
            avatars.forEach(avatar => {
                avatar.innerHTML = avatarUrl ? 
                    `<img src="${avatarUrl}" alt="Assistant" />` : 
                    `<i class="fas fa-sparkles"></i>`;
            });
        }

        updateTitle(title) {
            this.config.title = title;
            const titleEl = document.querySelector('.rag-chat-title');
            if (titleEl) {
                titleEl.textContent = title;
            }
        }
    }

    // Make RAGChatWidget globally available
    window.RAGChatWidget = RAGChatWidget;

    // Auto-initialize based on configuration
    function autoInit() {
        injectStyles();

        const embeddedElement = document.querySelector('[data-rag-chat-embedded]');

        if (embeddedElement) {
            const dataset = embeddedElement.dataset;
            new RAGChatWidget({
                apiUrl: dataset.apiUrl,
                title: dataset.title || 'AI Assistant',
                theme: dataset.theme || 'auto',
                embedded: true,
                container: embeddedElement.id || 'rag-chat-embedded',
                avatar: dataset.avatar || null,
                showTime: dataset.showTime !== 'false'
            });
        } else if (window.RAGChatConfig) {
            new RAGChatWidget(window.RAGChatConfig);
        } else {
            console.log('RAGChatWidget loaded - use "new RAGChatWidget(config)" to initialize');
        }
    }

    window.initRAGChat = function(config) {
        return new RAGChatWidget(config);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    console.log('RAG Chat Widget loaded successfully');

})();