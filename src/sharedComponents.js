import { node, div, span, a, raw, renderToBody } from "./framework.js";
import { colors, styles } from "./consts.js";

export const makeUrl = (id, search) =>
  "?" +
  (id || "search") +
  Object.keys(search)
    .map(k => `&${k}=${encodeURIComponent(search[k])}`)
    .join("");

export const spacer = n =>
  div({ style: { width: n + "px", height: n + "px" } });
export const hairline = () =>
  div({ style: { height: "1px", backgroundColor: colors.hairline } });

export const interleave = (items, fn) =>
  items.reduce(
    (items, item, i) => (i === 0 ? [item] : [...items, fn(i), item]),
    []
  );

export const navigate = url => {
  if (window.onbeforeunload) {
    if (!confirm(window.onbeforeunload({}))) {
      return;
    }
    window.onbeforeunload = false;
  }
  window.navigate(url);
};

export const loading = somePrommise => {
  const n = node(
    "div",
    {
      style: {
        textAlign: "center",
        padding: "16px",
        color: "#aaa"
      }
    },
    ["Loading..."]
  );
  somePrommise
    .then(result => {
      if (!result) {
        n.remove();
      } else {
        n.replaceWith(result);
      }
    })
    .catch(err => {
      console.error(err);
      debugger;
    });
  return n;
};
