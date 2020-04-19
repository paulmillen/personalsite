from flask import Flask, jsonify

app = Flask(__name__, static_folder='../build', static_url_path="/build")


@app.route('/health-check')
def health_check():
    return jsonify({"status": "healthy"})


@app.route('/', defaults={'path': ''})
def root(path):
    return app.send_static_file("index.html")