import { node, div, span, a, raw, renderToBody } from "./framework.js";
import { colors, styles } from "./consts.js";

const toast = message => {
  const fadeOut = () => {
    n.style.opacity = 0;
    setTimeout(() => {
      n.remove();
    }, 100);
  };
  const n = div(
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        pointerEvents: "box-none",
        transition: ".3s ease opacity"
      }
    },
    [
      div(
        {
          style: {
            backgroundColor: "white",
            border: "4px solid " + colors.label,
            boxShadow: "0 0 3px " + colors.hairline,
            padding: "16px 32px",
            fontSize: "1.3em",
            pointer: "cursor"
          },
          onclick: () => {
            fadeOut();
          }
        },
        [message]
      )
    ]
  );
  setTimeout(fadeOut, 1000);
  renderToBody(n);
};

export default toast;
