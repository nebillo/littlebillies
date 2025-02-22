// translations-post.js
document.addEventListener('DOMContentLoaded', function() {
  const lang = getLanguage();
  fetch('languages/' + lang + '.json')
    .then(response => response.json())
    .then(translations => {
      // Seleziona tutti gli elementi con l'attributo data-i18n e sostituisce il loro contenuto
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          // Usiamo innerHTML per consentire anche markup HTML nelle traduzioni
          el.innerHTML = translations[key];
        }
      });
      // Aggiorna il meta description se presente
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && translations['meta.description']) {
        metaDesc.setAttribute('content', translations['meta.description']);
      }
      // Aggiorna il titolo della pagina
      if (translations['meta.title']) {
        document.title = translations['meta.title'];
      }
    });
});
