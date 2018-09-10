import { render, node, div, img } from "./framework.js";

const svgns = 'http://www.w3.org/2000/svg'
const svgNode = (tag, attrs, children) => node(tag, {...attrs, ns: svgns}, children)

const arc = (cx, cy, t0, t1, r) => {
  const x0 = cx + Math.cos(t0) * r;
  const y0 = cy + Math.sin(t0) * r;
  const x1 = cx + Math.cos(t1) * r;
  const y1 = cy + Math.sin(t1) * r;
  return `${x0} ${y0} A ${r} ${r} ${t1 - t0} 1 1 ${x1} ${y1}`
};

const t0 = Math.PI / 2 + Math.PI / 4
const t1 = Math.PI / 2 - Math.PI / 4

const times = (cx, cy, r, start, end, increments) => {
  const span = end - start
  const lines = span / increments + 1
  const items = []
  for (let y = 1; y <= lines; y+=1) {
    const year = end - increments * (y - 1)
    const rad = 20 + (r - 20) * ((y ) / (lines ))
    items.push(svgNode('path', {
      d: 'M' + arc(cx, cy, t0, t1, rad),
      style: {
        fill: 'none',
        stroke: 'red',
      }
    }))
    items.push(svgNode('text', {
      textContent: year + '',
      x: cx - 7,
      y: cy - rad + 7
    }))
  }
  return svgNode('g', {}, items)
}

const renderPage = () => {
  return div(
    null,
    [
      svgNode('svg', {
        width: 1100,
        height: 850
      }, [
          svgNode('path', {
            d: `M500 500 L` + arc(500, 500, Math.PI / 2 + Math.PI / 4, Math.PI / 2 + -Math.PI / 4, 300) + 'Z',
            style: {
              stroke: 'blue',
              fill: 'none'
            }
          }),
          times(500, 500, 500, 1760, 1980, 20),
        ])
    ]
  )
}

render(
  document.getElementById("main"),
  renderPage()
);