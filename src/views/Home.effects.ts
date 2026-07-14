// @ts-nocheck
// PORTED VERBATIM from the original page script (one-time generation).
// The source is a React + "DC" page-builder component; React/react-dom and the
// builder runtime are NOT shipped. A tiny DCLogic shim below stands in for the
// React base: setState re-syncs the specific {{ }} / <sc-if> bindings imperatively
// (__render), and the builder's declarative sc-camel-on-* / style-hover bindings
// are wired generically from the data-* hooks the extractor emitted (__wire).
// Timers / listeners / observers / animations route through a tracker so they tear
// down on route change. Edit THIS file directly from now on.
//
// i18n: all user-facing copy this file drives (entities, docket, topic hints,
// fallbacks) comes in via the `copy` parameter — the current locale's
// HomeContent (src/content/home.ts). The view remounts on locale change and
// re-calls initEffects with the new language. The mail subject and topic keys
// deliberately stay ENGLISH (owner receives English data for both languages).
import { createTracker } from '@/composables/tracker'
import type { HomeContent } from '@/content/home'

export function initEffects(copy: HomeContent): () => void {
  const __fx = createTracker()
  const requestAnimationFrame = __fx.raf
  const cancelAnimationFrame = __fx.caf
  const setTimeout = __fx.setTimeout
  const clearTimeout = __fx.clearTimeout
  const setInterval = __fx.setInterval
  const clearInterval = __fx.clearInterval
  const IntersectionObserver = __fx.IO

  // Effective builder props (the data-props editor-schema defaults, resolved).
  const PROPS = { accent: '#D2453E', graphite: '#26282C', briefAnim: 'typeout', mapAnim: 'surge', docketStyle: 'ring', contactEmail: 'peter@lemur.legal', showChyron: true }

  try {
    // Minimal stand-in for the page-builder React base class. Replaces
    // setState-driven reconciliation with an imperative sync of the bindings
    // this template actually uses (see __render). Defined INSIDE the try so it
    // shares block scope with __render (a block-scoped function declaration).
    class DCLogic {
      constructor() { this.props = PROPS }
      setState(patch, cb) {
        const next = typeof patch === "function" ? patch(this.state) : patch
        Object.assign(this.state, next)
        __render(this)
        if (cb) cb()
      }
    }

    class Component extends DCLogic {
      state = { mobile: false, label: '', bar: false, sent: false, sel: 'lemur', docket: 0, part: 0, onAir: false, topic: '', nameVal: '' };

      componentDidMount() {
        this._c = [];
        this._locked = false;
        this._reduced = false;
        this._off = null;
        try { this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
        var reduced = this._reduced;
    // (framework self-call removed: theme is baked into :root / #pm-root)
        // Copy comes from the locale's content module (entities keep their
        // hrefs there too; extra fields like nodeLabel/aria are harmless).
        this._ents = copy.record.ents;
        this._docket = copy.docket.items;
        // The operating map is a 3-tier tree: pm → 4 categories → 7 leaves.
        // _order is the cycle/browse order (depth-first); _paths maps each
        // selectable node to the edge ids lighting its route back to the hub
        // (edge id = the child key of that edge); _edges lists every edge.
        // Every paintable node (for _applySel colouring, incl. the categories).
        this._nodes = ['pm', 'investment', 'suricate', 'ibex', 'startup', 'bloctopus', 'blocksquare', 'advisory', 'lemur', 'lecture', 'thinktank', 'faculty'];
        // Categories are structural only (not clickable), so the prev/next cycle
        // visits just the hub and the 7 leaf projects.
        this._order = ['pm', 'suricate', 'ibex', 'bloctopus', 'blocksquare', 'lemur', 'thinktank', 'faculty'];
        this._paths = {
          pm: [],
          investment: ['investment'],
          startup: ['startup'],
          advisory: ['advisory'],
          lecture: ['lecture'],
          suricate: ['investment', 'suricate'],
          ibex: ['investment', 'ibex'],
          bloctopus: ['startup', 'bloctopus'],
          blocksquare: ['startup', 'blocksquare'],
          lemur: ['advisory', 'lemur'],
          thinktank: ['lecture', 'thinktank'],
          faculty: ['lecture', 'faculty']
        };
        this._edges = ['investment', 'startup', 'advisory', 'lecture', 'suricate', 'ibex', 'bloctopus', 'blocksquare', 'lemur', 'thinktank', 'faculty'];
        // Parent of each node, for walking a node → … → hub chain (surge dot).
        this._parent = {
          investment: 'pm', startup: 'pm', advisory: 'pm', lecture: 'pm',
          suricate: 'investment', ibex: 'investment',
          bloctopus: 'startup', blocksquare: 'startup',
          lemur: 'advisory',
          thinktank: 'lecture', faculty: 'lecture'
        };

        var mq = null;
        try { mq = window.matchMedia('(max-width: 819px)'); } catch (e) {}
        if (mq) {
          var onMq = () => { this.setState({ mobile: mq.matches }); this._fitMap(); };
          onMq();
          if (mq.addEventListener) {
            __fx.on(mq, 'change', onMq);
            this._c.push(() => mq.removeEventListener('change', onMq));
          }
        }

        var l1 = document.getElementById('mline-1');
        var l2 = document.getElementById('mline-2');
        var l3 = document.getElementById('mline-3');
        if (reduced && l3) this._lock(l3);

        // section offsets cache for the segmented progress bar
        this._refreshOffs = () => {
          var h = window.innerHeight || 800;
          var ids = ['facets', 'record', 'media', 'writing', 'contact'];
          var tops = [];
          for (var i = 0; i < ids.length; i++) {
            var el = document.getElementById(ids[i]);
            if (!el) return;
            tops.push(el.getBoundingClientRect().top + (window.scrollY || 0));
          }
          this._off = { tops: tops, max: (document.documentElement.scrollHeight || 0) - h };
        };

        // unified scroll loop
        var busy = false;
        var onScroll = () => {
          if (busy) return;
          busy = true;
          requestAnimationFrame(() => {
            busy = false;
            var sy = window.scrollY || 0;
            var h = window.innerHeight || 800;
            var p = Math.max(0, Math.min(1, sy / (h * 0.5)));
            if (!reduced && l1 && l2) {
              var e = 1 - Math.pow(1 - p, 3);
              var fs = parseFloat(window.getComputedStyle(l1).fontSize) || 48;
              l1.style.transform = 'translateY(' + (e * fs * 0.26).toFixed(1) + 'px)';
              l2.style.transform = 'translateY(' + (e * fs * -0.18).toFixed(1) + 'px)';
            }
            if (p > 0.8 && !this._locked && l3) this._lock(l3);
            var o = this._off;
            if (o && o.tops.length === 5) {
              var seg = -1;
              for (var i = 0; i < 5; i++) { if (sy >= o.tops[i] - h * 0.35) seg = i; }
              var f = 0;
              if (seg >= 0) {
                var a = o.tops[seg] - h * 0.35;
                var b = seg < 4 ? o.tops[seg + 1] - h * 0.35 : o.max;
                var fr = b > a ? Math.min(1, Math.max(0, (sy - a) / (b - a))) : 1;
                f = (seg + fr) / 5;
              }
              var fill = document.getElementById('bar-fill');
              if (fill) fill.style.transform = 'scaleX(' + f.toFixed(4) + ')';
              var knob = document.getElementById('bar-knob');
              if (knob) knob.style.left = (f * 100).toFixed(2) + '%';
              if (seg !== this.state.part) this.setState({ part: seg });
            }
            var want = sy > h * 0.55;
            if (want !== this.state.bar) this.setState({ bar: want });
          });
        };
        __fx.on(window, 'scroll', onScroll, { passive: true });
        this._refreshOffs();
        onScroll();
        this._c.push(() => window.removeEventListener('scroll', onScroll));

        var onResize = () => { this._refreshOffs(); onScroll(); this._fitMap(); this._fitPanelAll(); };
        __fx.on(window, 'resize', onResize);
        __fx.on(window, 'load', onResize);
        this._c.push(() => window.removeEventListener('resize', onResize));
        this._c.push(() => window.removeEventListener('load', onResize));
        var offIv = setInterval(this._refreshOffs, 2500);
        this._c.push(() => clearInterval(offIv));

        // docket rotator
        var dIv = setInterval(() => {
          if (document.hidden) return;
          this._advDocket();
        }, 3400);
        this._c.push(() => clearInterval(dIv));

        // docket timer indicator (ring / dial / rise)
        this._docketAt = Date.now();
        var pRaf = 0;
        var pTick = () => {
          var p = Math.min(1, (Date.now() - (this._docketAt || 0)) / 3400);
          var ring = document.getElementById('docket-prog-ring');
          if (ring) ring.style.strokeDashoffset = (47.12 * (1 - p)).toFixed(2);
          var dial = document.getElementById('docket-prog-dial');
          if (dial) dial.style.background = 'conic-gradient(var(--accent) ' + (p * 100).toFixed(1) + '%, rgba(236,231,220,0.12) 0)';
          var rise = document.getElementById('docket-prog-rise');
          if (rise) rise.style.height = (p * 100).toFixed(1) + '%';
          pRaf = requestAnimationFrame(pTick);
        };
        pRaf = requestAnimationFrame(pTick);
        this._c.push(() => cancelAnimationFrame(pRaf));

        if ('IntersectionObserver' in window) {
          // section label tracking
          var els = Array.prototype.slice.call(document.querySelectorAll('[data-chyron]'));
          if (els.length) {
            var io = new IntersectionObserver((ens) => {
              for (var i = 0; i < ens.length; i++) {
                var en = ens[i];
                if (!en.isIntersecting) continue;
                var lab = en.target.getAttribute('data-chyron') || '';
                if (lab !== '__hide' && lab !== this.state.label) {
                  this.setState({ label: lab }, () => this._swap());
                }
              }
            }, { rootMargin: '-40% 0px -52% 0px', threshold: 0 });
            els.forEach((el) => io.observe(el));
            this._c.push(() => io.disconnect());
          }

          var vh = window.innerHeight || 800;

          if (!reduced) {
            // cascading reveals
            var rows = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
            var hidden = rows.filter((r) => r.getBoundingClientRect().top > vh * 0.92);
            hidden.forEach((r) => {
              r._origTrans = r.style.transition || '';
              r.style.opacity = '0';
              r.style.transform = 'translateY(14px)';
            });
            if (hidden.length) {
              var rio = new IntersectionObserver((ens) => {
                ens.forEach((en) => {
                  if (!en.isIntersecting) return;
                  rio.unobserve(en.target);
                  var el = en.target;
                  var d = parseInt(el.getAttribute('data-reveal') || '0', 10) * 70;
                  el.style.transition = 'opacity 0.55s cubic-bezier(0.2,0.7,0.2,1) ' + d + 'ms, transform 0.55s cubic-bezier(0.2,0.7,0.2,1) ' + d + 'ms';
                  el.style.opacity = '1';
                  el.style.transform = 'none';
                  setTimeout(() => { el.style.transition = el._origTrans; }, d + 620);
                });
              }, { rootMargin: '0px 0px -6% 0px' });
              hidden.forEach((r) => rio.observe(r));
              this._c.push(() => rio.disconnect());
            }

            // rule draws
            var rules = Array.prototype.slice.call(document.querySelectorAll('[data-rule]'));
            var hRules = rules.filter((r) => r.getBoundingClientRect().top > vh * 0.92);
            hRules.forEach((r) => {
              r.style.transform = 'scaleX(0)';
              r.style.transformOrigin = 'left';
            });
            if (hRules.length) {
              var uio = new IntersectionObserver((ens) => {
                ens.forEach((en) => {
                  if (!en.isIntersecting) return;
                  uio.unobserve(en.target);
                  en.target.style.transition = 'transform 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.1s';
                  en.target.style.transform = 'scaleX(1)';
                });
              }, { rootMargin: '0px 0px -8% 0px' });
              hRules.forEach((r) => uio.observe(r));
              this._c.push(() => uio.disconnect());
            }

            // timeline drops into place (deferred so the right mobile/desktop variant is mounted)
            setTimeout(() => {
              var tlWrap = [document.getElementById('tl-h'), document.getElementById('tl-v')].filter(function (x) { return x && x.offsetParent !== null; })[0] || document.getElementById('tl-h') || document.getElementById('tl-v');
              if (!tlWrap || tlWrap.getBoundingClientRect().top <= (window.innerHeight || 800) * 0.9) return;
              var tlItems = Array.prototype.slice.call(tlWrap.querySelectorAll('[data-tl-item]'));
              if (!tlItems.length) return;
              tlItems.forEach((it) => { it.style.opacity = '0'; });
              var tio = new IntersectionObserver((ens) => {
                ens.forEach((en) => {
                  if (!en.isIntersecting) return;
                  tio.disconnect();
                  tlItems.forEach((it, i) => {
                    it.style.opacity = '';
                    if (it.animate) __fx.anim(it, 
                      [{ opacity: 0, transform: 'translateY(-38px)' }, { opacity: 1, transform: 'none' }],
                      { duration: 650, delay: 140 + i * 110, easing: 'cubic-bezier(0.34,1.56,0.64,1)', fill: 'backwards' }
                    );
                  });
                  var tlLn = tlWrap.querySelector('[data-tl-line]');
                  if (tlLn) {
                    tlLn.style.transition = 'transform 1.05s cubic-bezier(0.2,0.7,0.2,1) 0.4s';
                    tlLn.style.transform = tlWrap.id === 'tl-v' ? 'scaleY(1)' : 'scaleX(1)';
                  }
                });
              }, { rootMargin: '0px 0px -15% 0px' });
              tio.observe(tlWrap);
              this._c.push(() => tio.disconnect());
            }, 60);

            // network draw-in
            var svg = document.querySelector('#network svg');
            if (svg && svg.getBoundingClientRect().top > vh * 0.92) {
              var lines = Array.prototype.slice.call(svg.querySelectorAll('line[id^="line-"]'));
              var nodes = Array.prototype.slice.call(svg.querySelectorAll('g[data-net]'));
              lines.forEach((ln) => {
                var L = 300;
                try { L = ln.getTotalLength(); } catch (e2) {}
                ln.style.strokeDasharray = L;
                ln.style.strokeDashoffset = L;
              });
              nodes.forEach((n) => { n.style.opacity = '0'; });
              var nio = new IntersectionObserver((ens) => {
                ens.forEach((en) => {
                  if (!en.isIntersecting) return;
                  nio.disconnect();
                  lines.forEach((ln, i) => {
                    ln.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.2,0.7,0.2,1) ' + (i * 110) + 'ms';
                    ln.style.strokeDashoffset = '0';
                  });
                  nodes.forEach((n, i) => {
                    n.style.transition = 'opacity 0.5s cubic-bezier(0.2,0.7,0.2,1) ' + (i * 90 + 200) + 'ms';
                    n.style.opacity = '1';
                  });
                });
              }, { rootMargin: '0px 0px -12% 0px' });
              nio.observe(svg);
              this._c.push(() => nio.disconnect());
            }

          }
        }

        // contact composer wiring
        var frm = document.getElementById('contact-form');
        if (frm) {
          var onInp = () => { this._updateSignal(); };
          __fx.on(frm, 'input', onInp);
          this._c.push(() => frm.removeEventListener('input', onInp));
        }
        // Media strip: deal each newly-snapped card in as you swipe/scroll it
        // (also covers the prev/next buttons, which scroll the strip).
        var mstrip = document.getElementById('media-strip');
        if (mstrip) {
          this._mediaIdx = 0;
          var onMStrip = () => {
            // Debounce to the moment the swipe/scroll comes to rest, so the card
            // settles once it snaps rather than bouncing mid-drag.
            if (this._mediaT) clearTimeout(this._mediaT);
            this._mediaT = setTimeout(() => {
              var kids = mstrip.children;
              if (!kids.length) return;
              var step = kids[0].getBoundingClientRect().width + 22;
              if (step < 40) return;
              var idx = Math.max(0, Math.min(kids.length - 1, Math.round(mstrip.scrollLeft / step)));
              if (idx !== this._mediaIdx) {
                var dir = idx > this._mediaIdx ? 1 : -1;
                this._mediaIdx = idx;
                this._mediaSettle(kids[idx], dir);
              }
            }, 90);
          };
          __fx.on(mstrip, 'scroll', onMStrip, { passive: true });
          this._c.push(() => mstrip.removeEventListener('scroll', onMStrip));
        }
        // All "What I do" dossiers start closed (no auto-open).

        requestAnimationFrame(() => { this._applySel(); this._pulseChain(this.state.sel); });
        // Size the operating map to its content on mobile (re-fit once web fonts
        // load, since label widths — and thus the crop — depend on them).
        this._fitMap();
        this._fitPanelAll();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { this._fitMap(); this._fitPanelAll(); });
      }

      componentDidUpdate(prevProps) {
        if (prevProps.accent !== this.props.accent || prevProps.graphite !== this.props.graphite) this._applyTheme();
      }

      componentWillUnmount() {
        (this._c || []).forEach((f) => { try { f(); } catch (e) {} });
        if (this._airT) clearTimeout(this._airT);
        if (this._typeT) clearInterval(this._typeT);
        this._twStop();
        this._pulseStop();
        if (this._thA) { try { this._thA.cancel(); } catch (e) {} }
        if (this._thRaf) cancelAnimationFrame(this._thRaf);
      }

      _applyTheme() {
        var root = document.getElementById('pm-root');
        if (!root) return;
        root.style.setProperty('--accent', this.props.accent || '#D2453E');
        root.style.setProperty('--graphite', this.props.graphite || '#26282C');
      }

      _pad(n) { return (n < 10 ? '0' : '') + n; }

      _lock(l3) {
        if (this._locked) return;
        this._locked = true;
        l3.style.color = '#FAF8F2';
        var per = document.getElementById('mline-period');
        if (per && per.animate && !this._reduced) {
          __fx.anim(per, 
            [{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }],
            { duration: 460, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }
          );
        }
      }

      _swap() {
        if (this._reduced) return;
        var el = document.getElementById('bar-label');
        if (el && el.animate) {
          __fx.anim(el, 
            [{ transform: 'translateY(115%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
            { duration: 300, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }
          );
        }
        var dot = document.getElementById('bar-dot');
        if (dot && dot.animate) {
          __fx.anim(dot, 
            [{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }],
            { duration: 380, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }
          );
        }
      }

      _advDocket() {
        this._docketAt = Date.now();
        this.setState((s) => ({ docket: (s.docket + 1) % 8 }), () => {
          if (this._reduced) return;
          var el = document.getElementById('docket-item');
          if (el && el.animate) {
            __fx.anim(el, 
              [{ transform: 'translateY(115%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
              { duration: 320, easing: 'cubic-bezier(0.2,0.7,0.2,1)' }
            );
          }
        });
      }

      advanceDocket = () => this._advDocket();

      _applySel() {
        var sel = this.state.sel;
        var active = this._paths[sel] || [];
        // Every node on the route sel → … → hub takes the accent, so selecting a
        // project reddens its section (category) dot too, not just the leaf.
        var accent = {}, pk = sel, guard = 0;
        while (pk && guard++ < 16) { accent[pk] = true; if (pk === 'pm') break; pk = this._parent[pk]; }
        (this._nodes || this._order).forEach((k) => {
          var is = !!accent[k];
          var isCat = this._parent[k] === 'pm';   // the 4 sections
          var g = document.getElementById('node-' + k);
          if (g && k !== 'pm') {
            var c = g.querySelector('circle');
            var t = g.querySelector('text');
            if (c) {
              if (isCat) {
                // sections: borderless grey dot; a red OUTLINE (not a red fill)
                // only when their project is selected.
                c.style.fill = '#3A3D43';
                c.style.stroke = is ? 'var(--accent)' : 'none';
                c.style.strokeWidth = is ? '2' : '0';
              } else {
                // leaves (projects): fill red when selected.
                c.style.fill = is ? 'var(--accent)' : '#3A3D43';
                c.style.stroke = is ? 'var(--accent)' : '#948E81';
              }
            }
            if (t) t.style.fill = is ? '#ECE7DC' : '#B4AEA1';
          }
          if (g && k === 'pm') {
            var ring = g.querySelectorAll('circle')[1];
            if (ring) ring.style.stroke = (k === sel) ? 'var(--accent)' : 'rgba(236,231,220,0.3)';
          }
        });
        // Edges light the selected node's whole route back to the hub
        // (leaf: hub→category + category→leaf; category: hub→category).
        this._edges.forEach((k) => {
          var on = active.indexOf(k) !== -1;
          var ln = document.getElementById('line-' + k);
          if (ln) {
            ln.style.stroke = on ? 'var(--accent)' : 'rgba(236,231,220,0.25)';
            ln.style.strokeWidth = on ? '2' : '1';
          }
          var fl = document.getElementById('flow-' + k);
          if (fl) fl.style.opacity = on && !this._reduced ? '0.95' : '0';
        });
        this._applyNameLink();
      }

      // Point the panel title at the selected project's site (new tab); when we
      // don't have a URL yet, it's a placeholder that stays put until we do.
      _applyNameLink() {
        var sel = (this._ents || {})[this.state.sel] || {};
        var href = sel.href || '';
        ['net-name', 'net-visit'].forEach((id) => {
          var a = document.getElementById(id);
          if (!a) return;
          if (href) {
            a.setAttribute('href', href);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener');
            a.removeAttribute('data-placeholder');
            a.removeAttribute('title');
          } else {
            a.setAttribute('href', '#');
            a.removeAttribute('target');
            a.setAttribute('data-placeholder', 'true');
            a.setAttribute('title', 'Link coming soon');
          }
        });
      }

      // Reserve the tallest dossier's height so the ‹/› controls below the panel
      // stay put as you browse. Measured across every selectable node for the
      // current locale + width (runs on mount / resize / web-font load).
      _fitPanelAll() {
        var inner = document.getElementById('net-panel-inner');
        var nameEl = document.getElementById('net-name');
        var roleEl = document.querySelector('#net-panel-inner [data-bind="selRole"]');
        var descEl = document.querySelector('#net-panel-inner [data-bind="selDesc"]');
        if (!inner || !nameEl || !roleEl || !descEl) return;
        if (inner.offsetWidth < 40) return;   // not laid out yet; a later call catches it
        var ents = this._ents || {};
        var save = { n: nameEl.textContent, r: roleEl.textContent, d: descEl.textContent };
        inner.style.minHeight = '0px';
        var max = 0;
        (this._order || []).forEach((k) => {
          var e = ents[k];
          if (!e) return;
          nameEl.textContent = e.name; roleEl.textContent = e.role; descEl.textContent = e.desc;
          var h = inner.offsetHeight;
          if (h > max) max = h;
        });
        nameEl.textContent = save.n; roleEl.textContent = save.r; descEl.textContent = save.d;
        if (max) inner.style.minHeight = max + 'px';
      }

      // Fit the operating map on mobile by cropping the viewBox to the graph's
      // actual content (nodes + labels) plus a margin, so it renders noticeably
      // bigger; desktop keeps the full 560x480 frame.
      _fitMap() {
        var svg = document.querySelector('#network svg[viewBox]');
        if (!svg) return;
        if (!this.state.mobile) { svg.setAttribute('viewBox', '0 0 560 480'); return; }
        var bb;
        try { bb = svg.getBBox(); } catch (e) { return; }
        if (!bb || bb.width < 50) return;
        var m = 16;
        svg.setAttribute('viewBox',
          Math.round(bb.x - m) + ' ' + Math.round(bb.y - m) + ' ' +
          Math.round(bb.width + 2 * m) + ' ' + Math.round(bb.height + 2 * m));
      }

      _twStop() {
        if (this._twRaf) { cancelAnimationFrame(this._twRaf); this._twRaf = null; }
        if (this._twNodes) {
          this._twNodes.forEach((n) => { n.node.nodeValue = n.full; });
          this._twNodes = null;
        }
      }

      _twStart(root) {
        this._twStop();
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var nodes = [];
        var tn;
        while ((tn = walker.nextNode())) {
          if (tn.nodeValue && tn.nodeValue.trim()) nodes.push({ node: tn, full: tn.nodeValue });
        }
        if (!nodes.length) return;
        this._twNodes = nodes;
        nodes.forEach((n) => { n.node.nodeValue = ''; });
        var ni = 0, ci = 0;
        var step = () => {
          var chunk = 3 + Math.floor(Math.random() * 3);
          while (chunk-- > 0 && ni < nodes.length) {
            ci += 1;
            var cur = nodes[ni];
            if (ci >= cur.full.length) {
              cur.node.nodeValue = cur.full;
              ni += 1;
              ci = 0;
            } else {
              cur.node.nodeValue = cur.full.slice(0, ci) + '▌';
            }
          }
          if (ni < nodes.length) {
            this._twRaf = requestAnimationFrame(step);
          } else {
            this._twRaf = null;
            this._twNodes = null;
          }
        };
        this._twRaf = requestAnimationFrame(step);
      }

      _mapFx(key) {
        if (this._reduced) return;
        var ease = 'cubic-bezier(0.2,0.7,0.2,1)';
        var mode = this.props.mapAnim || 'ripple';
        var rf = document.getElementById('net-rule-fill');
        if (rf && rf.animate) __fx.anim(rf, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 520, easing: ease });
        var inner = document.getElementById('net-panel-inner');
        var rows = inner ? Array.prototype.slice.call(inner.children) : [];
        var node = document.getElementById('node-' + key);
        var hubC = document.querySelector('#node-pm circle');
        var hx = hubC ? parseFloat(hubC.getAttribute('cx')) : 58;
        var hy = hubC ? parseFloat(hubC.getAttribute('cy')) : 240;
        var c = node ? node.querySelector('circle') : null;
        var cx = c ? parseFloat(c.getAttribute('cx')) : hx;
        var cy = c ? parseFloat(c.getAttribute('cy')) : hy;
        var fx = document.getElementById('fx-layer');
        var NS = 'http://www.w3.org/2000/svg';
        if (mode === 'surge' && fx) {
          // The traveling pulse from the selected node through its section to the
          // hub is owned by _pulseChain (started on selection). Here we just
          // cascade the panel rows in from the map side.
          var dx = cx < hx ? -16 : 16;
          rows.forEach((r, i) => {
            if (r.animate) __fx.anim(r,
              [{ opacity: 0, transform: 'translateX(' + dx + 'px)' }, { opacity: 1, transform: 'none' }],
              { duration: 430, delay: 200 + i * 55, easing: ease, fill: 'backwards' }
            );
          });
        } else if (mode === 'typeset') {
          var nm = document.getElementById('net-name');
          var full = (this._ents[key] || {}).name || '';
          if (nm) this._type(nm, full);
          rows.forEach((r, i) => {
            if (r.id === 'net-name' || !r.animate) return;
            __fx.anim(r, 
              [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
              { duration: 400, delay: 320 + i * 70, easing: ease, fill: 'backwards' }
            );
          });
        } else {
          if (fx) {
            [0, 150].forEach((dl) => {
              var ring = document.createElementNS(NS, 'circle');
              ring.setAttribute('cx', cx); ring.setAttribute('cy', cy); ring.setAttribute('r', '10');
              ring.setAttribute('fill', 'none');
              ring.setAttribute('stroke', 'var(--accent)');
              ring.setAttribute('stroke-width', '1.6');
              fx.appendChild(ring);
              if (ring.animate) {
                var ra = __fx.anim(ring, 
                  [{ r: '10', opacity: 0.85 }, { r: '34', opacity: 0 }],
                  { duration: 680, delay: dl, easing: 'cubic-bezier(0.2,0.6,0.4,1)', fill: 'backwards' }
                );
                ra.onfinish = () => ring.remove();
              } else { ring.remove(); }
            });
          }
          rows.forEach((r, i) => {
            if (r.animate) __fx.anim(r, 
              [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
              { duration: 420, delay: 120 + i * 60, easing: ease, fill: 'backwards' }
            );
          });
        }
      }

      _pulseStop() {
        if (this._pulseAnims) { this._pulseAnims.forEach((a) => { try { a.cancel(); } catch (e) {} }); this._pulseAnims = null; }
        if (this._pulseTimer) { clearInterval(this._pulseTimer); this._pulseTimer = null; }
        if (this._pulseEl && this._pulseEl.parentNode) this._pulseEl.parentNode.removeChild(this._pulseEl);
        this._pulseEl = null;
      }

      // A soft pulse that repeatedly rides the highlighted route from the selected
      // node, THROUGH its section (category) node, into the PM hub — replacing the
      // old selected-node → title thread. Loops while that node stays selected.
      _pulseChain(key) {
        this._pulseStop();
        if (this._reduced) return;
        var fx = document.getElementById('fx-layer');
        if (!fx) return;
        var NS = 'http://www.w3.org/2000/svg';
        // node centres, selected → parent → … → hub (in SVG user units)
        var chain = [], pk = key, guard = 0;
        while (pk && guard++ < 16) {
          var pg = document.getElementById('node-' + pk);
          var pc = pg ? pg.querySelector('circle') : null;
          if (pc) chain.push({ x: parseFloat(pc.getAttribute('cx')), y: parseFloat(pc.getAttribute('cy')) });
          if (pk === 'pm') break;
          pk = this._parent[pk];
        }
        if (chain.length < 2) return;
        var start = chain[0];
        // distance-proportional keyframe offsets → constant travel speed
        var cum = [0], total = 0;
        for (var si = 1; si < chain.length; si++) {
          total += Math.hypot(chain[si].x - chain[si - 1].x, chain[si].y - chain[si - 1].y);
          cum.push(total);
        }
        var dur = Math.round(950 + total * 2.6);
        var g = document.createElementNS(NS, 'g');
        g.style.pointerEvents = 'none';
        var halo = document.createElementNS(NS, 'circle');
        halo.setAttribute('cx', start.x); halo.setAttribute('cy', start.y); halo.setAttribute('r', '10');
        halo.setAttribute('fill', 'var(--accent)'); halo.setAttribute('opacity', '0.16');
        var core = document.createElementNS(NS, 'circle');
        core.setAttribute('cx', start.x); core.setAttribute('cy', start.y); core.setAttribute('r', '4.5');
        core.setAttribute('fill', 'var(--accent)');
        g.appendChild(halo); g.appendChild(core);
        fx.appendChild(g);
        var moveKf = chain.map((w, i) => ({
          transform: 'translate(' + (w.x - start.x).toFixed(1) + 'px,' + (w.y - start.y).toFixed(1) + 'px)',
          offset: total ? cum[i] / total : (i / (chain.length - 1))
        }));
        // fade in as it leaves the node, fade out as it merges into the hub
        var fadeKf = [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.14 },
          { opacity: 1, offset: 0.8 },
          { opacity: 0, offset: 1 }
        ];
        this._pulseAnims = [];
        if (g.animate) {
          this._pulseAnims.push(g.animate(moveKf, { duration: dur, easing: 'linear', iterations: Infinity }));
          this._pulseAnims.push(g.animate(fadeKf, { duration: dur, easing: 'ease-in-out', iterations: Infinity }));
        }
        this._pulseEl = g;
        // the hub gives a gentle "reception" beat each time a pulse arrives
        var ease = 'cubic-bezier(0.2,0.7,0.2,1)';
        var pulseHub = () => {
          var hub = document.querySelector('#node-pm circle');
          if (hub && hub.animate) {
            hub.style.transformBox = 'fill-box'; hub.style.transformOrigin = 'center';
            __fx.anim(hub, [{ transform: 'scale(1)' }, { transform: 'scale(1.13)' }, { transform: 'scale(1)' }], { duration: 440, easing: ease });
          }
        };
        this._pulseTimer = setInterval(pulseHub, dur);
      }

      _netCycle(dir) {
        var order = this._order;
        var i = order.indexOf(this.state.sel);
        var n = order[(i + dir + order.length) % order.length];
        this.setState({ sel: n }, () => {
          this._applySel();
          this._mapFx(n);
          this._pulseChain(n);
        });
      }

      netPrev = () => this._netCycle(-1);
      netNext = () => this._netCycle(1);

      _type(el, full) {
        if (this._typeT) clearInterval(this._typeT);
        var i = 0;
        el.textContent = '';
        this._typeT = setInterval(() => {
          i++;
          el.textContent = full.slice(0, i);
          if (i >= full.length) { clearInterval(this._typeT); this._typeT = null; }
        }, 26);
      }

      _updateSignal() {
        var msg = document.getElementById('cf-message');
        var len = msg ? msg.value.trim().length : 0;
        var ok = [
          !!this.state.topic,
          len > 0,
          len > 40,
          len > 90
        ];
        for (var i = 0; i < 4; i++) {
          var t = document.getElementById('sig-' + (i + 1));
          if (t) t.style.background = ok[i] ? 'var(--accent)' : 'rgba(236,231,220,0.15)';
        }
      }

      _mediaScroll(dir) {
        var s = document.getElementById('media-strip');
        if (!s || !s.children.length) return;
        var step = s.children[0].getBoundingClientRect().width + 22; // card + 1.4rem gap
        var cur = Math.round(s.scrollLeft / step);
        var target = Math.max(0, Math.min(s.children.length - 1, cur + dir));
        // The scroll listener (componentDidMount) deals the card in once the strip
        // snaps — same path for a swipe or these buttons.
        s.scrollTo({ left: target * step, behavior: this._reduced ? 'auto' : 'smooth' });
      }

      // A card "settling" into place (scale + a slight shuffle tilt) — no
      // translateX, so it complements the swipe/scroll that already slid it in.
      _mediaSettle(el, dir) {
        if (this._reduced || !this.state.mobile || !el || !el.animate) return;
        __fx.anim(el, [
          { transform: 'scale(0.9) rotate(' + (dir * 3.5) + 'deg)', opacity: 0.45, offset: 0 },
          { transform: 'scale(1.025) rotate(' + (dir * -0.7) + 'deg)', opacity: 1, offset: 0.66 },
          { transform: 'none', opacity: 1, offset: 1 }
        ], { duration: 500, easing: 'cubic-bezier(0.2,0.7,0.2,1)' });
      }

      mediaPrev = () => this._mediaScroll(-1);
      mediaNext = () => this._mediaScroll(1);
      stopProp = (e) => { e.stopPropagation(); };

      selectNet = (e) => {
        var k = e.currentTarget.getAttribute('data-net');
        if (k && this._ents && this._ents[k] && k !== this.state.sel) {
          this.setState({ sel: k }, () => {
            this._applySel();
            this._mapFx(k);
            this._pulseChain(k);
          });
        }
      };

      nameClick = (e) => {
        // Placeholder title (no site yet) shouldn't navigate — just sit there.
        if (e.currentTarget.getAttribute('data-placeholder') === 'true') e.preventDefault();
      };

      netKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectNet(e);
        }
      };

      jump = (e) => {
        var id = e.currentTarget.getAttribute('data-target');
        var el = id ? document.getElementById(id) : null;
        if (el) {
          var y = el.getBoundingClientRect().top + (window.scrollY || 0);
          window.scrollTo({ top: y, behavior: this._reduced ? 'auto' : 'smooth' });
        }
      };

      toggleCounsel = () => this._toggle('counsel');
      toggleInvestor = () => this._toggle('investor');
      toggleVoice = () => this._toggle('voice');
      toggleFounder = () => this._toggle('founder');

      _toggle(key) {
        this._twStop();
        this._open = this._open === key ? null : key;
        var open = this._open;
        ['counsel', 'investor', 'voice', 'founder'].forEach((k) => {
          var p = document.getElementById('brief-' + k);
          var b = document.getElementById('btn-' + k);
          var ic = document.getElementById('ico-' + k);
          var is = open === k;
          if (p) p.style.gridTemplateRows = is ? '1fr' : '0fr';
          if (b) b.setAttribute('aria-expanded', is ? 'true' : 'false');
          if (ic) {
            ic.style.transform = is ? 'rotate(45deg)' : 'none';
            ic.style.color = is ? 'var(--accent)' : 'var(--ink2)';
            ic.style.borderColor = is ? 'var(--accent)' : 'var(--ink2)';
          }
        });
        if (open === 'voice' && !this._reduced) {
          var ws = document.querySelectorAll('#brief-voice [data-qw]');
          Array.prototype.forEach.call(ws, (w, i) => {
            if (w.animate) __fx.anim(w, 
              [{ transform: 'translateY(115%)' }, { transform: 'none' }],
              { duration: 460, delay: 160 + i * 42, easing: 'cubic-bezier(0.2,0.7,0.2,1)', fill: 'backwards' }
            );
          });
        }
        if (open) this._briefFx(open);
        if (this._refreshOffs) setTimeout(this._refreshOffs, 550);
      }

      _briefFx(key) {
        if (this._reduced) return;
        var mode = this.props.briefAnim || 'cascade';
        var pad = document.querySelector('#brief-' + key + ' > div > div');
        if (!pad || !pad.animate) return;
        var rows = Array.prototype.slice.call(pad.children);
        var ease = 'cubic-bezier(0.2,0.7,0.2,1)';
        if (mode === 'fold') {
          pad.style.transformOrigin = '50% 0';
          __fx.anim(pad, 
            [{ opacity: 0, transform: 'perspective(900px) rotateX(-14deg) translateY(-6px)', filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
            { duration: 560, delay: 90, easing: ease, fill: 'backwards' }
          );
        } else if (mode === 'wipe') {
          __fx.anim(pad, 
            [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
            { duration: 620, delay: 60, easing: ease, fill: 'backwards' }
          );
          rows.forEach((r, i) => {
            __fx.anim(r, 
              [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }],
              { duration: 420, delay: 140 + i * 55, easing: ease, fill: 'backwards' }
            );
          });
        } else if (mode === 'typeout') {
          this._twStart(pad);
        } else if (mode === 'redact') {
          rows.forEach((r, i) => {
            if (!r.animate) return;
            if (!r.style.position) r.style.position = 'relative';
            var bar = document.createElement('span');
            bar.setAttribute('aria-hidden', 'true');
            bar.style.cssText = 'position:absolute; inset:0; background:' + (i === 0 ? 'var(--accent)' : 'var(--ink)') + '; transform-origin:right; pointer-events:none; z-index:2;';
            r.appendChild(bar);
            var ba = __fx.anim(bar, 
              [{ transform: 'scaleX(1)' }, { transform: 'scaleX(1)', offset: 0.35 }, { transform: 'scaleX(0)' }],
              { duration: 640, delay: 120 + i * 110, easing: 'cubic-bezier(0.7,0,0.2,1)', fill: 'backwards' }
            );
            ba.onfinish = () => bar.remove();
          });
        } else if (mode === 'stamp') {
          rows.forEach((r, i) => {
            if (r.animate) __fx.anim(r, 
              [
                { opacity: 0, transform: 'scale(1.45) rotate(-3deg)', filter: 'blur(2px)' },
                { opacity: 1, transform: 'scale(0.98) rotate(0.4deg)', filter: 'blur(0)', offset: 0.7 },
                { opacity: 1, transform: 'none' }
              ],
              { duration: 460, delay: 140 + i * 130, easing: 'cubic-bezier(0.2,0.7,0.2,1)', fill: 'backwards' }
            );
          });
        } else {
          rows.forEach((r, i) => {
            __fx.anim(r, 
              [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
              { duration: 430, delay: 120 + i * 60, easing: ease, fill: 'backwards' }
            );
          });
        }
      }

      onSubmit = (e) => {
        e.preventDefault();
        var addr = this.props.contactEmail || 'peter@lemur.legal';
        var msgEl = document.getElementById('cf-message');
        var msg = msgEl ? msgEl.value.trim() : '';
        var subj = 'Website inquiry — ' + (this.state.topic || 'General');
        try { window.location.href = 'mailto:' + addr + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg); } catch (err) {}
        this.setState({ sent: true });
        var b = document.getElementById('contact-send');
        if (b && b.animate) {
          __fx.anim(b, 
            [{ transform: 'none' }, { transform: 'translateY(2px)' }, { transform: 'none' }],
            { duration: 200, easing: 'ease-out' }
          );
        }
      };

      pickTopic = (e) => {
        var t = e.currentTarget.getAttribute('data-topic') || '';
        this.setState({ topic: t }, () => this._applyChips());
        var ta = document.getElementById('cf-message');
        if (ta && (ta.value === '' || (ta.value.indexOf('Re: ') === 0 && ta.value.length < 64))) {
          ta.value = 'Re: ' + t + ' — ';
          ta.focus();
        }
      };

      _applyChips() {
        for (var i = 0; i < 5; i++) {
          var c = document.getElementById('chip-' + i);
          if (!c) continue;
          var is = (c.getAttribute('data-topic') || '') === this.state.topic;
          c.setAttribute('aria-pressed', is ? 'true' : 'false');
          c.style.color = is ? 'var(--accent)' : 'var(--ivory2)';
          c.style.borderBottomColor = is ? 'var(--accent)' : 'rgba(236,231,220,0.35)';
          c.style.borderBottomStyle = is ? 'solid' : 'dashed';
        }
        this._updateSignal();
      }

      airOn = () => {
        if (this._airT) { clearTimeout(this._airT); this._airT = null; }
        if (!this.state.onAir) this.setState({ onAir: true });
        var wg = document.getElementById('wave-g');
        var wp = document.getElementById('wave-path');
        if (wg) wg.style.animationDuration = '5.5s';
        if (wp) wp.style.opacity = '0.65';
      };

      airOff = () => {
        if (this._airT) clearTimeout(this._airT);
        this._airT = setTimeout(() => {
          this.setState({ onAir: false });
          var wg = document.getElementById('wave-g');
          var wp = document.getElementById('wave-path');
          if (wg) wg.style.animationDuration = '11s';
          if (wp) wp.style.opacity = '0.28';
        }, 160);
      };

      renderVals() {
        // Hints keyed by the stable ENGLISH topic key (= data-topic attr);
        // the hint text itself is localized.
        var hints = {};
        copy.contact.topics.forEach(function (t) { hints[t.key] = t.hint; });
        var on = (this.props.showChyron === undefined || this.props.showChyron === null) ? true : !!this.props.showChyron;
        var ents = this._ents || {};
        var sel = ents[this.state.sel] || { tag: '', name: '', role: '', desc: '', href: '' };
        var docket = this._docket || [];
        return {
          showNav: !this.state.mobile,
          barOn: on && this.state.bar,
          barLabel: this.state.label || copy.bar.fallbackLabel,
          barPart: this._pad(Math.max(0, this.state.part) + 1) + ' / 05',
          docketText: docket[this.state.docket] || copy.docket.items[0],
          docketIdx: this._pad(this.state.docket + 1) + ' / 08',
          dsRing: (this.props.docketStyle || 'ring') === 'ring',
          dsDial: (this.props.docketStyle || 'ring') === 'dial',
          dsRise: (this.props.docketStyle || 'ring') === 'rise',
          selTag: sel.tag,
          selName: sel.name,
          selRole: sel.role,
          selDesc: sel.desc,
          selHref: sel.href,
          hasLink: !!sel.href,
          sentNote: this.state.sent,
          onAir: this.state.onAir,
          isMobile: this.state.mobile,
          isDesktop: !this.state.mobile,
          mailSubject: 'Website inquiry — ' + (this.state.topic || 'General'),
          offAir: !this.state.onAir,
          msgHint: hints[this.state.topic] || copy.contact.msgHint,
          pickTopic: this.pickTopic,
          airOn: this.airOn,
          airOff: this.airOff,
          contactAddr: this.props.contactEmail || 'peter@lemur.legal',
          mediaPrev: this.mediaPrev,
          mediaNext: this.mediaNext,
          stopProp: this.stopProp,
          netPrev: this.netPrev,
          netNext: this.netNext,
          netIdx: this._pad((this._order || []).indexOf(this.state.sel) + 1) + ' / ' + this._pad((this._order || []).length),
          toggleCounsel: this.toggleCounsel,
          toggleInvestor: this.toggleInvestor,
          toggleVoice: this.toggleVoice,
          toggleFounder: this.toggleFounder,
          jump: this.jump,
          selectNet: this.selectNet,
          netKey: this.netKey,
          advanceDocket: this.advanceDocket,
          onSubmit: this.onSubmit
        };
      }
    }

    // ---- reactive binding sync (stands in for React re-render of {{ }} / <sc-if>) ----
    function __render(c) {
      const v = c.renderVals()
      document.querySelectorAll("[data-bind]").forEach(function (el) {
        const k = el.getAttribute("data-bind")
        if (k in v && el.textContent !== String(v[k])) el.textContent = v[k]
      })
      document.querySelectorAll("[data-bind-href]").forEach(function (el) {
        el.setAttribute("href", v[el.getAttribute("data-bind-href")] || "")
      })
      document.querySelectorAll("[data-bind-placeholder]").forEach(function (el) {
        el.setAttribute("placeholder", v[el.getAttribute("data-bind-placeholder")] || "")
      })
      document.querySelectorAll("[data-if]").forEach(function (el) {
        el.style.display = v[el.getAttribute("data-if")] ? "contents" : "none"
      })
    }

    // ---- generic event + pseudo-state wiring (stands in for sc-camel-on-* / style-hover) ----
    // NOTE: submit is intentionally NOT wired — form submit is the Web3Forms follow-up pass.
    // Scoped to the VIEW roots (main + progress bar) so chrome hovers, wired by
    // SiteChrome/Masthead, are not double-bound.
    const __EVMAP = { click: "click", keydown: "keydown", focus: "focusin", blur: "focusout" }
    // Only wire pointer-hover states where the primary input can actually hover.
    // On touch, `mouseenter` fires on tap but `mouseleave` never does, so a
    // data-hover background would stick to the tapped element (the grey artefact).
    const __canHover = (function () { try { return window.matchMedia("(hover: hover)").matches } catch (e) { return true } })()
    function __viewRoots() {
      return [document.getElementById("main"), document.querySelector("[data-if=\"barOn\"]")].filter(Boolean)
    }
    function __wire(c) {
      __viewRoots().forEach(function (root) {
        Object.keys(__EVMAP).forEach(function (kind) {
          root.querySelectorAll("[data-on-" + kind + "]").forEach(function (el) {
            const fn = c[el.getAttribute("data-on-" + kind)]
            if (typeof fn === "function") __fx.on(el, __EVMAP[kind], fn)
          })
        })
        if (__canHover) root.querySelectorAll("[data-hover]").forEach(function (el) {
          const hov = el.getAttribute("data-hover")
          __fx.on(el, "mouseenter", function () { el.__b = el.style.cssText; el.style.cssText = el.__b + ";" + hov })
          __fx.on(el, "mouseleave", function () { if (el.__b != null) el.style.cssText = el.__b })
        })
        root.querySelectorAll("[data-focus]").forEach(function (el) {
          const foc = el.getAttribute("data-focus")
          __fx.on(el, "focus", function () { el.__b = el.style.cssText; el.style.cssText = el.__b + ";" + foc })
          __fx.on(el, "blur", function () { if (el.__b != null) el.style.cssText = el.__b })
        })
      })
    }

    const __c = new Component()
    __wire(__c)
    __c.componentDidMount()
    __render(__c)
    __fx.onDispose(function () { try { __c.componentWillUnmount() } catch (e) {} })
  } catch (e) { console.error("[effects] init failed", e) }
  return __fx.dispose
}
