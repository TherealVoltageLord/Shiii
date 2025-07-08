document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.landing-container')) {
    initLandingPage();
  } else {
    initPortfolioPage();
  }
});

function initLandingPage() {
  particlesJS('particles-landing', {
    "particles": {
      "number": { "value": 20 },
      "color": { "value": ["#ff5500", "#00a8ff", "#9c27b0"] },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5 },
      "size": { "value": 4 },
      "move": { "enable": true, "speed": 1 }
    },
    "interactivity": {
      "events": {
        "onhover": { "enable": true, "mode": "repulse" }
      }
    }
  });
  
  const typingLines = document.querySelectorAll('.typing-line');
  let currentLine = 0;
  
  function showNextLine() {
    if (currentLine < typingLines.length) {
      typingLines[currentLine].classList.add('visible');
      currentLine++;
      setTimeout(showNextLine, 2000);
    }
  }
  
  setTimeout(showNextLine, 1000);
  
  const enterBtn = document.getElementById('enter-btn');
  enterBtn.addEventListener('click', function() {
    window.location.href = 'main.html';
  });
}

function initPortfolioPage() {
  particlesJS('particles-main', {
    "particles": {
      "number": { "value": 30 },
      "color": { "value": ["#ff5500", "#00a8ff", "#9c27b0"] },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.3 },
      "size": { "value": 3 },
      "move": { "enable": true, "speed": 1 }
    },
    "interactivity": {
      "events": {
        "onhover": { "enable": true, "mode": "repulse" }
      }
    }
  });
  
  Promise.all([
    fetch('projects.json').then(res => res.json()),
    fetch('skills.json').then(res => res.json()),
    fetch('offers.json').then(res => res.json())
  ]).then(([projects, skills, offers]) => {
    renderProjects(projects);
    renderSkills(skills);
    renderOffers(offers);
    
    initSkillMeter();
  }).catch(error => {
    console.error('Error loading Skill data:', error);
  });
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const category = this.dataset.category;
      filterProjects(category);
    });
  });
  
  const contactBtn = document.getElementById('contact-btn');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.querySelector('.close-btn');
  
  contactBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });
  
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  const contactForm = document.getElementById('contact-form');
  const contactOptions = document.querySelectorAll('.contact-option[data-type]');
  
  contactOptions.forEach(option => {
    option.addEventListener('click', function() {
      const type = this.dataset.type;
      const name = document.getElementById('name').value;
      const message = document.getElementById('message').value;
      
      if (!name || !message) {
        alert('Please enter your name and message');
        return;
      }
      
      const encodedMessage = encodeURIComponent(`${name} says: ${message}`);
      
      if (type === 'whatsapp') {
        window.open(`https://wa.me/2347045674902?text=${encodedMessage}`, '_blank');
      } else if (type === 'telegram') {
        window.open(`https://t.me/selenakyle01?text=${encodedMessage}`, '_blank');
      }
    });
  });
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !message) {
      alert('Please enter your name and message');
      return;
    }
    
    alert(`Thank you, ${name}! Your message has been received. I'll contact you soon at ${email || 'your provided email'}.`);
    modal.style.display = 'none';
    contactForm.reset();
  });
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';
  
  let allProjects = [];
  
  for (const type in projects) {
    projects[type].forEach(project => {
      project.type = type;
      allProjects.push(project);
    });
  }
  
  // Render each project
  allProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = `project-card ${project.type}`;
    
    // Determine icon based on project type
    let iconClass;
    switch (project.type) {
      case 'api':
        iconClass = 'fas fa-server';
        break;
      case 'web':
        iconClass = 'fas fa-globe';
        break;
      case 'apk':
        iconClass = 'fas fa-mobile-alt';
        break;
      default:
        iconClass = 'fas fa-code';
        break;
      case 'upcoming':
        iconClass = 'fas fa-hourglass-half'
    }
    
    let stackTags = '';
    if (project.stack && Array.isArray(project.stack)) {
      stackTags = project.stack.map(stack =>
        `<span class="stack-tag">${stack}</span>`
      ).join('');
    }
    
    projectCard.innerHTML = `
            <div class="project-image">
                <i class="${iconClass}"></i>
            </div>
            <div class="project-content">
                <span class="project-type ${project.type}">${project.type.toUpperCase()}</span>
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description || 'A powerful project by Voltage Lord'}</p>
                <div class="project-stack">
                    ${stackTags}
                </div>
                <a href="${project.link}" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
    
    container.appendChild(projectCard);
  });
}

function filterProjects(category) {
  const allProjects = document.querySelectorAll('.project-card');
  
  allProjects.forEach(project => {
    if (category === 'all' || project.classList.contains(category)) {
      project.style.display = 'block';
    } else {
      project.style.display = 'none';
    }
  });
}

function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  container.innerHTML = '';
  
  skills.forEach(skill => {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    
    skillItem.innerHTML = `
            <div class="skill-header">
                <i class="${skill.icon} skill-icon"></i>
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percent">${skill.percent}%</span>
            </div>
            <div class="skill-meter">
                <div class="skill-progress" data-percent="${skill.percent}"></div>
            </div>
        `;
    
    container.appendChild(skillItem);
  });
}

function renderOffers(offers) {
  const container = document.getElementById('offers-container');
  container.innerHTML = '';
  
  offers.forEach(offer => {
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-card';
    
    offerCard.innerHTML = `
            <h3 class="offer-title">${offer.title}</h3>
            <p class="offer-description">${offer.description}</p>
        `;
    
    container.appendChild(offerCard);
  });
}

function initSkillMeter() {
  const skillProgresses = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target;
        const percent = progress.dataset.percent;
        progress.style.width = `${percent}%`;
        observer.unobserve(progress);
      }
    });
  }, { threshold: 0.5 });
  
  skillProgresses.forEach(progress => {
    observer.observe(progress);
  });
}
