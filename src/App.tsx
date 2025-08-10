import React, { useEffect, useState } from 'react'
import { Controls } from './components/Controls'
import { CortexSVG } from './components/CortexSVG'
import model, { Phase } from './components/model'

const PHASES: Phase[] = ['infer','predict','update']
const STEP_MS = 1400  // dwell time per phase

export default function App(){
  const [showFF, setShowFF] = useState(true)
  const [showFB, setShowFB] = useState(true)
  const [showRec, setShowRec] = useState(true)
  const [particles, setParticles] = useState(true)
  const [labels, setLabels] = useState(true)

  const [phase, setPhase] = useState<Phase>('all')
  const [playing, setPlaying] = useState(false)
  const [tick, setTick] = useState(0)  // animation clock for pulses

  // advance phase when playing
  useEffect(()=>{
    if(!playing) return
    let i = 0
    setPhase(PHASES[i])
    const id = setInterval(()=>{
      i = (i+1) % PHASES.length
      setPhase(PHASES[i])
    }, STEP_MS)
    return ()=> clearInterval(id)
  }, [playing])

  // simple clock for pulse fn (CortexSVG reads it)
  useEffect(()=>{
    let raf = 0
    const loop = ()=>{
      setTick(t=>t+1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return ()=> cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <header>
        <h1>Neocortical Column — React</h1>
        <div className="sub">Layers I–VI with intra-layer E/I microcircuits, thalamic input, apical feedback, and corticothalamic output</div>
      </header>
      <main>
        <section className="panel">
          <Controls
            showFF={showFF} setShowFF={setShowFF}
            showFB={showFB} setShowFB={setShowFB}
            showRec={showRec} setShowRec={setShowRec}
            particles={particles} setParticles={setParticles}
            labels={labels} setLabels={setLabels}
            onPhase={setPhase}
            playing={playing} onPlayToggle={()=>setPlaying(p=>!p)}
          />
          <div className="note">
            Tip: toggle <span className="kbd">F</span> feedforward, <span className="kbd">B</span> feedback, <span className="kbd">R</span> recurrent, <span className="kbd">P</span> particles.
          </div>
        </section>
        <section className="panel canvas">
          <CortexSVG
            model={model}
            showFF={showFF} showFB={showFB} showRec={showRec}
            particles={particles} labels={labels}
            phase={phase}
            tick={tick}
            pulsing={playing}
          />
        </section>
      </main>
    </>
  )
}
