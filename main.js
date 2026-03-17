import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

let audio;
let isMuted = true;

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Starting with Local Audio...");
    
    audio = document.getElementById('bg-audio');
    
    initStars();
    initClouds();
    setupCard();
    setupPersonalization();
    setupInteractivity();
    
    // Minimal GSAP animation to ensure visibility
    gsap.set(['.sub-greeting', '.main-title', '.greeting-card', '.lantern'], { opacity: 1, visibility: 'visible' });
    
    // Entrance animation
    gsap.from('.hero', { opacity: 0, y: 10, duration: 1, ease: 'power2.out' });
});

function initClouds() {
    const app = document.getElementById('app');
    const container = document.createElement('div');
    container.className = 'clouds-container';
    app.appendChild(container);
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        const w = Math.random() * 300 + 200;
        gsap.set(cloud, { x: Math.random() * window.innerWidth, y: Math.random() * 300, width: w, height: w * 0.6 });
        container.appendChild(cloud);
        gsap.to(cloud, { x: '+=100', duration: 20 + Math.random() * 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
}

function initStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const s = Math.random() * 2 + 1;
        gsap.set(star, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, width: s, height: s });
        container.appendChild(star);
        gsap.to(star, { opacity: 0.3, duration: 2 + Math.random() * 2, repeat: -1, yoyo: true });
    }
}

function setupPersonalization() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) {
        const nameElement = document.getElementById('recipient-name');
        if (nameElement) nameElement.textContent = name;
    }
}

function toggleAudio() {
    const toggle = document.getElementById('audio-toggle');
    if (!audio) return;

    if (isMuted) {
        audio.play().catch(e => console.log("Playback failed:", e));
        toggle.classList.remove('is-muted');
        isMuted = false;
    } else {
        audio.pause();
        toggle.classList.add('is-muted');
        isMuted = true;
    }
}

function setupCard() {
    const card = document.getElementById('card');
    const openBtn = document.getElementById('open-card');
    const closeBtn = document.getElementById('close-card');
    const toggle = document.getElementById('audio-toggle');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            card.classList.add('is-open');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#065f46', '#fefce8'] });
            
            // Start local audio on first interaction if muted
            if (isMuted && audio) {
                toggleAudio();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            card.classList.remove('is-open');
        });
    }

    if (toggle) {
        toggle.addEventListener('click', toggleAudio);
    }
}

function setupInteractivity() {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        gsap.to('.stars-container', { x: x * 0.5, y: y * 0.5, duration: 1 });
        gsap.to('.clouds-container', { x: x * 1, y: y * 1, duration: 1.5 });
    });
    
    window.addEventListener('click', (e) => {
        const s = document.createElement('div');
        s.className = 'sparkle';
        document.body.appendChild(s);
        gsap.set(s, { x: e.clientX, y: e.clientY });
        gsap.to(s, { opacity: 0, scale: 2, duration: 0.5, onComplete: () => s.remove() });
    });
}
