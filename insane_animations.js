// INSANE ANIMATIONS JS - MAXIMUM INTERACTIVITY

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the about page
    if (document.querySelector('.resume-container')) {
        const prompt = document.getElementById('animation-prompt');
        const promptText = document.getElementById('prompt-text');
        const animationToggle = document.getElementById('animation-toggle');
        let isAtBottom = false;
        let animationsActive = false;
        let particles = [];
        let mouseTrail = [];

        // --- Scroll Detection ---
        const handleScroll = () => {
            const atBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 5);
            if (atBottom && !isAtBottom) {
                prompt.classList.add('visible');
                isAtBottom = true;
            } else if (!atBottom && isAtBottom) {
                prompt.classList.remove('visible');
                isAtBottom = false;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        // --- Particle System ---
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 15 + 5;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 6 - 3;
                this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.005;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 10 - 5;
                this.element = this.createElement();
            }

            createElement() {
                const el = document.createElement('div');
                el.style.position = 'fixed';
                el.style.width = this.size + 'px';
                el.style.height = this.size + 'px';
                el.style.background = this.color;
                el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
                el.style.left = this.x + 'px';
                el.style.top = this.y + 'px';
                el.style.pointerEvents = 'none';
                el.style.zIndex = '9999';
                el.style.transform = `rotate(${this.rotation}deg)`;
                el.style.boxShadow = `0 0 ${this.size}px ${this.color}`;
                el.style.transition = 'all 0.1s linear';
                document.body.appendChild(el);
                return el;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha -= this.decay;
                this.rotation += this.rotationSpeed;
                this.size *= 0.98;

                this.element.style.left = this.x + 'px';
                this.element.style.top = this.y + 'px';
                this.element.style.opacity = this.alpha;
                this.element.style.transform = `rotate(${this.rotation}deg) scale(${this.alpha})`;
                this.element.style.width = this.size + 'px';
                this.element.style.height = this.size + 'px';

                return this.alpha > 0;
            }

            destroy() {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
        }

        // --- Mouse Trail Effect ---
        class TrailDot {
            constructor(x, y, index) {
                this.x = x;
                this.y = y;
                this.element = document.createElement('div');
                this.element.style.position = 'fixed';
                this.element.style.width = (20 - index) + 'px';
                this.element.style.height = (20 - index) + 'px';
                this.element.style.background = `hsl(${index * 30}, 100%, 50%)`;
                this.element.style.borderRadius = '50%';
                this.element.style.left = x + 'px';
                this.element.style.top = y + 'px';
                this.element.style.pointerEvents = 'none';
                this.element.style.zIndex = '9998';
                this.element.style.opacity = 1 - (index * 0.05);
                this.element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                this.element.style.boxShadow = `0 0 ${15 - index}px hsl(${index * 30}, 100%, 50%)`;
                document.body.appendChild(this.element);
            }

            update(x, y) {
                this.element.style.left = x + 'px';
                this.element.style.top = y + 'px';
            }

            destroy() {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }
        }

        // --- Animation Logic ---
        let backgroundElement = null;
        let mouseMoveListener = null;
        let particleInterval = null;
        let clickListener = null;

        const createExplosion = (x, y, count = 30) => {
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y));
            }
        };

        const updateParticles = () => {
            particles = particles.filter(particle => {
                const alive = particle.update();
                if (!alive) {
                    particle.destroy();
                }
                return alive;
            });

            if (animationsActive) {
                requestAnimationFrame(updateParticles);
            }
        };

        const applyAnimations = () => {
            try {
                animationsActive = true;

                // Prevent duplicate backgrounds
                if (backgroundElement) return;

                // 1. Create and inject the animated background
                backgroundElement = document.createElement('div');
                backgroundElement.id = 'animated-background';
                document.body.insertAdjacentElement('afterbegin', backgroundElement);

                // Create multiple gradient layers
                const dotsColor = 'rgba(50, 130, 184, 0.4)';
                const gradientColorStart = 'rgba(50, 130, 184, 0.3)';
                const gradientColorEnd = 'transparent';

                Object.assign(backgroundElement.style, {
                    backgroundImage: `
                        radial-gradient(${dotsColor} 1px, transparent 1px),
                        radial-gradient(ellipse 25% 25% at 50% 50%, ${gradientColorStart}, ${gradientColorEnd}),
                        linear-gradient(45deg, rgba(255,0,222,0.1) 0%, rgba(0,255,255,0.1) 100%)
                    `,
                    backgroundSize: '24px 24px, 400% 400%, 200% 200%',
                    backgroundPosition: 'center, -150% -150%, 0% 0%',
                    transformOrigin: 'center',
                    pointerEvents: 'none',
                    animation: 'rainbow 20s linear infinite'
                });

                // 2. Enhanced mouse move effect
                mouseMoveListener = (e) => {
                    const { clientX, clientY } = e;
                    const x = (clientX / window.innerWidth) * 100;
                    const y = (clientY / window.innerHeight) * 100;
                    const adjustedX = 37.5 + (x / 100) * 25;
                    const adjustedY = 37.5 + (y / 100) * 25;

                    if (backgroundElement) {
                        backgroundElement.style.backgroundPosition = `center, ${adjustedX}% ${adjustedY}%, ${x}% ${y}%`;
                    }

                    // Update mouse trail
                    if (mouseTrail.length > 0) {
                        mouseTrail[0].update(clientX, clientY);
                        for (let i = 1; i < mouseTrail.length; i++) {
                            const prev = mouseTrail[i - 1];
                            mouseTrail[i].update(
                                prev.x + (mouseTrail[i].x - prev.x) * 0.6,
                                prev.y + (mouseTrail[i].y - prev.y) * 0.6
                            );
                            mouseTrail[i].x = prev.x + (mouseTrail[i].x - prev.x) * 0.6;
                            mouseTrail[i].y = prev.y + (mouseTrail[i].y - prev.y) * 0.6;
                        }
                    }
                };
                window.addEventListener('mousemove', mouseMoveListener);

                // 3. Click explosion effect
                clickListener = (e) => {
                    if (animationsActive) {
                        createExplosion(e.clientX, e.clientY);

                        // Add ripple effect
                        const ripple = document.createElement('div');
                        Object.assign(ripple.style, {
                            position: 'fixed',
                            left: e.clientX + 'px',
                            top: e.clientY + 'px',
                            width: '0',
                            height: '0',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,0,222,0.5) 0%, rgba(0,255,255,0.3) 50%, transparent 100%)',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            zIndex: '9997',
                            transition: 'all 1s ease-out',
                            opacity: '1'
                        });
                        document.body.appendChild(ripple);

                        setTimeout(() => {
                            ripple.style.width = '300px';
                            ripple.style.height = '300px';
                            ripple.style.opacity = '0';
                        }, 10);

                        setTimeout(() => {
                            ripple.remove();
                        }, 1000);
                    }
                };
                document.addEventListener('click', clickListener);

                // 4. Create mouse trail
                for (let i = 0; i < 10; i++) {
                    mouseTrail.push(new TrailDot(0, 0, i));
                }

                // 5. Random particle generation
                particleInterval = setInterval(() => {
                    if (Math.random() > 0.7) {
                        createExplosion(
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerHeight,
                            5
                        );
                    }
                }, 2000);

                // 6. Add class to body
                document.body.classList.add('animations-active');
                if (backgroundElement) backgroundElement.style.opacity = '1';

                // 7. Start particle animation loop
                updateParticles();

                // 8. Add dynamic element enhancements
                enhanceElements();

                // 9. Add text scramble effect to headings
                scrambleText();

                // 10. Add cursor glow effect
                addCursorGlow();

            } catch (error) {
                console.error("Animation failed to apply:", error);
                if(promptText) promptText.textContent = "Animation error! But don't worry, your portfolio still looks great!";
                if(animationToggle) animationToggle.checked = false;
                removeAnimations();
            }
        };

        const enhanceElements = () => {
            // Add random delays to all animated elements
            const animatedElements = document.querySelectorAll('.resume-card, .project-card, .skill-badge, .overview-card');
            animatedElements.forEach((el, index) => {
                el.style.animationDelay = `${Math.random() * 2}s`;
            });

            // Add hover sound effect simulation (visual)
            document.querySelectorAll('button, .tab-button, a').forEach(el => {
                el.addEventListener('mouseenter', function() {
                    if (animationsActive) {
                        this.style.transform = 'scale(1.1)';
                        this.style.filter = 'brightness(1.5)';
                        setTimeout(() => {
                            this.style.transform = '';
                            this.style.filter = '';
                        }, 200);
                    }
                });
            });

            // Make images crazy
            document.querySelectorAll('img').forEach(img => {
                img.style.animation = 'morphing 4s ease-in-out infinite, spinY 8s linear infinite';
            });
        };

        const scrambleText = () => {
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            const elements = document.querySelectorAll('h1, h2, h3');

            elements.forEach(el => {
                const originalText = el.textContent;
                el.addEventListener('mouseenter', function() {
                    if (!animationsActive) return;

                    let iteration = 0;
                    const interval = setInterval(() => {
                        this.textContent = originalText
                            .split("")
                            .map((letter, index) => {
                                if(index < iteration) {
                                    return originalText[index];
                                }
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join("");

                        if(iteration >= originalText.length) {
                            clearInterval(interval);
                        }

                        iteration += 1 / 3;
                    }, 30);
                });
            });
        };

        const addCursorGlow = () => {
            const glow = document.createElement('div');
            Object.assign(glow.style, {
                position: 'fixed',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: '9996',
                transform: 'translate(-50%, -50%)',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });
            document.body.appendChild(glow);

            document.addEventListener('mousemove', (e) => {
                if (animationsActive) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                    glow.style.opacity = '1';
                }
            });

            document.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
        };

        const removeAnimations = () => {
            animationsActive = false;
            document.body.classList.remove('animations-active');

            // Clean up background
            if (backgroundElement) {
                backgroundElement.style.opacity = '0';
                setTimeout(() => {
                    if (backgroundElement && backgroundElement.parentNode) {
                        backgroundElement.remove();
                    }
                    backgroundElement = null;
                }, 1000);
            }

            // Remove listeners
            if (mouseMoveListener) {
                window.removeEventListener('mousemove', mouseMoveListener);
                mouseMoveListener = null;
            }

            if (clickListener) {
                document.removeEventListener('click', clickListener);
                clickListener = null;
            }

            // Clear intervals
            if (particleInterval) {
                clearInterval(particleInterval);
                particleInterval = null;
            }

            // Clean up particles
            particles.forEach(particle => particle.destroy());
            particles = [];

            // Clean up mouse trail
            mouseTrail.forEach(dot => dot.destroy());
            mouseTrail = [];

            // Remove any remaining dynamic elements
            document.querySelectorAll('#animated-background, [style*="fixed"][style*="9999"], [style*="fixed"][style*="9998"], [style*="fixed"][style*="9997"], [style*="fixed"][style*="9996"]').forEach(el => {
                if (el && el.parentNode) {
                    el.remove();
                }
            });
        };

        // --- Toggle Switch Handler ---
        animationToggle.addEventListener('change', () => {
            if (animationToggle.checked) {
                applyAnimations();
                promptText.textContent = "Welcome to the chaos! 🎆";
            } else {
                removeAnimations();
                promptText.textContent = "Back to normal... boring! 😴";
                setTimeout(() => {
                    promptText.textContent = "Thank you for reaching the bottom. You've earned animations!";
                }, 2000);
            }
        });
    }
});