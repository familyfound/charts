import { render, node, div, img } from "./framework.js";
import {people, peopleList, mother, father} from './tree.js';

const tweaks = {
  headDot: false,
  headDotSize: 4,
  footDot: false,
  footDotSize: 2,
  dotOpacity: 0.9,
  line: false,
  lineWidth: 4,
  lineOpacity: 0.9,
  arc: true,
  arcOpacity: 0.4,
};

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
  for (let y = 1; y <= lines; y+=1) {
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
  let [birth, death] = span.split('-')
  birth = intOr(birth, null, span);
  if (!birth) return
  return {
    birth,
    death: death === 'Living' ? maxDate - 5 : Math.min(maxDate - 5, intOr(death, birth + 80, span))
  }
};

const genColors = [
  {r: 100, g: 255, b: 255},
  {r: 255, g: 100, b: 255},
  {r: 76, g: 118, b: 80},
  {r: 100, g: 100, b: 255},
  {r: 255, g: 118, b: 41},
]
// genColors.splice(0, genColors.length)

// const colorsRaw = '8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f';
const colorsRaw = '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf';
const colors = [];
for (let i=0; i<colorsRaw.length; i+=6) {
  genColors.push({
    r: parseInt(colorsRaw.slice(i, i+2), 16),
    g: parseInt(colorsRaw.slice(i+2, i+4), 16),
    b: parseInt(colorsRaw.slice(i+4, i+6), 16),
  })
}

const renderPerson = (pid, showHover, hideHover) => {
  const person = people[pid];
  if (!person) return [];
  const gen = Math.floor(Math.log2(pid));
  const count = Math.pow(2, gen);
  const pos = pid - count;
  const percent = pos / count;
  if (person.lifespan === 'Living') {
    return
  }
  // if (person.lifespan.includes('Deceased') || person.lifespan === 'Living') {
  //   // return [...renderPeople(pid * 2), ...renderPeople(pid * 2 + 1)]
  //   return console.log(person.name, person.lifespan)
  // }
  const lifeSpan = parseLife(person.lifespan);
  if (!lifeSpan) {
    return console.log(person.name, person.lifespan)
  }
  const {birth, death} = lifeSpan
  const r0 = timeRad(birth);
  const r1 = timeRad(death);
  const t0 = Math.PI / 2 + Math.PI / 4
  const tDiff = Math.PI * 6 / 4;
  // const tStart = t0 + tDiff * (pos / count);
  // const tEnd = t0 + tDiff * ((pos + 1) / count);
  const color = genColors[gen % genColors.length];

  const maxWidth = 30;
  const maxArc = maxWidth / r0;

  const tMid = t0 + tDiff * ((pos + 0.5) / count);
  // const tOff = pid === 1 ? tDiff * 0.5 / count : Math.min(maxArc, tDiff * 0.5 / count);
  const tOff0 = tDiff * 0.5 / count - 2 / r0;
  const tOff1 = tDiff * 0.5 / count - 2 / r1;

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
    tweaks.arc && svgNode('path', {
      d: `M` + arc(center.x, center.y, tMid - tOff0, tMid + tOff0, r0, pid === 1 ? 1 : 0)
      + ' L ' + arc(center.x, center.y, tMid + tOff1, tMid - tOff1, r1, 0, 0)
      + ' Z ',
      style: {
        fill: `rgba(${color.r},${color.g},${color.b},${tweaks.arcOpacity})`,
        // stroke: '#fff',
      },
    }),
    tweaks.headDot && svgNode('circle', {
      cx: center.x + Math.cos(tMid) * r0,
      cy: center.y + Math.sin(tMid) * r0,
      r: tweaks.headDotSize,
      style: {
        fill: `rgba(${color.r},${color.g},${color.b},${tweaks.dotOpacity})`,
      }
    }),
    tweaks.footDot && svgNode('circle', {
      cx: center.x + Math.cos(tMid) * r1,
      cy: center.y + Math.sin(tMid) * r1,
      r: tweaks.footDotSize,
      style: {
        fill: `rgba(${color.r},${color.g},${color.b},${tweaks.dotOpacity})`,
      }
    }),
    tweaks.line && svgNode('path', {
      d: `M ${center.x + Math.cos(tMid) * r0} ${center.y + Math.sin(tMid) * r0}`
      + ` L ${center.x + Math.cos(tMid) * r1} ${center.y + Math.sin(tMid) * r1}`,
      style: {
        stroke: `rgba(${color.r},${color.g},${color.b},${tweaks.lineOpacity})`,
        strokeWidth: tweaks.lineWidth + 'px'
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

const tweakBody = (onChange, key) => {
  const v = tweaks[key];
  switch (typeof v) {
    case 'boolean':
      return node('input', {type: 'checkbox', checked: v, onchange: () => {
        tweaks[key] = !v
        onChange();
      }})
    case 'number':
      return node('input', {style: {width: '40px'}, type: 'number', value: v, onchange: (evt) => {
        tweaks[key] = parseFloat(evt.target.value)
        onChange();
      }})
    default:
      return null
  }
}

const renderTweaks = (onChange) => {
  console.log('rendering')
  return div({}, Object.keys(tweaks).map(key => {
    return div({
    }, [
      key,
      tweakBody(onChange, key)
    ])
  }))
}

const rerenderable = (fn) => {
  let node = null;
  let rerender = () => {
    let newNode = fn(rerender);
    if (node && node.parentNode) {
      node.replaceWith(newNode)
    }
    node = newNode
  }
  let newNode = fn(rerender)
  if (node != null) {
    // we rerendered synchronously
    return node
  }
  node = newNode;
  return node;
}

const renderWithTweaks = (render) => rerenderable(rerender => 
  div({}, [
    renderTweaks(rerender),
    render(),
  ])
);

render(
  document.getElementById("main"),
  renderWithTweaks(renderPage)
);