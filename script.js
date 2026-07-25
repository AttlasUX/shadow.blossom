/**
 * --------------------------------------------------------------------------
 * 1. CONFIGURACIÓN INICIAL Y DATOS
 * --------------------------------------------------------------------------
 */
const dataSets = [
    { kanji: 'humano', creature: 'osa', jade: 'jade-blanco', bg: 'human.png', sectionId: 'seccion-human' },
    { kanji: 'fuego', creature: 'phoenix', jade: 'jade-rojo', bg: 'fire.png', sectionId: 'seccion-fire' },
    { kanji: 'agua', creature: 'tortuga', jade: 'jade-azul', bg: 'water.png', sectionId: 'seccion-water' },
    { kanji: 'viento', creature: 'dragon', jade: 'jade-verde', bg: 'air.png', sectionId: 'seccion-air' },
    { kanji: 'tierra', creature: 'tigre', jade: 'jade-amarillo', bg: 'earth.png', sectionId: 'seccion-earth' },
    { kanji: 'maldad', creature: 'dokkaebi', jade: 'jade-violeta', bg: 'evil.png', sectionId: 'seccion-evil' }
];

let currentIndex = 0;
let isScrolling = false;
let autoRotateInterval;
let ctaTimeout;
const RUTA_ASSETS = '/Proyectos/webSites Templates/Assets/Corea/';

/**
 * --------------------------------------------------------------------------
 * 2. LÓGICA DE ROTACIÓN DE ELEMENTOS
 * --------------------------------------------------------------------------
 */
function rotateElements(index = null, isManual = false) {
    document.querySelectorAll('.kanji, .creature, .jade-block').forEach(el => el.classList.remove('active'));
    document.getElementById('cta-button').classList.remove('show');
    clearTimeout(ctaTimeout);

    currentIndex = index !== null ? index : (currentIndex + 1) % dataSets.length;
    const current = dataSets[currentIndex];

    document.querySelector(`[data-element="${current.kanji}"]`)?.classList.add('active');
    document.querySelector(`img[data-name="${current.creature}"]`)?.classList.add('active');
    document.getElementById(current.jade)?.classList.add('active');
    
    const ctaDelay = isManual ? 5000 : 15000;
    ctaTimeout = setTimeout(() => { document.getElementById('cta-button').classList.add('show'); }, ctaDelay);

    if (isManual) resetAutoRotate();
}

function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => rotateElements(), 20000);
}

/**
 * --------------------------------------------------------------------------
 * 3. CONTROLADORES DE EVENTOS DE SCROLL Y NAVEGACIÓN
 * --------------------------------------------------------------------------
 */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.detail-section');
    sections.forEach(sec => {
        if (sec.classList.contains('active')) {
            const rect = sec.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                sec.classList.remove('active');
            }
        }
    });
});

document.getElementById('cta-button').addEventListener('click', (e) => {
    e.preventDefault();
    
    clearInterval(autoRotateInterval);
    clearTimeout(ctaTimeout);

    const current = dataSets[currentIndex];
    
    const landing = [
        document.getElementById('background-layer'),
        document.getElementById('creature-container'),
        ...document.querySelectorAll('.jade-block')
    ];
    landing.forEach(el => el && el.classList.add('landing-hidden'));
    
    const targetSection = document.getElementById(current.sectionId);
    
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
});

window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
        document.getElementById('background-layer').classList.remove('landing-hidden');
        document.getElementById('jade-block-container').classList.remove('landing-hidden');
        document.getElementById('creature-container').classList.remove('landing-hidden');
        document.querySelectorAll('.detail-section').forEach(sec => sec.classList.remove('active'));
    }
});

/**
 * --------------------------------------------------------------------------
 * 4. OBSERVERS PARA GESTIÓN DE VISIBILIDAD (SECCIONES)
 * --------------------------------------------------------------------------
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            entry.target.classList.remove('active');
            setTimeout(() => {
                entry.target.style.display = 'none'; 
            }, 300);
        } else {
            entry.target.style.display = 'block';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.detail-section').forEach(sec => observer.observe(sec));

/**
 * --------------------------------------------------------------------------
 * 5. INTERACCIONES DE USUARIO (WHEEL Y BACK-TO-TOP)
 * --------------------------------------------------------------------------
 */
document.getElementById('jade-block-container').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;
    const nextIndex = (currentIndex + (e.deltaY > 0 ? 1 : -1) + dataSets.length) % dataSets.length;
    rotateElements(nextIndex, true);
    setTimeout(() => { isScrolling = false; }, 500);
}, { passive: false });

function hideDetail() {
    document.querySelectorAll('.detail-section').forEach(sec => sec.classList.remove('active'));
}

window.addEventListener('scroll', () => {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > window.innerHeight / 2) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('background-layer').classList.remove('landing-hidden');
    document.getElementById('creature-container').classList.remove('landing-hidden');
    document.querySelectorAll('.jade-block').forEach(el => el.classList.remove('landing-hidden'));
    
    document.querySelectorAll('.detail-section').forEach(sec => {
        sec.classList.remove('active');
        setTimeout(() => sec.style.display = 'none', 300);
    });

    resetAutoRotate();
});

/**
 * --------------------------------------------------------------------------
 * 6. INICIALIZACIÓN
 * --------------------------------------------------------------------------
 */
resetAutoRotate();

document.addEventListener('DOMContentLoaded', () => {
    const amuletoBtn = document.getElementById('footer-trigger');
    const footer = document.getElementById('dynamic-footer');

    amuletoBtn.addEventListener('click', () => {
        footer.classList.toggle('visible');
    });
});