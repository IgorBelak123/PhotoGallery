from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

users = []
uploads = []

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if any(user['username'] == username for user in users):
        return jsonify({'error': 'Username already taken'}), 400

    new_user = {'username': username, 'password': password}
    users.append(new_user)

    return jsonify({'message': 'User registered successfully'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    for user in users:
        if user['username'] == username and user['password'] == password:
            return jsonify({'message': 'Login successful'}), 200

    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/users', methods=['GET'])
def get_users():
    user_list = [user['username'] for user in users]
    return jsonify(user_list), 200

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_url = f'http://localhost:5000/uploads/files/{filename}'
    else:
        file_url = request.form.get('picture_url')
        filename = os.path.basename(file_url)

    data = request.form
    username = data.get('username')
    description = data.get('description')
    keyword = data.get('keyword')

    upload_entry = {
        'username': username,
        'filename': filename,
        'file_url': file_url,
        'description': description,
        'keyword': keyword
    }
    uploads.append(upload_entry)
    return jsonify({'message': 'Upload successful'}), 200

@app.route('/uploads', methods=['GET'])
def get_uploads():
    return jsonify(uploads), 200

@app.route('/search', methods=['GET'])
def search():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Keyword is required'}), 400

    filtered_uploads = [upload for upload in uploads if keyword.lower() in upload['keyword'].lower()]
    return jsonify(filtered_uploads), 200

@app.route('/uploads/files/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/update_description', methods=['POST'])
def update_description():
    data = request.json
    username = data.get('username')
    filename = data.get('filename')
    new_description = data.get('description')
    new_keyword = data.get('keyword')

    for upload in uploads:
        if upload['username'] == username and upload['filename'] == filename:
            upload['description'] = new_description
            upload['keyword'] = new_keyword
            return jsonify({'message': 'Description and keyword updated successfully'}), 200

    return jsonify({'error': 'Upload not found or unauthorized'}), 404

messages = []

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    recipient = data.get('recipient')
    sender = data.get('sender')
    content = data.get('content')

    if not recipient or not sender or not content:
        return jsonify({'error': 'All fields are required'}), 400

    message = {
        'recipient': recipient,
        'sender': sender,
        'content': content,
        'replies': []
    }
    messages.append(message)
    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/get_messages/<username>', methods=['GET'])
def get_messages(username):
    user_messages = [message for message in messages if message['recipient'] == username or message['sender'] == username]
    return jsonify(user_messages), 200

@app.route('/reply_message', methods=['POST'])
def reply_message():
    data = request.json
    original_message_index = data.get('original_message_index')
    recipient = data.get('recipient')
    sender = data.get('sender')
    content = data.get('content')

    if original_message_index is None or not recipient or not sender or not content:
        return jsonify({'error': 'All fields are required'}), 400

    reply = {
        'recipient': recipient,
        'sender': sender,
        'content': content
    }
    messages[original_message_index]['replies'].append(reply)
    return jsonify({'message': 'Reply sent successfully'}), 200

@app.route('/delete_message', methods=['POST'])
def delete_message():
    data = request.json
    original_message_index = data.get('original_message_index')

    if original_message_index is None:
        return jsonify({'error': 'Message index is required'}), 400

    try:
        messages.pop(original_message_index)
        return jsonify({'message': 'Message deleted successfully'}), 200
    except IndexError:
        return jsonify({'error': 'Message not found'}), 404

@app.route('/modify_picture', methods=['POST'])
def modify_picture():
    data = request.json
    filename = data.get('filename')
    new_description = data.get('description')
    new_keyword = data.get('keyword')
    username = data.get('username')

    if not filename or not username:
        return jsonify({'error': 'Filename and username are required'}), 400

    for upload in uploads:
        if upload['filename'] == filename and upload['username'] == username:
            upload['description'] = new_description
            upload['keyword'] = new_keyword
            return jsonify({'message': 'Picture details updated successfully'}), 200

    return jsonify({'error': 'Picture not found or unauthorized'}), 404

if __name__ == '__main__':
    app.run(debug=True)
