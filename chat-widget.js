/* Energy Direct — self-contained chat widget.
   Free, no backend, no third-party account, no LLM. Scripted FAQ + call/text handoff.
   Upgradeable later to live chat (tawk.to) or an EPP AI assistant for a fee.
   Included site-wide via: <script src="/chat-widget.js" defer></script> */
(function () {
  var PHONE = "(361) 582-9724", TEL = "+13615829724";
  var SMS = "sms:" + TEL;

  var QA = [
    { q: "How do I switch?", a: "Enter your ZIP at the top of the page to see the Ambit plans at your address, pick one, and enroll online in a few minutes. Ambit handles the switch with your utility &mdash; your power is never interrupted." },
    { q: "What is a TDU?", a: "Your Transmission and Distribution Utility (TDU) owns the poles, wires, and meters and restores outages, no matter which retail plan you choose. Your Ambit plan only sets your price, term, and rewards." },
    { q: "Will my lights go out?", a: "No. Switching only changes who bills you for energy. Your local utility keeps delivering power with zero interruption." },
    { q: "How much can I save?", a: "It depends on your address and usage. Enter your ZIP to see your real rate, and ask about Ambit's Free Energy and reward plans &mdash; ways to earn back what you spend." },
    { q: "Do you offer solar buyback?", a: "Yes. Ambit has solar buyback plans that credit you for the excess power your panels send to the grid. Try the calculator on our Solar Plans page to estimate your monthly credit." },
    { q: "Residential or commercial?", a: "Both. Use the Residential / Commercial selector in the rate form, then enter your ZIP to see the plans for your account type." }
  ];

  var css = [
    '#ed-fab{position:fixed;right:18px;bottom:18px;z-index:9998;width:60px;height:60px;border-radius:50%;',
    'background:linear-gradient(135deg,#1e3a8a,#2563eb);box-shadow:0 8px 22px rgba(15,23,42,.35);border:0;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;line-height:1;}',
    '#ed-fab:hover{filter:brightness(1.08);}',
    '#ed-panel{position:fixed;right:18px;bottom:88px;z-index:9999;width:340px;max-width:calc(100vw - 24px);',
    'height:460px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;overflow:hidden;display:none;',
    'flex-direction:column;box-shadow:0 18px 50px rgba(15,23,42,.32);font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}',
    '#ed-panel.open{display:flex;}',
    '#ed-head{background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff;padding:.85rem 1rem;display:flex;',
    'justify-content:space-between;align-items:center;}',
    '#ed-head b{font-size:1.05rem;} #ed-head small{display:block;opacity:.85;font-size:.78rem;font-weight:400;}',
    '#ed-x{background:none;border:0;color:#fff;font-size:1.4rem;cursor:pointer;line-height:1;}',
    '#ed-body{flex:1;overflow-y:auto;padding:1rem;background:#f7f8fa;}',
    '.ed-msg{max-width:85%;padding:.6rem .8rem;border-radius:12px;margin:.35rem 0;font-size:.92rem;line-height:1.45;}',
    '.ed-bot{background:#fff;border:1px solid #e5e7eb;color:#1e293b;border-bottom-left-radius:3px;}',
    '.ed-me{background:#2563eb;color:#fff;margin-left:auto;border-bottom-right-radius:3px;}',
    '#ed-chips{padding:.6rem;border-top:1px solid #e5e7eb;background:#fff;display:flex;flex-wrap:wrap;gap:.4rem;}',
    '.ed-chip{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:999px;padding:.35rem .7rem;',
    'font-size:.82rem;cursor:pointer;}',
    '.ed-chip:hover{background:#bfdbfe;}',
    '.ed-chip.call{background:#16a34a;color:#fff;border-color:#16a34a;font-weight:700;}',
    '.ed-msg a{color:inherit;font-weight:700;}'
  ].join('');

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var fab = el('<button id="ed-fab" aria-label="Open chat"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.8-.7L3 21l1.9-4.1A8.4 8.4 0 1 1 21 11.5z"/></svg></button>');
    var panel = el(
      '<div id="ed-panel" role="dialog" aria-label="Energy Direct chat">' +
        '<div id="ed-head"><div><b>Energy Direct</b><small>Questions? We are here to help.</small></div>' +
        '<button id="ed-x" aria-label="Close chat">&times;</button></div>' +
        '<div id="ed-body"></div>' +
        '<div id="ed-chips"></div>' +
      '</div>');
    document.body.appendChild(fab); document.body.appendChild(panel);

    var body = panel.querySelector('#ed-body'), chips = panel.querySelector('#ed-chips');

    function add(text, who) {
      var m = el('<div class="ed-msg ' + (who === 'me' ? 'ed-me' : 'ed-bot') + '"></div>');
      m.innerHTML = text; body.appendChild(m); body.scrollTop = body.scrollHeight;
    }
    function renderChips() {
      chips.innerHTML = '';
      QA.forEach(function (item, i) {
        var c = el('<button class="ed-chip">' + item.q + '</button>');
        c.onclick = function () { add(item.q, 'me'); setTimeout(function () { add(item.a, 'bot'); }, 250); };
        chips.appendChild(c);
      });
      var call = el('<button class="ed-chip call">Call or text us</button>');
      call.onclick = function () { add('I would like to talk to someone.', 'me');
        setTimeout(function () { add('Call or text us at <a href="' + TEL_HREF + '">' + PHONE + '</a> &mdash; happy to help you compare and enroll.', 'bot'); }, 250); };
      chips.appendChild(call);
    }
    var TEL_HREF = 'tel:' + TEL;

    add('Hi! Questions about switching, your rate, or solar? Tap one below, or call/text <a href="' + TEL_HREF + '">' + PHONE + '</a>.', 'bot');
    renderChips();

    function open() { panel.classList.add('open'); }
    function close() { panel.classList.remove('open'); }
    fab.onclick = function () { panel.classList.contains('open') ? close() : open(); };
    panel.querySelector('#ed-x').onclick = close;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
