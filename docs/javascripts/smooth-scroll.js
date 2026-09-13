/* Smooth scrolling for jumps within a page: the back-to-top button, the two
 * buttons in the home page hero, the table of contents, and the ¶ permalinks
 * next to headings.
 *
 * Setting `scroll-behavior: smooth` in the stylesheet would cover all of those
 * in one line, but it would also catch the jump back to the top that instant
 * navigation performs on every page change, and animating that looks broken on
 * a long page. So the property is switched on for the length of a click and
 * then taken away again. The theme still does the scrolling itself, exactly as
 * it did before.
 */
(function () {
  if (window.__msSmoothScroll) {
    return
  }
  window.__msSmoothScroll = true

  var root = document.documentElement
  var timer = null

  function smoothForAMoment() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    root.style.scrollBehavior = "smooth"
    clearTimeout(timer)
    timer = setTimeout(function () {
      root.style.scrollBehavior = ""
    }, 1500)
  }

  /* True for a link pointing at a heading on the page we are already on. The
   * resolved href is compared rather than the attribute, because instant
   * navigation rewrites relative URLs when it swaps a page in. */
  function isSamePageAnchor(el) {
    var link = el.closest("a[href]")
    if (!link || link.target) {
      return false
    }
    var url = new URL(link.href, location.href)
    return url.origin === location.origin &&
      url.pathname === location.pathname &&
      url.hash.length > 1
  }

  document.addEventListener("click", function (ev) {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey) {
      return
    }
    if (!(ev.target instanceof Element)) {
      return
    }
    if (ev.target.closest("[data-md-component=top]") || isSamePageAnchor(ev.target)) {
      smoothForAMoment()
    }
  }, true)
})()
