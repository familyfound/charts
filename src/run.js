import { render, node, div, img } from "./framework.js";
import {people, peopleList, mother, father} from './tree.js';

const svgns = 'http://www.w3.org/2000/svg'
const svgNode = (tag, attrs, children) => node(tag, {...attrs, ns: svgns}, children)

const arc = (cx, cy, t0, t1, r, sub=1, other=1) => {
  const x0 = cx + Math.cos(t0) * r;
  const y0 = cy + Math.sin(t0) * r;
  const x1 = cx + Math.cos(t1) * r;
  const y1 = cy + Math.sin(t1) * r;
  return `${x0} ${y0} A ${r} ${r} ${t1 - t0} ${sub} ${other} ${x1} ${y1}`
};

const t0 = Math.PI / 2 + Math.PI / 4
const t1 = Math.PI / 2 - Math.PI / 4

const times = (cx, cy, r, start, end, increments) => {
  const span = end - start
  const lines = span / increments
  const items = []
  for (let y = 0; y <= lines; y+=1) {
    const year = end - increments * (y )
    const rad = r * ((y ) / (lines ))
    items.push(svgNode('path', {
      d: 'M' + arc(cx, cy, t0, t1, rad),
      style: {
        fill: 'none',
        stroke: 'red',
        strokeDasharray: y % 2 == 0 ? '1 4' : '1 8',
      }
    }))
    items.push(svgNode('text', {
      textContent: year + '',
      x: cx - 7,
      y: cy - rad + 7
    }))
    let r0 = rad;
    let r1 = r;
    let radials = Math.pow(2, y)
    const th0 = t0;
    const th1 = t1 + Math.PI * 2;
    if (y <= 5 && y > 1) {

      for (let t = 0; t < radials; t++) {
        if (t % 2 == 0) {
          continue
        }
        const theta = th1 + (th0 - th1) * t / radials
        items.push(svgNode('path', {
          d: `M${
          cx + Math.cos(theta) * r0
          } ${
          cy + Math.sin(theta) * r0
          } L ${
          cx + Math.cos(theta) * r
          } ${
          cy + Math.sin(theta) * r
          }`,
          style: {
            stroke: 'blue',
            strokeDasharray: '1 8',
          }

        }))
      }
    }
  }
  return svgNode('g', {}, items)
}

// const radials = (cx, cy, r, start, end, increments)

const minDate = 1760
const maxDate = 2010
const center = {x: 550, y: 500};
const radius = 500;

const timeRad = time => (radius ) * Math.max(0, (maxDate - time)) / (maxDate - minDate);

const intOr = (n, backup, full) => {
  const i = parseInt(n);
  if (isNaN(i)) {
    console.log('dropping', n, full)
    return backup
  }
  return i
}

const parseLife = span => {
  const [birth, death] = span.split('-')
  return {
    birth: intOr(birth, minDate, span),
    death: intOr(death, maxDate, span)
  }
};

const genColors = [
  {r: 100, g: 255, b: 255},
  {r: 255, g: 100, b: 255},
  {r: 76, g: 118, b: 80},
  {r: 100, g: 100, b: 255},
  {r: 255, g: 118, b: 41},
]

const renderPerson = (pid) => {
  const person = people[pid];
  if (!person) return [];
  const gen = Math.floor(Math.log2(pid));
  const count = Math.pow(2, gen);
  const pos = pid - count;
  const percent = pos / count;
  if (person.lifespan.includes('Deceased') || person.lifespan === 'Living') {
    // return [...renderPeople(pid * 2), ...renderPeople(pid * 2 + 1)]
    return
  }
  const {birth, death} = parseLife(person.lifespan);
  const r0 = timeRad(birth);
  const r1 = timeRad(death);
  const t0 = Math.PI / 2 + Math.PI / 4
  const tDiff = Math.PI * 6 / 4;
  const tStart = t0 + tDiff * (pos / count);
  const tEnd = t0 + tDiff * ((pos + 1) / count);
  const color = genColors[gen % genColors.length];
  console.log(tStart, tEnd)
  const me = svgNode('path', {
    d: `M` + arc(center.x, center.y, tStart, tEnd, r0, 0)
     + ' L ' + arc(center.x, center.y, tEnd, tStart, r1, 0, 0)
     + ' Z ',
    style: {
      fill: `rgba(${color.r},${color.g},${color.b},0.4)`,
              // fill: 'none',
      stroke: '#fff',
    },
    onmouseover: (evt, node) => {
      node.style.strokeWidth = '10px'
      node.style.stroke = '#000'
      console.log(person.name)

    },
    onmouseout: (evt, node) => {
      node.style.strokeWidth = '1px'
      node.style.stroke = '#fff'
    }
  })
  return me
  // return [...renderPeople(pid * 2), ...renderPeople(pid * 2 + 1), me]
};

const renderPeople = () => {
  return peopleList.map(person => {
    const num = parseInt(person.ascendancyNumber)
    if (isNaN(num)) {
      return
    }
    return renderPerson(num)
  }).reverse()
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
            d: `M550 500 L` + arc(550, 500, Math.PI / 2 + Math.PI / 4, Math.PI / 2 + -Math.PI / 4, 500) + 'Z',
            style: {
              stroke: '#000',
              fill: 'none'
            }
          }),
          times(center.x, center.y, radius, minDate, maxDate, 20),
          ...renderPeople(1),
        ]),
    ]
  )
}

render(
  document.getElementById("main"),
  renderPage()
);