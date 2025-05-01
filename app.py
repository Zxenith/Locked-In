import os
import datetime
from os import environ as env
from dotenv import load_dotenv
import jwt
from flask_bcrypt import Bcrypt
from flask import Flask, redirect, session, url_for, request, flash, jsonify, make_response
import utils
import utils.data_utils
from utils.gemini_utils import get_career_roadmap
import utils.pdf_utils
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['APP_SECRET_KEY']
bcrypt = Bcrypt(app)
db = utils.data_utils.connect_db()

CORS(app)

def generate_token(user):
    payload = {
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        return jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route("/register", methods=["POST"])
def register():
    data = request.form
    if utils.data_utils.find_user_by_email(data['email']):
        return jsonify({"error": "User already exists"}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user_data = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password
    }
    db.users.insert_one(user_data)
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.form
    user = utils.data_utils.find_user_by_email(data['email'])
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        token = generate_token(user)
        return jsonify({"message": "Login successful", "token": token})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/logout")
def logout():
    # In a stateless JWT system, logout is handled on client side by discarding the token
    return jsonify({"message": "Logout successful. Please discard token on client side."})

def get_token_from_header():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    return None

@app.route("/", methods=["GET"])
def home():
    token = get_token_from_header()
    user_data = verify_token(token)
    if user_data:
        user = utils.data_utils.find_user_by_email(user_data['email'])
        return jsonify({
            "name": user['name'],
            "email": user['email'],
            "user_data": user
        })
    return jsonify({"message": "Not logged in"}), 401

@app.route("/predict", methods=["POST"])
def profile():
    token = get_token_from_header()
    user_data = verify_token(token)
    if not user_data:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.form

    try:
        user_input = {
            "name": data['name'],
            "email": data['email'],
            "age_group": data['age_group'],
            "current_role": data['current_role'],
            "industry": data['industry'],
            "experience": data['experience'],
            "career_goal": data['career_goal'],
            "new_career": data['new_career'],
            "career_switch": data['career_switch'],
            "skills": data.getlist('skills') if isinstance(data.getlist('skills'), list) else data['skills'],
            "learning_style": data['learning_style'],
            "time_commitment": data['time_commitment'],
            "budget": data['budget']
        }

        utils.data_utils.insert_or_update_user(user_input)
        profile = utils.data_utils.find_user_by_email(user_input['email'])
        output = get_career_roadmap(profile)
        return jsonify({"prediction": output})
    except Exception as e:
        return jsonify({"error": f"Error processing profile: {str(e)}"}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    token = get_token_from_header()
    user_data = verify_token(token)
    if not user_data:
        return jsonify({"error": "Unauthorized"}), 401

    if 'pdf_file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['pdf_file']
    goal = request.form['goal']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        resume_text = utils.pdf_utils.extract_text_from_pdf(file_path)
        data = {'resume': resume_text, 'goal': goal}
        output = get_career_roadmap(data)
        return jsonify({"prediction": output})
    else:
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(env.get("PORT", 3000)))
