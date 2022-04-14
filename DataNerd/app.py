from flask import Flask, render_template, jsonify, make_response

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.eldenring

# Set bar chart route
@app.route('/home')
def home():

    # Return the homepage template
    return render_template('home.html')

# Set column bar chart route
@app.route('/weapons')
def weapons():

    # Return the chart page template
    return render_template('weapons.html')

# Set column bar chart route
@app.route('/classes')
def classes():

    # Return the chart page template
    return render_template('classes.html')

# Set weapon API route
@app.route('/api/weapon+summary')
def api_weaponsummary():
    return jsonify(list(db.weaponsummary.find({},{'_id':False})))

# Set weapon API route
@app.route('/api/classes')
def api_classes():
    return jsonify(list(db.classes.find({},{'_id':False})))

if __name__ == "__main__":
    app.run(debug=True)
