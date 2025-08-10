export type NodeType = 'E' | 'I' | 'T' | 'A' | 'OUT'
export type EdgeKind = 'ff' | 'fb' | 'rec' | 'inh'
export type Phase = 'infer' | 'predict' | 'update' | 'all'

export interface Node {
  id: string
  type: NodeType
  x: number
  y: number
  label?: string
  layer: string
}

export interface Edge {
  id: string
  from: string
  to: string
  kind: EdgeKind
  width?: number
}

const W = 1100
const xLeft = 170, xRight = 940, xMid = (xLeft + xRight)/2
const Y = { I: 70, II: 140, III: 220, IV: 310, V: 430, VI: 560 }

// Nodes
const nodes: Node[] = [
  // Layer I: top-down & apical sites
  { id: 'I_TD', type: 'E', x: xLeft, y: Y.I, label: 'Top-down (L1)', layer: 'I' },
  { id: 'I_A23', type: 'A', x: xMid-80, y: Y.I, label: 'Apical→II/III', layer: 'I' },
  { id: 'I_A5', type: 'A', x: xMid+80, y: Y.I, label: 'Apical→V', layer: 'I' },

  // Layer II
  { id: 'L2_E', type: 'E', x: xLeft+120, y: Y.II, label: 'L2 E (IT)', layer: 'II' },
  { id: 'L2_I', type: 'I', x: xLeft+152, y: Y.II+22, label: 'L2 I', layer: 'II' },

  // Layer III
  { id: 'L3_E', type: 'E', x: xLeft+120, y: Y.III, label: 'L3 E (IT)', layer: 'III' },
  { id: 'L3_I', type: 'I', x: xLeft+152, y: Y.III+22, label: 'L3 I', layer: 'III' },

  // Layer IV
  { id: 'L4_T', type: 'T', x: xLeft, y: Y.IV, label: 'Thalamus (core)', layer: 'IV' },
  { id: 'L4_E', type: 'E', x: xLeft+120, y: Y.IV, label: 'L4 E (spiny stellate)', layer: 'IV' },
  { id: 'L4_I', type: 'I', x: xLeft+152, y: Y.IV+22, label: 'L4 I', layer: 'IV' },

  // Layer V
  { id: 'L5_E', type: 'E', x: xLeft+120, y: Y.V, label: 'L5 E (PT/IT)', layer: 'V' },
  { id: 'L5_I', type: 'I', x: xLeft+152, y: Y.V+22, label: 'L5 I', layer: 'V' },
  { id: 'OUT_UP', type: 'OUT', x: xRight-20, y: Y.V, label: '→ Higher areas', layer: 'V' },

  // Layer VI split
  { id: 'L6_CT', type: 'E', x: xLeft+120, y: Y.VI, label: 'L6 E (CT)', layer: 'VI' },
  { id: 'L6_I', type: 'I', x: xLeft+152, y: Y.VI+22, label: 'L6 I', layer: 'VI' },
  { id: 'L6_IT', type: 'E', x: xLeft+200, y: Y.VI, label: 'L6 E (IT)', layer: 'VI' },

  // Layer VI outputs
  { id: 'OUT_THAL', type: 'OUT', x: xRight-20, y: Y.VI, label: '→ Thalamus', layer: 'VI' },
]

