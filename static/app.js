//Crear CANALES
var socket = io.connect('http://127.0.0.1:5000/');

socket.on('update_channels', function(nombres) {
    updateChannelsList(nombres.canales);
});

function createChannel() {
    let newChannel = document.getElementById('nuevoCanal').value;
    if(newChannel != localStorage.getItem("nombre")){
        socket.emit('crearCanal', {'canal': newChannel});
    }
}

function updateChannelsList(channels) {
    var listaCanales = document.getElementById('listaCanales');
    listaCanales.innerHTML = '';
    channels.forEach(function(canal) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(canal));
        listaCanales.appendChild(li);
    });
}

//HOME
window.onload = function(){
    if (localStorage.getItem("nombre") == null){
        document.getElementById("dialogo").showModal();
    } else {
        document.getElementById("mostrarNombre").innerHTML = localStorage.getItem("nombre");
        document.getElementById('chat').innerHTML = '';

        // Mostrar los mensajes almacenados para la sala actual
        updateChat();
    
        // Emitir el evento 'join' al servidor con la sala actual
        socket.emit('join', { room: room }, nombre);
        console.log('Se emitió el evento join');
    }
}

function guardarNombre(){
    nombre = document.getElementById("nombre").value;
    localStorage.setItem("nombre", nombre);
    document.getElementById("mostrarNombre").innerHTML = nombre;
    document.getElementById("dialogo").close();
}

//cambiar de canal    
function joinRoom() {
    room = document.getElementById('room').value;
    nombre = localStorage.getItem("nombre");
    localStorage.setItem("room", room);

    // Limpiar el contenido del div de chat al cambiar de sala
    document.getElementById('chat').innerHTML = '';
    socket.emit('join', { room: room }, nombre);
    // Mostrar los mensajes almacenados para la sala actual
    updateChat();

    
}

var messages = {};  // Diccionario para almacenar mensajes por sala
const MAX_MESSAGES = 5;
var currentTimeInMilliseconds = Date.now();
var currentDate = new Date(currentTimeInMilliseconds);

function updateChat() {
    var room = document.getElementById('room').value;
    var chatDiv = document.getElementById('chat');
    chatDiv.innerHTML = '';

    // Mostrar los últimos mensajes almacenados para la sala actual
    if (messages[room]) {
        // Obtener las horas, minutos y segundos
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();
        var startIndex = Math.max(0, messages[room].length - MAX_MESSAGES);
        messages[room].slice(startIndex).forEach(function (msg) {
            var newParagraph = document.createElement('p');
            newParagraph.innerHTML = msg + " - " + hours + ":" + minutes + ":" + seconds;  // Usa innerHTML en lugar de textContent
            chatDiv.appendChild(newParagraph);
        });
    }
}

socket.on('message', function(data) {

    // Al recibir un mensaje del servidor, lo agregamos al diccionario
    var room = document.getElementById('room').value;
    if (!messages[room]) {
        messages[room] = [];
    }
    messages[room].push(data.msg);

    // Actualizamos el contenido del div de chat con los mensajes anteriores y el nuevo mensaje
    updateChat();
});


function sendMessage() {
    console.log('funcion sendMessage');
    var room = document.getElementById('room').value;
    var message = document.getElementById('message').value;
    var senderName = localStorage.getItem("nombre");
    console.log(room, message);

    socket.emit('mensaje', { msg: message, room: room, sender: senderName });
    document.getElementById('message').value = '';
}

