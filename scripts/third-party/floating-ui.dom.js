!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports, require("@floating-ui/core"))
    : "function" == typeof define && define.amd
    ? define(["exports", "@floating-ui/core"], e)
    : e(
        ((t =
          "undefined" != typeof globalThis
            ? globalThis
            : t || self).FloatingUIDOM = {}),
        t.FloatingUICore
      );
})(this, function (t, e) {
  "use strict";
  const n = Math.min,
    o = Math.max,
    i = Math.round,
    r = Math.floor,
    c = (t) => ({ x: t, y: t });
  function l(t) {
    return u(t) ? (t.nodeName || "").toLowerCase() : "#document";
  }
  function s(t) {
    var e;
    return (
      (null == t || null == (e = t.ownerDocument) ? void 0 : e.defaultView) ||
      window
    );
  }
  function f(t) {
    var e;
    return null ==
      (e = (u(t) ? t.ownerDocument : t.document) || window.document)
      ? void 0
      : e.documentElement;
  }
  function u(t) {
    return t instanceof Node || t instanceof s(t).Node;
  }
  function a(t) {
    return t instanceof Element || t instanceof s(t).Element;
  }
  function d(t) {
    return t instanceof HTMLElement || t instanceof s(t).HTMLElement;
  }
  function h(t) {
    return (
      "undefined" != typeof ShadowRoot &&
      (t instanceof ShadowRoot || t instanceof s(t).ShadowRoot)
    );
  }
  function p(t) {
    const { overflow: e, overflowX: n, overflowY: o, display: i } = v(t);
    return (
      /auto|scroll|overlay|hidden|clip/.test(e + o + n) &&
      !["inline", "contents"].includes(i)
    );
  }
  function m(t) {
    return ["table", "td", "th"].includes(l(t));
  }
  function g(t) {
    const e = y(),
      n = v(t);
    return (
      "none" !== n.transform ||
      "none" !== n.perspective ||
      (!!n.containerType && "normal" !== n.containerType) ||
      (!e && !!n.backdropFilter && "none" !== n.backdropFilter) ||
      (!e && !!n.filter && "none" !== n.filter) ||
      ["transform", "perspective", "filter"].some((t) =>
        (n.willChange || "").includes(t)
      ) ||
      ["paint", "layout", "strict", "content"].some((t) =>
        (n.contain || "").includes(t)
      )
    );
  }
  function y() {
    return (
      !("undefined" == typeof CSS || !CSS.supports) &&
      CSS.supports("-webkit-backdrop-filter", "none")
    );
  }
  function w(t) {
    return ["html", "body", "#document"].includes(l(t));
  }
  function v(t) {
    return s(t).getComputedStyle(t);
  }
  function x(t) {
    return a(t)
      ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
      : { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
  }
  function b(t) {
    if ("html" === l(t)) return t;
    const e = t.assignedSlot || t.parentNode || (h(t) && t.host) || f(t);
    return h(e) ? e.host : e;
  }
  function T(t) {
    const e = b(t);
    return w(e)
      ? t.ownerDocument
        ? t.ownerDocument.body
        : t.body
      : d(e) && p(e)
      ? e
      : T(e);
  }
  function L(t, e, n) {
    var o;
    void 0 === e && (e = []), void 0 === n && (n = !0);
    const i = T(t),
      r = i === (null == (o = t.ownerDocument) ? void 0 : o.body),
      c = s(i);
    return r
      ? e.concat(
          c,
          c.visualViewport || [],
          p(i) ? i : [],
          c.frameElement && n ? L(c.frameElement) : []
        )
      : e.concat(i, L(i, [], n));
  }
  function R(t) {
    const e = v(t);
    let n = parseFloat(e.width) || 0,
      o = parseFloat(e.height) || 0;
    const r = d(t),
      c = r ? t.offsetWidth : n,
      l = r ? t.offsetHeight : o,
      s = i(n) !== c || i(o) !== l;
    return s && ((n = c), (o = l)), { width: n, height: o, $: s };
  }
  function E(t) {
    return a(t) ? t : t.contextElement;
  }
  function C(t) {
    const e = E(t);
    if (!d(e)) return c(1);
    const n = e.getBoundingClientRect(),
      { width: o, height: r, $: l } = R(e);
    let s = (l ? i(n.width) : n.width) / o,
      f = (l ? i(n.height) : n.height) / r;
    return (
      (s && Number.isFinite(s)) || (s = 1),
      (f && Number.isFinite(f)) || (f = 1),
      { x: s, y: f }
    );
  }
  const O = c(0);
  function S(t) {
    const e = s(t);
    return y() && e.visualViewport
      ? { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop }
      : O;
  }
  function F(t, n, o, i) {
    void 0 === n && (n = !1), void 0 === o && (o = !1);
    const r = t.getBoundingClientRect(),
      l = E(t);
    let f = c(1);
    n && (i ? a(i) && (f = C(i)) : (f = C(t)));
    const u = (function (t, e, n) {
      return void 0 === e && (e = !1), !(!n || (e && n !== s(t))) && e;
    })(l, o, i)
      ? S(l)
      : c(0);
    let d = (r.left + u.x) / f.x,
      h = (r.top + u.y) / f.y,
      p = r.width / f.x,
      m = r.height / f.y;
    if (l) {
      const t = s(l),
        e = i && a(i) ? s(i) : i;
      let n = t,
        o = n.frameElement;
      for (; o && i && e !== n; ) {
        const t = C(o),
          e = o.getBoundingClientRect(),
          i = v(o),
          r = e.left + (o.clientLeft + parseFloat(i.paddingLeft)) * t.x,
          c = e.top + (o.clientTop + parseFloat(i.paddingTop)) * t.y;
        (d *= t.x),
          (h *= t.y),
          (p *= t.x),
          (m *= t.y),
          (d += r),
          (h += c),
          (n = s(o)),
          (o = n.frameElement);
      }
    }
    return e.rectToClientRect({ width: p, height: m, x: d, y: h });
  }
  const D = [":popover-open", ":modal"];
  function P(t) {
    return D.some((e) => {
      try {
        return t.matches(e);
      } catch (t) {
        return !1;
      }
    });
  }
  function H(t) {
    return F(f(t)).left + x(t).scrollLeft;
  }
  function W(t, n, i) {
    let r;
    if ("viewport" === n)
      r = (function (t, e) {
        const n = s(t),
          o = f(t),
          i = n.visualViewport;
        let r = o.clientWidth,
          c = o.clientHeight,
          l = 0,
          u = 0;
        if (i) {
          (r = i.width), (c = i.height);
          const t = y();
          (!t || (t && "fixed" === e)) &&
            ((l = i.offsetLeft), (u = i.offsetTop));
        }
        return { width: r, height: c, x: l, y: u };
      })(t, i);
    else if ("document" === n)
      r = (function (t) {
        const e = f(t),
          n = x(t),
          i = t.ownerDocument.body,
          r = o(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth),
          c = o(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
        let l = -n.scrollLeft + H(t);
        const s = -n.scrollTop;
        return (
          "rtl" === v(i).direction &&
            (l += o(e.clientWidth, i.clientWidth) - r),
          { width: r, height: c, x: l, y: s }
        );
      })(f(t));
    else if (a(n))
      r = (function (t, e) {
        const n = F(t, !0, "fixed" === e),
          o = n.top + t.clientTop,
          i = n.left + t.clientLeft,
          r = d(t) ? C(t) : c(1);
        return {
          width: t.clientWidth * r.x,
          height: t.clientHeight * r.y,
          x: i * r.x,
          y: o * r.y,
        };
      })(n, i);
    else {
      const e = S(t);
      r = { ...n, x: n.x - e.x, y: n.y - e.y };
    }
    return e.rectToClientRect(r);
  }
  function M(t, e) {
    const n = b(t);
    return (
      !(n === e || !a(n) || w(n)) && ("fixed" === v(n).position || M(n, e))
    );
  }
  function z(t, e, n) {
    const o = d(e),
      i = f(e),
      r = "fixed" === n,
      s = F(t, !0, r, e);
    let u = { scrollLeft: 0, scrollTop: 0 };
    const a = c(0);
    if (o || (!o && !r))
      if ((("body" !== l(e) || p(i)) && (u = x(e)), o)) {
        const t = F(e, !0, r, e);
        (a.x = t.x + e.clientLeft), (a.y = t.y + e.clientTop);
      } else i && (a.x = H(i));
    return {
      x: s.left + u.scrollLeft - a.x,
      y: s.top + u.scrollTop - a.y,
      width: s.width,
      height: s.height,
    };
  }
  function A(t, e) {
    return d(t) && "fixed" !== v(t).position
      ? e
        ? e(t)
        : t.offsetParent
      : null;
  }
  function V(t, e) {
    const n = s(t);
    if (!d(t) || P(t)) return n;
    let o = A(t, e);
    for (; o && m(o) && "static" === v(o).position; ) o = A(o, e);
    return o &&
      ("html" === l(o) ||
        ("body" === l(o) && "static" === v(o).position && !g(o)))
      ? n
      : o ||
          (function (t) {
            let e = b(t);
            for (; d(e) && !w(e); ) {
              if (g(e)) return e;
              e = b(e);
            }
            return null;
          })(t) ||
          n;
  }
  const N = {
    convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
      let { elements: e, rect: n, offsetParent: o, strategy: i } = t;
      const r = "fixed" === i,
        s = f(o),
        u = !!e && P(e.floating);
      if (o === s || (u && r)) return n;
      let a = { scrollLeft: 0, scrollTop: 0 },
        h = c(1);
      const m = c(0),
        g = d(o);
      if (
        (g || (!g && !r)) &&
        (("body" !== l(o) || p(s)) && (a = x(o)), d(o))
      ) {
        const t = F(o);
        (h = C(o)), (m.x = t.x + o.clientLeft), (m.y = t.y + o.clientTop);
      }
      return {
        width: n.width * h.x,
        height: n.height * h.y,
        x: n.x * h.x - a.scrollLeft * h.x + m.x,
        y: n.y * h.y - a.scrollTop * h.y + m.y,
      };
    },
    getDocumentElement: f,
    getClippingRect: function (t) {
      let { element: e, boundary: i, rootBoundary: r, strategy: c } = t;
      const s = [
          ...("clippingAncestors" === i
            ? (function (t, e) {
                const n = e.get(t);
                if (n) return n;
                let o = L(t, [], !1).filter((t) => a(t) && "body" !== l(t)),
                  i = null;
                const r = "fixed" === v(t).position;
                let c = r ? b(t) : t;
                for (; a(c) && !w(c); ) {
                  const e = v(c),
                    n = g(c);
                  n || "fixed" !== e.position || (i = null),
                    (
                      r
                        ? !n && !i
                        : (!n &&
                            "static" === e.position &&
                            i &&
                            ["absolute", "fixed"].includes(i.position)) ||
                          (p(c) && !n && M(t, c))
                    )
                      ? (o = o.filter((t) => t !== c))
                      : (i = e),
                    (c = b(c));
                }
                return e.set(t, o), o;
              })(e, this._c)
            : [].concat(i)),
          r,
        ],
        f = s[0],
        u = s.reduce((t, i) => {
          const r = W(e, i, c);
          return (
            (t.top = o(r.top, t.top)),
            (t.right = n(r.right, t.right)),
            (t.bottom = n(r.bottom, t.bottom)),
            (t.left = o(r.left, t.left)),
            t
          );
        }, W(e, f, c));
      return {
        width: u.right - u.left,
        height: u.bottom - u.top,
        x: u.left,
        y: u.top,
      };
    },
    getOffsetParent: V,
    getElementRects: async function (t) {
      const e = this.getOffsetParent || V,
        n = this.getDimensions;
      return {
        reference: z(t.reference, await e(t.floating), t.strategy),
        floating: { x: 0, y: 0, ...(await n(t.floating)) },
      };
    },
    getClientRects: function (t) {
      return Array.from(t.getClientRects());
    },
    getDimensions: function (t) {
      const { width: e, height: n } = R(t);
      return { width: e, height: n };
    },
    getScale: C,
    isElement: a,
    isRTL: function (t) {
      return "rtl" === v(t).direction;
    },
  };
  const B = e.autoPlacement,
    I = e.shift,
    k = e.flip,
    j = e.size,
    q = e.hide,
    U = e.arrow,
    X = e.inline,
    Y = e.limitShift;
  Object.defineProperty(t, "detectOverflow", {
    enumerable: !0,
    get: function () {
      return e.detectOverflow;
    },
  }),
    Object.defineProperty(t, "offset", {
      enumerable: !0,
      get: function () {
        return e.offset;
      },
    }),
    (t.arrow = U),
    (t.autoPlacement = B),
    (t.autoUpdate = function (t, e, i, c) {
      void 0 === c && (c = {});
      const {
          ancestorScroll: l = !0,
          ancestorResize: s = !0,
          elementResize: u = "function" == typeof ResizeObserver,
          layoutShift: a = "function" == typeof IntersectionObserver,
          animationFrame: d = !1,
        } = c,
        h = E(t),
        p = l || s ? [...(h ? L(h) : []), ...L(e)] : [];
      p.forEach((t) => {
        l && t.addEventListener("scroll", i, { passive: !0 }),
          s && t.addEventListener("resize", i);
      });
      const m =
        h && a
          ? (function (t, e) {
              let i,
                c = null;
              const l = f(t);
              function s() {
                var t;
                clearTimeout(i), null == (t = c) || t.disconnect(), (c = null);
              }
              return (
                (function f(u, a) {
                  void 0 === u && (u = !1), void 0 === a && (a = 1), s();
                  const {
                    left: d,
                    top: h,
                    width: p,
                    height: m,
                  } = t.getBoundingClientRect();
                  if ((u || e(), !p || !m)) return;
                  const g = {
                    rootMargin:
                      -r(h) +
                      "px " +
                      -r(l.clientWidth - (d + p)) +
                      "px " +
                      -r(l.clientHeight - (h + m)) +
                      "px " +
                      -r(d) +
                      "px",
                    threshold: o(0, n(1, a)) || 1,
                  };
                  let y = !0;
                  function w(t) {
                    const e = t[0].intersectionRatio;
                    if (e !== a) {
                      if (!y) return f();
                      e
                        ? f(!1, e)
                        : (i = setTimeout(() => {
                            f(!1, 1e-7);
                          }, 100));
                    }
                    y = !1;
                  }
                  try {
                    c = new IntersectionObserver(w, {
                      ...g,
                      root: l.ownerDocument,
                    });
                  } catch (t) {
                    c = new IntersectionObserver(w, g);
                  }
                  c.observe(t);
                })(!0),
                s
              );
            })(h, i)
          : null;
      let g,
        y = -1,
        w = null;
      u &&
        ((w = new ResizeObserver((t) => {
          let [n] = t;
          n &&
            n.target === h &&
            w &&
            (w.unobserve(e),
            cancelAnimationFrame(y),
            (y = requestAnimationFrame(() => {
              var t;
              null == (t = w) || t.observe(e);
            }))),
            i();
        })),
        h && !d && w.observe(h),
        w.observe(e));
      let v = d ? F(t) : null;
      return (
        d &&
          (function e() {
            const n = F(t);
            !v ||
              (n.x === v.x &&
                n.y === v.y &&
                n.width === v.width &&
                n.height === v.height) ||
              i();
            (v = n), (g = requestAnimationFrame(e));
          })(),
        i(),
        () => {
          var t;
          p.forEach((t) => {
            l && t.removeEventListener("scroll", i),
              s && t.removeEventListener("resize", i);
          }),
            null == m || m(),
            null == (t = w) || t.disconnect(),
            (w = null),
            d && cancelAnimationFrame(g);
        }
      );
    }),
    (t.computePosition = (t, n, o) => {
      const i = new Map(),
        r = { platform: N, ...o },
        c = { ...r.platform, _c: i };
      return e.computePosition(t, n, { ...r, platform: c });
    }),
    (t.flip = k),
    (t.getOverflowAncestors = L),
    (t.hide = q),
    (t.inline = X),
    (t.limitShift = Y),
    (t.platform = N),
    (t.shift = I),
    (t.size = j);
});
