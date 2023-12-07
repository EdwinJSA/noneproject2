$(document).ready(function () {
  var socket = io();
    canalActual = localStorage.getItem("Canales");
    var roomName = canalActual;
    var figura = $("#Figura_omar");
    console.log(roomName);
    $("#name_room").text(roomName);
    socket.emit("cargar_mensajes",roomName);

  socket.emit('cargar_rooms', "cargar datos");
  socket.on("cargar_rooms2", (data) => {
    console.log(data);

    let list_room = $('#roomList')
    let objetoJSON = data;

    for (let clave in objetoJSON) {
      console.log(clave);
      var roomName = clave;
      var roomHtml = `
            <li class="list" id="${roomName}" value="${roomName}">
            <a class="list-item active box">
              <div class="media">
                <div class="media-content is-hidden-mobile">
                  <div class="content">
                    <p>
                      <strong>${roomName}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
    `;
      $('#roomList').append(roomHtml);
    }

  });


  $('#roomList').on('click', '.enterRoomBtn', function () {
    console.log('Botón "Enter" clickeado');
    $('#usernameModal').modal('show');
  });


  $('#saveRoomBtn').on('click', function () {
    var roomName = $('#roomNameInput').val();
    if (roomName.trim() === '') {
      swal("¡Error!", "Por favor, ingrese un nombre de sala válido.", "error");
      return;
    }

    if ($('#' + roomName.replace(/\s/g, '')).length > 0 || roomName.trim() === '') {
      swal("¡Error!", "El nombre de sala ya está en uso. Por favor, ingrese un nombre de sala único.", "error");
      return;
    }

    socket.emit('create_room', { 'roomName': roomName });
    $('#createRoomModal').modal('hide');
  });


  socket.on('room_created', function (data) {
    var roomName = data.roomName;
    var roomHtml = `
        <li class="list" id="${roomName}" value="${roomName}">
        <a class="list-item active box">
          <div class="media">
            <div class="media-content is-hidden-mobile">
              <div class="content">
                <p>
                  <strong>${roomName}</strong>
                </p>
              </div>
            </div>
          </div>
        </a>
      </li>
`;

    $('#roomList').on('click', '.enterRoomBtn', function () {
      $('#usernameModal').modal('show');
    });


    $('#roomList').append(roomHtml);
    console.log('Sala creada:', roomName);
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: `Sala ${roomName} exitosamente`
    })

  });


  $('#roomList').on('click', 'li', event => {
    var roomName = event.currentTarget.id;
    var figura = $("#Figura_omar");
    console.log(roomName);
    $("#name_room").text(roomName);
    localStorage.setItem("Canales", roomName);
    socket.emit("cargar_mensajes",roomName);
  
  });


  $('#search').on('input', function () {
    var searchValue = $(this).val().toLowerCase();

    $('#roomList .list-item').each(function () {
      var roomName = $(this).find('strong').text().toLowerCase();
      if (roomName.includes(searchValue)) {
        $(this).slideDown();
        if (roomName === searchValue) {
          $(this).insertBefore($('#roomList .list-item:first'));
        }
      } else {
        $(this).slideUp();
      }
    });
    if (searchValue === '') {
      $('#roomList .list-item').slideDown();
    }
  });


  socket.on('cargar_mensajesJS', function(dataM) {
    const padre = document.getElementById('agregar-mensaje');
    const usersContainer = document.getElementById('users');
  
    while (padre.firstChild) {
      padre.removeChild(padre.firstChild);
    }
  
    usersContainer.innerHTML = '';
  
    const usuariosEnSala = dataM.map(mensaje => mensaje.Usuario);
    const usuariosUnicos = [...new Set(usuariosEnSala)];
  
    const usuariosText = document.createElement("p");
    usuariosText.innerText = "Online users";
    usuariosText.classList.add("text-lg", "font-bold", "mb-2");
    usersContainer.appendChild(usuariosText);
  
    usuariosUnicos.forEach(nombreUsuario => {
      const section = document.createElement("section");
      section.classList.add("bg-gray-100", "py-8", "is-visible-mobile");
  
      const divProfile = document.createElement("div");
      divProfile.classList.add("max-w-2xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "is-rounded");
    });
  
    dataM.forEach(mensaje => {
      const div = document.createElement('div');
      const time = document.createElement('time');
      const p = document.createElement('p');
  
      div.classList.add('bg-gray-100', 'border', 'border-gray-200', 'rounded-lg', 'px-4', 'py-2', 'max-w-lg');
  
      time.classList.add('mb-1', 'text-xs', 'font-normal', 'text-black-900', 'sm:order-last', 'sm:mb-0');
      time.setAttribute('id', 'datetime');
  
      p.classList.add('mb-2', 'break-all');
      p.setAttribute('id', 'root');
  
      const nombreUsuario = mensaje.Usuario;
      const mensajeTexto = mensaje.Mensaje;
  
      p.innerText += nombreUsuario + ": " + mensajeTexto;
      p.innerHTML += "<br/><br/>";
      time.innerHTML = mensaje.Date;
  
      div.appendChild(time);
      div.appendChild(p);
  
      padre.appendChild(div);
    });
  });
});


