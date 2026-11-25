/* =========================================================
   Tilicho Cleaning: site script
   ---------------------------------------------------------
   EDIT YOUR DETAILS HERE. Every page reads them from this block,
   so you only change them in one place.
   ========================================================= */
var TILICHO = {
  // WhatsApp / Viber / phone number: digits only, with country code 977, no "+" or spaces.
  phoneIntl: '97798XXXXXXXX',
  // How the number is shown on the page.
  phoneDisplay: '+977 98XXXXXXXX',
  email: 'info@tilichocare.com',
  address: '[Your address], Nepal',
  // Full profile links, e.g. 'https://www.facebook.com/tilichocare'
  facebook: '',
  instagram: '',
  tiktok: '',

  // PRODUCT VIDEOS ("Watch it work" section).
  // Fill ONE option per product. Leave both empty to show the animated demo.
  //   mp4:     a file you upload into the "videos" folder, e.g. 'videos/toilet-wand.mp4'
  //   poster:  (optional) a still image shown before the video plays, e.g. 'videos/toilet-wand.jpg'
  //   youtube: just the video ID from the YouTube link, e.g. for https://youtu.be/AbC123xyz use 'AbC123xyz'
  videos: {
    wand:  { mp4: '', poster: '', youtube: '' },
    drain: { mp4: '', poster: '', youtube: '' }
  },

  // REELS ("Tilicho in real homes" section): customer feedback and product description videos.
  // Add one line per reel, newest first. Use REAL customer videos only, with their permission.
  //   type:   'review' (customer feedback) or 'product' (product description video)
  //   title:  short caption shown on the reel
  //   name:   (optional) customer's name and city, e.g. 'Sita, Kathmandu'
  // Plus ONE video source:
  //   mp4:     a vertical video file in the videos/reels folder, e.g. 'videos/reels/review-1.mp4'
  //   youtube: a YouTube Shorts ID, e.g. for https://youtube.com/shorts/AbC123xyz use 'AbC123xyz'
  //   link:    an Instagram / TikTok / Facebook reel URL (opens in a new tab; add a poster image)
  //   poster:  (optional for mp4 and youtube, needed for link) cover image, e.g. 'videos/reels/review-1.jpg'
  // While this list is empty, the section shows "coming soon" slots and a "send us your video" card.
  reels: [
    // { type: 'review',  title: 'No more dirty brush!', name: 'Sita, Kathmandu', mp4: 'videos/reels/review-1.mp4', poster: 'videos/reels/review-1.jpg' },
    // { type: 'product', title: 'How the toilet wand works', youtube: 'AbC123xyz' },
    // { type: 'review',  title: 'Love the lemon sticks', name: 'Ram, Pokhara', link: 'https://www.instagram.com/reel/XXXX/', poster: 'videos/reels/review-2.jpg' },
  ]
};

