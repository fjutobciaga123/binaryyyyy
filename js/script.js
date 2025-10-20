/**
 * BINARY - Main JavaScript
 * Handles smooth animations, scroll effects, and AOS initialization
 */

(function() {
    'use strict';

    // ===================================
    // AOS (Animate On Scroll) Implementation
    // ===================================
    
    const AOSConfig = {
        offset: 120,
        delay: 0,
        duration: 800,
        easing: 'ease',
        once: true,
        mirror: false
    };

    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                    
                    if (AOSConfig.once) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: `-${AOSConfig.offset}px`
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===================================
    // Smooth Scroll Implementation
    // ===================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // Logo Parallax Effect
    // ===================================
    
    function initLogoParallax() {
        const logo = document.getElementById('logo');
        
        if (!logo) return;

        let ticking = false;

        function updateLogoPosition(scrollPos) {
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection) return;

            const heroHeight = heroSection.offsetHeight;
            
            if (scrollPos < heroHeight) {
                const scale = 1 + (scrollPos / heroHeight) * 0.2;
                const opacity = 1 - (scrollPos / heroHeight) * 0.8;
                
                logo.style.transform = `scale(${scale})`;
                logo.style.opacity = opacity;
            }
        }

        window.addEventListener('scroll', function() {
            const scrollPos = window.pageYOffset;

            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateLogoPosition(scrollPos);
                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // ===================================
    // Scroll Indicator Hide on Scroll
    // ===================================
    
    function initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (!scrollIndicator) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }

            lastScroll = currentScroll;
        });

        // Click to scroll to next section
        scrollIndicator.addEventListener('click', function() {
            const truthSection = document.getElementById('truth');
            if (truthSection) {
                truthSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ===================================
    // Lazy Loading Images Optimization
    // ===================================
    
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }

        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Performance: Debounce Function
    // ===================================
    
    function debounce(func, wait) {
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

    // ===================================
    // Window Resize Handler
    // ===================================
    
    function initResizeHandler() {
        const handleResize = debounce(() => {
            // Recalculate any size-dependent elements
            const windowWidth = window.innerWidth;
            
            // Add any resize-specific logic here
            console.log('Window resized to:', windowWidth);
        }, 250);

        window.addEventListener('resize', handleResize);
    }

    // ===================================
    // Contract Address Copy to Clipboard
    // ===================================
    
    function initContractCopy() {
        const contractAddress = document.querySelector('.contract-address');
        
        if (!contractAddress) return;

        contractAddress.style.cursor = 'pointer';
        contractAddress.title = 'Click to copy';

        contractAddress.addEventListener('click', function() {
            const text = this.textContent.trim();
            
            if (text === 'soon') {
                // Show COPIED! message with green animation (only on inner box)
                const originalText = this.textContent;
                this.textContent = 'COPIED!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
                return;
            }

            // Copy to clipboard for actual contract address
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'COPIED!';
                    this.classList.add('copied');
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.classList.remove('copied');
                    }, 2000);
                });
            }
        });
    }

    // ===================================
    // Page Load Animation
    // ===================================
    
    function initPageLoad() {
        document.body.style.opacity = '0';
        
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // ===================================
    // Custom Cursor
    // ===================================
    
    function initCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        if (!cursor) return;

        // Direct tracking for better performance
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .step-card, .roadmap-card, .art-item, .contract-address, .logo');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // Hide cursor when leaving the page
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    // ===================================
    // Art Gallery Lightbox
    // ===================================
    
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const artItems = document.querySelectorAll('.art-item img');
        
        if (!lightbox || !lightboxImage) return;

        // Open lightbox when clicking on art
        artItems.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                lightboxImage.src = this.src;
                lightboxImage.alt = this.alt;
                lightbox.classList.add('active');
            });
        });

        // Close lightbox when clicking on background
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.classList.remove('active');
            }
        });

        // Close lightbox with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });

        // Prevent closing when clicking on the image itself
        lightboxImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ===================================
    // Binary Aura Generator
    // ===================================
    
    function initBinaryAuraGenerator() {
        const canvas = document.getElementById('auraCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        const uploadInput = document.getElementById('imageUpload');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const canvasContainer = document.querySelector('.aura-canvas-container');
        
        if (!canvas || !ctx || !uploadInput) return;

        let uploadedImage = null;
        let settings = {
            color: 'white',
            size: 20,
            amount: 100,
            opacity: 0.8
        };

        // Setup initial canvas size
        canvas.width = 600;
        canvas.height = 600;

        // Upload image
        canvasContainer.addEventListener('click', () => uploadInput.click());
        
        canvasContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvasContainer.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });

        canvasContainer.addEventListener('dragleave', () => {
            canvasContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });

        canvasContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            canvasContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                loadImage(file);
            }
        });

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                loadImage(file);
            }
        });

        function loadImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImage = img;
                    
                    // Set canvas to FULL original image resolution
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Calculate display size (max 600px for viewing)
                    const maxDisplaySize = 600;
                    let displayWidth, displayHeight;
                    
                    if (img.width > img.height) {
                        displayWidth = Math.min(maxDisplaySize, img.width);
                        displayHeight = (img.height / img.width) * displayWidth;
                    } else {
                        displayHeight = Math.min(maxDisplaySize, img.height);
                        displayWidth = (img.width / img.height) * displayHeight;
                    }
                    
                    // Set CSS display size (for viewing only)
                    canvas.style.width = displayWidth + 'px';
                    canvas.style.height = displayHeight + 'px';
                    
                    // Update container height
                    canvasContainer.style.height = displayHeight + 'px';
                    
                    canvas.style.display = 'block';
                    uploadPlaceholder.classList.add('hidden');
                    drawImageWithBinary();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function drawImageWithBinary() {
            if (!uploadedImage) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw image to fill entire canvas
            ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

            // Add binary digits
            ctx.font = `${settings.size}px 'Amiga4everPro', monospace`;
            ctx.globalAlpha = settings.opacity;

            // Scale digit size to match actual canvas resolution
            const scaleFactor = canvas.width / 600; // Base scale on 600px reference
            const actualDigitSize = settings.size * scaleFactor;
            ctx.font = `${actualDigitSize}px 'Amiga4everPro', monospace`;

            for (let i = 0; i < settings.amount; i++) {
                const digit = Math.random() > 0.5 ? '1' : '0';
                const px = Math.random() * canvas.width;
                const py = Math.random() * canvas.height;
                
                // Set color based on settings
                if (settings.color === 'both') {
                    ctx.fillStyle = Math.random() > 0.5 ? 'white' : 'black';
                } else {
                    ctx.fillStyle = settings.color;
                }
                
                ctx.fillText(digit, px, py);
            }

            ctx.globalAlpha = 1;
        }

        // Controls
        const colorWhite = document.getElementById('colorWhite');
        const colorBlack = document.getElementById('colorBlack');
        const colorBoth = document.getElementById('colorBoth');
        const digitSize = document.getElementById('digitSize');
        const digitAmount = document.getElementById('digitAmount');
        const digitOpacity = document.getElementById('digitOpacity');
        const sizeValue = document.getElementById('sizeValue');
        const amountValue = document.getElementById('amountValue');
        const opacityValue = document.getElementById('opacityValue');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const resetBtn = document.getElementById('resetBtn');

        // Color selection
        colorWhite?.addEventListener('click', () => {
            settings.color = 'white';
            colorWhite.classList.add('active');
            colorBlack?.classList.remove('active');
            colorBoth?.classList.remove('active');
            drawImageWithBinary();
        });

        colorBlack?.addEventListener('click', () => {
            settings.color = 'black';
            colorBlack.classList.add('active');
            colorWhite?.classList.remove('active');
            colorBoth?.classList.remove('active');
            drawImageWithBinary();
        });

        colorBoth?.addEventListener('click', () => {
            settings.color = 'both';
            colorBoth.classList.add('active');
            colorWhite?.classList.remove('active');
            colorBlack?.classList.remove('active');
            drawImageWithBinary();
        });

        // Size slider
        digitSize?.addEventListener('input', (e) => {
            settings.size = parseInt(e.target.value);
            if (sizeValue) sizeValue.textContent = settings.size;
            drawImageWithBinary();
        });

        // Amount slider
        digitAmount?.addEventListener('input', (e) => {
            settings.amount = parseInt(e.target.value);
            if (amountValue) amountValue.textContent = settings.amount;
            drawImageWithBinary();
        });

        // Opacity slider
        digitOpacity?.addEventListener('input', (e) => {
            settings.opacity = parseFloat(e.target.value);
            if (opacityValue) opacityValue.textContent = settings.opacity;
            drawImageWithBinary();
        });

        // Regenerate button
        regenerateBtn?.addEventListener('click', () => {
            drawImageWithBinary();
        });

        // Download button
        downloadBtn?.addEventListener('click', () => {
            if (!uploadedImage) {
                alert('Please upload an image first!');
                return;
            }
            const link = document.createElement('a');
            link.download = 'binary-aura.png';
            // Use full quality PNG export
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });

        // Reset button
        resetBtn?.addEventListener('click', () => {
            uploadedImage = null;
            canvas.style.display = 'none';
            uploadPlaceholder?.classList.remove('hidden');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            uploadInput.value = '';
            
            // Reset canvas size
            canvas.width = 600;
            canvas.height = 600;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvasContainer.style.height = '600px';
            
            // Reset settings
            settings = {
                color: 'white',
                size: 20,
                amount: 100,
                opacity: 0.8
            };
            
            // Reset UI
            if (digitSize) digitSize.value = 20;
            if (digitAmount) digitAmount.value = 100;
            if (digitOpacity) digitOpacity.value = 0.8;
            if (sizeValue) sizeValue.textContent = 20;
            if (amountValue) amountValue.textContent = 100;
            if (opacityValue) opacityValue.textContent = 0.8;
            colorWhite?.classList.add('active');
            colorBlack?.classList.remove('active');
            colorBoth?.classList.remove('active');
        });
    }

    // ===================================
    // Initialize All Features
    // ===================================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all features
        initPageLoad();
        initCustomCursor();
        initAOS();
        initSmoothScroll();
        initLogoParallax();
        initScrollIndicator();
        initLazyLoading();
        initResizeHandler();
        initContractCopy();
        initLightbox();
        initBinaryAuraGenerator();
        initBinaryChat();
        initMobileMenu();

        console.log('🔥 BINARY website initialized successfully!');
    }

    // ===================================
    // Mobile Menu
    // ===================================
    
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        // Toggle menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ===================================
    // Binary Chat
    // ===================================
    
    function initBinaryChat() {
        const chat = document.getElementById('binaryChat');
        const chatHeader = document.getElementById('chatHeader');
        const chatToggle = document.getElementById('chatToggle');
        const chatBody = document.getElementById('chatBody');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');

        if (!chat || !chatHeader || !chatToggle || !chatBody || !chatMessages || !chatInput || !chatSend) return;

        const responses = [
            "nie oddychjdzie przez chwile",
            "nie patrz sie na dul leb",
            "finansowo nie oplacalo mi sie zabijac tej suki",
            "zrobimy dzien z guwnem?",
            "ma ktos guwno?",
            "andy \"cwelątko\""
        ];

        let isMinimized = true;
        chatBody.classList.add('minimized');

        // Toggle chat - click entire header
        chatHeader.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                chatBody.classList.add('minimized');
                chat.classList.remove('expanded');
                chatToggle.textContent = '💬';
                chatToggle.classList.remove('open');
            } else {
                chatBody.classList.remove('minimized');
                chat.classList.add('expanded');
                chatToggle.textContent = '✕';
                chatToggle.classList.add('open');
            }
        });

        // Typing animation
        function typeMessage(element, text, speed = 50) {
            let index = 0;
            element.textContent = '';
            
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (index < text.length) {
                        element.textContent += text.charAt(index);
                        index++;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    } else {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            });
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-message bot-message typing-message';
            typingMsg.innerHTML = `
                <div class="message-content typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
            chatMessages.appendChild(typingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return typingMsg;
        }

        // Send message
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user-message';
            userMsg.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
            chatMessages.appendChild(userMsg);

            // Clear input
            chatInput.value = '';

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Show typing indicator
            const typingMsg = showTypingIndicator();

            // Wait for random delay (1-2 seconds)
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            // Remove typing indicator
            typingMsg.remove();

            // Create bot message with typing animation
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot-message';
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            botMsg.appendChild(messageContent);
            chatMessages.appendChild(botMsg);

            // Type the message
            await typeMessage(messageContent, randomResponse, 30);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Send on button click
        chatSend.addEventListener('click', sendMessage);

        // Send on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        console.log('💬 Binary Chat initialized!');
    }

    // Start initialization
    init();

})();
