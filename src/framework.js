
export const node = (tag, attrs, children) => {
  var node = attrs && attrs.ns ? document.createElementNS(attrs.ns, tag) : document.createElement(tag);
  if (children) {
    if (!Array.isArray(children)) {
      node.appendChild(
        typeof children === "string" || typeof children === "number"
          ? document.createTextNode("" + children)
          : children
      );
    } else {
      children.forEach(
        child =>
          child &&
          node.appendChild(
            typeof child === "string" || typeof child === "number"
              ? document.createTextNode("" + child)
              : child
          )
      );
    }
  }
  if (attrs && attrs.ref) {
    attrs.ref(node);
    delete attrs.ref;
  }
  for (var attr in attrs) {
    if (attr === 'ns') continue;
    if (attr === "style") {
      Object.assign(node.style, attrs[attr]);
    } else if (attr === "checked" || attr === "disabled" || attr === "value" || attr === 'textContent') {
      node[attr] = attrs[attr];
    } else if (typeof attrs[attr] === "function") {
      const fn = attrs[attr];
      node[attr] = evt => fn(evt, node);
    } else {
      node.setAttribute(attr, attrs[attr]);
    }
  }
  return node;
};

export const named = tag => (attrs, children) => node(tag, attrs, children);
export const div = named("div");
export const button = named("button");
export const img = named("img");
export const span = named("span");
export const a = named("a");
export const raw = text => {
  var node = document.createElement("div");
  node.innerHTML = text;
  return node;
};

export const render = (target, node) => {
  target.innerHTML = "";
  target.appendChild(node);
};
export const renderToBody = node => document.body.appendChild(node);