// Edges
const edges: Edge[] = [
  // Intralaminar microcircuits (E→E, E→I, I→E)
  { id: 'L2_EE', from: 'L2_E', to: 'L2_E', kind: 'rec', width: 2 },
  { id: 'L2_EI', from: 'L2_E', to: 'L2_I', kind: 'rec', width: 2 },
  { id: 'L2_IE', from: 'L2_I', to: 'L2_E', kind: 'inh', width: 2.2 },

  { id: 'L3_EE', from: 'L3_E', to: 'L3_E', kind: 'rec', width: 2 },
  { id: 'L3_EI', from: 'L3_E', to: 'L3_I', kind: 'rec', width: 2 },
  { id: 'L3_IE', from: 'L3_I', to: 'L3_E', kind: 'inh', width: 2.2 },

  { id: 'L4_EE', from: 'L4_E', to: 'L4_E', kind: 'rec', width: 2 },
  { id: 'L4_EI', from: 'L4_E', to: 'L4_I', kind: 'rec', width: 2 },
  { id: 'L4_IE', from: 'L4_I', to: 'L4_E', kind: 'inh', width: 2.2 },

  { id: 'L5_EE', from: 'L5_E', to: 'L5_E', kind: 'rec', width: 2 },
  { id: 'L5_EI', from: 'L5_E', to: 'L5_I', kind: 'rec', width: 2 },
  { id: 'L5_IE', from: 'L5_I', to: 'L5_E', kind: 'inh', width: 2.2 },

  { id: 'L6CT_EE', from: 'L6_CT', to: 'L6_CT', kind: 'rec', width: 2 },
  { id: 'L6CT_EI', from: 'L6_CT', to: 'L6_I', kind: 'rec', width: 2 },
  { id: 'L6CT_IE', from: 'L6_I', to: 'L6_CT', kind: 'inh', width: 2.2 },

  { id: 'L6IT_EE', from: 'L6_IT', to: 'L6_IT', kind: 'rec', width: 2 },

  // Feedforward chain
  { id: 'T_to_L4E', from: 'L4_T', to: 'L4_E', kind: 'ff', width: 3 },
  { id: 'L4_to_L2', from: 'L4_E', to: 'L2_E', kind: 'ff', width: 3 },
  { id: 'L4_to_L3', from: 'L4_E', to: 'L3_E', kind: 'ff', width: 2.7 },
  { id: 'L2_to_L3', from: 'L2_E', to: 'L3_E', kind: 'ff', width: 2 },
  { id: 'L23_to_L5', from: 'L3_E', to: 'L5_E', kind: 'ff', width: 3 },
  { id: 'L5_to_L6CT', from: 'L5_E', to: 'L6_CT', kind: 'ff', width: 2.4 },
  { id: 'L5_to_L6IT', from: 'L5_E', to: 'L6_IT', kind: 'ff', width: 2 },
  { id: 'L5_to_UP', from: 'L5_E', to: 'OUT_UP', kind: 'ff', width: 3 },

  // Feedback from L6-CT
  { id: 'L6CT_to_L4E', from: 'L6_CT', to: 'L4_E', kind: 'fb', width: 3 },
  { id: 'L6CT_to_L4I', from: 'L6_CT', to: 'L4_I', kind: 'fb', width: 2.4 },
  { id: 'L6CT_to_THAL', from: 'L6_CT', to: 'OUT_THAL', kind: 'fb', width: 2.6 },

  // L6-IT cortical feedback example
  { id: 'L6IT_to_L5', from: 'L6_IT', to: 'L5_E', kind: 'fb', width: 2 },

  // Layer I apical feedback
  { id: 'I_to_A23', from: 'I_TD', to: 'I_A23', kind: 'fb', width: 2 },
  { id: 'I_to_A5', from: 'I_TD', to: 'I_A5', kind: 'fb', width: 2 },
  { id: 'A23_to_L2', from: 'I_A23', to: 'L2_E', kind: 'fb', width: 2 },
  { id: 'A23_to_L3', from: 'I_A23', to: 'L3_E', kind: 'fb', width: 2 },
  { id: 'A5_to_L5', from: 'I_A5', to: 'L5_E', kind: 'fb', width: 2 },
]

// Layer bands for background shading
const bands = [
  { name: 'I', y: Y.I-36 },
  { name: 'II', y: Y.II-36 },
  { name: 'III', y: Y.III-36 },
  { name: 'IV', y: Y.IV-36 },
  { name: 'V', y: Y.V-36 },
  { name: 'VI', y: Y.VI-36 }
]

const model = { nodes, edges, bands }
export default model