(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var C = TILICHO;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasPhone = /^\d{10,15}$/.test(C.phoneIntl);
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- WhatsApp messages ---------- */
  var MSG = {
    hello: 'Hello Tilicho! ',
    wand: 'Hello Tilicho! I would like to order the Disposable Toilet Wand (box of 16 heads), NPR 1,500.\n' +
      'Please include the free drain stick launch offer if still available.\nQuantity: 1\nName:\nDelivery address:',
    drain: function (f) {
      return 'Hello Tilicho! I would like to order Drain Cleaning Sticks, ' + f + ' fragrance (pack of 12 sticks), NPR 370.\n' +
        'Quantity: 1\nName:\nDelivery address:';
    },
    notify: function (x) { return 'Hello Tilicho! Please let me know when ' + x + ' is available.'; },
    share: 'Hello Tilicho! I would like to share a video review of my Tilicho product.',
    dist: 'Hello Tilicho! I am interested in becoming a Tilicho distributor.\nName:\nBusiness:\nCity/District:'
  };
  function waLink(text) {
    var base = 'https://wa.me/' + (hasPhone ? C.phoneIntl : '');
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }
  // Order buttons are real links (they work in in-app browsers that block pop-ups)
  function setWa(a, text) { a.href = waLink(text); a.target = '_blank'; a.rel = 'noopener'; }
  // Used only after a form is submitted
  function openWhatsApp(text) {
    var url = waLink(text);
    var w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (e) {} } else { window.location.href = url; }
  }

  /* ---------- Fill in contact details and links ---------- */
  $$('[data-fill]').forEach(function (el) { var v = C[el.getAttribute('data-fill')]; if (v) el.textContent = v; });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$('[data-link]').forEach(function (a) {
    var type = a.getAttribute('data-link');
    if (type === 'whatsapp') setWa(a, MSG.hello);
    else if (type === 'tel') a.href = 'tel:+' + C.phoneIntl;
    else if (type === 'viber') a.href = 'viber://chat?number=%2B' + C.phoneIntl;
    else if (type === 'email') a.href = 'mailto:' + C.email;
  });
  $$('[data-order="wand"]').forEach(function (a) { setWa(a, MSG.wand); });
  $$('[data-order="drain"]').forEach(function (a) { setWa(a, MSG.drain(a.getAttribute('data-fragrance') || 'Lemon')); });
  $$('[data-notify]').forEach(function (a) { setWa(a, MSG.notify(a.getAttribute('data-notify'))); });
  $$('.dist .nojs-only').forEach(function (a) { setWa(a, MSG.dist); });
  // Social icons: link them when a profile URL is set, hide them otherwise (no dead buttons)
  $$('[data-social]').forEach(function (a) {
    var url = C[a.getAttribute('data-social')];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else { a.hidden = true; }
  });
  $$('.social-row').forEach(function (row) {
    if (!row.querySelector('.social:not([hidden])')) row.hidden = true;
  });

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var ticking = false;
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) setMenu(false); });
  }

  /* ---------- How it works: product tabs, demo player, real videos ---------- */
  var watch = document.querySelector('.watch');
  var player = document.querySelector('[data-player]');
  if (watch && player) {
    $$('[data-pane]', player).forEach(function (pane) {
      var key = pane.getAttribute('data-pane');
      var v = (C.videos && C.videos[key]) || {};
      var screen = pane.querySelector('.screen');
      var label = key === 'wand' ? 'Tilicho disposable toilet wand' : 'Tilicho drain cleaning sticks';
      if (v.mp4) {
        screen.innerHTML = '';
        var vid = document.createElement('video');
        vid.src = v.mp4; vid.controls = true; vid.playsInline = true; vid.preload = 'metadata';
        if (v.poster) vid.poster = v.poster;
        vid.setAttribute('aria-label', 'Video: how to use the ' + label);
        screen.appendChild(vid);
        pane.setAttribute('data-video', '1');
      } else if (v.youtube) {
        screen.innerHTML = '';
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'yt';
        btn.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + encodeURIComponent(v.youtube) + '/hqdefault.jpg)';
        btn.setAttribute('aria-label', 'Play video: how to use the ' + label);
        btn.innerHTML = '<span class="yt-play"><svg aria-hidden="true"><use href="#i-play"/></svg></span>';
        btn.addEventListener('click', function () {
          var f = document.createElement('iframe');
          f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtube) + '?autoplay=1&playsinline=1&rel=0';
          f.title = 'Video: how to use the ' + label;
          f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
          screen.replaceChild(f, btn);
        });
        screen.appendChild(btn);
        pane.setAttribute('data-video', '1');
      }
    });

    var restart = function () {
      if (!watch.getAnimations) return;
      watch.getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = 0; });
    };
    var current = function () { var r = watch.querySelector('.demo-radio:checked'); return r ? r.value : 'wand'; };
    var sync = function () {
      var key = current();
      watch.setAttribute('data-current', key);   // fallback for browsers without :has()
      var pane = player.querySelector('[data-pane="' + key + '"]');
      var isVideo = pane.getAttribute('data-video') === '1';
      player.classList.toggle('has-video', isVideo);
      $$('[data-steps]', watch).forEach(function (ol) { ol.classList.toggle('is-static', isVideo); });
      $$('video', player).forEach(function (v) { if (!v.closest('[data-pane="' + key + '"]')) v.pause(); });
    };
    $$('.demo-radio', watch).forEach(function (r) {
      r.addEventListener('change', function () { sync(); requestAnimationFrame(restart); });
    });
    sync();

    var toggleBtn = player.querySelector('[data-action="toggle"]');
    toggleBtn.addEventListener('click', function () {
      var paused = !watch.classList.contains('is-paused');
      watch.classList.toggle('is-paused', paused);
      player.classList.toggle('is-paused', paused);
      toggleBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    });
    player.querySelector('[data-action="restart"]').addEventListener('click', restart);
  }

  /* ---------- Drain stick fragrance (CSS does the switching; this is a fallback for older browsers) ---------- */
  var drainCard = document.querySelector('.prod-drain');
  if (drainCard) {
    var checkedF = drainCard.querySelector('input[name="fragrance"]:checked');
    if (checkedF) drainCard.setAttribute('data-fragrance', checkedF.value);
    drainCard.addEventListener('change', function (e) {
      if (e.target.name === 'fragrance') drainCard.setAttribute('data-fragrance', e.target.value);
    });
  }

  /* ---------- Reels ---------- */
  var reelRow = document.getElementById('reel-row');
  var reelModal = document.getElementById('reel-modal');
  if (reelRow) {
    var reels = (C.reels || []).filter(function (r) { return r && (r.mp4 || r.youtube || r.link); });
    var TYPE = { review: 'Customer review', product: 'Product video' };
    var esc = function (t) { return String(t || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var typeOf = function (r) { return r.type === 'product' ? 'product' : 'review'; };
    var posterOf = function (r) { return r.poster || (r.youtube ? 'https://i.ytimg.com/vi/' + encodeURIComponent(r.youtube) + '/hqdefault.jpg' : ''); };
    if (reels.length) {
      var shareCard = reelRow.querySelector('.reel-share');
      var shareHtml = shareCard ? shareCard.parentNode.outerHTML : '';
      var html = '';
      reels.forEach(function (r, i) {
        var t = typeOf(r), pst = posterOf(r);
        var media = pst ? '<img src="' + esc(pst) + '" alt="" loading="lazy" decoding="async">'
          : (r.mp4 ? '<video src="' + esc(r.mp4) + '#t=0.1" muted playsinline preload="metadata" tabindex="-1" aria-hidden="true"></video>' : '');
        var inner = '<span class="reel-media">' + media + '</span><span class="reel-tag">' + TYPE[t] + '</span>' +
          '<span class="reel-play"><svg aria-hidden="true"><use href="#i-play"/></svg></span>' +
          '<span class="reel-cap"><b>' + esc(r.title) + '</b>' + (r.name ? '<span>' + esc(r.name) + '</span>' : '') + '</span>';
        var aria = 'Play ' + TYPE[t] + ': ' + esc(r.title) + (r.name ? ', ' + esc(r.name) : '');
        // Instagram / TikTok / Facebook reels are real links; our own videos open in the player
        html += '<li class="reel-item" data-type="' + t + '">' + ((!r.mp4 && !r.youtube)
          ? '<a class="reel" href="' + esc(r.link) + '" target="_blank" rel="noopener" aria-label="' + aria + '">' + inner + '</a>'
          : '<button class="reel" type="button" data-reel="' + i + '" aria-label="' + aria + '">' + inner + '</button>') + '</li>';
      });
      reelRow.innerHTML = html + shareHtml;
    }
    $$('[data-share-reel]', reelRow).forEach(function (a) { setWa(a, MSG.share); });

    $$('.reel-filters input').forEach(function (r) {
      r.addEventListener('change', function () {
        // fallback for browsers without :has()
        $$('.reel-item', reelRow).forEach(function (it) {
          var ty = it.getAttribute('data-type');
          it.style.display = (r.value === 'all' || ty === 'all' || ty === r.value) ? '' : 'none';
        });
        reelRow.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
    $$('[data-reel-scroll]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = reelRow.querySelector('.reel-item');
        var stepW = card ? card.getBoundingClientRect().width + 14 : 260;
        reelRow.scrollBy({ left: +b.getAttribute('data-reel-scroll') * stepW * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    if (reelModal && reels.length) {
      var stage = reelModal.querySelector('.reel-stage');
      var cap = reelModal.querySelector('.reel-modal-cap');
      var cur = -1;
      var visibleIdx = function () {
        return $$('[data-reel]', reelRow).filter(function (b) { return b.offsetParent !== null; }).map(function (b) { return +b.getAttribute('data-reel'); });
      };
      var closeReel = function () {
        stage.innerHTML = '';
        if (reelModal.open && reelModal.close) reelModal.close(); else reelModal.removeAttribute('open');
        document.body.style.overflow = '';
      };
      var showReel = function (i) {
        var r = reels[i]; if (!r || (!r.mp4 && !r.youtube)) return;
        cur = i;
        stage.innerHTML = '';
        if (r.mp4) {
          var v = document.createElement('video');
          v.src = r.mp4; v.controls = true; v.playsInline = true; v.autoplay = true;
          if (r.poster) v.poster = r.poster;
          v.setAttribute('aria-label', TYPE[typeOf(r)] + ': ' + (r.title || ''));
          stage.appendChild(v);
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else {
          var f = document.createElement('iframe');
          f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(r.youtube) + '?autoplay=1&playsinline=1&rel=0';
          f.title = TYPE[typeOf(r)] + ': ' + (r.title || 'Tilicho video');
          f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
          stage.appendChild(f);
        }
        cap.innerHTML = '<span class="reel-tag">' + TYPE[typeOf(r)] + '</span><b>' + esc(r.title) + '</b>' + (r.name ? '<span>' + esc(r.name) + '</span>' : '');
        var vis = visibleIdx(), k = vis.indexOf(i);
        reelModal.querySelector('[data-reel-step="-1"]').hidden = k <= 0;
        reelModal.querySelector('[data-reel-step="1"]').hidden = k < 0 || k >= vis.length - 1;
        if (!reelModal.open) {
          if (reelModal.showModal) reelModal.showModal(); else reelModal.setAttribute('open', '');
          document.body.style.overflow = 'hidden';
        }
      };
      var stepReel = function (d) { var vis = visibleIdx(), k = vis.indexOf(cur) + d; if (k >= 0 && k < vis.length) showReel(vis[k]); };
      reelRow.addEventListener('click', function (e) { var b = e.target.closest('[data-reel]'); if (b) showReel(+b.getAttribute('data-reel')); });
      reelModal.querySelector('[data-reel-close]').addEventListener('click', closeReel);
      $$('[data-reel-step]', reelModal).forEach(function (b) { b.addEventListener('click', function () { stepReel(+b.getAttribute('data-reel-step')); }); });
      reelModal.addEventListener('close', function () { stage.innerHTML = ''; document.body.style.overflow = ''; });
      reelModal.addEventListener('click', function (e) { if (e.target === reelModal || e.target.classList.contains('reel-modal-inner')) closeReel(); });
      reelModal.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') stepReel(1);
        if (e.key === 'ArrowLeft') stepReel(-1);
      });
      var sx = 0, sy = 0;
      reelModal.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      reelModal.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) stepReel(dx < 0 ? 1 : -1);
        else if (dy > 100 && Math.abs(dy) > Math.abs(dx)) closeReel();
      }, { passive: true });
    }
  }

  /* ---------- Forms → WhatsApp / email ---------- */
  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (f) {
      var bad = !f.value.trim();
      f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { f.focus(); ok = false; }
    });
    var err = form.querySelector('.form-error');
    if (err) err.hidden = ok;
    return ok;
  }
  function val(form, name) { var f = form.elements[name]; return f ? f.value.trim() : ''; }

  var dForm = document.getElementById('distributor-form');
  if (dForm) dForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(dForm)) return;
    openWhatsApp('Hello Tilicho! I am interested in becoming a distributor.' +
      '\nName: ' + val(dForm, 'name') + '\nBusiness: ' + val(dForm, 'business') +
      '\nCity/District: ' + val(dForm, 'city') + '\nPhone: ' + val(dForm, 'phone') +
      (val(dForm, 'message') ? '\nMessage: ' + val(dForm, 'message') : ''));
  });

  var cForm = document.getElementById('contact-form');
  if (cForm) cForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(cForm)) return;
    var name = val(cForm, 'name'), phone = val(cForm, 'phone'), message = val(cForm, 'message');
    var via = e.submitter ? e.submitter.value : 'whatsapp';
    if (via === 'email') {
      window.location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('Website enquiry from ' + name) +
        '&body=' + encodeURIComponent(message + '\n\nName: ' + name + '\nPhone: ' + phone);
    } else {
      openWhatsApp('Hello Tilicho! My name is ' + name + ' (' + phone + ').\n' + message);
    }
  });
  $$('.form [required]').forEach(function (f) {
    f.addEventListener('input', function () { if (f.value.trim()) f.setAttribute('aria-invalid', 'false'); });
  });

  /* ---------- Scroll reveal, pause off-screen loops, floating buttons ---------- */
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        revealObs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el) {
      var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }) : [];
      var i = sibs.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 4) * 90 + 'ms';
      revealObs.observe(el);
    });
    // safety net: never leave content invisible
    setTimeout(function () { $$('.reveal').forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible'); }); }, 2500);

    var animObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-offscreen', !en.isIntersecting); });
    });
    $$('[data-anim]').forEach(function (el) { animObs.observe(el); });

    var hero = document.querySelector('.hero');
    var waFloat = document.querySelector('.wa-float');
    var buybar = document.querySelector('.buybar');
    var heroVisible = true, contactVisible = false, typing = false;
    var syncBars = function () {
      if (waFloat) waFloat.classList.toggle('is-hidden', heroVisible);
      if (buybar) buybar.classList.toggle('is-hidden', heroVisible || contactVisible || typing);
    };
    if (hero) {
      if (waFloat) waFloat.classList.add('is-hidden');
      new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; syncBars(); }).observe(hero);
    }
    var contactSec = document.getElementById('contact');
    if (contactSec && buybar) {
      new IntersectionObserver(function (entries) { contactVisible = entries[0].isIntersecting; syncBars(); }, { threshold: 0.15 }).observe(contactSec);
    }
    document.addEventListener('focusin', function (e) { if (e.target.matches('input:not([type="radio"]), textarea')) { typing = true; syncBars(); } });
    document.addEventListener('focusout', function (e) { if (e.target.matches('input:not([type="radio"]), textarea')) { typing = false; syncBars(); } });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
