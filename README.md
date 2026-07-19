# Logic Circuit Lab — Interactive Combinational Predictor

An interactive, browser-based simulator for logic gates and combinational circuits. Toggle input pins, watch a live SVG schematic update, see the matching row light up in the truth table, and solve built-in lab challenges. Optionally connects to a local Python prediction API, with automatic fallback to local (in-browser) evaluation if the API isn't running.

---

## ✨ Features

- **14 built-in circuits** — 7 basic logic gates + 7 advanced combinational circuits
- **Live interactive schematic** — SVG diagram redraws with glowing HIGH/LOW states as you toggle inputs
- **Dynamic truth table** — full table generated per circuit, with the row matching your current inputs highlighted in real time
- **Lab Challenges** — each circuit ships with a mini puzzle ("configure inputs so output = 1", etc.) with live PENDING → SOLVED feedback
- **Hybrid evaluation engine** — tries a local Python API first for predictions; falls back automatically to local JavaScript logic if the API is offline
- **Clean glassmorphism UI** — dark theme, glowing accents, responsive layout, no build step required

---

## 🗂️ Circuit Database

**Basic Gates**
| Gate | Inputs |
|------|--------|
| NOT  | 1 |
| AND  | 2 |
| OR   | 2 |
| NAND | 2 |
| NOR  | 2 |
| XOR  | 2 |
| XNOR | 2 |

**Advanced Circuits**
| Circuit | Description |
|---|---|
| Half Adder | Adds 2 single bits → Sum, Carry |
| Full Adder | Adds 2 bits + Carry-in → Sum, Carry-out |
| Half Subtractor | Subtracts 2 single bits → Difference, Borrow |
| Full Subtractor | Subtracts 2 bits + Borrow-in → Difference, Borrow-out |
| 1-Bit Comparator | Compares 2 bits → A>B, A=B, A<B |
| Parity Generator | Generates a parity bit for input data |
| Parity Checker | Checks parity bit validity |

---

## 📁 Project Structure

```
logic-gate-lab/
├── index.html        # Page layout — sidebar, schematic, truth table, challenge panel
├── style.css          # Dark glassmorphism theme, layout, animations
├── app.js             # Circuit database, evaluation logic, SVG schematic renderer, API integration
├── app.py             # Lightweight Python API server (predicts outputs using trained ML models)
└── README.md
```

---

## 🚀 Getting Started

The frontend is plain HTML/CSS/JS — no build step needed. The Python API is optional and only needed if you want ML-predicted (rather than locally computed) outputs.

### 1. Run the frontend only (simplest)
1. Download or clone the project folder.
2. Open `index.html` directly in a browser, or serve it locally:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000` (or just open the file directly).

With no API running, everything still works — the app quietly falls back to its own local JavaScript logic (`circuit.eval()`) for every prediction, and the status badge in the header shows the connection as offline.

### 2. Run the full stack (frontend + Python prediction API)
1. Install the one dependency the API needs:
   ```bash
   pip install joblib numpy
   ```
2. Start the API server:
   ```bash
   python app.py
   ```
   It listens on `http://localhost:5000/`.
3. Open `index.html` (or serve it as above). The header status badge turns **online** once it detects the API, and predictions now come from the trained model instead of local logic.

> If the API is stopped or a prediction fails, the app automatically falls back to local evaluation — nothing breaks either way.

### Using it
1. Pick a circuit from the **Circuit Database** sidebar (Basic Gates or Advanced Circuits).
2. Use the **toggle switches** under the schematic to set each input pin (A, B, Cin, etc.) HIGH or LOW.
3. Watch the **schematic** light up and the **truth table** row highlight automatically.
4. Try to **solve the Lab Challenge** shown in the info card — it turns green and shows "SOLVED" once you find the right input combination.

---

## 🔌 Python Prediction API Reference

`app.py` is a dependency-light server built on Python's built-in `http.server` (no Flask/FastAPI required). CORS is enabled so it can be called directly from the browser.

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/circuits` | Lists the circuits currently available for prediction |
| `POST` | `/predict` | Runs a prediction for a given circuit + input values |

**Predict request**
```jsonc
POST /api/predict
{ "circuit": "half_adder", "inputs": { "A": 1, "B": 0 } }
```

**Predict response**
```jsonc
{
  "circuit": "half_adder",
  "inputs": { "A": 1, "B": 0 },
  "outputs": { "Sum": 1, "Carry": 0 }
}
```

If a requested circuit isn't available for prediction, the API returns a `404` with an error message, and `app.js` transparently falls back to local evaluation.

`app.js` polls `GET /api/circuits` every 5 seconds (`checkApiConnection`) to keep the header's online/offline status badge in sync with the server.

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, glassmorphism/glow effects, responsive grid
- **Vanilla JavaScript** — no frameworks; dynamic SVG generation, DOM rendering, `fetch` API
- **Google Fonts** — Inter, Outfit, Fira Code
- **Python (`http.server`)** — zero-framework REST API for serving ML predictions
- **joblib + NumPy** — loading trained scikit-learn models and running inference

---

## 📌 Notes

- All circuit logic, truth tables, and schematics are generated dynamically from a single `circuitDatabase` object in `app.js` — adding a new gate/circuit means adding one new entry there.
- `app.py` only *serves* predictions — it expects a trained model to already exist for the API to load (e.g. produced by a separate scikit-learn training script using `MLPClassifier` or similar).
- The frontend never requires the API to function — it's a drop-in accelerator/showcase for a trained ML model, not a hard dependency.

---

## 📄 License

Personal / academic project. Feel free to adapt for coursework or learning purposes.
## Reference 
Google Antigravity (AI)- For project guidance   
Claude AI - For documentation 
📧 Contact email id -thathachenchaiah506@gmail.com

## Summary
🔌 Interactive Schematic - Toggle inputs and watch your circuit come alive
A few more in the same style if you want options to pick from:
🗂️ Circuit Explorer - Browse 14 built-in gates and combinational circuits
📋 Live Truth Table - Watch your active input row highlight in real time
🏆 Lab Challenges - Solve live puzzles by wiring the right inputs
