import { node, div, span, a, raw, renderToBody } from "./framework.js";

export const textarea = (name, value, style, textareaProps, className) => {
  const recalc = evt => {
    shadow.textContent = n.value.trim() ? n.value + " " : "M";
    const style = window.getComputedStyle(shadow);
    n.style.height = style.height;
  };

  const n = node("textarea", {
    name,
    value: value || "",
    // onkeyup: recalc,
    // onkeydown: () => setTimeout(recalc, 0),
    // onkeypress: () => setTimeout(recalc, 0),
    // onkeyrelease: recalc,
    // onchange: recalc,
    oninput: recalc,
    class: className,
    ...textareaProps
  });
  const shadow = div(
    {
      style: {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        position: "absolute",
        width: "100%",
        padding: "4px 8px",
        border: "1px solid black",
        top: 0,
        left: 0,
        visibility: "hidden"
      },
      class: className
    },
    value && value.trim() ? value + " " : "M"
  );

  setTimeout(() => recalc(), 10);
  // window.addEventListener('resize', this.resize)
  return div({ class: className, style: { ...style, position: "relative" } }, [
    n,
    shadow
  ]);
};

// render() {
//   const {onHeightChange, ...props} = this.props
//   return (
//     <div className={css(styles.container)}>
//       <textarea
//         {...props}
//         ref={n => (this.textarea = n)}
//         className={css(styles.textarea) + ' ' + this.props.className}
//       />
//       <div
//         ref={n => (this.shadow = n)}
//         className={css(styles.shadow) + ' ' + this.props.className}
//       >
//         {this.props.value.trim()
//           ? this.props.value + ' '
//           : 'M'}
//       </div>
//     </div>
//   )
// }
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     cursor: "text",
//     flex: 1
//   },

//   textarea: {
//     cursor: "text",
//     width: "100%",
//     resize: "none",
//     overflow: "hidden"
//   },

//   shadow: {
//     whiteSpace: "pre-wrap",
//     position: "absolute",
//     width: "100%",
//     top: 0,
//     left: 0,
//     visibility: "hidden"
//   }
// });

// css(styles.container);
// css(styles.textarea);
// css(styles.shadow);
