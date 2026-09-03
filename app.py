from flask import Flask, render_template

app = Flask(__name__, 
            template_folder='.',
            static_folder='.')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projekte')
def projekte():
    return render_template('projekte.html')

@app.route('/wohnen')
def wohnen():
    return render_template('wohnen.html')

@app.route('/gewerbe')
def gewerbe():
    return render_template('gewerbe.html')

@app.route('/hotel')
def hotel():
    return render_template('hotel.html')

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/kontakt')
def kontakt():
    return render_template('kontakt.html')

@app.route('/impressum')
def impressum():
    return render_template('impressum.html')

if __name__ == '__main__':
    app.run(debug=True)