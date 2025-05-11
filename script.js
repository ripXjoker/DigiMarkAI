// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    // Sections (Pages)
    const sections = document.querySelectorAll('main > section'); // Assuming sections are direct children of a <main> wrapper
    const splashScreen = document.getElementById('splash-screen');
    const authScreen = document.getElementById('auth-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    // Add more section selectors as needed...

    // Navigation Links (assuming they exist with hrefs like "#dashboard-screen")
    const navLinks = document.querySelectorAll('nav a, footer a'); // Sidebar, bottom nav, etc.

    // Auth Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTabs = document.querySelectorAll('#auth-screen .tabs button');

    // Sidebar
    const sidebar = document.getElementById('main-sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const mainContent = document.getElementById('main-content'); // Assuming your main content wrapper

    // Modals
    const logoutTrigger = document.getElementById('logout-modal-trigger');
    const logoutModal = document.getElementById('logout-modal');
    const closeModalButtons = document.querySelectorAll('.modal-overlay .modal-content span, .modal-overlay .button[class*="cancel"]'); // Generic close

    // --- Initial State & Setup ---
    function hideAllSections() {
        sections.forEach(section => section.style.display = 'none');
    }

    function showSection(sectionId) {
        hideAllSections();
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
            window.scrollTo(0, 0); // Scroll to top of new "page"
        } else {
            console.warn(`Section with ID "${sectionId}" not found.`);
            // Show a default or error section if preferred
            if (dashboardScreen) dashboardScreen.style.display = 'block';
        }
    }

    // Simulate app loading and initial view (e.g., show auth or dashboard)
    function initializeApp() {
        // For now, let's assume we start at the auth screen after a brief splash
        if (splashScreen) {
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (authScreen) authScreen.style.display = 'block'; // Or dashboard if logged in
            }, 1500); // Simulate loading
        } else if (authScreen) {
            authScreen.style.display = 'block'; // Default to auth if no splash
        } else if (dashboardScreen) {
            dashboardScreen.style.display = 'block'; // Or dashboard if no auth needed initially
        }
    }

    // --- Event Listeners ---

    // Navigation Handling (Simplified SPA-like behavior)
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                event.preventDefault(); // Prevent default anchor jump
                const sectionId = targetId.substring(1); // Remove #
                if (sectionId === 'logout-modal-trigger') { // Special case for modal trigger
                    if(logoutModal) logoutModal.style.display = 'flex';
                } else {
                    showSection(sectionId);
                }

                // Basic active link styling for bottom nav (conceptual)
                if (link.closest('footer')) {
                    document.querySelectorAll('footer a').forEach(l => l.style.fontWeight = 'normal');
                    link.style.fontWeight = 'bold';
                }
            }
        });
    });

    // Auth Tab Switching
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

    // Login Form Submission (Placeholder)
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission
            console.log('Login attempt:', {
                email: loginForm.querySelector('#login-email').value,
                // password: loginForm.querySelector('#login-password').value // Don't log passwords!
            });
            alert('Login functionality placeholder. Check console.');
            // In a real app: validate, send to backend, handle response
            // On success, navigate to dashboard:
            // showSection('dashboard-screen');
        });
    }

    // Sidebar Toggle
    if (toggleSidebarButton && sidebar && mainContent) {
        toggleSidebarButton.addEventListener('click', () => {
            const isSidebarOpen = sidebar.style.left === '0px';
            if (isSidebarOpen) {
                sidebar.style.left = '-300px'; // Adjust if width is different
                mainContent.style.marginLeft = '0px';
            } else {
                sidebar.style.left = '0px';
                mainContent.style.marginLeft = '250px'; // Adjust to sidebar width
            }
        });
    }

    // Modal Handling
    if (logoutTrigger && logoutModal) {
        logoutTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalToClose = button.closest('.modal-overlay');
            if (modalToClose) {
                modalToClose.style.display = 'none';
            }
        });
    });

    // Close modal if clicking on the overlay itself
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) { // Clicked on overlay, not content
                overlay.style.display = 'none';
            }
        });
    });


    // --- Initialize App ---
    // Wrap your sections in a <main> tag in index.html for the querySelector to work well,
    // or adjust the `sections` selector.
    // For now, to avoid errors if <main> isn't there, we check.
    if (sections.length > 0) {
        initializeApp();
    } else {
        console.warn("No <section> elements found within <main> or `sections` selector needs adjustment. Page switching might not work.");
        // Fallback if sections aren't found as expected
        if (authScreen) authScreen.style.display = 'block';
        else if(dashboardScreen) dashboardScreen.style.display = 'block';
    }

});
