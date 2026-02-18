/* ========================================
   粒子背景动画 (Canvas)
   ======================================== */
class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.maxDistance = 120;
        this.colors = ['rgba(0, 240, 255, 0.5)', 'rgba(124, 58, 237, 0.4)', 'rgba(255, 255, 255, 0.3)'];

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = window.innerWidth < 768 ? 40 : this.particleCount;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;

            // 边界反弹
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // 鼠标交互
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // 绘制连线
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    const opacity = (1 - dist / this.maxDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

/* ========================================
   打字机效果
   ======================================== */
class TypeWriter {
    constructor(elementId, texts, speed = 80, deleteSpeed = 40, pauseTime = 2000) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.charIndex--;
            this.element.textContent = currentText.substring(0, this.charIndex);
        } else {
            this.charIndex++;
            this.element.textContent = currentText.substring(0, this.charIndex);
        }

        let delay = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            delay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }
}

/* ========================================
   滚动渐入动画
   ======================================== */
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // 添加延迟实现依次出现效果
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach((el) => this.observer.observe(el));
    }
}

/* ========================================
   移动端导航菜单
   ======================================== */
class MobileNav {
    constructor() {
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');

        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        this.navItems.forEach((item) => {
            item.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('open');
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.links.classList.remove('open');
    }
}

/* ========================================
   导航栏滚动效果
   ======================================== */
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.links = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('.section, .hero');

        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        const scrollY = window.scrollY;

        // 导航栏背景变化
        if (scrollY > 50) {
            this.navbar.style.background = 'rgba(10, 10, 26, 0.95)';
        } else {
            this.navbar.style.background = 'rgba(10, 10, 26, 0.8)';
        }

        // 高亮当前区块对应的导航链接
        let current = '';
        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        this.links.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent-cyan)';
            }
        });
    }
}

/* ========================================
   平滑滚动（兼容性增强）
   ======================================== */
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* ========================================
   初始化
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 粒子背景
    new ParticleBackground('particles');

    // 打字机效果
    new TypeWriter('typing-text', [
        'Full Stack Developer',
        '全栈开发工程师',
        'Tech Enthusiast',
        '热爱开源 & 分享'
    ], 80, 40, 2000);

    // 滚动渐入
    new ScrollReveal();

    // 移动端导航
    new MobileNav();

    // 导航栏滚动效果
    new NavbarScroll();

    // 项目卡片鼠标光晕追踪
    document.querySelectorAll('.project-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // 平滑滚动
    new SmoothScroll();
});
