document.addEventListener('DOMContentLoaded', () => {
    // --- Card Animation and Effects ---
    const cards = document.querySelectorAll(".card");
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    cards.forEach((card) => {
        const content = card.querySelector(".card-content");
        const rotationFactor = parseFloat(card.getAttribute("data-rotation-factor")) || 2;

        if (!isTouchDevice) {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = (rotationFactor * (x - centerX)) / centerX;
                const rotateX = (-rotationFactor * (y - centerY)) / centerY;

                content.style.transform = `
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;

                card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
                card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
            });

            card.addEventListener("mouseleave", () => {
                content.style.transform = "rotateX(0) rotateY(0)";
                content.style.transition = "transform 0.5s ease";
                setTimeout(() => {
                    content.style.transition = "";
                }, 500);
            });
        }

        const randomDelay = Math.random() * 2;
        card.style.animation = `cardFloat 4s infinite alternate ease-in-out ${randomDelay}s`;
    });

    // Add card floating animation styles
    const style = document.createElement("style");
    style.textContent = `
        @keyframes cardFloat {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(-5px);
            }
        }
        
        @media (min-width: 768px) {
            @keyframes cardFloat {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-8px);
                }
            }
        }
        
        @media (min-width: 1024px) {
            @keyframes cardFloat {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-10px);
                }
            }
        }
    `;
    document.head.appendChild(style);

    // Button ripple effects
    const buttons = document.querySelectorAll(".card-button");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();

            const ripple = document.createElement("span");
            ripple.classList.add("ripple");
            button.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            ripple.classList.add("active");

            setTimeout(() => {
                ripple.remove();
            }, 500);
        });
    });

    // Add ripple effect styles
    const rippleStyle = document.createElement("style");
    rippleStyle.textContent = `
        .card-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.5s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // --- Main Application Logic ---
    const sections = document.querySelectorAll('main > section');
    const splashScreen = document.getElementById('splash-screen');
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const onboardingCarousel = document.getElementById('onboarding-carousel');

    // Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarNavLinks = document.querySelectorAll('#main-sidebar a');
    const bottomNavLinks = document.querySelectorAll('#bottom-nav a');

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTabs = document.querySelectorAll('#auth-screen .tabs button');
    const authTabLinks = document.querySelectorAll('.auth-tab-link');

    // Onboarding
    const onboardingGetStartedBtn = document.querySelector('.onboarding-get-started');
    const onboardingNextBtns = document.querySelectorAll('.onboarding-next');
    const onboardingFinishBtn = document.querySelector('.onboarding-finish');
    const onboardingSteps = [
        'onboarding-step-1-screen',
        'onboarding-step-2-screen',
        'onboarding-step-3-screen',
        'onboarding-step-4-screen'
    ];
    let currentOnboardingStep = 0;

    // Sidebar
    const sidebar = document.getElementById('main-sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const mainContent = document.getElementById('main-content');

    // Modals
    const logoutModal = document.getElementById('logout-modal');
    const logoutModalTriggers = document.querySelectorAll('[href="#logout-modal-trigger"]');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn, .cancel-modal-btn');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');

    // --- Functions ---
    function hideAllSections() {
        sections.forEach(section => section.style.display = 'none');
    }

    function showSection(sectionId) {
        hideAllSections();
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
            window.scrollTo(0, 0);
            updateActiveNavLink(sectionId);
        } else {
            console.warn(`Section with ID "${sectionId}" not found.`);
            if (dashboardScreen) dashboardScreen.style.display = 'block';
        }
    }

    function updateActiveNavLink(activeSectionId) {
        sidebarNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        bottomNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
                link.style.color = '#3498db';
                link.style.fontWeight = 'bold';
            } else {
                link.classList.remove('active');
                link.style.color = '#7f8c8d';
                link.style.fontWeight = 'normal';
            }
        });
    }

    function initializeApp() {
        if (splashScreen) {
            splashScreen.style.display = 'block';
            setTimeout(() => {
                const onboardingComplete = localStorage.getItem('onboardingComplete');
                if (!onboardingComplete && onboardingCarousel) {
                    showSection('onboarding-carousel');
                } else if (authScreen) {
                    showSection('auth-screen');
                } else if (dashboardScreen) {
                    showSection('dashboard-screen');
                }
            }, 1500);
        } else {
            const onboardingComplete = localStorage.getItem('onboardingComplete');
            if (!onboardingComplete && onboardingCarousel) {
                showSection('onboarding-carousel');
            } else if (authScreen) {
                showSection('auth-screen');
            } else if (dashboardScreen) {
                showSection('dashboard-screen');
            } else if (sections.length > 0) {
                sections[0].style.display = 'block';
            }
        }
    }

    // --- Event Listeners ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault();
                const sectionId = targetId.substring(1);

                if (sectionId === 'logout-modal-trigger') {
                    if (logoutModal) logoutModal.style.display = 'flex';
                } else {
                    showSection(sectionId);
                }
            }
        });
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (loginForm && signupForm) {
                if (tab.textContent.toLowerCase().includes('login')) {
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                }
            }
        });
    });

    authTabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetText = link.textContent.toLowerCase();
            authTabs.forEach(tabButton => {
                if (tabButton.textContent.toLowerCase().includes(targetText)) {
                    tabButton.click();
                }
            });
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Login attempt:', { email: loginForm.querySelector('#login-email').value });
            alert('Login successful (placeholder)! Navigating to dashboard.');
            localStorage.setItem('userLoggedIn', 'true');
            showSection('dashboard-screen');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Signup attempt:', { name: signupForm.querySelector('#signup-name').value, email: signupForm.querySelector('#signup-email').value });
            alert('Signup successful (placeholder)! Please login.');
            authTabs.forEach(tab => { if (tab.textContent.toLowerCase().includes('login')) tab.click(); });
        });
    }

    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Password reset link sent (placeholder)!');
            showSection('auth-screen');
        });
    }

    if (onboardingGetStartedBtn) {
        onboardingGetStartedBtn.addEventListener('click', () => {
            currentOnboardingStep = 0;
            showSection(onboardingSteps[currentOnboardingStep]);
        });
    }

    onboardingNextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentOnboardingStep++;
            if (currentOnboardingStep < onboardingSteps.length) {
                showSection(onboardingSteps[currentOnboardingStep]);
            } else {
                localStorage.setItem('onboardingComplete', 'true');
                showSection('auth-screen');
            }
        });
    });

    if (onboardingFinishBtn) {
        onboardingFinishBtn.addEventListener('click', () => {
            localStorage.setItem('onboardingComplete', 'true');
            showSection('auth-screen');
        });
    }

    if (toggleSidebarButton && sidebar && mainContent) {
        toggleSidebarButton.addEventListener('click', () => {
            const isSidebarOpen = sidebar.style.left === '0px';
            sidebar.style.left = isSidebarOpen ? '-300px' : '0px';
            mainContent.style.marginLeft = isSidebarOpen ? '0px' : '250px';
        });
    }

    logoutModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (logoutModal) logoutModal.style.display = 'flex';
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalToClose = button.closest('.modal-overlay');
            if (modalToClose) modalToClose.style.display = 'none';
        });
    });

    if (logoutModal) {
        logoutModal.addEventListener('click', (event) => {
            if (event.target === logoutModal) logoutModal.style.display = 'none';
        });
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            alert('Logged out (placeholder)!');
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('onboardingComplete');
            if (logoutModal) logoutModal.style.display = 'none';
            showSection('auth-screen');
        });
    }

    // --- Initialize App ---
    if (sections.length > 0) {
        initializeApp();
    } else {
        console.error("CRITICAL: No <section> elements found within <main>. Page switching will not work.");
    }
});
