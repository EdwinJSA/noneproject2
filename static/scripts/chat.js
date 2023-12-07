document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let room;

  var today = new Date();
  var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;

  const send_message = () => {
    room = document.querySelector("#name_room").textContent
    nombre = document.querySelector("#name_user").textContent
    const message = document.querySelector("#message-input").value;
    socket.emit("message", { message, room, nombre, dateTime });
    document.querySelector("#message-input").value = "";
  };

  socket.on("message", (data) => {
    console.log(data);
    const nombreUsuario = data.nombre;
  
    const padre = document.querySelector("#agregar-mensaje");
  
    const div = document.createElement('div');
    const time = document.createElement('time');
    const p = document.createElement('p');
  
    div.classList.add('bg-gray-100', 'border', 'border-gray-200', 'rounded-lg', 'px-4', 'py-2', 'max-w-lg');
  
    time.classList.add('mb-1', 'text-xs', 'font-normal', 'text-black-900', 'sm:order-last', 'sm:mb-0');
    time.setAttribute('id', 'datetime');
  
    p.classList.add('mb-2', 'break-all');
    p.setAttribute('id', 'root');
  
    p.innerText += nombreUsuario + ": " + data.message;
    p.innerHTML += "<br/><br/>";
    time.innerHTML = dateTime;
  
    div.appendChild(time);
    div.appendChild(p);
  
    padre.appendChild(div);
  });

  document.querySelector("#send-message").onclick = () => {
    const inputValue = document.querySelector("#message-input").value.trim();
    if (inputValue.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "No puedes enviar un mensaje vacío",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      });
      return;
    }
    send_message();
    document.querySelector(".emojionearea-editor").innerHTML = "";
    console.log("prueba2");
  };

  document.querySelector("#message-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = document.querySelector("#message-input").value.trim();
      if (inputValue.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Error de Mensaje",
          text: "Mensaje vacío",
          confirmButtonText: "Ok",
        });
        return;
      }
      send_message();
    }
  });

});
