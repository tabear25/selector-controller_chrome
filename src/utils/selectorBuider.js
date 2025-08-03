/**
 * Build a unique & stable CSS selector for a DOM element.
 * Falls back to XPath when a safe CSS path is impossible (e.g. in SVG or selector‑hostile markup).
 */
export function buildSelector(el, { preferCss = true } = {}) {
  if (preferCss) {
    const css = cssPath(el);
    if (isUniqueSelector(el, css)) return css;
  }
  return getXPath(el);
}

function cssPath(el) {
  if (el.id) return `#${CSS.escape(el.id)}`;
  const path = [];
  while (el && el.nodeType === Node.ELEMENT_NODE && el.localName !== 'html') {
    let selector = el.localName.toLowerCase();
    if (el.classList.length) selector += `.${[...el.classList].map(c => CSS.escape(c)).join('.')}`;
    const sameTagSiblings = [...el.parentNode.children].filter(n => n.localName === el.localName);
    if (sameTagSiblings.length > 1) {
      selector += `:nth-of-type(${sameTagSiblings.indexOf(el) + 1})`;
    }
    path.unshift(selector);
    el = el.parentNode;
  }
  return path.join(' > ');
}

function isUniqueSelector(el, selector) {
  try {
    const matches = el.ownerDocument.querySelectorAll(selector);
    return matches.length === 1 && matches[0] === el;
  } catch (_) {
    return false;
  }
}

function getXPath(el) {
  if (el.id) return `//*[@id="${el.id}"]`;
  return (
    (el.parentNode ? getXPath(el.parentNode) : '') +
    '/' +
    el.localName.toLowerCase() +
    `[${[...el.parentNode.children].filter(c => c.localName === el.localName).indexOf(el) + 1}]`
  );
}