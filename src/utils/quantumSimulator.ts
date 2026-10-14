/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Complex number representation
export interface Complex {
  re: number;
  im: number;
}

const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cExpI = (theta: number): Complex => ({
  re: Math.cos(theta),
  im: Math.sin(theta),
});

export interface QuantumStateResult {
  probabilities: number[]; // P(q_i) in [0, 1]
  expectationValues: number[]; // <Z_i> in [-1, 1]
  stateVectorAmplitudes: { state: string; probability: number }[];
  entanglementEntropy: number;
  overallSuccessProbability: number;
}

/**
 * 4-Qubit Parameterized Quantum Circuit Simulator mirroring PennyLane default.qubit:
 * - AngleEmbedding for spatial features
 * - 3-Layer Parameterized Rotations R(phi, theta, omega)
 * - Linear CNOT Entanglement ladder (q0->q1, q1->q2, q2->q3)
 * - Pauli-Z Expectation values
 */
export function runPennyLaneQNN(
  features: number[], // [Receiver Speed, Defender Cushion, Box Count, Pass Rush Pressure]
  weights: number[][][] // [layers][qubits][3: phi, theta, omega]
): QuantumStateResult {
  const nQubits = 4;
  const dim = 16; // 2^4

  // Initialize state |0000>
  let state: Complex[] = Array.from({ length: dim }, (_, i) => ({
    re: i === 0 ? 1 : 0,
    im: 0,
  }));

  // Helper to apply single-qubit matrix
  const apply1QubitGate = (targetQubit: number, m00: Complex, m01: Complex, m10: Complex, m11: Complex) => {
    const nextState: Complex[] = Array.from({ length: dim }, () => ({ re: 0, im: 0 }));
    const bitMask = 1 << (nQubits - 1 - targetQubit);

    for (let i = 0; i < dim; i++) {
      if ((i & bitMask) === 0) {
        // Target bit is 0
        const i0 = i;
        const i1 = i | bitMask;
        const v0 = state[i0];
        const v1 = state[i1];

        // next[i0] = m00*v0 + m01*v1
        nextState[i0] = cAdd(cMul(m00, v0), cMul(m01, v1));
        // next[i1] = m10*v0 + m11*v1
        nextState[i1] = cAdd(cMul(m10, v0), cMul(m11, v1));
      }
    }
    state = nextState;
  };

  // Rotation gate: Rot(phi, theta, omega) = RZ(omega) * RY(theta) * RZ(phi)
  const applyRot = (qubit: number, phi: number, theta: number, omega: number) => {
    // RZ(phi): diag(e^(-i*phi/2), e^(i*phi/2))
    // RY(theta): [[cos(theta/2), -sin(theta/2)], [sin(theta/2), cos(theta/2)]]
    // RZ(omega): diag(e^(-i*omega/2), e^(i*omega/2))
    const cTheta = Math.cos(theta / 2);
    const sTheta = Math.sin(theta / 2);

    const expZ1_neg = cExpI(-phi / 2);
    const expZ1_pos = cExpI(phi / 2);
    const expZ2_neg = cExpI(-omega / 2);
    const expZ2_pos = cExpI(omega / 2);

    // M = RZ(omega) * RY(theta) * RZ(phi)
    // [0,0] = expZ2_neg * cTheta * expZ1_neg
    const m00 = cMul(expZ2_neg, cMul({ re: cTheta, im: 0 }, expZ1_neg));
    // [0,1] = expZ2_neg * (-sTheta) * expZ1_pos
    const m01 = cMul(expZ2_neg, cMul({ re: -sTheta, im: 0 }, expZ1_pos));
    // [1,0] = expZ2_pos * sTheta * expZ1_neg
    const m10 = cMul(expZ2_pos, cMul({ re: sTheta, im: 0 }, expZ1_neg));
    // [1,1] = expZ2_pos * cTheta * expZ1_pos
    const m11 = cMul(expZ2_pos, cMul({ re: cTheta, im: 0 }, expZ1_pos));

    apply1QubitGate(qubit, m00, m01, m10, m11);
  };

  // RX rotation gate (PennyLane default for AngleEmbedding rotation='X')
  const applyRx = (qubit: number, angle: number) => {
    // RX(theta) = [[cos(theta/2), -i*sin(theta/2)], [-i*sin(theta/2), cos(theta/2)]]
    const c = Math.cos(angle / 2);
    const s = Math.sin(angle / 2);
    apply1QubitGate(qubit, { re: c, im: 0 }, { re: 0, im: -s }, { re: 0, im: -s }, { re: c, im: 0 });
  };

  // RY rotation gate
  const applyRy = (qubit: number, angle: number) => {
    const c = Math.cos(angle / 2);
    const s = Math.sin(angle / 2);
    apply1QubitGate(qubit, { re: c, im: 0 }, { re: -s, im: 0 }, { re: s, im: 0 }, { re: c, im: 0 });
  };

  // CNOT gate
  const applyCNOT = (controlQubit: number, targetQubit: number) => {
    const nextState: Complex[] = [...state];
    const cMask = 1 << (nQubits - 1 - controlQubit);
    const tMask = 1 << (nQubits - 1 - targetQubit);

    for (let i = 0; i < dim; i++) {
      if ((i & cMask) !== 0) {
        // Control is 1
        const swapped = i ^ tMask;
        if (i < swapped) {
          const temp = nextState[i];
          nextState[i] = nextState[swapped];
          nextState[swapped] = temp;
        }
      }
    }
    state = nextState;
  };

  // Step 1: Encode spatial tracking features (repeating n_qubits times as in user's loop)
  for (let rep = 0; rep < nQubits; rep++) {
    for (let i = 0; i < nQubits; i++) {
      const val = features[i] ?? 0.5;
      applyRx(i, val); // PennyLane default rotation='X'
    }
  }

  // Step 2: Parameterized Quantum Circuit Layers (The QNN "weights")
  const numLayers = weights.length;
  for (let l = 0; l < numLayers; l++) {
    for (let i = 0; i < nQubits; i++) {
      const [phi, theta, omega] = weights[l][i] || [0.2, 0.5, 0.1];
      applyRot(i, phi, theta, omega);
    }
    // Entangle neighboring player nodes: CNOT(wires=[i, i + 1])
    for (let i = 0; i < nQubits - 1; i++) {
      applyCNOT(i, i + 1);
    }
  }

  // Step 3: Measure expectation value <PauliZ_i>
  const expectationValues: number[] = [];
  for (let q = 0; q < nQubits; q++) {
    const mask = 1 << (nQubits - 1 - q);
    let expVal = 0;
    for (let i = 0; i < dim; i++) {
      const prob = state[i].re * state[i].re + state[i].im * state[i].im;
      const bitIsZero = (i & mask) === 0;
      expVal += bitIsZero ? prob : -prob;
    }
    expectationValues.push(Number(expVal.toFixed(4)));
  }

  // Map expectation values [-1, 1] to probabilities [0, 1]
  // In PennyLane / Quantum ML classification, P(success) = (1 - <Z>) / 2 (where |1> = success)
  const probabilities = expectationValues.map((ev) => Number(((1 - ev) / 2).toFixed(3)));

  // Statevector amplitudes
  const stateVectorAmplitudes = state.map((c, i) => {
    const prob = c.re * c.re + c.im * c.im;
    const binary = i.toString(2).padStart(4, '0');
    return { state: `|${binary}⟩`, probability: Number(prob.toFixed(4)) };
  });

  // Calculate von Neumann entanglement entropy approximation
  let entropy = 0;
  for (const item of stateVectorAmplitudes) {
    if (item.probability > 1e-6) {
      entropy -= item.probability * Math.log2(item.probability);
    }
  }

  const overallSuccessProbability = Number(
    (probabilities.reduce((acc, p) => acc + p, 0) / probabilities.length).toFixed(3)
  );

  return {
    probabilities,
    expectationValues,
    stateVectorAmplitudes,
    entanglementEntropy: Number(entropy.toFixed(3)),
    overallSuccessProbability,
  };
}

// Exact NumPy seed(42) weights for shape (3 layers x 4 qubits x 3 rotation angles)
export const DEFAULT_QNN_WEIGHTS: number[][][] = [
  // Layer 0
  [
    [0.4967, -0.1383, 0.6477],
    [1.5230, -0.2342, -0.2341],
    [1.5792, 0.7674, -0.4695],
    [0.5426, -0.4634, -0.4657],
  ],
  // Layer 1
  [
    [0.2420, -1.9133, -1.7249],
    [-0.5623, -1.0128, 0.3142],
    [-0.9080, -1.4123, 1.4656],
    [-0.2258, 0.0675, -1.4247],
  ],
  // Layer 2
  [
    [-0.5444, 0.1109, -1.1510],
    [0.3757, -0.6006, -0.2917],
    [-0.6017, 1.8523, -0.0135],
    [-1.0577, 0.8225, -1.2208],
  ],
];
