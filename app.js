/**
 * Shopify Growth Specialist Portfolio
 * Premium Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initScrollReveal();
  initNumberCounters();
  initMagneticButtons();
  initMobileMenu();
  initNavbarScroll();
  initCaseStudyFilter();
  initTestimonialCarousel();
  initFooterCollapse();
});

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optionally unobserve after revealing
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select all elements to animate
  const elementsToAnimate = document.querySelectorAll(
    '.hidden-element, .hidden-element--fade, .hidden-element--left, .hidden-element--right'
  );
  
  elementsToAnimate.forEach(el => observer.observe(el));
}

/**
 * Dynamic Number Counters
 */
function initNumberCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const targetAttr = element.getAttribute('data-counter');
  const target = parseFloat(targetAttr);
  const isDecimal = targetAttr.includes('.');
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  const startValue = 0;

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-expo)
    const easeProgress = 1 - Math.pow(2, -10 * progress);
    
    let currentValue = startValue + (target - startValue) * easeProgress;
    
    if (isDecimal) {
      element.textContent = prefix + currentValue.toFixed(1) + suffix;
    } else {
      element.textContent = prefix + Math.floor(currentValue) + suffix;
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(updateCounter);
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', handleMagneticMove);
    button.addEventListener('mouseleave', handleMagneticLeave);
  });
}

function handleMagneticMove(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  // Magnetic strength
  const strength = 0.3;
  
  button.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.03)`;
}

function handleMagneticLeave(e) {
  const button = e.currentTarget;
  
  // Smoothly return to original position
  button.style.transform = 'translate(0px, 0px) scale(1)';
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__mobile-toggle');
  const navLinks = document.querySelector('.nav__links');
  
  if (!toggle || !navLinks) return;

  function closeMenu() {
    toggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
  const nav = document.querySelector('.nav');
  
  if (!nav) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * Parallax effect for hero background (optional)
 */
function initParallax() {
  const hero = document.querySelector('.hero');
  
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    hero.style.backgroundPosition = `center ${rate}px`;
  });
}

// Uncomment to enable parallax
// initParallax();

/**
 * Case Study Filter
 */
function initCaseStudyFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  
  if (!filterButtons.length || !caseCards.length) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      caseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Testimonial Carousel
 */
function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;
  
  const track = carousel.querySelector('.testimonial-carousel__track');
  const prevBtn = carousel.querySelector('.testimonial-carousel__btn--prev');
  const nextBtn = carousel.querySelector('.testimonial-carousel__btn--next');
  const dotsContainer = carousel.querySelector('.testimonial-carousel__dots');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  const testimonials = track.querySelectorAll('.testimonial');
  const totalSlides = testimonials.length;
  
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'testimonial-carousel__dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  const dots = dotsContainer.querySelectorAll('.testimonial-carousel__dot');
  let currentSlide = 0;
  
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    currentSlide = index;
    const slideWidth = testimonials[0].offsetWidth + parseInt(getComputedStyle(track).gap || 16);
    track.scrollTo({
      left: slideWidth * currentSlide,
      behavior: 'smooth'
    });
    updateDots();
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }
  
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Update dots on scroll
  track.addEventListener('scroll', () => {
    const slideWidth = testimonials[0].offsetWidth + parseInt(getComputedStyle(track).gap || 16);
    const newSlide = Math.round(track.scrollLeft / slideWidth);
    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
      currentSlide = newSlide;
      updateDots();
    }
  });

  // Auto-move functionality
  let autoSlideInterval;
  const intervalTime = 2000; // 2 seconds as requested

  function startAutoSlide() {
    stopAutoSlide(); // Ensure no duplicates
    autoSlideInterval = setInterval(nextSlide, intervalTime);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Use Intersection Observer to start/stop based on visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(carousel);

  // Pause auto-slide on hover
  carousel.addEventListener('mouseenter', stopAutoSlide);

  carousel.addEventListener('mouseleave', () => {
    // Only restart if it's still in view
    startAutoSlide();
  });
}

/**
 * Footer Collapse on Mobile
 */
function initFooterCollapse() {
  const footerColumns = document.querySelectorAll('.footer__column');
  
  footerColumns.forEach(column => {
    const title = column.querySelector('.footer__title');
    if (!title) return;
    
    title.addEventListener('click', () => {
      // Toggle current column
      column.classList.toggle('collapsed');
    });
  });
}
