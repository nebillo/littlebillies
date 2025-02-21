document.addEventListener('DOMContentLoaded', function() {
  // Event delegation per i click: ascolta su tutto il documento
  document.addEventListener('click', function(e) {
    let target = e.target;
    // Scorri la catena degli elementi fino a trovare quello con l'attributo data-click-event
    while(target && target !== document) {
      if (target.hasAttribute('data-click-event')) {
        const eventName = target.getAttribute('data-click-event');
        heap.track(`click: ${eventName}`, {
          element: target.tagName,
          id: target.id || null,
          class: target.className || null
        });
        break;
      }
      target = target.parentNode;
    }
  });

  // Configura l'IntersectionObserver per gli elementi con data-view-event
  const viewElements = document.querySelectorAll('[data-view-event]');
  const observer = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const eventName = entry.target.getAttribute('data-view-event');
        heap.track(`view: ${eventName}`, {
          element: entry.target.tagName,
          id: entry.target.id || null,
          class: entry.target.className || null
        });
        // Se vuoi tracciare l'evento solo la prima volta, disattiva l'osservazione
        obs.unobserve(entry.target);
      }
    });
  });

  viewElements.forEach(function(el) {
    observer.observe(el);
  });
});
