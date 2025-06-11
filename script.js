document.addEventListener('DOMContentLoaded', function() {

    // --- General Utilities & Smooth Scroll ---
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Adjust for fixed header height if necessary
            const headerHeight = document.getElementById('mainHeader') ? document.getElementById('mainHeader').offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('mainHeader');
    const hero = document.getElementById('hero'); // For adjustHeroPadding

    function adjustHeroPaddingLocal() {
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            hero.style.paddingTop = `${headerHeight + 20}px`; // 20px is extra space
        }
    }

    if (header) {
        let lastHeaderHeight = header.offsetHeight;
        window.addEventListener('scroll', () => {
            const isCurrentlyScrolled = header.classList.contains('scrolled');
            if (window.scrollY > 50) {
                if (!isCurrentlyScrolled) {
                    header.classList.add('scrolled');
                }
            } else {
                if (isCurrentlyScrolled) {
                    header.classList.remove('scrolled');
                }
            }
            // Adjust padding if header height changed due to class change
            if (header.offsetHeight !== lastHeaderHeight) {
                if (hero) adjustHeroPaddingLocal();
                lastHeaderHeight = header.offsetHeight;
            }
        });
    }
    // Initial and resize adjustments for hero padding
    if (hero) {
        adjustHeroPaddingLocal();
    }
    window.addEventListener('resize', () => {
        if (hero) adjustHeroPaddingLocal();
    });


    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
            // Accessibility: Announce menu state change
            const isExpanded = document.body.classList.contains('mobile-menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            mainNav.setAttribute('aria-hidden', !isExpanded);
        });

        // Close mobile menu when a nav link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (document.body.classList.contains('mobile-menu-open')) {
                    document.body.classList.remove('mobile-menu-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }


    // --- Navigation Link Activation (Smooth Scroll & Active State) ---
    const navLinks = document.querySelectorAll('#mainNav a[href^="#"], a.cta-button[href^="#"], a.cta-button-outline[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                smoothScrollTo(targetId);

                // Active state for main navigation
                if (this.closest('#mainNav')) {
                    document.querySelectorAll('#mainNav a.active').forEach(activeLink => {
                        activeLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
            // If it's a link to another page (e.g. full_menu.html), let default behavior occur
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        let current = '';
        const headerHeight = header ? header.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted offset
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            if (link.closest('#mainNav')) { // Only apply active to main nav items
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            }
        });
        // Ensure "Home" is active if at the top or no other section is current
        const homeLink = document.querySelector('#mainNav a[href="#hero"]');
        if (!current && homeLink && !homeLink.classList.contains('active')) {
             if (document.querySelector('#mainNav a.active')) {
                document.querySelector('#mainNav a.active').classList.remove('active');
             }
             homeLink.classList.add('active');
        } else if (current && homeLink && homeLink.classList.contains('active') && current !== 'hero') {
            homeLink.classList.remove('active');
        }
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call


    // --- Authentication & Guest Chat Section ---
    const authPrompt = document.getElementById('authPrompt');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const chatInterface = document.getElementById('chatInterface');
    const loginPromptBtn = document.getElementById('loginPromptBtn');
    const registerPromptBtn = document.getElementById('registerPromptBtn');
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');
    const freeWallButton = document.getElementById('freeWallButton');

    let isLoggedIn = false; // Demo state

    window.showAuthForm = function(formType) { // Make it global for inline calls if any (none currently)
        if (authPrompt) authPrompt.style.display = 'none';
        if (loginForm) loginForm.style.display = formType === 'login' ? 'block' : 'none';
        if (registerForm) registerForm.style.display = formType === 'register' ? 'block' : 'none';
        if (chatInterface) chatInterface.style.display = 'none';
    }

    if (loginPromptBtn) {
        loginPromptBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('login');
        });
    }

    if (registerPromptBtn) {
        registerPromptBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('register');
        });
    }

    if (switchToRegisterLink) {
        switchToRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('register');
        });
    }

    if (switchToLoginLink) {
        switchToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('login');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email && password) { // Basic validation
                console.log('Simulating login for:', email);
                isLoggedIn = true;
                if (loginForm) loginForm.style.display = 'none';
                if (registerForm) registerForm.style.display = 'none';
                if (chatInterface) chatInterface.style.display = 'block';
                if (authPrompt) authPrompt.style.display = 'none';
                if (freeWallButton) freeWallButton.style.display = 'block'; // Show flying button
                document.getElementById('loginEmail').value = ''; // Clear field
                document.getElementById('loginPassword').value = ''; // Clear field

                const chatInput = document.getElementById('chatMessageInput');
                if (chatInput) chatInput.focus();
            } else {
                alert('Please enter both email and password.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            if (username && email && password) {
                console.log('Simulating registration for:', username, email);
                alert('Registration successful (demo)! Please login.');
                showAuthForm('login'); // Switch to login form
                document.getElementById('registerUsername').value = '';
                document.getElementById('registerEmail').value = '';
                document.getElementById('registerPassword').value = '';
            } else {
                alert('Please fill in all registration fields.');
            }
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            isLoggedIn = false;
            if (chatInterface) chatInterface.style.display = 'none';
            if (authPrompt) authPrompt.style.display = 'block';
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'none';
            if (freeWallButton) freeWallButton.style.display = 'none'; // Hide flying button
            console.log('User logged out (demo)');
        });
    }

    // Guest Chat Message Sending (Demo)
    const sendMessageButton = document.getElementById('sendMessageButton');
    const chatMessageInput = document.getElementById('chatMessageInput');
    const chatOutput = document.getElementById('chatOutput');

    function addChatMessage(message, sender) {
        if (!chatOutput) return;
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = sender === 'user' ? "You: " : "Guest: ";
        p.appendChild(strong);
        p.appendChild(document.createTextNode(message));

        if (sender === 'user') {
            p.style.textAlign = 'right'; // Simple alignment
        }
        chatOutput.appendChild(p);
        chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to bottom
    }

    if (sendMessageButton && chatMessageInput) {
        sendMessageButton.addEventListener('click', function() {
            const message = chatMessageInput.value.trim();
            if (message) {
                addChatMessage(message, 'user');
                chatMessageInput.value = '';
                // Demo: Simulate a reply
                setTimeout(() => {
                    addChatMessage("Thanks for your message! (This is a demo response)", "guest");
                }, 1000);
            }
        });
        chatMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if inside one
                sendMessageButton.click();
            }
        });
    }

    // Initial state for auth, chat, and flying button
    if (!isLoggedIn) {
        if (authPrompt) authPrompt.style.display = 'block';
        if (chatInterface) chatInterface.style.display = 'none';
        if (freeWallButton) freeWallButton.style.display = 'none';
    } else {
        if (authPrompt) authPrompt.style.display = 'none';
        if (chatInterface) chatInterface.style.display = 'block';
        if (freeWallButton) freeWallButton.style.display = 'block';
    }

    // Flying button event listener
    if (freeWallButton) {
        freeWallButton.addEventListener('click', () => {
            window.location.href = 'free_wall.html';
        });
    }


    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (name && email && subject && message) {
                console.log('Contact Form Submitted (Demo):');
                console.log('Name:', name);
                console.log('Email:', email);
                console.log('Subject:', subject);
                console.log('Message:', message);
                alert('Thank you for your message! (This is a demo, your message was not actually sent).');
                contactForm.reset(); // Clear the form
            } else {
                alert('Please fill in all fields of the contact form.');
            }
        });
    }


    // --- AI Chef Modal ---
    const aiChefModal = document.getElementById('aiChefModal');
    const askTheChefBtn = document.getElementById('askTheChefBtn');
    const closeAiChefModalBtn = document.getElementById('closeAiChefModalBtn');
    const aiChefUserInput = document.getElementById('aiChefUserInput');
    const aiChefSendBtn = document.getElementById('aiChefSendBtn');
    const aiChefChatbox = document.getElementById('aiChefChatbox');
    const aiChefVideo = document.getElementById('aiChefImage'); // Get the video element

    function openAiChefModal() {
        if (isLoggedIn) {
            if (aiChefModal) {
                aiChefModal.style.display = 'flex';
                setTimeout(() => {
                    aiChefModal.classList.add('open');
                }, 10);
                document.body.classList.add('modal-open');
                if (aiChefUserInput) aiChefUserInput.focus();
                if (aiChefVideo && typeof aiChefVideo.play === 'function') { // Play video if it's a video element
                    aiChefVideo.play().catch(error => console.log("Video autoplay failed:", error));
                }
            }
        } else {
            if (authPrompt) authPrompt.style.display = 'block';
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'none';
            if (chatInterface) chatInterface.style.display = 'none';
            smoothScrollTo('guestChat');
        }
    }

    function closeAiChefModal() {
        if (aiChefModal) {
            aiChefModal.classList.remove('open');
            // Wait for transition to finish before hiding
            aiChefModal.addEventListener('transitionend', function handleTransitionEnd() {
                aiChefModal.style.display = 'none';
                aiChefModal.removeEventListener('transitionend', handleTransitionEnd);
            });
            document.body.classList.remove('modal-open');
            if (aiChefVideo && typeof aiChefVideo.pause === 'function') { // Pause video
                aiChefVideo.pause();
            }
        }
    }

    if (askTheChefBtn) {
        askTheChefBtn.addEventListener('click', openAiChefModal);
    }

    if (closeAiChefModalBtn) {
        closeAiChefModalBtn.addEventListener('click', closeAiChefModal);
    }

    if (aiChefModal) {
        aiChefModal.addEventListener('click', function(event) {
            if (event.target === aiChefModal) {
                closeAiChefModal();
            }
        });
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && aiChefModal && aiChefModal.classList.contains('open')) {
            closeAiChefModal();
        }
    });

    // Typing animation for AI Chef
    function typeMessage(element, text, speed = 30, callback) {
        let i = 0;
        element.textContent = '';
        
        if(aiChefSendBtn) aiChefSendBtn.disabled = true;
        if(aiChefUserInput) aiChefUserInput.disabled = true;

        function typeCharacter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                if (aiChefChatbox) aiChefChatbox.scrollTop = aiChefChatbox.scrollHeight;
                setTimeout(typeCharacter, speed);
            } else {
                if(aiChefSendBtn) aiChefSendBtn.disabled = false;
                if(aiChefUserInput) {
                    aiChefUserInput.disabled = false;
                    aiChefUserInput.focus();
                }
                if (aiChefChatbox) aiChefChatbox.scrollTop = aiChefChatbox.scrollHeight;
                if (callback) callback();
            }
        }
        typeCharacter();
    }

    function addAiChefMessage(messageContent, senderClass) {
        if (!aiChefChatbox) return;
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', senderClass);

        const messageParagraph = document.createElement('p');
        messageContainer.appendChild(messageParagraph);
        aiChefChatbox.appendChild(messageContainer);

        if (senderClass === 'chef-message') {
            typeMessage(messageParagraph, messageContent);
        } else {
            messageParagraph.textContent = messageContent;
            if (aiChefChatbox) aiChefChatbox.scrollTop = aiChefChatbox.scrollHeight;
        }
    }

    if (aiChefSendBtn && aiChefUserInput) {
        aiChefSendBtn.addEventListener('click', function() {
            const userQuery = aiChefUserInput.value.trim();
            if (userQuery && !aiChefSendBtn.disabled) { // Check if button is not disabled
                addAiChefMessage(userQuery, 'user-message');
                if (aiChefUserInput) aiChefUserInput.value = '';

                setTimeout(() => {
                    let chefResponse = "I'm still learning! Ask me about our Adobo or Sinigang for now. (Demo)";
                    if (userQuery.toLowerCase().includes('adobo')) {
                        chefResponse = "Our Adobo is a classic! Tender chicken or pork braised in soy sauce, vinegar, garlic, and peppercorns. It's a taste of home!";
                    } else if (userQuery.toLowerCase().includes('sinigang')) {
                        chefResponse = "Ah, Sinigang! A hearty and sour tamarind-based soup, usually with pork ribs or shrimp and lots of vegetables. Very comforting!";
                    } else if (userQuery.toLowerCase().includes('hours') || userQuery.toLowerCase().includes('open')) {
                        chefResponse = "We're open from 11 AM to 10 PM daily! Come visit us! (Demo Info)";
                    } else if (userQuery.toLowerCase().includes('location') || userQuery.toLowerCase().includes('address')) {
                        chefResponse = "You can find Kinamot at 123 Flavortown St., Foodie City! (Demo Address)";
                    }
                    addAiChefMessage(chefResponse, 'chef-message');
                }, 1200);
            }
        });

        aiChefUserInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && !aiChefSendBtn.disabled) {
                e.preventDefault();
                aiChefSendBtn.click();
            }
        });
    }

    // --- Footer: Set Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End of DOMContentLoaded
