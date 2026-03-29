// script.js — alterna entre light/dark mode e persiste preferência em localStorage
// script.js — alterna entre light/dark mode e persiste preferência em localStorage
(function(){
  const KEY = 'theme';

  // Elemento que controla o tema — agora pode ser um `button` visível
  const toggle = document.getElementById('theme-toggle');
  if(!toggle) return; // aborta se não existir

  // Detecta se o controle é um botão (nossa nova implementação)
  const isButton = toggle.tagName === 'BUTTON';

  /**
   * Aplica o tema na página e atualiza o controle visual/ARIA.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme){
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);

    if(isButton){
      // Botão exibe emoji e usa `aria-pressed` como estado
      toggle.textContent = isLight ? '☀️' : '🌙';
      toggle.setAttribute('aria-pressed', String(isLight));
    } else {
      // Fallback para checkbox (não usado agora)
      toggle.checked = !isLight;
      toggle.setAttribute('aria-checked', String(toggle.checked));
    }
  }

  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ? saved : (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  // Eventos: botão usa 'click', input usaria 'change'
  if(isButton){
    toggle.addEventListener('click', () => {
      const isLightNow = document.body.classList.contains('light-theme');
      const next = isLightNow ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(KEY, next);
    });
  } else {
    toggle.addEventListener('change', () => {
      const next = toggle.checked ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(KEY, next);
    });
  }

  // Responde a mudanças de preferência do sistema se o usuário não escolheu manualmente
  if(window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if(mq.addEventListener){
      mq.addEventListener('change', (e) => {
        if(!localStorage.getItem(KEY)){
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } else if(mq.addListener){
      mq.addListener((e) => {
        if(!localStorage.getItem(KEY)){
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

})();

document.addEventListener("DOMContentLoaded", () => {
    const profileLinks = document.querySelectorAll('.profile');

    profileLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            
            const item = link.closest('.item-profile');
            if (!item) return;

            const nomeE1 = item.querySelector('.nome-profile');
            const imgE1 = item.querySelector('.profile-icon');

            const nome = nomeE1 ? nomeE1.textContent.trim() : '';
            let imgSrc = imgE1 ? imgE1.getAttribute('src') : '';

            
            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/') && !imgSrc.startsWith('..')) {
                imgSrc = '../' + imgSrc;
            }

            try {
                localStorage.setItem('perfilAtivoNome', nome);
                localStorage.setItem('perfilAtivoImagem', imgSrc);
            } catch (e) {
                console.warn('Não foi possível salvar o perfil ativo no localStorag', e);
            }
            
        });
    });
});