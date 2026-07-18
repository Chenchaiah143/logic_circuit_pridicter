"""
api.py
------
Lightweight Python API server for the Combinational Circuit Predictor.
Loads trained models and listens on http://localhost:5000/ for prediction requests.
Built using python's built-in http.server to avoid external dependencies.
"""
import os
import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import joblib
import numpy as np
# Resolve project folders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
class APIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        # Enable CORS
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", content_type)
        self.end_headers()
    def do_OPTIONS(self):
        # Handle CORS preflight request
        self._set_headers(204)
    def do_GET(self):
        if self.path == "/api/circuits":
            try:
                circuits = self._list_circuits()
                self._set_headers(200)
                self.wfile.write(json.dumps(circuits).encode("utf-8"))
            except Exception as e:
                self._send_error(500, str(e))
        else:
            self._send_error(404, "Endpoint not found")
    def do_POST(self):
        if self.path == "/api/predict":
            try:
                # Read content length
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    self._send_error(400, "Empty payload")
                    return
                # Parse JSON body
                post_data = self.rfile.read(content_length)
                payload = json.loads(post_data.decode("utf-8"))
                
                circuit_name = payload.get("circuit")
                inputs = payload.get("inputs", {})
                if not circuit_name:
                    self._send_error(400, "Missing 'circuit' parameter")
                    return
                # Predict logic
                outputs = self._predict(circuit_name, inputs)
                
                self._set_headers(200)
                self.wfile.write(json.dumps(outputs).encode("utf-8"))
            except FileNotFoundError as fnf:
                self._send_error(404, str(fnf))
            except Exception as e:
                self._send_error(500, f"Prediction error: {str(e)}")
        else:
            self._send_error(404, "Endpoint not found")
    def _list_circuits(self):
        if not os.path.isdir(MODELS_DIR):
            return []
        names = []
        for f in os.listdir(MODELS_DIR):
            if f.endswith(".joblib"):
                names.append(f[:-len(".joblib")])
        return sorted(names)
    def _predict(self, circuit_name, inputs_dict):
        model_path = os.path.join(MODELS_DIR, f"{circuit_name}.joblib")
        meta_path = os.path.join(MODELS_DIR, f"{circuit_name}_meta.json")
        if not os.path.exists(model_path) or not os.path.exists(meta_path):
            raise FileNotFoundError(
                f"Model or metadata for circuit '{circuit_name}' was not found. Please train models first."
            )
        # Load models
        model = joblib.load(model_path)
        with open(meta_path, "r") as f:
            meta = json.load(f)
        input_cols = meta["inputs"]
        output_cols = meta["outputs"]
        # Parse inputs in order
        values = []
        for col in input_cols:
            val = inputs_dict.get(col, 0)
            values.append(int(val))
        X = np.array(values, dtype=int).reshape(1, -1)
        
        # Predict using model
        prediction = model.predict(X)[0]
        if not isinstance(prediction, (list, np.ndarray)):
            prediction = [prediction]
        # Structure response
        results = {}
        for col, val in zip(output_cols, prediction):
            results[col] = int(val)
        return {
            "circuit": circuit_name,
            "inputs": {k: v for k, v in zip(input_cols, values)},
            "outputs": results
        }
    def _send_error(self, code, message):
        self._set_headers(code)
        response = {"error": message}
        self.wfile.write(json.dumps(response).encode("utf-8"))
    def log_message(self, format, *args):
        # Route standard request logging to stderr so tail works nicely
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.client_address[0],
                          self.log_date_time_string(),
                          format%args))
def run(server_class=HTTPServer, handler_class=APIHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"API Server listening on http://localhost:{port}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping API server...")
        httpd.server_close()
if __name__ == "__main__":
    run()
