import React from 'react'
import { Phase } from './model'

export function Controls(props: {
  showFF: boolean, setShowFF: (v:boolean)=>void,
  showFB: boolean, setShowFB: (v:boolean)=>void,
  showRec: boolean, setShowRec: (v:boolean)=>void,
  particles: boolean, setParticles: (v:boolean)=>void,
  labels: boolean, setLabels: (v:boolean)=>void,
  onPhase: (p:Phase)=>void,
  playing: boolean, onPlayToggle: ()=>void
}){
  const { showFF, setShowFF, showFB, setShowFB, showRec, setShowRec,
          particles, setParticles, labels, setLabels,
          onPhase, playing, onPlayToggle } = props

  return (
    <div className="controls">
      <div className="legend">
        <div className="swatch" style={{background: 'var(--ff)'}}></div><div>Feedforward</div>
        <div className="swatch" style={{background: 'var(--fb)'}}></div><div>Feedback / Top-down</div>
        <div className="swatch" style={{background: 'var(--rec)'}}></div><div>Recurrent (E↔E, E→I)</div>
        <div className="swatch" style={{background: 'var(--inh)'}}></div><div>Inhibitory (I→E)</div>
      </div>

      <div className="group">
        <label><input type="checkbox" checked={showFF} onChange={e=>setShowFF(e.target.checked)} /> Show feedforward</label>
        <label><input type="checkbox" checked={showFB} onChange={e=>setShowFB(e.target.checked)} /> Show feedback</label>
        <label><input type="checkbox" checked={showRec} onChange={e=>setShowRec(e.target.checked)} /> Show recurrent & inhibitory</label>
      </div>

      <div className="group">
        <label><input type="checkbox" checked={particles} onChange={e=>setParticles(e.target.checked)} /> Animate particles</label>
        <label><input type="checkbox" checked={labels} onChange={e=>setLabels(e.target.checked)} /> Show labels</label>
      </div>

      <div className="group btnbar">
        <button onClick={()=>onPhase('infer')}>Phase A: Infer (T→IV→II/III→V)</button>
        <button onClick={()=>onPhase('predict')}>Phase B: Predict (VI→IV & L1 apical)</button>
        <button onClick={()=>onPhase('update')}>Phase C: Update (mismatch loops)</button>
        <button onClick={()=>onPhase('all')}>Show all flows</button>
        <button onClick={onPlayToggle}>{playing ? '■ Stop' : '▶ Play phases'}</button>
      </div>
    </div>
  )
}
