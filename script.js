// ============================================
// PRIME TAXFIN SOLUTIONS - PREMIUM LOAN JAVASCRIPT
// Fixed Animations & Calculator Integration
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initEMICalculator();
    initLoanCards();
    initContactForm();
    initAnimations();
    
    console.log('%c🏢 PRIME TAXFIN SOLUTIONS', 'color: #4f46e5; font-size: 24px; font-weight: bold;');
    console.log('%c📱 Premium Loan Website Initialized', 'color: #10b981; font-size: 16px;');
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        loadingProgress.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.classList.add('loaded'); // Trigger final entrance animations
                }, 500);
            }, 500);
        }
    }, 100);
}

// Navigation & Mobile Menu
function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 150;
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll Effects (Scroll to top)
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Entrance Animations (Replaces AOS perfectly without blocking hover)
function initAnimations() {
    const animatedElements = document.querySelectorAll('.loan-card, .step, .team-card, .info-card, .portal-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Chart.js & EMI Calculator
function initEMICalculator() {
    const loanAmountInput = document.getElementById('loanAmountInput');
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const interestRateInput = document.getElementById('interestRateInput');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const loanTenureInput = document.getElementById('loanTenureInput');
    const loanTenureSlider = document.getElementById('loanTenureSlider');
    const loanTypeBtns = document.querySelectorAll('.loan-type-btn');
    
    const loanAmountDisplay = document.getElementById('loanAmountDisplay');
    const interestRateDisplay = document.getElementById('interestRateDisplay');
    const loanTenureDisplay = document.getElementById('loanTenureDisplay');
    const loanTypeDisplay = document.getElementById('loanTypeDisplay');
    const emiResult = document.getElementById('emiResult');
    const totalAmount = document.getElementById('totalAmount');
    const totalInterest = document.getElementById('totalInterest');
    const principalAmount = document.getElementById('principalAmount');
    const displayTenure = document.getElementById('displayTenure');
    
    let emiChartInstance = null;

    function formatIndianNumber(num) {
        return Math.round(num).toLocaleString('en-IN');
    }
    
    function calculateEMI() {
        const principal = parseFloat(loanAmountInput.value.replace(/,/g, '')) || 500000;
        const rate = (parseFloat(interestRateInput.value) || 12.5) / 12 / 100;
        const tenure = (parseFloat(loanTenureInput.value) || 5) * 12;
        
        const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
        const totalPayment = emi * tenure;
        const totalInterestPayable = totalPayment - principal;
        
        loanAmountDisplay.textContent = formatIndianNumber(principal);
        interestRateDisplay.textContent = parseFloat(interestRateInput.value).toFixed(1) + '%';
        loanTenureDisplay.textContent = `${loanTenureInput.value} Years`;
        displayTenure.textContent = `${loanTenureInput.value} Years (${tenure} Months)`;
        
        emiResult.textContent = `₹${formatIndianNumber(emi)}`;
        totalAmount.textContent = `₹${formatIndianNumber(totalPayment)}`;
        totalInterest.textContent = `₹${formatIndianNumber(totalInterestPayable)}`;
        principalAmount.textContent = `₹${formatIndianNumber(principal)}`;
        
        updateChart(principal, totalInterestPayable);
    }
    
    function updateChart(principal, interest) {
        const ctx = document.getElementById('emiChart');
        if (!ctx) return; // Failsafe if canvas is missing
        
        if (emiChartInstance) {
            emiChartInstance.destroy();
        }
        
        emiChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: ['#4f46e5', '#10b981'],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '75%'
            }
        });
    }
    
    // Bind Loan Type Buttons
    loanTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loanTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            loanTypeDisplay.textContent = `${btn.querySelector('span').textContent} Loan`;
            const newRate = btn.dataset.rate;
            interestRateInput.value = newRate;
            interestRateSlider.value = newRate;
            
            calculateEMI();
        });
    });
    
    // Sync Sliders and Inputs
    function sync(input, slider) {
        input.addEventListener('input', () => {
            let val = input.value.replace(/,/g, '');
            slider.value = val;
            calculateEMI();
        });
        slider.addEventListener('input', () => {
            input.value = slider.value;
            calculateEMI();
        });
    }
    
    sync(loanAmountInput, loanAmountSlider);
    sync(interestRateInput, interestRateSlider);
    sync(loanTenureInput, loanTenureSlider);
    
    // Format big numbers on blur
    loanAmountInput.addEventListener('blur', () => {
        let val = loanAmountInput.value.replace(/,/g, '');
        if(!isNaN(val) && val !== '') loanAmountInput.value = parseInt(val).toLocaleString('en-IN');
    });
    loanAmountInput.addEventListener('focus', () => {
        loanAmountInput.value = loanAmountInput.value.replace(/,/g, '');
    });
    
    // Init
    calculateEMI();
}

// Click to Apply routing
function initLoanCards() {
    document.querySelectorAll('.loan-cta').forEach(cta => {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.loan-card');
            const loanType = card.dataset.loan;
            
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    const select = document.querySelector('#loanEnquiryForm select');
                    if(select) {
                        select.value = loanType;
                        select.focus();
                    }
                }, 800);
            }
        });
    });
}

// Contact Form WhatsApp integration
function initContactForm() {
    const contactForm = document.getElementById('loanEnquiryForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!data.phone || data.phone.length < 10) {
                alert('Please enter a valid phone number');
                return;
            }
            
            const whatsappMessage = `*🏢 PRIME TAXFIN SOLUTIONS - Loan Enquiry*\n\n` +
                `*👤 Name:* ${data.name || 'Not provided'}\n` +
                `*📱 Phone:* ${data.phone}\n` +
                `*📧 Email:* ${data.email || 'Not provided'}\n` +
                `*💰 Loan Type:* ${data['loan-type'] || 'Not specified'}\n` +
                `*💵 Loan Amount:* ${data['loan-amount'] || 'Not specified'}\n` +
                `*📝 Additional Info:* ${data['additional-info'] || 'None'}\n\n` +
                `_Enquiry submitted on: ${new Date().toLocaleString('en-IN')}_`;
            
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/919893330505?text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank');
            setTimeout(() => this.reset(), 1000);
        });
    }
}