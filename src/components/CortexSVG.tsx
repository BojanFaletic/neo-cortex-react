import React, { useEffect, useRef } from 'react'
import type { Phase } from './model'
import model from './model'

function curvePath(x1:number,y1:number,x2:number,y2:number){
  const cx = (x1+x2)/2
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
}

// which edges should pulse per phase
function edgeActiveForPhase(phase: Phase, edgeId: string, kind: 'ff'|'fb'|'rec'|'inh'){
  if(phase==='all') return false
  if(phase==='infer'){
    // emphasize feedforward chain
    return kind==='ff'
  }
  if(phase==='predict'){
    // emphasize L6→L4 (+thalamus) & apical (L1) feedback
    return kind==='fb' ||
      edgeId.startsWith('I_') || edgeId.startsWith('A')
  }
  if(phase==='update'){
    // emphasize mismatch correction in L4 loop & thalamus→L4
    return edgeId==='T_to_L4E' || edgeId.startsWith('L4_')
  }
  return false
}

export function CortexSVG(props: {
  model: typeof model
  showFF: boolean
  showFB: boolean
  showRec: boolean
  particles: boolean
  labels: boolean
  phase: Phase
  tick: number         // animation clock
  pulsing: boolean     // whether to pulse current phase
}){
  const { showFF, showFB, showRec, particles, labels, phase, tick, pulsing } = props
  const svgRef = useRef<SVGSVGElement>(null)
  const edges = props.model.edges
  const nodes = props.model.nodes

  // particle state kept as per-edge t values
  const particleState = useRef(new Map<string, number>())
  useEffect(()=>{ // seed
    particleState.current.clear()
    edges.forEach(e=> particleState.current.set(e.id, Math.random()))
  }, [edges])

  // animation loop for particles + pulses
  useEffect(()=>{
    let raf = 0
    const step = ()=>{
      const svg = svgRef.current
      if(!svg){ raf = requestAnimationFrame(step); return }

      // particles
      if(particles){
        edges.forEach(e=>{
          const path = svg.querySelector(`#edge-${e.id}`) as SVGPathElement | null
          const dot = svg.querySelector(`#dot-${e.id}`) as SVGCircleElement | null
          if(!path || !dot) return
          const len = path.getTotalLength()
          const t = (particleState.current.get(e.id) ?? 0) + 0.006
          const tWrap = t % 1
          particleState.current.set(e.id, tWrap)
          const pt = path.getPointAtLength(tWrap * len)
          dot.setAttribute('cx', pt.x.toString()); dot.setAttribute('cy', pt.y.toString())
        })
      }

      // pulses (modulate strokeWidth + opacity if active this phase)
      const t = tick * 0.12  // pulse speed
      const pulse = 0.5 + 0.5*Math.sin(t) // 0..1
      edges.forEach(e=>{
        const path = svg.querySelector(`#edge-${e.id}`) as SVGPathElement | null
        if(!path) return
        const base = Number(path.getAttribute('data-basew')) || Number(path.getAttribute('stroke-width')) || 3
        if(!path.getAttribute('data-basew')) path.setAttribute('data-basew', String(base))
        const active = pulsing && edgeActiveForPhase(phase, e.id, e.kind)
        const w = active ? base * (1.0 + 0.8*pulse) : base
        const a = active ? Math.min(0.95, 0.45 + 0.5*pulse) : 1.0
        path.setAttribute('stroke-width', w.toString())
        path.setAttribute('opacity', a.toString())
      })

      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return ()=> cancelAnimationFrame(raf)
  }, [particles, edges, tick, pulsing, phase])

  function visible(kind: 'ff'|'fb'|'rec'|'inh'){
    if(kind==='ff') return showFF && (phase!=='predict')
    if(kind==='fb') return showFB && (phase!=='infer')
    if(kind==='rec' || kind==='inh') return showRec
    return true
  }

  return (
    <svg ref={svgRef} viewBox="0 0 1100 780" aria-label="Neocortical column">
      {props.model.bands.map(b=>(
        <g key={b.name}>
          <rect x={120} y={b.y} width={860} height={80} rx={10} ry={10} className="bubble" />
          <text x={40} y={b.y+48} className="layerLabel">Layer {b.name}</text>
        </g>
      ))}

      {/* edges underneath nodes */}
      {edges.map(e=>{
        const from = nodes.find(n=>n.id===e.from)!
        const to   = nodes.find(n=>n.id===e.to)!
        const d = (from.id===to.id)
          ? `M ${from.x-16} ${from.y-14} q 16 -10 32 0 q -16 10 -32 0 z`
          : curvePath(from.x, from.y, to.x, to.y)
        const cls =
          e.kind==='ff' ? 'path ff' :
          e.kind==='fb' ? 'path fb' :
          e.kind==='rec' ? 'path rec' : 'path inhEdge'
        const hide = !visible(e.kind) || (phase==='update' && e.id.startsWith('L4_')===false && e.id!=='T_to_L4E')
        return (
          <g key={e.id} className={hide ? 'hidden' : ''}>
            <path id={`edge-${e.id}`} d={d} className={cls} strokeWidth={e.width ?? 3} />
            <circle id={`dot-${e.id}`} r="2.2" style={{color:
              e.kind==='ff' ? 'var(--ff)' : e.kind==='fb' ? 'var(--fb)' : e.kind==='rec' ? 'var(--rec)' : 'var(--inh)'
            }} />
          </g>
        )
      })}

      {/* nodes */}
      {nodes.map(n=>{
        const label = labels ? <text x={n.x+18} y={n.y+3} className="nodeLabel">{n.label ?? n.id}</text> : null
        if(n.type==='I') return (
          <g key={n.id} id={n.id} tabIndex={0}>
            <circle cx={n.x} cy={n.y} r="10" className="bubble inh" />
            {label}
          </g>
        )
        if(n.type==='T') return (
          <g key={n.id} id={n.id} tabIndex={0}>
            <rect x={n.x-14} y={n.y-10} width="28" height="20" rx="4" ry="4" className="bubble thal" />
            {label}
          </g>
        )
        if(n.type==='A') return (
          <g key={n.id} id={n.id} tabIndex={0}>
            <polygon points={`${n.x-8},${n.y-8} ${n.x-8},${n.y+8} ${n.x+8},${n.y}`} className="bubble exc" />
            {label}
          </g>
        )
        // E soma as triangle
        return (
          <g key={n.id} id={n.id} tabIndex={0}>
            <polygon points={`${n.x-14},${n.y-14} ${n.x-14},${n.y+14} ${n.x+14},${n.y}`} className="bubble exc" />
            {label}
          </g>
        )
      })}
    </svg>
  )
}
