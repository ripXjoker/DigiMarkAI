// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const sections = document.querySelectorAll('main > section');
    const splashScreen = document.getElementById('splash-screen');
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const onboardingCarousel = document.getElementById('onboarding-carousel'); // Added

    // Navigation Links
    const navLinks = document.querySelectorAll('.nav-link'); // Using common class
    const sidebarNavLinks = document.querySelectorAll('#main-sidebar a');
    const bottomNavLinks = document.querySelectorAll('#bottom-nav a');


    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTabs = document.querySelectorAll('#auth-screen .tabs button');
    const authTabLinks = document.querySelectorAll('.auth-tab-link'); // Links to switch auth tabs

    // Onboarding
    const onboardingGetStartedBtn = document.querySelector('.onboarding-get-started');
    const onboardingNextBtns = document.querySelectorAll('.onboarding-next');
    const onboardingFinishBtn = document.querySelector('.onboarding-finish');
    const onboardingSteps = [ // IDs of onboarding step sections
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
    const logoutModalTriggers = document.querySelectorAll('[href="#logout-modal-trigger"]'); // Select all logout triggers
    const closeModalButtons = document.querySelectorAll('.close-modal-btn, .cancel-modal-btn');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');


    // --- Initial State & Setup ---
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
            if (dashboardScreen) dashboardScreen.style.display = 'block'; // Fallback
        }
    }

    function updateActiveNavLink(activeSectionId) {
        sidebarNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active'); // You'll need CSS for .active
            } else {
                link.classList.remove('active');
            }
        });
        bottomNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active'); // You'll need CSS for .active
                 link.style.color = '#3498db'; // Example active style
                 link.style.fontWeight = 'bold';
            } else {
                link.classList.remove('active');
                link.style.color = '#7f8c8d'; // Example inactive style
                link.style.fontWeight = 'normal';
            }
        });
    }


    function initializeApp() {
        if (splashScreen) { // Start with splash screen
            splashScreen.style.display = 'block';
            setTimeout(() => {
                // Check if user has completed onboarding (e.g., using localStorage)
                const onboardingComplete = localStorage.getItem('onboardingComplete');
                if (!onboardingComplete && onboardingCarousel) {
                    showSection('onboarding-carousel');
                } else if (authScreen) { // Default to auth if no splash or onboarding needed
                    showSection('auth-screen');
                } else if (dashboardScreen) {
                    showSection('dashboard-screen');
                }
            }, 1500);
        } else {
            // Fallback if no splash screen
             const onboardingComplete = localStorage.getItem('onboardingComplete');
            if (!onboardingComplete && onboardingCarousel) {
                showSection('onboarding-carousel');
            } else if (authScreen) {
                showSection('auth-screen');
            } else if (dashboardScreen) {
                showSection('dashboard-screen');
            } else {
                // If nothing else, try to show the first section found
                if(sections.length > 0) sections[0].style.display = 'block';
            }
        }
    }

    // --- Event Listeners ---

    // Generic Navigation Handling
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault();
                const sectionId = targetId.substring(1);

                if (sectionId === 'logout-modal-trigger') {
                    if(logoutModal) logoutModal.style.display = 'flex';
                } else {
                    showSection(sectionId);
                }
            }
        });
    });

    // Auth Tab Switching (Buttons)
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
    // Auth Tab Switching (Links like "Sign Up" / "Login" text links)
    authTabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetText = link.textContent.toLowerCase();
            authTabs.forEach(tabButton => {
                if (tabButton.textContent.toLowerCase().includes(targetText)) {
                    tabButton.click(); // Simulate click on the corresponding tab button
                }
            });
        });
    });


    // Login Form Submission (Placeholder)
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Login attempt:', { email: loginForm.querySelector('#login-email').value });
            alert('Login successful (placeholder)! Navigating to dashboard.');
            // Simulate successful login
            localStorage.setItem('userLoggedIn', 'true'); // Example flag
            showSection('dashboard-screen');
        });
    }
    // Signup Form Submission (Placeholder)
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Signup attempt:', { name: signupForm.querySelector('#signup-name').value, email: signupForm.querySelector('#signup-email').value });
            alert('Signup successful (placeholder)! Please login.');
            // Optionally switch to login tab
            authTabs.forEach(tab => { if (tab.textContent.toLowerCase().includes('login')) tab.click(); });
        });
    }
    // Reset Password Form
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Password reset link sent (placeholder)!');
            showSection('auth-screen'); // Go back to login
        });
    }


    // Onboarding Logic
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
                // Should not happen if finish button is separate
                localStorage.setItem('onboardingComplete', 'true');
                showSection('auth-screen'); // Or dashboard if auto-login after onboarding
            }
        });
    });
    if (onboardingFinishBtn) {
        onboardingFinishBtn.addEventListener('click', () => {
            localStorage.setItem('onboardingComplete', 'true');
            showSection('auth-screen'); // Or dashboard
        });
    }


    // Sidebar Toggle
    if (toggleSidebarButton && sidebar && mainContent) {
        toggleSidebarButton.addEventListener('click', () => {
            const isSidebarOpen = sidebar.style.left === '0px';
            sidebar.style.left = isSidebarOpen ? '-300px' : '0px';
            mainContent.style.marginLeft = isSidebarOpen ? '0px' : '250px';
        });
    }

    // Modal Handling
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
            localStorage.removeItem('userLoggedIn'); // Clear login flag
            localStorage.removeItem('onboardingComplete'); // Optionally reset onboarding for testing
            if(logoutModal) logoutModal.style.display = 'none';
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
