/* ==========================================
   LOGIC CIRCUIT LAB - APPLICATION LOGIC
   ========================================== */
// --- 1. CIRCUIT METADATA & BOOLEAN SIMULATOR ---
const circuitDatabase = {
    // Basic Gates
    not_gate: {
        name: "NOT Gate",
        category: "Basic Gate",
        badge: "1-Input Logic",
        inputs: ["A"],
        outputs: ["Output"],
        expression: "Y = A'",
        description: "Also known as an inverter. It reverses the input signal: outputs HIGH (1) if the input is LOW (0), and outputs LOW (0) if the input is HIGH (1).",
        eval: (ins) => ({ Output: ins.A ? 0 : 1 }),
        challenge: { goalText: "Output = 1", check: (ins, outs) => outs.Output === 1 }
    },
    and_gate: {
        name: "AND Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = A · B",
        description: "Outputs HIGH (1) only if all its inputs are HIGH (1). If any input is LOW (0), the output will be LOW (0).",
        eval: (ins) => ({ Output: ins.A && ins.B ? 1 : 0 }),
        challenge: { goalText: "Output = 1", check: (ins, outs) => outs.Output === 1 }
    },
    or_gate: {
        name: "OR Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = A + B",
        description: "Outputs HIGH (1) if at least one of its inputs is HIGH (1). Outputs LOW (0) only if all inputs are LOW (0).",
        eval: (ins) => ({ Output: ins.A || ins.B ? 1 : 0 }),
        challenge: { goalText: "Output = 1 using only one HIGH input", check: (ins, outs) => outs.Output === 1 && (ins.A + ins.B === 1) }
    },
    nand_gate: {
        name: "NAND Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = (A · B)'",
        description: "A combination of an AND gate followed by a NOT gate. Outputs LOW (0) only if all inputs are HIGH (1). Otherwise, outputs HIGH (1).",
        eval: (ins) => ({ Output: ins.A && ins.B ? 0 : 1 }),
        challenge: { goalText: "Output = 0", check: (ins, outs) => outs.Output === 0 }
    },
    nor_gate: {
        name: "NOR Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = (A + B)'",
        description: "A combination of an OR gate followed by a NOT gate. Outputs HIGH (1) only if all inputs are LOW (0). Otherwise, outputs LOW (0).",
        eval: (ins) => ({ Output: ins.A || ins.B ? 0 : 1 }),
        challenge: { goalText: "Output = 1", check: (ins, outs) => outs.Output === 1 }
    },
    xor_gate: {
        name: "XOR Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = A ⊕ B",
        description: "Exclusive-OR gate. Outputs HIGH (1) only if the inputs are different. Outputs LOW (0) if the inputs are the same.",
        eval: (ins) => ({ Output: ins.A !== ins.B ? 1 : 0 }),
        challenge: { goalText: "Output = 1", check: (ins, outs) => outs.Output === 1 }
    },
    xnor_gate: {
        name: "XNOR Gate",
        category: "Basic Gate",
        badge: "2-Input Logic",
        inputs: ["A", "B"],
        outputs: ["Output"],
        expression: "Y = (A ⊕ B)'",
        description: "Exclusive-NOR gate. Outputs HIGH (1) if the inputs are the same. Outputs LOW (0) if the inputs are different.",
        eval: (ins) => ({ Output: ins.A === ins.B ? 1 : 0 }),
        challenge: { goalText: "Output = 0", check: (ins, outs) => outs.Output === 0 }
    },
    
    // Advanced Circuits
    half_adder: {
        name: "Half Adder",
        category: "Advanced Circuit",
        badge: "Adder Logic",
        inputs: ["A", "B"],
        outputs: ["Sum", "Carry"],
        expression: "Sum = A ⊕ B \nCarry = A · B",
        description: "Adds two single-digit binary numbers. The sum digit is computed using an XOR gate, while the carry digit is computed using an AND gate.",
        eval: (ins) => ({
            Sum: ins.A !== ins.B ? 1 : 0,
            Carry: ins.A && ins.B ? 1 : 0
        }),
        challenge: { goalText: "Sum = 0 and Carry = 1", check: (ins, outs) => outs.Sum === 0 && outs.Carry === 1 }
    },
    full_adder: {
        name: "Full Adder",
        category: "Advanced Circuit",
        badge: "Adder Logic",
        inputs: ["A", "B", "Cin"],
        outputs: ["Sum", "Carry"],
        expression: "Sum = A ⊕ B ⊕ Cin \nCarry = (A·B) + (Cin·(A⊕B))",
        description: "Adds three single-digit binary numbers (A, B, and a Carry Input). Utilizes two Half Adders and an OR gate.",
        eval: (ins) => {
            const sum = ins.A ^ ins.B ^ ins.Cin;
            const carry = (ins.A & ins.B) | (ins.Cin & (ins.A ^ ins.B));
            return { Sum: sum, Carry: carry };
        },
        challenge: { goalText: "Sum = 1 and Carry = 1", check: (ins, outs) => outs.Sum === 1 && outs.Carry === 1 }
    },
    half_subtractor: {
        name: "Half Subtractor",
        category: "Advanced Circuit",
        badge: "Subtractor Logic",
        inputs: ["A", "B"],
        outputs: ["Diff", "Borrow"],
        expression: "Diff = A ⊕ B \nBorrow = A' · B",
        description: "Subtracts input B from input A (A - B). Computes the Difference using XOR, and the Borrow using NOT and AND gates.",
        eval: (ins) => ({
            Diff: ins.A !== ins.B ? 1 : 0,
            Borrow: !ins.A && ins.B ? 1 : 0
        }),
        challenge: { goalText: "Diff = 1 and Borrow = 1", check: (ins, outs) => outs.Diff === 1 && outs.Borrow === 1 }
    },
    full_subtractor: {
        name: "Full Subtractor",
        category: "Advanced Circuit",
        badge: "Subtractor Logic",
        inputs: ["A", "B", "Bin"],
        outputs: ["Diff", "Borrow"],
        expression: "Diff = A ⊕ B ⊕ Bin \nBorrow = (A'·B) + (Bin·(A⊕B)')",
        description: "Performs subtraction of three binary bits: minuend A, subtrahend B, and Borrow Input Bin. Computes the Difference and Borrow out.",
        eval: (ins) => {
            const diff = ins.A ^ ins.B ^ ins.Bin;
            const borrow = (!ins.A & ins.B) | (ins.Bin & !(ins.A ^ ins.B) ? 1 : 0);
            return { Diff: diff, Borrow: borrow };
        },
        challenge: { goalText: "Diff = 0 and Borrow = 1", check: (ins, outs) => outs.Diff === 0 && outs.Borrow === 1 }
    },
    comparator_1bit: {
        name: "1-Bit Comparator",
        category: "Advanced Circuit",
        badge: "Comparator Logic",
        inputs: ["A", "B"],
        outputs: ["A_Greater_B", "A_Equal_B", "A_Less_B"],
        expression: "A_Gt_B = A·B' \nA_Eq_B = (A⊕B)' \nA_Lt_B = A'·B",
        description: "Compares two 1-bit inputs A and B and sets one of three outputs (Greater than, Equal to, or Less than) to HIGH (1).",
        eval: (ins) => ({
            A_Greater_B: ins.A > ins.B ? 1 : 0,
            A_Equal_B: ins.A === ins.B ? 1 : 0,
            A_Less_B: ins.A < ins.B ? 1 : 0
        }),
        challenge: { goalText: "Activate the 'A_Greater_B' Output", check: (ins, outs) => outs.A_Greater_B === 1 }
    },
    parity_generator: {
        name: "Parity Generator",
        category: "Advanced Circuit",
        badge: "Error Check Logic",
        inputs: ["A", "B", "C"],
        outputs: ["Parity"],
        expression: "Parity = A ⊕ B ⊕ C",
        description: "Generates an even parity bit. The output Parity bit is set to HIGH (1) if the sum of input bits is odd, making the total number of 1s even.",
        eval: (ins) => ({
            Parity: (ins.A ^ ins.B ^ ins.C) ? 1 : 0
        }),
        challenge: { goalText: "Output Parity = 1 using exactly two HIGH inputs", check: (ins, outs) => outs.Parity === 1 && (ins.A + ins.B + ins.C === 2) }
    },
    parity_checker: {
        name: "Parity Checker",
        category: "Advanced Circuit",
        badge: "Error Check Logic",
        inputs: ["A", "B", "C", "P"],
        outputs: ["Error"],
        expression: "Error = A ⊕ B ⊕ C ⊕ P",
        description: "Checks if the received bits A, B, C along with parity bit P have even parity. Outputs an Error (1) if parity check fails (odd sum of bits).",
        eval: (ins) => ({
            Error: (ins.A ^ ins.B ^ ins.C ^ ins.P) ? 1 : 0
        }),
        challenge: { goalText: "Trigger an parity check Error", check: (ins, outs) => outs.Error === 1 }
    }
};
// State Variables
let activeCircuitKey = "and_gate";
let inputStates = { A: 0, B: 0 };
let apiOnline = false;
const API_URL = "http://localhost:5000/api";
// --- DOM ELEMENTS ---
const elements = {
    basicGatesList: document.getElementById('basic-gates-list'),
    advancedCircuitsList: document.getElementById('advanced-circuits-list'),
    circuitName: document.getElementById('circuit-name'),
    circuitType: document.getElementById('circuit-type'),
    circuitBadgeType: document.getElementById('circuit-badge-type'),
    circuitExpression: document.getElementById('circuit-expression'),
    circuitDescription: document.getElementById('circuit-description'),
    togglesContainer: document.getElementById('toggles-container'),
    tableHeaders: document.getElementById('table-headers'),
    tableBody: document.getElementById('table-body'),
    svgContainer: document.getElementById('svg-canvas-container'),
    
    // Challenge Elements
    challengeCard: document.getElementById('challenge-card'),
    challengePrompt: document.getElementById('challenge-prompt'),
    challengeStatus: document.getElementById('challenge-status'),
    challengeFeedbackText: document.getElementById('challenge-feedback-text')
};
// --- 2. SIDEBAR INITIALIZATION ---
function initSidebar() {
    elements.basicGatesList.innerHTML = '';
    elements.advancedCircuitsList.innerHTML = '';
    
    Object.keys(circuitDatabase).forEach(key => {
        const item = circuitDatabase[key];
        const btn = document.createElement('button');
        btn.className = `circuit-btn ${key === activeCircuitKey ? 'active' : ''}`;
        btn.setAttribute('data-circuit', key);
        
        btn.innerHTML = `
            <span>${item.name}</span>
            <span class="btn-indicator">⯈</span>
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.circuit-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectCircuit(key);
        });
        
        if (item.category === "Basic Gate") {
            elements.basicGatesList.appendChild(btn);
        } else {
            elements.advancedCircuitsList.appendChild(btn);
        }
    });
}
// --- 3. DYNAMIC TRUTH TABLE BUILDER ---
function buildTruthTable(key) {
    const circuit = circuitDatabase[key];
    const ins = circuit.inputs;
    const outs = circuit.outputs;
    
    // Build Headers
    elements.tableHeaders.innerHTML = '';
    ins.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        elements.tableHeaders.appendChild(th);
    });
    outs.forEach(header => {
        const th = document.createElement('th');
        th.style.color = 'var(--accent-green)';
        th.textContent = header;
        elements.tableHeaders.appendChild(th);
    });
    
    // Build Rows (2^n combinations)
    elements.tableBody.innerHTML = '';
    const rowCount = Math.pow(2, ins.length);
    
    for (let r = 0; r < rowCount; r++) {
        const rowInputs = {};
        const tr = document.createElement('tr');
        tr.id = `row-${key}-${r}`;
        
        // Compute input values for this row
        ins.forEach((inputName, idx) => {
            const shift = ins.length - 1 - idx;
            const bit = (r >> shift) & 1;
            rowInputs[inputName] = bit;
            
            const td = document.createElement('td');
            td.textContent = bit;
            tr.appendChild(td);
        });
        
        // Compute outputs
        const rowOutputs = circuit.eval(rowInputs);
        outs.forEach(outputName => {
            const val = rowOutputs[outputName];
            const td = document.createElement('td');
            td.textContent = val;
            td.style.color = val ? 'var(--accent-green)' : 'var(--text-low)';
            tr.appendChild(td);
        });
        
        elements.tableBody.appendChild(tr);
    }
}
// Highlight the row in the table matching current states
function highlightActiveRow(key) {
    const circuit = circuitDatabase[key];
    const ins = circuit.inputs;
    
    // Calculate row index from input states
    let rowIndex = 0;
    ins.forEach((inputName, idx) => {
        const bit = inputStates[inputName] || 0;
        const shift = ins.length - 1 - idx;
        rowIndex |= (bit << shift);
    });
    
    // Remove old highlights
    document.querySelectorAll('.truth-table tr').forEach(r => r.classList.remove('active-row'));
    
    const targetRow = document.getElementById(`row-${key}-${rowIndex}`);
    if (targetRow) {
        targetRow.classList.add('active-row');
        // Scroll slightly if table overflows
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
// --- 4. INTERACTIVE INPUT CONTROLS ---
function renderToggles(key) {
    const circuit = circuitDatabase[key];
    elements.togglesContainer.innerHTML = '';
    
    // Reset state values for inputs
    inputStates = {};
    circuit.inputs.forEach(inputName => {
        inputStates[inputName] = 0; // Default off
        
        const container = document.createElement('div');
        container.className = 'toggle-switch-container';
        
        container.innerHTML = `
            <span class="toggle-label">${inputName}</span>
            <label class="switch">
                <input type="checkbox" id="toggle-${inputName}">
                <span class="slider"></span>
            </label>
        `;
        
        elements.togglesContainer.appendChild(container);
        
        // Event listener
        const chk = container.querySelector('input');
        chk.addEventListener('change', () => {
            inputStates[inputName] = chk.checked ? 1 : 0;
            evaluateCircuit();
        });
    });
}
// --- 5. BOOLEAN LOGIC SIMULATOR ---
function evaluateCircuit() {
    const circuit = circuitDatabase[activeCircuitKey];
    
    // Highlight Truth Table row
    highlightActiveRow(activeCircuitKey);
    if (apiOnline) {
        // Fetch prediction from Python API Server
        fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                circuit: activeCircuitKey,
                inputs: inputStates
            })
        })
        .then(response => {
            if (!response.ok) throw new Error("API error");
            return response.json();
        })
        .then(data => {
            const outputs = data.outputs;
            // Redraw SVG schematic with new glowing states
            drawSchematic(activeCircuitKey, inputStates, outputs);
            // Validate challenge
            checkChallenge(circuit, outputs);
        })
        .catch(err => {
            console.warn("API Error, falling back to local simulation:", err);
            setApiStatus(false);
            // Fallback immediately to local evaluation
            runLocalEvaluation(circuit);
        });
    } else {
        runLocalEvaluation(circuit);
    }
}
function runLocalEvaluation(circuit) {
    const outputs = circuit.eval(inputStates);
    drawSchematic(activeCircuitKey, inputStates, outputs);
    checkChallenge(circuit, outputs);
}
function checkChallenge(circuit, outputs) {
    const isSolved = circuit.challenge.check(inputStates, outputs);
    
    if (isSolved) {
        elements.challengeCard.className = 'challenge-box solved';
        elements.challengeStatus.className = 'status-badge status-solved';
        elements.challengeStatus.textContent = 'SOLVED';
        elements.challengeFeedbackText.innerHTML = '🎉 Excellent! You configured the inputs correctly and solved the lab challenge.';
    } else {
        elements.challengeCard.className = 'challenge-box';
        elements.challengeStatus.className = 'status-badge status-pending';
        elements.challengeStatus.textContent = 'PENDING';
        elements.challengeFeedbackText.textContent = 'Adjust the toggle switches to solve the puzzle.';
    }
}
// --- 6. DYNAMIC SVG SCHEMATIC BUILDER ---
// Generates beautiful vector lines and gate blocks dynamically inside the canvas
function drawSchematic(key, ins, outs) {
    elements.svgContainer.innerHTML = '';
    
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 420 220");
    
    // Helper: draw wire path
    function drawWire(d, val) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", `wire ${val === 1 ? 'wire-high' : 'wire-low'}`);
        svg.appendChild(path);
    }
    
    // Helper: draw gate shape outline
    function drawGateShape(d, isActive) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", `gate-shape ${isActive ? 'active' : ''}`);
        svg.appendChild(path);
    }
    // Helper: draw small text labels
    function drawText(x, y, txt, cls = "pin-label", anchor = "start") {
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("class", cls);
        text.setAttribute("text-anchor", anchor);
        text.textContent = txt;
        svg.appendChild(text);
    }
    
    // Helper: draw tiny signal values (0/1) on top of wires
    function drawPinVal(x, y, val) {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", x - 6);
        rect.setAttribute("y", y - 7);
        rect.setAttribute("width", 12);
        rect.setAttribute("height", 12);
        rect.setAttribute("rx", 3);
        rect.setAttribute("fill", val ? "rgba(57, 255, 20, 0.2)" : "rgba(255, 0, 127, 0.2)");
        rect.setAttribute("stroke", val ? "var(--accent-green)" : "var(--accent-pink)");
        rect.setAttribute("stroke-width", 1);
        svg.appendChild(rect);
        
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y + 2);
        text.setAttribute("class", "pin-value-text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", val ? "var(--accent-green)" : "var(--accent-pink)");
        text.textContent = val;
        svg.appendChild(text);
    }
    const midY = 110;
    const outX = 350;
    // Check circuit configuration and construct visual SVGs
    if (key === "not_gate") {
        // NOT GATE DRAWING
        const A = ins.A || 0;
        const Y = outs.Output || 0;
        
        // Input Wire
        drawWire("M 40,110 L 160,110", A);
        // Output Wire
        drawWire("M 220,110 L 370,110", Y);
        
        // Gate Shape (Triangle + Circle inverter)
        drawGateShape("M 160,85 L 205,110 L 160,135 Z", Y === 0);
        
        // Inverter Circle dot
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", "211");
        circle.setAttribute("cy", "110");
        circle.setAttribute("r", "5");
        circle.setAttribute("class", `gate-shape ${Y === 0 ? 'active' : ''}`);
        svg.appendChild(circle);
        
        // Labels & Values
        drawText(30, 114, "A");
        drawText(380, 114, "Y");
        drawText(175, 125, "NOT", "gate-label");
        
        drawPinVal(70, 110, A);
        drawPinVal(300, 110, Y);
        
    } else if (["and_gate", "nand_gate", "or_gate", "nor_gate", "xor_gate", "xnor_gate"].includes(key)) {
        // 2-INPUT BASIC GATES
        const A = ins.A || 0;
        const B = ins.B || 0;
        const Y = outs.Output || 0;
        
        // Input Wires
        drawWire("M 40,80 L 160,80", A);
        drawWire("M 40,140 L 160,140", B);
        
        // Gate Symbols
        let gatePath = "";
        let isNandNorXnor = ["nand_gate", "nor_gate", "xnor_gate"].includes(key);
        let gateOutX = isNandNorXnor ? 218 : 224;
        
        // Output Wires
        drawWire(`M ${gateOutX},110 L 370,110`, Y);
        
        if (key.startsWith("and") || key.startsWith("nand")) {
            // AND Gate path (D-shape)
            gatePath = "M 155,70 L 180,70 A 40,40 0 0,1 180,150 L 155,150 Z";
            drawText(168, 115, key.startsWith("nand") ? "NAND" : "AND", "gate-label");
        } else if (key.startsWith("or") || key.startsWith("nor")) {
            // OR Gate path (curved back, pointed front)
            gatePath = "M 150,70 Q 170,110 150,150 Q 185,150 215,110 Q 185,70 150,70 Z";
            drawText(168, 115, key.startsWith("nor") ? "NOR" : "OR", "gate-label");
        } else if (key.startsWith("xor") || key.startsWith("xnor")) {
            // XOR Gate path (double curve back)
            // Draw extra input arc
            const xorArc = document.createElementNS(svgNS, "path");
            xorArc.setAttribute("d", "M 143,70 Q 163,110 143,150");
            xorArc.setAttribute("class", "wire wire-neutral");
            svg.appendChild(xorArc);
            
            gatePath = "M 150,70 Q 170,110 150,150 Q 185,150 215,110 Q 185,70 150,70 Z";
            drawText(168, 115, key.startsWith("xnor") ? "XNOR" : "XOR", "gate-label");
        }
        
        drawGateShape(gatePath, Y === 1);
        
        // Inverter dot for negative gates
        if (isNandNorXnor) {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", "220");
            circle.setAttribute("cy", "110");
            circle.setAttribute("r", "5");
            circle.setAttribute("class", `gate-shape ${Y === 1 ? 'active' : ''}`);
            svg.appendChild(circle);
        }
        
        // Labels & Values
        drawText(30, 84, "A");
        drawText(30, 144, "B");
        drawText(380, 114, "Y");
        
        drawPinVal(70, 80, A);
        drawPinVal(70, 140, B);
        drawPinVal(300, 110, Y);
        
    } else if (key === "half_adder" || key === "half_subtractor") {
        // HALF ADDER / HALF SUBTRACTOR - Clean schematic layout
        // Layout: A at y=82, B at y=155
        // XOR gate (top): center y=82, inputs at y=72 and y=92, output tip at x=215, y=82
        // AND gate (bottom): center y=155, inputs at y=138 and y=165, right tip at x=207, y=152
        const A = ins.A || 0;
        const B = ins.B || 0;
        const SumDiff  = outs.Sum   !== undefined ? outs.Sum   : outs.Diff;
        const CarryBorrow = outs.Carry !== undefined ? outs.Carry : outs.Borrow;
        // ── A input wire ──
        // Horizontal segment from left to branch point
        drawWire("M 30,82 L 78,82", A);
        // A → XOR upper input  (go right along y=82 → y=72 at gate entry)
        drawWire("M 78,82 L 78,72 L 148,72", A);
        // A → AND upper input  (branch down from x=78,y=82 → down to AND top)
        drawWire("M 78,82 L 78,138 L 155,138", A);
        // ── B input wire ──
        // Horizontal segment from left to branch point
        drawWire("M 30,155 L 100,155", B);
        // B → XOR lower input  (branch up from x=100,y=155 → y=92 at gate entry)
        drawWire("M 100,155 L 100,92 L 148,92", B);
        // B → AND lower input  (continue right from branch point)
        drawWire("M 100,155 L 155,155", B);
        // ── Output wires ──
        drawWire("M 215,82 L 370,82", SumDiff);       // Sum / Diff
        drawWire("M 207,152 L 370,152", CarryBorrow);  // Carry / Borrow
        // ── XOR gate body + extra arc (for Sum / Diff) ──
        // Extra curved back-line that distinguishes XOR from OR
        const xorExtraArc = document.createElementNS(svgNS, "path");
        xorExtraArc.setAttribute("d", "M 142,62 Q 158,82 142,102");
        xorExtraArc.setAttribute("class", "wire wire-neutral");
        svg.appendChild(xorExtraArc);
        // XOR gate outline
        drawGateShape("M 148,62 Q 165,82 148,102 Q 182,102 215,82 Q 182,62 148,62 Z", SumDiff === 1);
        drawText(162, 87, "XOR", "gate-label");
        // ── AND gate body (for Carry / Borrow) ──
        // For half subtractor: NOT bubble on A's input line to AND  (Borrow = A' · B)
        if (key === "half_subtractor") {
            const notBubble = document.createElementNS(svgNS, "circle");
            notBubble.setAttribute("cx", "160");
            notBubble.setAttribute("cy", "138");
            notBubble.setAttribute("r",  "5");
            notBubble.setAttribute("class", `gate-shape ${CarryBorrow === 1 ? "active" : ""}`);
            svg.appendChild(notBubble);
        }
        // AND gate D-shape: flat left edge, round right
        drawGateShape("M 155,128 L 182,128 A 24,24 0 0,1 182,175 L 155,175 Z", CarryBorrow === 1);
        drawText(160, 157, key === "half_adder" ? "AND" : "AND", "gate-label");
        // ── Pin labels ──
        drawText(12, 86,  "A");
        drawText(12, 159, "B");
        drawText(375, 86,  key === "half_adder" ? "Sum"    : "Diff");
        drawText(375, 156, key === "half_adder" ? "Carry"  : "Borrow");
        // ── Signal value indicators on wires ──
        drawPinVal(54,  82,  A);
        drawPinVal(54,  155, B);
        drawPinVal(305, 82,  SumDiff);
        drawPinVal(305, 152, CarryBorrow);
        
    } else if (key === "full_adder" || key === "full_subtractor") {
        // FULL ADDER / FULL SUBTRACTOR BLOCK REPRESENTATION
        const A = ins.A || 0;
        const B = ins.B || 0;
        const CinBin = ins.Cin !== undefined ? ins.Cin : ins.Bin;
        const SumDiff = outs.Sum !== undefined ? outs.Sum : outs.Diff;
        const CarryBorrow = outs.Carry !== undefined ? outs.Carry : outs.Borrow;
        
        // Input wires going into the composite block
        drawWire("M 40,55 L 150,55", A);
        drawWire("M 40,110 L 150,110", B);
        drawWire("M 40,165 L 150,165", CinBin);
        
        // Output Wires leaving block
        drawWire("M 270,80 L 360,80", SumDiff);
        drawWire("M 270,140 L 360,140", CarryBorrow);
        
        // Draw Circuit block box
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "150");
        rect.setAttribute("y", "35");
        rect.setAttribute("width", "120");
        rect.setAttribute("height", "150");
        rect.setAttribute("rx", "12");
        rect.setAttribute("class", `gate-shape ${SumDiff || CarryBorrow ? 'active' : ''}`);
        rect.setAttribute("fill", "#101026");
        svg.appendChild(rect);
        
        // Block Inner Titles
        drawText(210, 85, key === "full_adder" ? "FULL" : "FULL", "gate-label", "middle");
        drawText(210, 105, key === "full_adder" ? "ADDER" : "SUBTRACTOR", "gate-label", "middle");
        
        // Pins and labels
        drawText(30, 59, "A");
        drawText(30, 114, "B");
        drawText(20, 169, key === "full_adder" ? "Cin" : "Bin");
        drawText(370, 84, key === "full_adder" ? "Sum" : "Diff");
        drawText(370, 144, key === "full_adder" ? "Carry" : "Borrow");
        
        drawPinVal(65, 55, A);
        drawPinVal(65, 110, B);
        drawPinVal(65, 165, CinBin);
        drawPinVal(310, 80, SumDiff);
        drawPinVal(310, 140, CarryBorrow);
        
    } else if (key.startsWith("comparator")) {
        // COMPARATOR BLOCKS
        const A_Gt_B = outs.A_Greater_B || 0;
        const A_Eq_B = outs.A_Equal_B || 0;
        const A_Lt_B = outs.A_Less_B || 0;
        
        // Left Box drawing
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "150");
        rect.setAttribute("y", "35");
        rect.setAttribute("width", "120");
        rect.setAttribute("height", "150");
        rect.setAttribute("rx", "12");
        rect.setAttribute("class", `gate-shape ${A_Gt_B || A_Eq_B || A_Lt_B ? 'active' : ''}`);
        rect.setAttribute("fill", "#101026");
        svg.appendChild(rect);
        
        // Outputs wires and text pins
        drawWire("M 270,60 L 350,60", A_Gt_B);
        drawWire("M 270,110 L 350,110", A_Eq_B);
        drawWire("M 270,160 L 350,160", A_Lt_B);
        
        drawText(360, 64, "A > B");
        drawText(360, 114, "A = B");
        drawText(360, 164, "A < B");
        
        drawPinVal(305, 60, A_Gt_B);
        drawPinVal(305, 110, A_Eq_B);
        drawPinVal(305, 160, A_Lt_B);
        
        if (key === "comparator_1bit") {
            const A = ins.A || 0;
            const B = ins.B || 0;
            drawWire("M 40,80 L 150,80", A);
            drawWire("M 40,140 L 150,140", B);
            
            drawText(30, 84, "A");
            drawText(30, 144, "B");
            drawPinVal(70, 80, A);
            drawPinVal(70, 140, B);
            
            drawText(210, 100, "1-BIT", "gate-label", "middle");
            drawText(210, 120, "COMP", "gate-label", "middle");
            
        } else if (key === "comparator_2bit") {
            const A1 = ins.A1 || 0;
            const A0 = ins.A0 || 0;
            const B1 = ins.B1 || 0;
            const B0 = ins.B0 || 0;
            
            drawWire("M 40,55 L 150,55", A1);
            drawWire("M 40,85 L 150,85", A0);
            drawWire("M 40,135 L 150,135", B1);
            drawWire("M 40,165 L 150,165", B0);
            
            drawText(20, 59, "A1");
            drawText(20, 89, "A0");
            drawText(20, 139, "B1");
            drawText(20, 169, "B0");
            
            drawPinVal(70, 55, A1);
            drawPinVal(70, 85, A0);
            drawPinVal(70, 135, B1);
            drawPinVal(70, 165, B0);
            
            drawText(210, 100, "2-BIT", "gate-label", "middle");
            drawText(210, 120, "COMP", "gate-label", "middle");
            
        } else if (key === "comparator_4bit") {
            // Composite inputs view to keep it clean
            drawText(210, 95, "4-BIT COMP", "gate-label", "middle");
            
            // Render numerical representations
            const valA = (ins.A3*8) + (ins.A2*4) + (ins.A1*2) + ins.A0;
            const valB = (ins.B3*8) + (ins.B2*4) + (ins.B1*2) + ins.B0;
            
            drawText(210, 120, `A = ${valA}`, "pin-label", "middle");
            drawText(210, 135, `B = ${valB}`, "pin-label", "middle");
            
            // Draw schematic entry ports
            drawWire("M 40,75 L 150,75", ins.A3);
            drawWire("M 40,95 L 150,95", ins.A2);
            drawWire("M 40,125 L 150,125", ins.B3);
            drawWire("M 40,145 L 150,145", ins.B2);
            
            drawText(20, 79, "A[3:0]");
            drawText(20, 129, "B[3:0]");
            
            drawPinVal(65, 75, ins.A3);
            drawPinVal(65, 125, ins.B3);
        }
        
    } else if (key.startsWith("parity")) {
        // PARITY GENERATOR / CHECKER
        const outputsVal = Object.values(outs)[0] || 0;
        
        // Draw Parity Block Box
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "150");
        rect.setAttribute("y", "35");
        rect.setAttribute("width", "120");
        rect.setAttribute("height", "150");
        rect.setAttribute("rx", "12");
        rect.setAttribute("class", `gate-shape ${outputsVal ? 'active' : ''}`);
        rect.setAttribute("fill", "#101026");
        svg.appendChild(rect);
        
        drawWire("M 270,110 L 350,110", outputsVal);
        drawPinVal(305, 110, outputsVal);
        
        if (key === "parity_generator") {
            const A = ins.A || 0;
            const B = ins.B || 0;
            const C = ins.C || 0;
            
            drawWire("M 40,65 L 150,65", A);
            drawWire("M 40,110 L 150,110", B);
            drawWire("M 40,155 L 150,155", C);
            
            drawText(30, 69, "A");
            drawText(30, 114, "B");
            drawText(30, 159, "C");
            
            drawPinVal(70, 65, A);
            drawPinVal(70, 110, B);
            drawPinVal(70, 155, C);
            
            drawText(210, 95, "PARITY", "gate-label", "middle");
            drawText(210, 115, "GEN", "gate-label", "middle");
            drawText(360, 114, "P (Even)");
            
        } else if (key === "parity_checker") {
            const A = ins.A || 0;
            const B = ins.B || 0;
            const C = ins.C || 0;
            const P = ins.P || 0;
            
            drawWire("M 40,55 L 150,55", A);
            drawWire("M 40,90 L 150,90", B);
            drawWire("M 40,130 L 150,130", C);
            drawWire("M 40,165 L 150,165", P);
            
            drawText(30, 59, "A");
            drawText(30, 94, "B");
            drawText(30, 134, "C");
            drawText(30, 169, "P");
            
            drawPinVal(70, 55, A);
            drawPinVal(70, 90, B);
            drawPinVal(70, 130, C);
            drawPinVal(70, 165, P);
            
            drawText(210, 95, "PARITY", "gate-label", "middle");
            drawText(210, 115, "CHECK", "gate-label", "middle");
            drawText(360, 114, "Error");
        }
    }
    
    elements.svgContainer.appendChild(svg);
}
// --- 7. CIRCUIT SWITCHING SYSTEM ---
function selectCircuit(key) {
    activeCircuitKey = key;
    const data = circuitDatabase[key];
    
    // Update textual properties
    elements.circuitName.textContent = data.name;
    elements.circuitType.textContent = data.category;
    elements.circuitBadgeType.textContent = data.badge;
    elements.circuitDescription.textContent = data.description;
    
    // Formatting multi-line boolean expressions in the inspector
    elements.circuitExpression.innerHTML = data.expression.replace(/\n/g, "<br>");
    
    // Update Challenge view prompt
    elements.challengePrompt.textContent = `Goal: ${data.challenge.goalText}`;
    
    // Render dynamic components
    renderToggles(key);
    buildTruthTable(key);
    evaluateCircuit(); // Initial evaluate with all inputs set to 0
}
// API Status Helper
function setApiStatus(online) {
    apiOnline = online;
    const statusBar = document.querySelector('.status-bar');
    const statusText = document.querySelector('.status-text');
    
    if (online) {
        statusBar.className = 'status-bar api-online';
        statusText.textContent = 'AI API ONLINE';
    } else {
        statusBar.className = 'status-bar api-offline';
        statusText.textContent = 'LOCAL SIMULATOR (API OFFLINE)';
    }
}
function checkApiConnection() {
    fetch(`${API_URL}/circuits`)
        .then(res => {
            if (res.ok) {
                // If transitioning from offline to online, update status and evaluate
                if (!apiOnline) {
                    setApiStatus(true);
                    evaluateCircuit();
                }
            } else {
                setApiStatus(false);
            }
        })
        .catch(err => {
            setApiStatus(false);
        });
}
// --- 8. INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    selectCircuit("and_gate");
    
    // Check connection to prediction server
    checkApiConnection();
    // Periodically poll connection status every 5 seconds
    setInterval(checkApiConnection, 5000);
});