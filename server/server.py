from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='../client/public', static_url_path='/public')


@app.route('/health-check')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/assets/<path:path>')
def assets(path):
    return send_from_directory('../client/public/assets', path)

@app.route('/build/<path:path>')
def build(path):
    return send_from_directory('../client/public/build', path)

@app.route('/global.css')
def global_css():
    return app.send_static_file('global.css')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    print(repr(path))
    return app.send_static_file('index.html')