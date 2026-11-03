/* disco.games – shared game menu
   Loaded on disco.games and in every game with:
   <script src="https://www.disco.games/menu.js" defer></script>
   To add a game, add one entry to GAMES below. */
(function () {
  if (window.__discoMenuLoaded) return;
  window.__discoMenuLoaded = true;

  var HOME = { url: 'https://www.disco.games/', hosts: ['disco.games', 'www.disco.games'], title: 'disco.games', desc: 'All games', icon: 'home' };
  var GAMES = [
    { url: 'https://guessthecareer.disco.games/', hosts: ['guessthecareer.disco.games'], title: 'Guess the Career', desc: 'Guess the footballer from their career path', icon: 'career' },
    { url: 'https://airports.disco.games/', hosts: ['airports.disco.games'], title: 'Guess the Airport', desc: 'Guess the airport from its runways', icon: 'airport' },
    { url: 'https://flagquiz.disco.games/', hosts: ['flagquiz.disco.games'], title: 'Flag Quiz', desc: 'Guess the country from its flag', icon: 'flag' },
    { url: 'https://mumla.disco.games/', hosts: ['mumla.disco.games'], title: 'Mumla', desc: 'Daily word game in Swedish', icon: 'mumla' }
  ];

  var ICONS = {
    home: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    career: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M4 14h16M10 9v11"/>',
    airport: '<path d="M5 17L19 7M7 5l10 14"/><path d="M4 12h16" stroke-dasharray="2 2"/>',
    flag: '<path d="M6 21V4"/><path d="M6 5h11l-2 4 2 4H6"/>',
    mumla: '<rect x="3" y="8" width="5" height="8" rx="1"/><rect x="9.5" y="8" width="5" height="8" rx="1"/><rect x="16" y="8" width="5" height="8" rx="1"/>'
  };

  var host = location.hostname.toLowerCase();
  function isCurrent(item) { return item.hosts.indexOf(host) !== -1; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---- styles (scoped with the dgm- prefix so the games' own CSS is not affected) ----
  var css = '' +
    '.dgm-btn{appearance:none;-webkit-appearance:none;box-sizing:border-box;margin:0;padding:0;width:40px;height:40px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:inherit;cursor:pointer;font:inherit;line-height:1}' +
    '.dgm-btn:hover{background:rgba(128,0,0,.08)}' +
    '.dgm-btn:focus-visible,.dgm-close:focus-visible,.dgm-link:focus-visible{outline:3px solid #C18D17;outline-offset:2px}' +
    '.dgm-btn svg{width:22px;height:22px;display:block}' +
    '.dgm-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(61,0,0,.45);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility 0s linear .2s}' +
    '.dgm-panel{position:fixed;top:0;left:0;bottom:0;z-index:2147483001;width:320px;max-width:86vw;display:flex;flex-direction:column;background:#fff;color:#3d0000;box-shadow:0 0 40px rgba(61,0,0,.25);transform:translateX(-100%);visibility:hidden;transition:transform .22s ease,visibility 0s linear .22s;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:left}' +
    '.dgm-open .dgm-backdrop{opacity:1;visibility:visible;transition:opacity .2s ease}' +
    '.dgm-open .dgm-panel{transform:none;visibility:visible;transition:transform .22s ease}' +
    '.dgm-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 12px 14px 20px;border-bottom:3px solid #C18D17;padding-top:max(14px,env(safe-area-inset-top,0px))}' +
    '.dgm-brand{font-size:20px;font-weight:800;letter-spacing:-.02em;color:#3d0000;text-decoration:none}' +
    '.dgm-brand span{color:#800000}' +
    '.dgm-close{appearance:none;-webkit-appearance:none;box-sizing:border-box;margin:0;padding:0;width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:#3d0000;cursor:pointer}' +
    '.dgm-close:hover{background:#fff0fd}' +
    '.dgm-close svg{width:20px;height:20px;display:block}' +
    '.dgm-body{flex:1;overflow-y:auto;padding:12px 10px max(20px,env(safe-area-inset-bottom,0px))}' +
    '.dgm-label{margin:14px 10px 6px;font-size:13px;font-weight:700;color:#6e2f2f}' +
    '.dgm-list{list-style:none;margin:0;padding:0}' +
    '.dgm-list li{margin:0;padding:0}' +
    '.dgm-link{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;border:1px solid transparent;color:#3d0000;text-decoration:none}' +
    '.dgm-link:hover{background:#fff0fd;color:#3d0000}' +
    '.dgm-link[aria-current="page"]{background:#fff0fd;border-color:#f3c4ee}' +
    '.dgm-icon{width:40px;height:40px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:#FFD5FB;color:#800000}' +
    '.dgm-link[aria-current="page"] .dgm-icon{background:#800000;color:#fff}' +
    '.dgm-icon svg{width:22px;height:22px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.dgm-text{display:flex;flex-direction:column;min-width:0}' +
    '.dgm-title{font-size:16px;font-weight:700}' +
    '.dgm-desc{font-size:13px;color:#6e2f2f}' +
    '.dgm-here{margin-left:auto;font-size:12px;font-weight:700;color:#800000;white-space:nowrap}' +
    '.dgm-floating{position:fixed;top:12px;left:12px;z-index:1500;background:#fff;color:#3d0000;box-shadow:0 1px 4px rgba(61,0,0,.2)}' +
    '@media (prefers-reduced-motion:reduce){.dgm-backdrop,.dgm-panel,.dgm-open .dgm-backdrop,.dgm-open .dgm-panel{transition:none}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- markup ----
  function itemHtml(item) {
    var current = isCurrent(item);
    return '<li><a class="dgm-link" href="' + esc(item.url) + '"' + (current ? ' aria-current="page"' : '') + '>' +
      '<span class="dgm-icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + ICONS[item.icon] + '</svg></span>' +
      '<span class="dgm-text"><span class="dgm-title">' + esc(item.title) + '</span><span class="dgm-desc">' + esc(item.desc) + '</span></span>' +
      (current ? '<span class="dgm-here">You are here</span>' : '') +
      '</a></li>';
  }

  var root = document.createElement('div');
  root.className = 'dgm-root';
  root.innerHTML =
    '<div class="dgm-backdrop" data-dgm-close></div>' +
    '<nav class="dgm-panel" id="dgm-panel" role="dialog" aria-modal="true" aria-label="All games on disco.games">' +
      '<div class="dgm-head">' +
        '<a class="dgm-brand" href="' + HOME.url + '">disco<span>.games</span></a>' +
        '<button type="button" class="dgm-close" data-dgm-close aria-label="Close menu"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '</div>' +
      '<div class="dgm-body">' +
        '<ul class="dgm-list">' + itemHtml(HOME) + '</ul>' +
        '<p class="dgm-label">Games</p>' +
        '<ul class="dgm-list">' + GAMES.map(itemHtml).join('') + '</ul>' +
      '</div>' +
    '</nav>';
  document.body.appendChild(root);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dgm-btn';
  btn.setAttribute('aria-label', 'Open games menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'dgm-panel');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // Where the button goes: a [data-disco-menu] slot, else the game's header, else a floating button
  var slot = document.querySelector('[data-disco-menu]') ||
             document.querySelector('.top-bar__left') ||
             document.querySelector('.user-bar');
  if (slot) slot.insertBefore(btn, slot.firstChild);
  else { btn.classList.add('dgm-floating'); document.body.appendChild(btn); }

  // ---- open / close ----
  var panel = root.querySelector('.dgm-panel');
  var lastFocus = null;
  var prevOverflow = '';

  function open() {
    lastFocus = document.activeElement;
    root.classList.add('dgm-open');
    btn.setAttribute('aria-expanded', 'true');
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    var target = panel.querySelector('[aria-current="page"]') || panel.querySelector('.dgm-link');
    setTimeout(function () { if (target) target.focus(); }, 30);
  }
  function close() {
    if (!root.classList.contains('dgm-open')) return;
    root.classList.remove('dgm-open');
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = prevOverflow;
    if (lastFocus && lastFocus.focus) lastFocus.focus(); else btn.focus();
  }

  btn.addEventListener('click', function () {
    root.classList.contains('dgm-open') ? close() : open();
  });
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-dgm-close]')) close();
  });

  // Keys inside the panel stay in the panel, so the games don't type them into their guess boxes
  root.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var items = panel.querySelectorAll('a, button');
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
