from flask import Flask, jsonify, request
from flask_cors import CORS
from predict import infer

app = Flask(__name__)
CORS(app)

@app.route("/guess", methods=['POST'])
def predict():
    data = request.json
    img_base = data["img"]

    result = infer(img_base)

    return jsonify({
        'prediction': result
    })

app.run(host="0.0.0.0", port=8080)