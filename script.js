// Header shadow after scrolling
const header = document.querySelector('.top');
addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });

// Scroll reveal: headings, cards and lists fade up once when they enter the screen
const items = document.querySelectorAll('section:not(.hero) h2, .seg, .svc-list > div, .steps, .why-list li, .gal-grid figure, .faq details, .contact__in > *, .foot__in > *');
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
items.forEach((el) => {
  const i = [...el.parentElement.children].indexOf(el);
  el.style.setProperty('--d', `${Math.min(i, 5) * 0.08}s`); // stagger siblings
  el.classList.add('reveal');
  io.observe(el);
});

// Menu: underline the section currently on screen
const links = document.querySelectorAll('.nav a[href^="#"]');
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  links.forEach((a) => a.toggleAttribute('aria-current', a.hash === `#${e.target.id}`));
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach((a) => spy.observe(document.querySelector(a.hash)));

// Formulir membuka WhatsApp dengan pesan terisi. Nomor diambil dari tombol WA di header.
const WA = document.querySelector('[data-wa]').href.match(/wa\.me\/(\d+)/)[1];
const form = document.getElementById('quote');
const err = form.querySelector('.form__err');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  for (const el of form.querySelectorAll('[required]')) {
    const bad = !el.value.trim();
    el.setAttribute('aria-invalid', bad);
    if (bad) ok = false;
  }
  err.hidden = ok;
  if (!ok) return form.querySelector('[aria-invalid="true"]').focus();

  const d = Object.fromEntries(new FormData(form));
  const msg = [
    'Halo, saya ingin minta survei/penawaran instalasi gas LPG.',
    `Nama: ${d.nama.trim()}`,
    d.instansi.trim() && `Usaha/instansi: ${d.instansi.trim()}`,
    `Jenis tempat: ${d.jenis}`,
    `Kota: ${d.kota.trim()}`,
    `Kebutuhan: ${d.kebutuhan.trim()}`,
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});
