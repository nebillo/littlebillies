// translation-pre.js
function getLanguage() {
  // Controlla se l'utente ha già scelto una lingua
  let lang = localStorage.getItem('lang');
  if (!lang) {
    // Usa la lingua del browser: se inizia per "it" => italiano, altrimenti inglese
    const browserLang = navigator.language || navigator.userLanguage;
    lang = browserLang.startsWith('it') ? 'it' : 'en';
  }
  return lang;
}