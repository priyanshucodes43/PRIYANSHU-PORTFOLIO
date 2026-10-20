/* ==========================================================================
   DEVELOPER PORTFOLIO - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DYNAMIC CANVAS PARTICLE BACKGROUND SYSTEM
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
      
      // Update custom cursor glow
      const cursorGlow = document.getElementById('cursor-glow');
      if (cursorGlow) {
        cursorGlow.style.left = `${e.x}px`;
        cursorGlow.style.top = `${e.y}px`;
      }
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
        this.color = '#38bdf8';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse displacement
        if (mouse.x && mouse.y) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#2563eb';
        ctx.fill();
      }
    }

    // Spawn Particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 70);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${1 - dist / 130})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 2. HERO TYPEWRITER EFFECT
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      "Python Developer & Scripting Specialist",
      "6-Month DCA Diploma Certified",
      "Aspiring C / C++ Software Engineer",
      "Future Java Enterprise Developer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end of line
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // --------------------------------------------------------------------------
  // 3. THEME TOGGLER (DARK / LIGHT MODE)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme mode!`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION TOGGLE & ACTIVE SCROLL TRACKING
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
  }

  // Active Nav Link Scroll Observer
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll handler for all internal anchor links (View Projects, Get In Touch, Nav)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (navLinksContainer) {
            navLinksContainer.classList.remove('mobile-open');
          }
          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, targetId);
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. TABBED ABOUT ME SECTION
  // --------------------------------------------------------------------------
  const aboutTabs = document.querySelectorAll('.about-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      aboutTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetTab = document.getElementById(`tab-${tab.dataset.tab}`);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // 6. SKILL BARS & NUMERIC COUNTERS INTERSECTION OBSERVER
  // --------------------------------------------------------------------------
  const skillSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  let animatedSkills = false;

  const counters = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger Skill Progress Fill
        if (!animatedSkills && entry.target.id === 'skills') {
          progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
          });
          animatedSkills = true;
        }

        // Trigger Counter Numbers
        if (!animatedCounters && entry.target.id === 'hero') {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const step = Math.ceil(target / 40);
            const updateCount = () => {
              count += step;
              if (count < target) {
                counter.innerText = count;
                setTimeout(updateCount, 40);
              } else {
                counter.innerText = target + '+';
              }
            };
            updateCount();
          });
          animatedCounters = true;
        }
      }
    });
  }, { threshold: 0.3 });

  if (skillSection) observer.observe(skillSection);
  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);

  // --------------------------------------------------------------------------
  // 7. PROJECT GALLERY FILTERING & MODAL DETAILS
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Modal Data Store - College Submission Projects
  const projectDetails = {
    1: {
      title: "Student Record & Marks Management System",
      category: "Python & SQLite Database",
      image: "assets/student_mgmt.jpg",
      description: "A complete DCA college submission project engineered in Python 3 with SQLite database connectivity for managing student admissions, course enrollments, subject marks calculation, grade generation, and report card printing.",
      features: [
        "Add, search, update, and delete student records with unique roll numbers",
        "Automatic percentage, GPA, and grade calculation (A+, A, B, Fail)",
        "Subject-wise marks analysis and class performance reports",
        "Data storage in SQLite database with CSV export functionality"
      ],
      link: "https://github.com/priyanshucodes43"
    },
    2: {
      title: "Digital Library Automation & Book Issue System",
      category: "Python & File Management",
      image: "assets/library_system.jpg",
      description: "An automated library management software system designed in Python to manage book inventory, issue/return transactions, fine calculation, and student member logs.",
      features: [
        "Search books by Title, Author, ISBN, or Subject Category",
        "Issue and return date tracking with automatic overdue fine calculator",
        "Student library card membership verification & issue limits",
        "Persistent data storage using structured JSON & CSV file handling"
      ],
      link: "https://github.com/priyanshucodes43"
    },
    3: {
      title: "Store Billing & Inventory Management System",
      category: "DCA & SQL Database",
      image: "assets/dca_project.jpg",
      description: "A retail point-of-sale (POS) billing system built with database tools, automated GST tax calculation, itemized invoice printing, and stock level monitoring.",
      features: [
        "Product inventory tracking with low-stock warning alerts",
        "Quick barcode/item code billing interface and bill generation",
        "Automatic CGST & SGST tax breakdown on customer receipts",
        "Daily sales analytics and profit summary reports"
      ],
      link: "https://github.com/priyanshucodes43"
    },
    4: {
      title: "Employee Payroll & Attendance System",
      category: "Python / Java Desktop App",
      image: "assets/python_project.jpg",
      description: "An automated payroll software desktop application that calculates monthly salaries, tax deductions, attendance, overtime pay, and generates printable payslips.",
      features: [
        "Employee registration and daily attendance tracking module",
        "Monthly basic salary, HRA, DA, tax deductions, and NET salary computation",
        "Automated payslip generation and Excel summary export",
        "Role-based password authentication for HR & Administrator access"
      ],
      link: "https://github.com/priyanshucodes43"
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const details = projectDetails[id];
      if (details && projectModal && modalBody) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 20px;">
            <span class="project-category">${details.category}</span>
            <h2 style="font-size: 1.8rem; margin-top: 4px;">${details.title}</h2>
          </div>
          <img src="${details.image}" alt="${details.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--border-subtle);">
          <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 1.05rem;">${details.description}</p>
          <h4 style="color: var(--accent-cyan); margin-bottom: 12px;">Key Highlights & Features:</h4>
          <ul style="list-style: none; padding-left: 0; margin-bottom: 24px;">
            ${details.features.map(f => `<li style="margin-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i> ${f}</li>`).join('')}
          </ul>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="${details.link && details.link !== '#' ? details.link : 'https://github.com/priyanshucodes43'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="modal-repo-link">
              <i class="fa-brands fa-github"></i> View Repository on GitHub
            </a>
            <button class="btn btn-secondary" onclick="document.getElementById('project-modal').classList.remove('active')">
              Close Preview
            </button>
          </div>
        `;
        projectModal.classList.add('active');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM SUBMISSION & TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;

      showToast(`Thank you ${name}! Your message has been sent successfully.`, 'success');
      contactForm.reset();
    });
  }

  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); font-size: 1.2rem;"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
});
