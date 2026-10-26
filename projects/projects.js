// Live preview of a project's site. The iframe is created only when the reader
// asks for it, rendered at desktop width and scaled down to fit the column.
(function () {
  var DESKTOP_WIDTH = 1280;
  var DESKTOP_HEIGHT = 800;

  function fit(viewport) {
    var frame = viewport.querySelector('iframe');
    if (!frame) return;
    var scale = Math.min(1, viewport.clientWidth / DESKTOP_WIDTH);
    frame.style.transform = 'scale(' + scale + ')';
    viewport.style.height = Math.round(DESKTOP_HEIGHT * scale) + 'px';
  }

  var observer = 'ResizeObserver' in window
    ? new ResizeObserver(function (entries) { entries.forEach(function (entry) { fit(entry.target); }); })
    : null;

  function load(panel) {
    var viewport = panel.querySelector('.preview-viewport');
    if (!viewport.querySelector('iframe')) {
      viewport.textContent = '';
      var frame = document.createElement('iframe');
      frame.src = panel.dataset.src;
      frame.title = 'Live preview: ' + panel.dataset.label;
      frame.width = DESKTOP_WIDTH;
      frame.height = DESKTOP_HEIGHT;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
      viewport.appendChild(frame);
      if (observer) observer.observe(viewport);
      else window.addEventListener('resize', function () { fit(viewport); });
    }
    fit(viewport);
  }

  document.querySelectorAll('.preview-load').forEach(function (button) {
    button.addEventListener('click', function () { load(button.closest('.preview')); });
  });

  document.querySelectorAll('button[aria-controls^="preview-"]').forEach(function (button) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      button.textContent = open ? document.body.dataset.previewOpen : document.body.dataset.previewClose;
      panel.hidden = open;
      if (!open) load(panel);
    });
  });

  // Slide decks: arrows, click halves, keyboard, swipe, progress bar, fullscreen.
  document.querySelectorAll('.deck').forEach(function (deck) {
    var base = deck.dataset.base;
    var count = Number(deck.dataset.count);
    var img = deck.querySelector('.deck-slide');
    var counter = deck.querySelector('.deck-count b');
    var range = deck.querySelector('.deck-range');
    var label = deck.getAttribute('aria-label');
    var current = 1;
    var name = function (n) { return base + (n < 10 ? '0' : '') + n + '.jpg'; };

    function show(n) {
      current = Math.max(1, Math.min(count, n));
      img.src = name(current);
      img.alt = label + ' — ' + current + ' / ' + count;
      counter.textContent = current;
      range.value = current;
      deck.querySelectorAll('[data-act="prev"]').forEach(function (b) { b.disabled = current === 1; });
      deck.querySelectorAll('[data-act="next"]').forEach(function (b) { b.disabled = current === count; });
      if (current < count) new Image().src = name(current + 1);
    }

    deck.addEventListener('click', function (event) {
      var act = event.target.closest('[data-act]');
      if (swiped) { swiped = false; return; }
      if (!act) return;
      if (act.dataset.act === 'prev') show(current - 1);
      else if (act.dataset.act === 'next') show(current + 1);
      else if (document.fullscreenElement === deck) document.exitFullscreen();
      else if (deck.requestFullscreen) deck.requestFullscreen();
    });
    range.addEventListener('input', function () { show(Number(range.value)); });
    deck.addEventListener('keydown', function (event) {
      if (event.target === range) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') { show(current + 1); event.preventDefault(); }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { show(current - 1); event.preventDefault(); }
    });
    var startX = null;
    var swiped = false;
    var stage = deck.querySelector('.deck-stage');
    stage.addEventListener('pointerdown', function (event) { startX = event.clientX; });
    stage.addEventListener('pointerup', function (event) {
      if (startX === null) return;
      var dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) { swiped = true; show(current + (dx < 0 ? 1 : -1)); }
    });
    show(1);
  });
})();
