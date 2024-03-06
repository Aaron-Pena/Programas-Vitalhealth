//#region 2. MODELO DE DATOS (MODELS)

class Task {
  constructor(id, nombre, descripcion, fecha, cantidad) {
    this.id = id;
    this.nombre = nombre ;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.cantidad = cantidad; 
  }
}

function mapAPIToTasks(data) {
  return data.map(item => {
    return new Task(
      item.id,
      item.nombre,
      item.descripcion,
      new Date(item.fecha),
      item.cantidad
    );
  });
}

class TaskDescriptor {

  constructor(id, nombre, cantidad) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }

}


function mapAPIToTaskDescriptors(data) {
  return data.map(task => {
    return new TaskDescriptor(
      task.id,
      task.nombre,
      task.cantidad
    );
  });
}

//#endregion

//#region 3. VENTAS (VIEW)

function displayTasksView(tasks) {

  clearTable();

  showLoadingMessage();

  if (tasks.length === 0) {

    showNotFoundMessage();

  } else {

    hideMessage();

    displayTasksTable(tasks);
  }

}


function displayClearTasksView() {
  clearTable();

  showInitialMessage();
}

function displayTasksTable(tasks) {
  const tablaBody = document.getElementById('data-table-body');

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.id}</td>
      <td class="editable" contenteditable="false">${task.nombre}</td>
      <td class="editable" contenteditable="false">${task.descripcion}</td>
      <td class="editable" contenteditable="false">${formatDate(task.fecha)}</td>
      <td class="editable" contenteditable="false">${task.cantidad}</td>
      <td>
        <button class="btn-update" data-task-id="${task.id}">Editar</button>
        <button class="btn-delete" data-task-id="${task.id}">Eliminar</button>
      </td>
    `;

    const editButton = row.querySelector('.btn-update');
    editButton.addEventListener('click', () => {
      toggleEditRow(row);
    });

    tablaBody.appendChild(row);
  });

  initDeleteTaskButtonHandler();
}

function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}

function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron consultas con el filtro proporcionado.';

  message.style.display = 'block';
}

function hideMessage() {
  const message = document.getElementById('message');

  message.style.display = 'none';
}



function toggleEditRow(row) {

  const editButton = row.querySelector('.btn-update');
  const taskId = editButton.getAttribute('data-task-id');
  const editableCells = row.querySelectorAll('.editable');

  if (editButton.textContent === 'Editar') {
    editButton.textContent = 'Guardar';
    editButton.classList.add('btn-update-saving');
    editableCells.forEach(cell => {
      cell.contentEditable = 'true';
    });
  } else {
    editButton.textContent = 'Editar';
    editButton.classList.remove('btn-update-saving'); 
    editableCells.forEach(cell => {
      cell.contentEditable = 'false';
    });

    const taskData = {
      id:taskId,
      nombre: row.cells[1].textContent,
      descripcion: row.cells[2].textContent,
      fecha: row.cells[3].textContent,
      cantidad: row.cells[4].textContent,
    };

    saveEdit(taskId,taskData);
  };
}


//#endregion

//#region 4. FILTROS (VIEW)

function initFilterButtonsHandler() {

  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    searchTasks();
  });

  document.getElementById('reset-filters').addEventListener('click', () => clearTasks());

}


function clearTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');

  displayClearTasksView();
}


function resetTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
 searchTasks();
}


function searchTasks() {
  const nombre = document.getElementById('product-filter').value;
  const fecha = document.getElementById('date-filter').value;
  const cantidad = document.getElementById('quantity-filter').value;
  

  getTasksData(nombre, fecha ,cantidad);
}

//#endregion

//#region 5. BOTONES PARA AGREGAR Y ELIMINAR VENTAS (VIEW)

function initAddTaskButtonsHandler() {

document.getElementById('addStock').addEventListener('click', () => {
  openAddTaskModal()
});

document.getElementById('modal-background').addEventListener('click', () => {
  closeAddTaskModal();
});

document.getElementById('item-form').addEventListener('submit', event => {
  event.preventDefault();
  processSubmitTask();
});

}
function openAddTaskModal() {
  document.getElementById('item-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}


function closeAddTaskModal() {
  document.getElementById('item-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}


function processSubmitTask() {
  const product = document.getElementById('product-field').value;
  const describe = document.getElementById('describe-field').value;
  const dateofRec = document.getElementById('dateofRec-field').value;
  const quantity = document.getElementById('quantity-field').value;

  
 const taskToSave = new Task(
    null,
    product,
    describe,
    dateofRec,
    quantity,
  );

  createTask(taskToSave);
}


//#endregion

function initDeleteTaskButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id');
      deleteTask(taskId); 

    });

  });

}




//#endregion

//#region 6. CARGAR DATOS DE MODELOS PARA FORM (VIEW)


//#endregion
 
//#region 7. CONSUMO DE DATOS DESDE API

function getTaskData() {
  fetchAPI(`${apiURL}/laboratorio`, 'GET')
    .then(data => {
      const tasksList = mapAPIToTaskDescriptors(data);
      //displayTaskOptions(tasksList);
    });

}


function getTasksData(nombre, fecha, cantidad) {

  const url = buildGetTasksDataUrl(nombre, fecha, cantidad);

  fetchAPI(url, 'GET')
    .then(data => {
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function createTask(task) {

  fetchAPI(`${apiURL}/laboratorio`, 'POST', task)
    .then(task => {
      closeAddTaskModal();
      //resetTasks();
      window.alert(`Producto ${task.id} creada correctamente.`);
    });

}

function deleteTask(taskId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar el producto ${taskId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/laboratorio/${taskId}`, 'DELETE')
      .then(() => {
       // resetTasks();
        window.alert("Producto eliminada.");
      });

  }
}




function saveEdit(taskId,taskData) {
  fetch(`${apiURL}/laboratorio/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (response.ok) {
        console.log("Datos enviados")
      } else {
        console.error('Error al guardar los datos en el servidor');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud HTTP:', error);
    });
}



function buildGetTasksDataUrl(nombre,fecha, cantidad) {

const url = new URL(`${apiURL}/laboratorio`);

if (nombre) {
  url.searchParams.append('nombre', nombre);
}

if (fecha) {
  url.searchParams.append('fecha', fecha);
}

if (cantidad) {
  url.searchParams.append('cantidad', cantidad);
}


return url;
}

//#endregion

//#region 8. INICIALIZAMOS FUNCIONALIDAD (CONTROLLER)

initAddTaskButtonsHandler();

initFilterButtonsHandler();

getTaskData();

//#endregion




