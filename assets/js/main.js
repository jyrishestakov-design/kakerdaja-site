// Mobiilimenüü + galerii lightbox
document.addEventListener('DOMContentLoaded', () => {
  const t = document.querySelector('.nav-toggle'), nav = document.getElementById('menyy');
  if (t && nav) t.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  const items = Array.from(document.querySelectorAll('.gallery figure:not(.gallery-video) img'));
  if (!items.length) return;
  const lb = document.createElement('div'); lb.className = 'lightbox';
  lb.innerHTML = '<img alt=""><button class="lb-prev" aria-label="Eelmine pilt">&#10094;</button><button class="lb-next" aria-label="Järgmine pilt">&#10095;</button><button class="lb-close" aria-label="Sulge">&#10005;</button>';
  document.body.appendChild(lb);
  const img = lb.querySelector('img'); let i = 0;
  const show = n => { i = (n + items.length) % items.length; img.src = items[i].src; img.alt = items[i].alt || ''; };
  const close = () => lb.classList.remove('active');
  items.forEach((el, n) => el.addEventListener('click', () => { show(n); lb.classList.add('active'); }));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.querySelector('.lb-prev').onclick = () => show(i - 1);
  lb.querySelector('.lb-next').onclick = () => show(i + 1);
  lb.querySelector('.lb-close').onclick = close;
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(i - 1); else if (e.key === 'ArrowRight') show(i + 1);
  });
});
