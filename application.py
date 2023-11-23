import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Aquí se guardarán los canales creados
canales = set()

@app.route("/")
def index():
    return render_template('home.html', canales=canales)

@socketio.on('crearCanal')
def crearCanal(nombres):
    canal = nombres['canal']
    print(canal)
    if canal not in canales:
        canales.add(canal)
        print(canales)
        socketio.emit('update_channels', {'canales': list(canales)}, broadcast=True)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    nombre = data['nombre']
    print(nombre)
    join_room(room)
    emit('message', {'msg': f'{nombre} se unió al chat {room}'}, room=room)
    
MAX_MESSAGES = 5  # Definir la cantidad máxima de mensajes a almacenar por sala
messages = {} 

@socketio.on('mensaje')
def handle_message(data):
    room = data['room']
    sender = data['sender']
    message = data['msg']

    # Almacenar el mensaje en el formato "Remitente: mensaje" en el diccionario
    if not messages.get(room):
        messages[room] = []

    messages[room].append(f'{sender}: {message}')

    # Limitar la cantidad de mensajes almacenados
    messages[room] = messages[room][-MAX_MESSAGES:]

    # Emitir todos los mensajes almacenados a la sala
    emit('message', {'msg': messages[room]}, room=room)

if __name__ == '__main__':
    socketio.run(app)
