(() => {
  // Assembled only on user click so static HTML/JS scrapers never see a plaintext address
  const userCodes = [102, 106, 97, 118, 105, 101, 114, 109, 97, 112];
  const domainCodes = [103, 109, 97, 105, 108, 46, 99, 111, 109];
  const toast = document.getElementById('copyToast');
  let toastTimer = null;

  function getAddress() {
    const decode = (codes) => String.fromCharCode(...codes);
    return `${decode(userCodes)}@${decode(domainCodes)}`;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  document.querySelectorAll('[data-open-email]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = `mailto:${getAddress()}`;
    });
  });

  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const address = getAddress();
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(address);
        btn.textContent = 'Copied email';
        showToast(`Copied ${address}`);
      } catch {
        showToast(address);
        return;
      }
      setTimeout(() => {
        btn.textContent = original;
      }, 1800);
    });
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      });
    });
  }

  // Engineering notes category filter
  const filterButtons = document.querySelectorAll('[data-filter]');
  const noteRows = document.querySelectorAll('[data-category]');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.filter;
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      noteRows.forEach((row) => {
        const categories = (row.dataset.category || '').split(' ');
        row.hidden = selected !== 'all' && !categories.includes(selected);
      });
    });
  });

  // Subtle active nav highlight on scroll
  const navLinks = Array.from(document.querySelectorAll('.nav-desktop .nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((link) => {
              link.setAttribute('aria-current', link.getAttribute('href') === id ? 'true' : 'false');
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
