// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  
  // Calculate scroll progress percentage
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (e.scroll / scrollHeight) * 100 : 0;
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, .skills-list li');

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

hoverTargets.forEach(target => {
  target.addEventListener('mouseenter', () => {
    follower.classList.add('active');
    cursor.style.transform = 'translate(-50%, -50%) scale(0)';
  });
  target.addEventListener('mouseleave', () => {
    follower.classList.remove('active');
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// Animations
// Hero
const tl = gsap.timeline();
tl.from('.hero-title', { y: 100, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.2 })
  .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5")
  .from('.contact-list li', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, "-=0.5");

// Section Titles
gsap.utils.toArray('.section-title').forEach(title => {
  ScrollTrigger.create({
    trigger: title,
    start: 'top 80%',
    onEnter: () => title.classList.add('in-view')
  });
});

// About section
gsap.fromTo('.img-wrapper', 
  { x: -50, opacity: 0 },
  {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%'
    },
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }
);
gsap.fromTo('.about-text p', 
  { x: 50, opacity: 0 },
  {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%'
    },
    x: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }
);

// Skills
gsap.fromTo('.skills-list li', 
  { y: 50, opacity: 0 },
  {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%'
    },
    y: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.05,
    ease: 'back.out(1.7)'
  }
);

// Projects
gsap.fromTo('.project-card:not(#github-projects .project-card)', 
  { y: 100, opacity: 0 },
  {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 70%'
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  }
);

// Experience
gsap.fromTo('.exp-card', 
  { x: 50, opacity: 0 },
  {
    scrollTrigger: {
      trigger: '#experience',
      start: 'top 70%'
    },
    x: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.3,
    ease: 'power3.out'
  }
);

// 3D Tilt on project cards
const cards = document.querySelectorAll('.project-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set custom properties for hover glow tracking
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
});

// Fetch latest GitHub Projects
const githubUsername = 'IATESPAGHETTI';

fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
  .then(res => res.json())
  .then(repos => {
    const container = document.getElementById('github-projects');
    if (!container) return;
    container.innerHTML = '';
    
    // Filter out if not an array
    if (!Array.isArray(repos)) return;

    repos.slice(0, 5).forEach((repo, i) => {
      const card = document.createElement('div');
      card.className = 'project-card hover-target';
      card.innerHTML = `
        <div class="card-bg"></div>
        <div class="card-content">
          <h3 style="font-size: 1.5rem; margin-bottom: 10px;">${repo.name}</h3>
          <p style="font-size: 1rem;">${repo.description ? repo.description : 'No description available.'}</p>
          <div class="tech-stack" style="margin-bottom: 15px;">
            <span class="tech">★ ${repo.stargazers_count}</span>
            ${repo.language ? `<span class="tech">${repo.language}</span>` : ''}
          </div>
          <a href="${repo.html_url}" target="_blank"><i class="fas fa-external-link-alt"></i> View Code</a>
        </div>
      `;
      container.appendChild(card);
      
      // Add GSAP ScrollTrigger animation for the new card
      gsap.fromTo(card, 
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#github-projects',
            start: 'top 80%'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out'
        }
      );

      // Bind custom cursor hover effects
      card.addEventListener('mouseenter', () => {
        follower.classList.add('active');
        cursor.style.transform = 'translate(-50%, -50%) scale(0)';
      });
      card.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });

      // Bind 3D tilt effect
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set custom properties for hover glow tracking
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  })
  .catch(err => console.error('Failed to fetch github repos', err));
