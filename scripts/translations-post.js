// translations-post.js

// Funzione per cambiare la lingua: salva la nuova preferenza e ricarica la pagina
function changeLang(lang) {
  localStorage.setItem('lang', lang);
  location.reload();
}

// Quando il DOM è pronto...
document.addEventListener('DOMContentLoaded', function() {
  const lang = getLanguage();
  
  // Carica il file JSON della lingua scelta e applica le traduzioni
  fetch('languages/' + lang + '.json')
    .then(response => response.json())
    .then(translations => {
      // Applica le traduzioni agli elementi con data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          el.innerHTML = translations[key];
        }
      });

      // Aggiorna gli attributi placeholder per gli elementi che hanno data-i18n-placeholder
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
          el.setAttribute('placeholder', translations[key]);
        }
      });
      
      // Aggiorna meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && translations['meta.description']) {
        metaDesc.setAttribute('content', translations['meta.description']);
      }
      // Aggiorna titolo della pagina
      if (translations['meta.title']) {
        document.title = translations['meta.title'];
      }
    });

  // Nascondi il bottone della lingua attiva
  if (lang === 'it') {
    const btnIt = document.getElementById('btn-lang-it');
    if (btnIt) btnIt.style.display = 'none';
  } else {
    const btnEn = document.getElementById('btn-lang-en');
    if (btnEn) btnEn.style.display = 'none';
  }
});
