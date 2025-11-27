
// Projects Data
const projectsData = [
    {
        title: "ChatGPT & ChatPDF Solutions",
        company: "Lighthouse Info Systems Pvt Ltd",
        category: "GenAI",
        description: "Developed advanced AI solutions for conversational AI and document processing using state-of-the-art language models",
        tags: ["Generative AI", "NLP", "Python"]
    },
    {
        title: "Real-time Camera Systems",
        company: "Lighthouse Info Systems Pvt Ltd",
        category: "Computer Vision",
        description: "ML/DL integration for analytics and monitoring in real-time camera systems with advanced detection capabilities",
        tags: ["Computer Vision", "Deep Learning", "Real-time Processing"]
    },
    {
        title: "Cryptography-based RSA Encryption for Blockchain",
        company: "Cojag Smart Technology",
        category: "Blockchain",
        description: "Developed and demonstrated RSA Encryption and Decryption for Blockchain Transactions using Python",
        tags: ["Blockchain", "Cryptography", "Python"]
    },
    {
        title: "Skin Cancer Detection",
        company: "Cojag Smart Technology",
        category: "Healthcare",
        description: "Deep learning model to detect skin cancer with high accuracy for early diagnosis using CNN",
        tags: ["Healthcare AI", "Deep Learning", "Medical Imaging"]
    },
    {
        title: "Brain Tumor Detection",
        company: "Cojag Smart Technology",
        category: "Healthcare",
        description: "Built and optimized model for identifying brain tumors through advanced medical imaging techniques",
        tags: ["Healthcare AI", "CNN", "Medical Imaging"]
    },
    {
        title: "Vehicle Detection System",
        company: "Cojag Smart Technology",
        category: "Computer Vision",
        description: "Real-time vehicle detection using computer vision for traffic monitoring and analysis",
        tags: ["Computer Vision", "Object Detection", "Traffic Analytics"]
    },
    {
        title: "Grape Leaf Disease Detection",
        company: "Cojag Smart Technology",
        category: "Agriculture",
        description: "Solution to identify diseases in grape leaves for agricultural efficiency using image classification",
        tags: ["Agriculture AI", "Computer Vision", "Image Classification"]
    },
    {
        title: "Bitcoin Price Prediction",
        company: "Asterisc Technocrat",
        category: "Finance",
        description: "Machine learning model for cryptocurrency price forecasting using time series analysis",
        tags: ["Financial ML", "Time Series", "Prediction"]
    },
    {
        title: "Stock Price Prediction",
        company: "Asterisc Technocrat",
        category: "Finance",
        description: "Predictive modeling for stock market analysis using machine learning algorithms",
        tags: ["Financial ML", "Regression", "Market Analysis"]
    },
    {
        title: "Instagram Reach Forecasting",
        company: "Asterisc Technocrat",
        category: "Analytics",
        description: "Data analysis and forecasting for social media engagement metrics",
        tags: ["Social Media", "Forecasting", "Analytics"]
    },
    {
        title: "Rainfall Prediction",
        company: "Cojag Smart Technology",
        category: "Climate",
        description: "Deep learning and machine learning model for weather prediction and climate analysis",
        tags: ["Climate Tech", "Prediction", "Deep Learning"]
    },
    {
        title: "Human Emotion Recognition",
        company: "Cojag Smart Technology",
        category: "Computer Vision",
        description: "Python-based emotion detection system using facial recognition and deep learning",
        tags: ["Emotion AI", "Face Recognition", "Deep Learning"]
    },
    {
        title: "Online Admission System",
        category: "Web Development",
        description: "24x7 online admission system streamlining application process for students with full-stack implementation",
        tags: ["Web Development", "Full-Stack", "Python"]
    }
];

// Loading Screen
window.addEventListener('load', function () {
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1000);
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing Effect
const typingText = document.querySelector('.typing-text');
const roles = [
    'Python Developer',
    'AI/ML Specialist',
    'Data Scientist',
    'GenAI Engineer',
    'Oracle Cloud Expert'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(type, typingSpeed);
}

type();

// Skill Bars Animation
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Projects Rendering
const projectsGrid = document.querySelector('.projects-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = '';
    const filtered = filter === 'all'
        ? projectsData
        : projectsData.filter(p => p.category === filter);

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
                    <div class="project-header">
                        <div class="project-category">${project.category}</div>
                        <h3 class="project-title">${project.title}</h3>
                        ${project.company ? `<div class="project-company">${project.company}</div>` : ''}
                    </div>
                    <div class="project-body">
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
        projectsGrid.appendChild(card);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.getAttribute('data-filter'));
    });
});

renderProjects();

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fade In Animation on Scroll
const fadeElements = document.querySelectorAll('.stat-card, .skill-category, .timeline-item, .project-card, .edu-card, .cert-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// Experience modal wiring: populate and open a modal when "View Details" is clicked
(function setupExperienceModals() {
    const modal = document.getElementById('expModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalCompany = modal.querySelector('.modal-company');
    const modalDuration = modal.querySelector('.modal-duration');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalTags = modal.querySelector('.modal-tags');
    const closeBtn = modal.querySelector('.modal-close');

    function openModal(data) {
        modalTitle.textContent = data.title || '';
        modalCompany.textContent = data.company || '';
        modalDuration.textContent = data.duration || '';
        modalDesc.innerHTML = data.bio || '';
        modalTags.innerHTML = '';
        (data.tags || []).forEach(t => {
            const el = document.createElement('span');
            el.className = 'project-tag';
            el.textContent = t;
            modalTags.appendChild(el);
        });
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // close behaviours
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // attach to each experience CTA button
    document.querySelectorAll('.exp-cards .flipperContainer').forEach(container => {
        const btn = container.querySelector('.cta-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            // read fields from the card
            const titleEl = container.querySelector('.title');
            const subEl = container.querySelector('.subTitle');
            const bioEl = container.querySelector('.cardBack .bio');
            const tagEls = container.querySelectorAll('.tech-tags .tech-tag');
            const imgEl = container.querySelector('.imgContainer');

            const tags = Array.from(tagEls).map(t => t.textContent.trim());

            const data = {
                title: titleEl ? titleEl.textContent.trim() : '',
                company: subEl ? subEl.textContent.trim() : '',
                duration: subEl ? subEl.textContent.trim() : '',
                bio: bioEl ? bioEl.innerHTML : '',
                tags: tags
            };

            openModal(data);
        });
    });
})();
