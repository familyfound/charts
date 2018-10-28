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
    items.push(svgNode('g', {
      class: 'time-line',
    }, [svgNode('path', {
      d: 'M' + arc(cx, cy, t0, t1, rad),
      style: {
        fill: 'none',
        stroke: 'red',
        strokeDasharray: y % 2 == 0 ? '1 4' : '1 8',
      }
    }),
    svgNode('text', {
      textContent: year + '',
      x: cx + Math.cos(t0) * rad + 7,
      y: cy + Math.sin(t0) * rad + 7
    })]))
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

const renderPerson = (pid, showHover, hideHover) => {
  const person = people[pid];
  if (!person) return [];
  const gen = Math.floor(Math.log2(pid));
  const count = Math.pow(2, gen);
  const pos = pid - count;
  const percent = pos / count;
  if (person.lifespan.includes('Deceased') || person.lifespan === 'Living') {
    // return [...renderPeople(pid * 2), ...renderPeople(pid * 2 + 1)]
    return console.log(person.name)
  }
  const {birth, death} = parseLife(person.lifespan);
  const r0 = timeRad(birth);
  const r1 = timeRad(death);
  const t0 = Math.PI / 2 + Math.PI / 4
  const tDiff = Math.PI * 6 / 4;
  const tStart = t0 + tDiff * (pos / count);
  const tEnd = t0 + tDiff * ((pos + 1) / count);
  const color = genColors[gen % genColors.length];
  const me = svgNode('g', {
    class: 'person',
    onmousemove: (evt, node) => {
      node.setAttribute('class', 'person-hover')
      showHover({x: evt.clientX, y: evt.clientY}, person)
    },
    onmouseout: (evt, node) => {
      node.setAttribute('class', 'person')
      hideHover()
    }
  }, [
    svgNode('path', {
      d: `M` + arc(center.x, center.y, tStart, tEnd, r0, pid === 1 ? 1 : 0)
      + ' L ' + arc(center.x, center.y, tEnd, tStart, r1, 0, 0)
      + ' Z ',
      style: {
        fill: `rgba(${color.r},${color.g},${color.b},0.4)`,
        // stroke: '#fff',
      },
    })
  ])
  return me
};

const renderPeople = (showHover, hideHover) => {
  return peopleList.map(person => {
    const num = parseInt(person.ascendancyNumber)
    if (isNaN(num)) {
      return
    }
    return renderPerson(num, showHover, hideHover)
  }).reverse()
}

const renderPage = () => {
  let hover;
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
          ...renderPeople((pos, person) => {
            hover.style.display = 'block'
            hover.style.top = pos.y + 15 + 'px'
            hover.style.left = pos.x + 15 + 'px'
            render(hover, div({}, [
              div({}, person.name),
              div({}, person.lifespan),
              div({}, person.birthPlace),
              div({}, person.deathPlace),
            ]))
          }, () => {
            hover.style.display = 'none'
          }),
          times(center.x, center.y, radius, minDate, maxDate, 20),
        ]),
      div({
        class: 'hover',
        ref: node => hover = node,
      })
    ]
  )
}

render(
  document.getElementById("main"),
  renderPage()
);