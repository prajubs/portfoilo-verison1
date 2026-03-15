// ----- script.js -----
// ENHANCED PORTFOLIO WITH SMOOTH UI/UX, DETAIL MODALS, ANIMATIONS

(function () {
    "use strict";

    // ========== API CONFIG ==========
    const API_CONFIG = {
        BASE_URL: 'https://b2rbowlb68.execute-api.ap-south-1.amazonaws.com/giri',
        ENDPOINTS: {
            GET_DATA: '/portfolio',
            VALIDATE_KEY: '/validate',
            ADD_PROJECT: '/project',
            ADD_BLOG: '/blog',
            DELETE_PROJECT: '/project',
            DELETE_BLOG: '/blog'
        }
    };

    // ========== DEFAULT DATA ==========
    const DEFAULT_DATA = {
        projects: [
            {
                id: 1,
                title: "ESP32-CAM Surveillance",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
                description: "AI-based motion detection with Telegram alerts. This project uses an ESP32-CAM module to capture images when motion is detected using a PIR sensor, processes them with a lightweight AI model for object classification, and sends real-time alerts via Telegram bot. The system supports night-vision mode and can be monitored remotely through a simple web dashboard.",
                technologies: ["ESP32", "Camera", "Arduino", "TensorFlow Lite", "Telegram API"],
                url: "#"
            },
            {
                id: 2,
                title: "BLDC Motor Controller",
                image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=400&fit=crop",
                description: "Sensorless FOC (Field-Oriented Control) for drones. Designed and implemented a complete motor drive system using PIC32 microcontroller with back-EMF zero-crossing detection, sinusoidal PWM generation, and closed-loop speed control. The custom PCB was designed in KiCad with a 4-layer stack-up optimized for EMI performance.",
                technologies: ["PIC32", "C++", "KiCad", "FOC Algorithm", "PCB Design"],
                url: "#"
            },
            {
                id: 3,
                title: "RTOS based Weather Station",
                image: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=600&h=400&fit=crop",
                description: "FreeRTOS + BME280 sensor, MQTT to AWS IoT Core. A multi-tasked weather monitoring station built on ESP-IDF with four concurrent tasks: sensor reading (temperature, humidity, pressure), OLED display updates, MQTT publishing to AWS, and OTA firmware update handling. Data is visualized in real-time on a Grafana dashboard.",
                technologies: ["FreeRTOS", "ESP-IDF", "MQTT", "AWS IoT", "Grafana"],
                url: "#"
            }
        ],
        blogs: [
            {
                id: 1,
                title: "ESP32 Deep Sleep & Battery Life",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
                excerpt: "Optimizing power consumption for battery-powered IoT devices using ESP32 deep sleep modes.",
                content: "When building battery-powered IoT devices, power consumption is the most critical design consideration. The ESP32 offers several sleep modes that can dramatically extend battery life from days to months or even years.\n\nDeep Sleep Mode\n\nIn deep sleep, the ESP32 main CPU is powered down. Only the RTC (Real-Time Clock) controller, RTC peripherals, and RTC memory remain active. Power consumption drops from ~240mA (active Wi-Fi) to just 10µA.\n\nTo enter deep sleep:\n\nesp_sleep_enable_timer_wakeup(TIME_IN_US);\nesp_deep_sleep_start();\n\nWake-up Sources\n\nThe ESP32 supports multiple wake-up sources:\n• Timer wake-up — wake after a specified duration\n• External wake-up (ext0/ext1) — wake on GPIO pin state change\n• Touch pad wake-up — wake on capacitive touch detection\n• ULP coprocessor — the Ultra-Low-Power coprocessor can monitor sensors while the main CPU sleeps\n\nPractical Tips\n\n1. Batch your transmissions — collect multiple readings before connecting to Wi-Fi\n2. Use static IP — DHCP negotiation adds 2-3 seconds of active time\n3. Reduce TX power — if your access point is nearby, lower the WiFi transmit power\n4. Use MQTT over HTTP — MQTT connections are lighter and faster\n5. Implement exponential backoff — avoid constantly retrying failed connections\n\nWith these techniques, I achieved 14 months of battery life on a 3000mAh LiPo battery with hourly sensor readings and Wi-Fi uploads.",
                readTime: "7 min read",
                date: "2025-02-14"
            },
            {
                id: 2,
                title: "AVR vs PIC: Which one to choose?",
                image: "https://images.unsplash.com/photo-1553406830-736e1b8e1ad4?w=600&h=400&fit=crop",
                excerpt: "A comprehensive comparison of AVR and PIC microcontrollers for beginners entering embedded development.",
                content: "Choosing between AVR and PIC microcontrollers is one of the first decisions every embedded developer faces. Both families have their strengths, and the right choice depends on your project requirements and development style.\n\nArchitecture Overview\n\nAVR (e.g., ATmega328P):\n• Modified Harvard architecture with 8-bit RISC core\n• Single clock cycle execution for most instructions\n• 32 general-purpose registers\n• Open-source toolchain (avr-gcc)\n• Arduino ecosystem compatibility\n\nPIC (e.g., PIC16F/PIC18F):\n• Harvard architecture with RISC core\n• 4 clock cycles per instruction (PIC16) or 2 (PIC18)\n• Smaller register file (working register model)\n• MPLAB X IDE with XC compilers\n• Extensive Microchip library support\n\nPerformance Comparison\n\nFor raw throughput at the same clock speed, AVR generally wins due to its single-cycle execution. However, PIC microcontrollers often come with richer peripheral sets — especially in analog and power management — making them ideal for mixed-signal applications.\n\nDevelopment Experience\n\nIf you're a beginner, AVR with Arduino is the easiest path to start. PIC has a steeper learning curve but gives you deeper understanding of hardware-level programming. For professional development, both have strong ecosystems.\n\nMy Recommendation\n\n• Start with AVR/Arduino for learning\n• Use PIC for industrial/analog-heavy projects\n• Consider ESP32 if you need Wi-Fi/Bluetooth\n• Look at STM32 for high-performance ARM needs",
                readTime: "10 min read",
                date: "2025-01-25"
            }
        ],
        contact: {
            email: "binary.developer01@gmail.com",
            phone: "+91 7406368709",
            location: "Bengaluru, India"
        },
        settings: {
            secretKey: "admin123"
        }
    };

    // ========== STATE ==========
    let portfolioData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    let SECRET_KEY = localStorage.getItem('portfolio_secret_key') || DEFAULT_DATA.settings.secretKey;

    // ========== DOM ELEMENTS ==========
    const projectsContainer = document.getElementById('projectsContainer');
    const blogsContainer = document.getElementById('blogsContainer');
    const adminProjectsList = document.getElementById('adminProjectsList');
    const adminBlogsList = document.getElementById('adminBlogsList');
    const loginModal = document.getElementById('loginModal');
    const adminModal = document.getElementById('adminModal');
    const loadingScreen = document.getElementById('loadingScreen');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactLocation = document.getElementById('contactLocation');

    // ========== API SERVICE ==========
    const ApiService = {
        getHeaders() {
            const headers = { 'Content-Type': 'application/json' };
            if (SECRET_KEY) headers['Authorization'] = `Bearer ${SECRET_KEY}`;
            return headers;
        },

        async request(endpoint, method = 'GET', data = null) {
            const url = `${API_CONFIG.BASE_URL}${endpoint}`;
            const options = {
                method,
                headers: this.getHeaders(),
                mode: 'cors'
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const resp = await fetch(url, options);
            if (!resp.ok) throw new Error(`API Error ${resp.status}`);
            return await resp.json();
        },

        async validateSecretKey(key) {
            try {
                const res = await this.request('/validate', 'POST', { secretKey: key });
                return res.valid === true;
            } catch {
                return key === 'admin123';
            }
        },

        async loadPortfolioData() {
            try {
                const items = await this.request('/portfolio', 'GET');
                if (Array.isArray(items)) {
                    const projects = items.filter(i => i.type === 'project').map(p => ({
                        ...p,
                        technologies: p.technologies || ['Embedded'],
                        image: p.image || DEFAULT_DATA.projects[0].image,
                        url: p.url || '#'
                    }));

                    const blogs = items.filter(i => i.type === 'blog').map(b => ({
                        ...b,
                        excerpt: b.excerpt || b.content?.substring(0, 80) || '',
                        readTime: b.readTime || '5 min',
                        date: b.date || new Date().toISOString().split('T')[0],
                        image: b.image || DEFAULT_DATA.blogs[0].image
                    }));

                    return { projects, blogs, contact: portfolioData.contact, settings: portfolioData.settings };
                }
                return this.getLocalData();
            } catch {
                return this.getLocalData();
            }
        },

        getLocalData() {
            const local = localStorage.getItem('portfolioData');
            return local ? JSON.parse(local) : DEFAULT_DATA;
        },

        saveLocalData(data) {
            localStorage.setItem('portfolioData', JSON.stringify(data));
            localStorage.setItem('portfolioDataLastUpdated', new Date().toISOString());
        }
    };

    // ========== UTILITIES ==========
    function saveData() {
        ApiService.saveLocalData(portfolioData);
        updateAdminStats();
    }

    function formatDate(d) {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // ========== RENDER FUNCTIONS ==========
    function loadProjects() {
        if (!projectsContainer) return;

        projectsContainer.innerHTML = portfolioData.projects.map((p, idx) => `
            <div class="project-card reveal-card" style="transition-delay:${idx * 0.1}s" onclick="window.openProjectDetail(${p.id})">
                <div class="project-image-wrapper">
                    <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy">
                    <div class="card-overlay">
                        <span><i class="fas fa-expand"></i> View Details</span>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-description">${(p.description || '').substring(0, 100)}${(p.description || '').length > 100 ? '...' : ''}</p>
                    <div class="project-tech">
                        ${(p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Trigger reveal for dynamically loaded cards
        requestAnimationFrame(() => observeElements());
    }

    function loadBlogs() {
        if (!blogsContainer) return;

        blogsContainer.innerHTML = portfolioData.blogs.map((b, idx) => `
            <div class="blog-card reveal-card" style="transition-delay:${idx * 0.1}s" onclick="window.openBlogDetail(${b.id})">
                <div class="blog-image-wrapper">
                    <img src="${b.image}" alt="${b.title}" class="blog-image" loading="lazy">
                    <div class="card-overlay">
                        <span><i class="fas fa-book-open"></i> Read Article</span>
                    </div>
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${b.title}</h3>
                    <p class="blog-excerpt">${b.excerpt}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-clock"></i> ${b.readTime || '5 min'}</span>
                        <span><i class="far fa-calendar-alt"></i> ${formatDate(b.date)}</span>
                    </div>
                    <div class="blog-read-more">Read More <i class="fas fa-arrow-right"></i></div>
                </div>
            </div>
        `).join('');

        requestAnimationFrame(() => observeElements());
    }

    function loadAdminProjects() {
        if (!adminProjectsList) return;

        adminProjectsList.innerHTML = portfolioData.projects.map(p => `
            <div class="admin-item" data-id="${p.id}">
                <img src="${p.image}" alt="${p.title}">
                <div class="admin-item-content">
                    <h4>${p.title}</h4>
                    <p>${(p.description || '').substring(0, 70)}${(p.description || '').length > 70 ? '...' : ''}</p>
                    <div class="admin-item-meta">
                        ${(p.technologies || []).slice(0, 3).map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-icon btn-edit" onclick="window.editProject(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="window.deleteProject(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function loadAdminBlogs() {
        if (!adminBlogsList) return;

        adminBlogsList.innerHTML = portfolioData.blogs.map(b => `
            <div class="admin-item" data-id="${b.id}">
                <img src="${b.image}" alt="${b.title}">
                <div class="admin-item-content">
                    <h4>${b.title}</h4>
                    <p>${(b.excerpt || '').substring(0, 70)}${(b.excerpt || '').length > 70 ? '...' : ''}</p>
                    <div class="admin-item-meta">
                        <span>${b.readTime}</span>
                        <span>${formatDate(b.date)}</span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-icon btn-edit" onclick="window.editBlog(${b.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="window.deleteBlog(${b.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function updateContactInfo() {
        if (contactEmail) contactEmail.innerText = portfolioData.contact.email;
        if (contactPhone) contactPhone.innerText = portfolioData.contact.phone;
        if (contactLocation) contactLocation.innerText = portfolioData.contact.location;

        const newEmail = document.getElementById('newEmail');
        const newPhone = document.getElementById('newPhone');
        const newLocation = document.getElementById('newLocation');

        if (newEmail) newEmail.value = portfolioData.contact.email;
        if (newPhone) newPhone.value = portfolioData.contact.phone;
        if (newLocation) newLocation.value = portfolioData.contact.location;
    }

    function updateAdminStats() {
        const projCount = document.getElementById('projectsCount');
        const blogCount = document.getElementById('blogsCount');
        const storageEl = document.getElementById('storageUsed');
        const lastUpdatedEl = document.getElementById('lastUpdated');

        if (projCount) projCount.innerText = portfolioData.projects.length;
        if (blogCount) blogCount.innerText = portfolioData.blogs.length;

        if (storageEl) {
            const size = JSON.stringify(portfolioData).length;
            storageEl.innerText = (size / 1024).toFixed(2) + ' KB';
        }

        if (lastUpdatedEl) {
            const last = localStorage.getItem('portfolioDataLastUpdated');
            lastUpdatedEl.innerText = last ? new Date(last).toLocaleString() : 'Never';
        }
    }

    // ========== MODAL CONTROLS ==========
    window.showModal = function (modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.hideModal = function (modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // ========== DETAIL MODALS ==========
    window.openProjectDetail = function (projectId) {
        const project = portfolioData.projects.find(p => p.id == projectId);
        if (!project) return;

        const modal = document.getElementById('projectDetailModal');
        const content = document.getElementById('projectDetailContent');

        content.innerHTML = `
            <button class="detail-close-btn" onclick="window.closeDetailModal('projectDetailModal')"><i class="fas fa-times"></i></button>
            <img src="${project.image}" alt="${project.title}" class="detail-hero-image">
            <div class="detail-body">
                <h2>${project.title}</h2>
                <div class="detail-meta">
                    <span><i class="fas fa-microchip"></i> Embedded Project</span>
                    ${project.url && project.url !== '#' ? `<span><i class="fas fa-link"></i> <a href="${project.url}" target="_blank" style="color:var(--primary-color)">GitHub Link</a></span>` : ''}
                </div>
                <div class="detail-tech-list">
                    ${(project.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="detail-description">${project.description}</div>
                <div class="detail-actions">
                    ${project.url && project.url !== '#' ? `<a href="${project.url}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> View Project</a>` : ''}
                    <button class="btn btn-secondary" onclick="window.closeDetailModal('projectDetailModal')"><i class="fas fa-arrow-left"></i> Back</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('open'));
        document.body.style.overflow = 'hidden';
    };

    window.openBlogDetail = function (blogId) {
        const blog = portfolioData.blogs.find(b => b.id == blogId);
        if (!blog) return;

        const modal = document.getElementById('blogDetailModal');
        const content = document.getElementById('blogDetailContent');

        // Convert newlines to paragraphs
        const formattedContent = (blog.content || blog.excerpt || '')
            .split('\n\n')
            .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        content.innerHTML = `
            <button class="detail-close-btn" onclick="window.closeDetailModal('blogDetailModal')"><i class="fas fa-times"></i></button>
            <img src="${blog.image}" alt="${blog.title}" class="detail-hero-image">
            <div class="detail-body">
                <h2>${blog.title}</h2>
                <div class="detail-meta">
                    <span><i class="far fa-clock"></i> ${blog.readTime || '5 min read'}</span>
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(blog.date)}</span>
                    <span><i class="fas fa-user"></i> Prajwal B S</span>
                </div>
                <div class="blog-detail-content">${formattedContent}</div>
                <div class="detail-actions">
                    <button class="btn btn-secondary" onclick="window.closeDetailModal('blogDetailModal')"><i class="fas fa-arrow-left"></i> Back to Blogs</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('open'));
        document.body.style.overflow = 'hidden';
    };

    window.closeDetailModal = function (modalId) {
        const modal = document.getElementById(modalId);
        const content = modal.querySelector('.detail-modal-content');

        content.classList.add('closing');
        modal.style.opacity = '0';

        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('open');
            modal.style.opacity = '';
            content.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 350);
    };

    // ========== DELETE FUNCTIONS ==========
    window.deleteProject = async function (projectId) {
        const id = parseInt(projectId) || projectId;

        if (!confirm('⚠️ Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        showLoading(true, 'Deleting project...');

        try {
            const projectIndex = portfolioData.projects.findIndex(p => p.id == id);

            if (projectIndex === -1) {
                showMessage('Project not found!', 'error');
                showLoading(false);
                return;
            }

            if (SECRET_KEY) {
                try {
                    await ApiService.request(`/project/${id}`, 'DELETE');
                } catch (apiError) {
                    console.warn('API delete failed, continuing with local delete:', apiError);
                }
            }

            portfolioData.projects = portfolioData.projects.filter(p => p.id != id);
            saveData();
            loadProjects();
            loadAdminProjects();
            updateAdminStats();
            showMessage('Project deleted successfully!', 'success');

        } catch (error) {
            showMessage('Error deleting project: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    };

    window.deleteBlog = async function (blogId) {
        const id = parseInt(blogId) || blogId;

        if (!confirm('⚠️ Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        showLoading(true, 'Deleting blog...');

        try {
            const blogIndex = portfolioData.blogs.findIndex(b => b.id == id);

            if (blogIndex === -1) {
                showMessage('Blog not found!', 'error');
                showLoading(false);
                return;
            }

            if (SECRET_KEY) {
                try {
                    await ApiService.request(`/blog/${id}`, 'DELETE');
                } catch (apiError) {
                    console.warn('API delete failed, continuing with local delete:', apiError);
                }
            }

            portfolioData.blogs = portfolioData.blogs.filter(b => b.id != id);
            saveData();
            loadBlogs();
            loadAdminBlogs();
            updateAdminStats();
            showMessage('Blog deleted successfully!', 'success');

        } catch (error) {
            showMessage('Error deleting blog: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    };

    // Edit functions
    window.editProject = function (id) {
        const proj = portfolioData.projects.find(p => p.id == id);
        if (proj) {
            const newTitle = prompt('Edit project title:', proj.title);
            if (newTitle) {
                proj.title = newTitle;
                saveData();
                loadProjects();
                loadAdminProjects();
                showMessage('Project updated', 'success');
            }
        }
    };

    window.editBlog = function (id) {
        const blog = portfolioData.blogs.find(b => b.id == id);
        if (blog) {
            const newTitle = prompt('Edit blog title:', blog.title);
            if (newTitle) {
                blog.title = newTitle;
                saveData();
                loadBlogs();
                loadAdminBlogs();
                showMessage('Blog updated', 'success');
            }
        }
    };

    // ========== UI MESSAGES ==========
    function showMessage(text, type = 'success') {
        const msg = document.createElement('div');
        msg.className = `message message-${type}`;
        msg.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${text}</span>`;

        const dash = document.querySelector('.admin-dashboard');
        if (dash) {
            dash.insertBefore(msg, dash.firstChild);
        } else {
            msg.style.position = 'fixed';
            msg.style.top = '100px';
            msg.style.left = '50%';
            msg.style.transform = 'translateX(-50%)';
            msg.style.zIndex = '9999';
            msg.style.minWidth = '300px';
            document.body.appendChild(msg);
        }

        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.4s ease';
            setTimeout(() => msg.remove(), 400);
        }, 3000);
    }

    function showLoading(show, msg = 'Loading...') {
        if (!loadingScreen) return;

        const loaderText = loadingScreen.querySelector('.loader-text');
        if (loaderText) loaderText.textContent = msg;

        if (show) {
            loadingScreen.classList.remove('hidden');
            loadingScreen.style.display = 'flex';
        } else {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }

    // ========== PARTICLE CANVAS ==========
    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const particleCount = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(67, 97, 238, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(67, 97, 238, ${0.08 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();
            animId = requestAnimationFrame(animate);
        }

        animate();
    }

    // ========== TYPING EFFECT ==========
    function initTypingEffect() {
        const typingEl = document.getElementById('typingText');
        if (!typingEl) return;

        const roles = [
            'Embedded Software Developer',
            'IoT Solutions Architect',
            'PCB Design Engineer',
            'Freelance Developer',
            'Firmware Engineer'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }

    // ========== SCROLL REVEAL (IntersectionObserver) ==========
    let observer;

    function initScrollReveal() {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Animate skill bars if they're inside the target
                    const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        if (width) {
                            setTimeout(() => {
                                bar.style.width = width;
                                bar.classList.add('animated');
                            }, 200);
                        }
                    });
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        observeElements();
    }

    function observeElements() {
        if (!observer) return;
        document.querySelectorAll('.reveal, .reveal-card').forEach(el => {
            if (!el.classList.contains('active')) {
                observer.observe(el);
            }
        });
    }

    // ========== NAVBAR SCROLL EFFECT ==========
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ========== BACK TO TOP ==========
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== INITIALIZATION ==========
    async function init() {
        showLoading(true, 'Loading portfolio...');

        try {
            const data = await ApiService.loadPortfolioData();
            portfolioData = {
                ...DEFAULT_DATA,
                ...data,
                contact: { ...DEFAULT_DATA.contact, ...data.contact }
            };

            portfolioData.projects = portfolioData.projects.map((p, idx) => ({
                ...p,
                id: p.id || Date.now() + idx
            }));

            portfolioData.blogs = portfolioData.blogs.map((b, idx) => ({
                ...b,
                id: b.id || Date.now() + idx + 1000
            }));

        } catch (e) {
            console.warn('Init error, using local data:', e);
            portfolioData = ApiService.getLocalData();
        }

        updateContactInfo();
        loadProjects();
        loadBlogs();
        loadAdminProjects();
        loadAdminBlogs();
        updateAdminStats();

        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) yearSpan.innerText = new Date().getFullYear();

        showLoading(false);

        // Fade in body
        setTimeout(() => document.body.classList.add('loaded'), 100);
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Admin login button
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showModal(loginModal);
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const key = document.getElementById('secretKey').value;

                showLoading(true, 'Validating...');
                const valid = await ApiService.validateSecretKey(key);

                if (valid) {
                    localStorage.setItem('portfolio_secret_key', key);
                    SECRET_KEY = key;
                    hideModal(loginModal);
                    showModal(adminModal);
                    showMessage('Login successful', 'success');
                } else {
                    showMessage('Invalid secret key', 'error');
                }
                showLoading(false);
            });
        }

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function () {
                hideModal(this.closest('.modal'));
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                const tabId = this.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Add Project Form
        const addProjectForm = document.getElementById('addProjectForm');
        if (addProjectForm) {
            addProjectForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const project = {
                    title: document.getElementById('projTitle').value,
                    image: document.getElementById('projImage').value,
                    description: document.getElementById('projDesc').value,
                    technologies: document.getElementById('projTech').value.split(',').map(s => s.trim()),
                    url: document.getElementById('projUrl').value,
                    date: new Date().toISOString().split('T')[0]
                };

                showLoading(true, 'Adding project...');

                try {
                    let apiResult = null;
                    try {
                        apiResult = await ApiService.request('/project', 'POST', { ...project, secretKey: SECRET_KEY });
                    } catch (e) {
                        console.log('API add failed, using local only');
                    }

                    project.id = apiResult?.id || Date.now();
                    portfolioData.projects.push(project);

                    saveData();
                    loadProjects();
                    loadAdminProjects();
                    updateAdminStats();

                    this.reset();
                    showMessage('Project added successfully!', 'success');

                } catch (error) {
                    showMessage('Failed to add project: ' + error.message, 'error');
                } finally {
                    showLoading(false);
                }
            });
        }

        // Add Blog Form
        const addBlogForm = document.getElementById('addBlogForm');
        if (addBlogForm) {
            addBlogForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const blog = {
                    title: document.getElementById('blogTitle').value,
                    image: document.getElementById('blogImage').value,
                    excerpt: document.getElementById('blogExcerpt').value,
                    content: document.getElementById('blogContent').value,
                    readTime: document.getElementById('blogReadTime').value,
                    date: new Date().toISOString().split('T')[0]
                };

                showLoading(true, 'Adding blog...');

                try {
                    let apiResult = null;
                    try {
                        apiResult = await ApiService.request('/blog', 'POST', { ...blog, secretKey: SECRET_KEY });
                    } catch (e) {
                        console.log('API add failed, using local only');
                    }

                    blog.id = apiResult?.id || Date.now();
                    portfolioData.blogs.push(blog);

                    saveData();
                    loadBlogs();
                    loadAdminBlogs();
                    updateAdminStats();

                    this.reset();
                    showMessage('Blog added successfully!', 'success');

                } catch (error) {
                    showMessage('Failed to add blog: ' + error.message, 'error');
                } finally {
                    showLoading(false);
                }
            });
        }

        // Update contact form
        const updateContactForm = document.getElementById('updateContactForm');
        if (updateContactForm) {
            updateContactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                portfolioData.contact = {
                    email: document.getElementById('newEmail').value,
                    phone: document.getElementById('newPhone').value,
                    location: document.getElementById('newLocation').value
                };

                saveData();
                updateContactInfo();
                showMessage('Contact info updated successfully!', 'success');
            });
        }

        // Update secret key form
        const updateKeyForm = document.getElementById('updateKeyForm');
        if (updateKeyForm) {
            updateKeyForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const k1 = document.getElementById('newSecretKey').value;
                const k2 = document.getElementById('confirmSecretKey').value;

                if (k1 !== k2) {
                    showMessage('Keys do not match!', 'error');
                    return;
                }

                portfolioData.settings.secretKey = k1;
                localStorage.setItem('portfolio_secret_key', k1);
                SECRET_KEY = k1;

                saveData();
                showMessage('Secret key updated successfully!', 'success');
                this.reset();
            });
        }

        // Export data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const dataStr = JSON.stringify(portfolioData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'portfolio-backup.json';
                a.click();
            });
        }

        // Import data
        const importBtn = document.getElementById('importData');
        const importFile = document.getElementById('importFile');

        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });

            importFile.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        portfolioData = JSON.parse(ev.target.result);
                        saveData();
                        init();
                        showMessage('Data imported successfully!', 'success');
                    } catch {
                        showMessage('Invalid file format!', 'error');
                    }
                };
                reader.readAsText(file);
                this.value = '';
            });
        }

        // Clear data
        const clearBtn = document.getElementById('clearData');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (confirm('⚠️ Delete ALL data? This cannot be undone.')) {
                    localStorage.removeItem('portfolioData');
                    portfolioData = JSON.parse(JSON.stringify(DEFAULT_DATA));
                    saveData();
                    init();
                    showMessage('Reset to default data', 'success');
                }
            });
        }

        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }

        // Contact form — sends to email + WhatsApp
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('contactName').value.trim();
                const email = document.getElementById('contactUserEmail').value.trim();
                const message = document.getElementById('contactMessage').value.trim();

                // Get the contact email and phone from portfolio data
                const toEmail = portfolioData.contact.email || 'binary.developer01@gmail.com';
                const toPhone = (portfolioData.contact.phone || '+917406368709').replace(/[\s\-()]/g, '');

                // Build email body
                const emailSubject = encodeURIComponent(`Portfolio Contact from ${name}`);
                const emailBody = encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );

                // Open mailto link
                const mailtoLink = `mailto:${toEmail}?subject=${emailSubject}&body=${emailBody}`;
                window.open(mailtoLink, '_blank');

                // Build WhatsApp message
                const whatsappMsg = encodeURIComponent(
                    `Hi Prajwal! I'm ${name} (${email}).\n\n${message}`
                );
                const whatsappLink = `https://wa.me/${toPhone.replace('+', '')}?text=${whatsappMsg}`;

                // Open WhatsApp after a short delay so both actually open
                setTimeout(() => {
                    window.open(whatsappLink, '_blank');
                }, 500);

                e.target.reset();
                showMessage('Opening email & WhatsApp — thanks for reaching out! 🚀', 'success');
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) hideModal(loginModal);
            if (e.target === adminModal) hideModal(adminModal);

            // Detail modals
            const projectModal = document.getElementById('projectDetailModal');
            const blogModal = document.getElementById('blogDetailModal');
            if (e.target === projectModal) window.closeDetailModal('projectDetailModal');
            if (e.target === blogModal) window.closeDetailModal('blogDetailModal');
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const projectModal = document.getElementById('projectDetailModal');
                const blogModal = document.getElementById('blogDetailModal');

                if (projectModal && projectModal.classList.contains('open')) {
                    window.closeDetailModal('projectDetailModal');
                } else if (blogModal && blogModal.classList.contains('open')) {
                    window.closeDetailModal('blogDetailModal');
                } else if (adminModal && adminModal.style.display === 'flex') {
                    hideModal(adminModal);
                } else if (loginModal && loginModal.style.display === 'flex') {
                    hideModal(loginModal);
                }
            }
        });
    }

    // Smooth scrolling
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    const navMenu = document.querySelector('.nav-menu');
                    const hamburger = document.querySelector('.hamburger');

                    if (navMenu) navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            });
        });
    }

    // ========== START EVERYTHING ==========
    document.addEventListener('DOMContentLoaded', () => {
        init();
        setupEventListeners();
        setupSmoothScroll();
        initParticles();
        initTypingEffect();
        initScrollReveal();
        initNavbarScroll();
        initBackToTop();
    });
})();
