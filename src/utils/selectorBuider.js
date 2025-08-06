/**
 * DOM 要素に対してユニークで安定したセレクタを生成する。
 * セレクタの生成が難しい場合は XPath にフォールバックする。
 */
export function buildSelector(el, { preferCss = true } = {}) {
  if (preferCss) {
    const css = cssPath(el);
    if (isUniqueSelector(el, css)) return css;
  }
  return getXPath(el);
}

/**
 * 要素から CSS セレクタのパスを構築する。
 */
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

/**
 * 生成したセレクタが一意かどうかを判定する。
 */
function isUniqueSelector(el, selector) {
  try {
    const matches = el.ownerDocument.querySelectorAll(selector);
    return matches.length === 1 && matches[0] === el;
  } catch (_) {
    return false;
  }
}

/**
 * 再帰的に XPath を構築する。
 */
function getXPath(el) {
  if (el.id) return `//*[@id="${el.id}"]`;
  return (
    (el.parentNode ? getXPath(el.parentNode) : '') +
    '/' +
    el.localName.toLowerCase() +
    `[${[...el.parentNode.children].filter(c => c.localName === el.localName).indexOf(el) + 1}]`
  );
}
