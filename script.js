// Nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navClose = document.getElementById('navClose');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navClose.addEventListener('click', () => {
  navLinks.classList.remove('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Language switch (HU default, EN toggle)
const langButtons = document.querySelectorAll('.lang-btn');
const huEls = document.querySelectorAll('.t-hu');
const enEls = document.querySelectorAll('.t-en');
function setLang(lang){
  const isEn = lang === 'en';
  huEls.forEach(el => { el.hidden = isEn; });
  enEls.forEach(el => { el.hidden = !isEn; });
  langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  document.documentElement.lang = lang;
  try { localStorage.setItem('cafeHarmonicLang', lang); } catch (e) {}
}
langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});
let savedLang = 'hu';
try { savedLang = localStorage.getItem('cafeHarmonicLang') || 'hu'; } catch (e) {}
setLang(savedLang);

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));
