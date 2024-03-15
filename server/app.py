from flask import Flask, jsonify, request
from flask_cors import CORS
from predict import infer

app = Flask(__name__)
CORS(app)


@app.route("/guess", methods=['POST'])
def predict():
    data = request.json
    img_base = data["img"].partition(",")[2]

    prediction = infer(img_base)

    return jsonify({
        'prediction': prediction
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)