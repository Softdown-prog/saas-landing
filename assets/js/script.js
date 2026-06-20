/**
 * script.js — Lógica de Interface
 * Landing Page Estática · Bootstrap 5 + Alpine.js
 *
 * Responsabilidades deste arquivo:
 *   1. Navbar  — fixa com sombra ao rolar + fechar menu mobile ao clicar em âncora
 *   2. Scroll  — rolagem suave para âncoras internas (fallback ao CSS nativo)
 *   3. Reveal  — aparecimento das seções ao entrar no viewport (IntersectionObserver)
 *   4. Header  — ocultar/exibir navbar ao rolar para cima/baixo (hide-on-scroll)
 *
 * O que NÃO está aqui:
 *   - Ano dinâmico no rodapé → tratado inline no HTML (não duplicar)
 *   - Collapse da navbar mobile → gerenciado pelo Bootstrap JS bundle
 *   - Qualquer lógica Alpine.js → fica nos atributos x-data do HTML
 */

'use strict';

/* ============================================================
   UTILITÁRIO — Executar após o DOM estar pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVBAR — Sombra ao rolar + fechar menu mobile em âncoras
     ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  if (navbar) {

    // 1a. Adiciona classe de sombra quando a página rola além de 10px
    const toggleNavbarShadow = () => {
      navbar.classList.toggle('shadow-sm', window.scrollY > 10);
    };

    window.addEventListener('scroll', toggleNavbarShadow, { passive: true });
    toggleNavbarShadow(); // executa uma vez no carregamento


    // 1b. Fecha o menu mobile ao clicar em qualquer link âncora interno
    const navLinks = navbar.querySelectorAll('a[href^="#"]');
    const navCollapse = navbar.querySelector('.navbar-collapse');

    if (navCollapse) {
      // Usa a API do Bootstrap para fechar o collapse de forma segura
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, {
        toggle: false,
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (navCollapse.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });
    }
  }


  /* ----------------------------------------------------------
     2. SCROLL SUAVE — Fallback JS para âncoras internas
     (browsers modernos suportam scroll-behavior: smooth via CSS;
      este bloco garante compatibilidade onde o CSS não basta)
     ---------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // Ignora href="#" puro (links sem alvo real)
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Desconta a altura do navbar fixo para não cobrir o título da seção
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop =
        targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     3. REVEAL — Seções aparecem ao entrar no viewport
     Adiciona a classe .is-visible nos elementos marcados com
     data-reveal no HTML. O CSS controla a animação em si.

     Uso no HTML:
       <section data-reveal> ... </section>
       <div data-reveal> ... </div>
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // dispara apenas uma vez
          }
        });
      },
      {
        threshold: 0.12,    // 12% do elemento visível já dispara
        rootMargin: '0px 0px -40px 0px', // margem inferior para antecipação
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: sem suporte ao IntersectionObserver, exibe tudo imediatamente
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }


  /* ----------------------------------------------------------
     4. HIDE-ON-SCROLL — Navbar some ao rolar para baixo,
     reaparece ao rolar para cima (UX mobile)
     ---------------------------------------------------------- */
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 60; // px mínimos antes de reagir

  const handleNavbarVisibility = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    // Nunca oculta se estiver no topo da página
    if (currentScrollY < SCROLL_THRESHOLD) {
      navbar?.classList.remove('navbar--hidden');
      lastScrollY = currentScrollY;
      return;
    }

    if (delta > 8) {
      // Rolando para baixo — oculta
      navbar?.classList.add('navbar--hidden');
    } else if (delta < -8) {
      // Rolando para cima — exibe
      navbar?.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
  };

  if (navbar) {
    window.addEventListener('scroll', handleNavbarVisibility, { passive: true });
  }

}); // fim DOMContentLoaded
 
