//#region 2. MODELO DE DATOS (MODELS)

class LabItems {
    constructor (id, nombre, descripcion, fecha, cantidad){
        this.id = id;
        this.nombre = nombre ;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.cantidad = cantidad;
        }
  }
  
  function mapAPIToProducts(data) {
    return data.map(prod => {
      return new LabItems(
        prod.id,
        prod.nombre,
        prod.descripcion,
        new Date(prod.fecha),
        prod.cantidad,
      );
    });
  }
  
  class ItemDescriptor {
  
    constructor(id, nombre, cantidad) {
      this.id = id;
      this.nombre = nombre;
      this.cantidad = cantidad;
    }
  
  }
  
  
  function mapAPIToItemDescriptors(data) {
    return data.map(item => {
      return new ItemDescriptor(
        item.id,
        item.nombre,
        item.cantidad
      );
    });
  }
  
  //#endregion
  
//#region 3. VENTAS (VIEW)

function displayProductsView(products) {

    clearTable();
  
    showLoadingMessage();
  
    if (products.length === 0) {
  
      showNotFoundMessage();
  
    } else {
  
      hideMessage();
  
      displayProductsTable(products);
    }
  
  }
  
  
  function displayClearProductsView() {
    clearTable();
  
    showInitialMessage();
  }
  
  function displayProductsTable(products) {
  
    const tablaBody = document.getElementById('data-table-body');
  
    products.forEach(product => {
  
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.nombre}</td>
        <td>${product.descripcion}</td>
        <td>${formatDate(product.fecha)}</td>
        <td>${product.cantidad}</td>
        <td>
          <button class="btn-delete" data-product-id="${product.id}">Eliminar</button>
        </td>
      `;
  
      tablaBody.appendChild(row);
  
    });
  
    initDeleteProductButtonHandler();
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
  
    message.innerHTML = 'No se ha realizado una consulta de productos.';
  
    message.style.display = 'block';
  }
  
  function showNotFoundMessage() {
    const message = document.getElementById('message');
  
    message.innerHTML = 'No se encontraron productos con el filtro proporcionado.';
  
    message.style.display = 'block';
  }
  
  function hideMessage() {
    const message = document.getElementById('message');
  
    message.style.display = 'none';
  }
  
  //#endregion
  
//#region 4. FILTROS (VIEW)

function initFilterButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
      event.preventDefault();
      searchProducts();
    });
  
    document.getElementById('reset-filters').addEventListener('click', () => clearProducts());
  
  }
  
  
  function clearProducts() {
    document.querySelector('select.filter-field').selectedIndex = 0;
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  
    displayClearProductsView();
  }
  
  
  function resetProducts() {
    document.querySelector('select.filter-field').selectedIndex = 0;
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
    searchProducts();
  }
  
  
  function searchProducts() {
    const product = document.getElementById('product-filter').value;
    const quantity = document.getElementById('quantity-filter').value;
    const fecha = document.getElementById('date-filter').value;
    
    getProductsData(product, quantity , fecha);
  }
  
  //#endregion
  
//#region 5. BOTONES PARA AGREGAR Y ELIMINAR VENTAS (VIEW)

function initAddProductButtonsHandler() {

  document.getElementById('addStock').addEventListener('click', () => {
    openAddProductModal()
  });

  document.getElementById('modal-background').addEventListener('click', () => {
    closeAddProductModal();
  });

  document.getElementById('item-form').addEventListener('submit', event => {
    event.preventDefault();
    processSubmitProduct();
  });
  
  }
  function openAddProductModal() {
    document.getElementById('item-form').reset();
    document.getElementById('modal-background').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
  }
  
  
  function closeAddProductModal() {
    document.getElementById('item-form').reset();
    document.getElementById('modal-background').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
  }
  
  
  function processSubmitProduct() {
    const product = document.getElementById('product-field').value;
    const describe = document.getElementById('describe-field').value;
    const dateofRec = document.getElementById('dateofRec-field').value;
    const quantity = document.getElementById('quantity-field').value;

    const saleToSave = new LabItems(
      null,
        product,
        describe,
        dateofRec,
        quantity,
    );
  
    createProduct(saleToSave);
  }
  
  
  function initDeleteProductButtonHandler() {
  
    document.querySelectorAll('.btn-delete').forEach(button => {
  
      button.addEventListener('click', () => {
  
        const itemID = button.getAttribute('data-product-id');
        deleteProduct(itemID); 
  
      });
  
    });
  
  }
  
  
  //#endregion
  
//#region 6. CARGAR DATOS DE MODELOS PARA FORM (VIEW)
function displayItemOptions(items) {


  
    items.forEach(item => {
  
      const optionFilter = document.createElement('option');
  
      optionFilter.value = item.nombre;
      optionFilter.text = `${item.nombre} - ${(item.cantidad)}`;
  
     
  
      const optionModal = document.createElement('option');
 
   
    });
  
  }

  
  
  //#endregion
   
//#region 7. CONSUMO DE DATOS DESDE API

function getItemData() {
    fetchAPI(`${apiURL}/laboratorio`, 'GET')
      .then(data => {
        const itemsList = mapAPIToItemDescriptors(data);
        displayItemOptions(itemsList);
      });
  
  }
  
  
  function getProductsData(item, nombre, cantidad, fecha) {
  
    const url = buildGetProductsDataUrl(item,nombre,cantidad,fecha);
  
    fetchAPI(url, 'GET')
      .then(data => {
        const productsList = mapAPIToProducts(data);
        displayProductsView(productsList);
      });
  }
  
  
  function deleteProduct(itemID) {
  
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar el producto ${itemID}?`);
  
    if (confirm) {
  
      fetchAPI(`${apiURL}/laboratorio/${itemID}`, 'DELETE')
        .then(() => {
          resetProducts();
          window.alert("Producto eliminada.");
        });
  
    }
  }

  function createProduct(product) {

    fetchAPI(`${apiURL}/laboratorio`, 'POST', product)
      .then(product => {
        closeAddProductModal();
        resetProducts();
        window.alert(`Producto ${product.id} creada correctamente.`);
      });
  
  }


function buildGetProductsDataUrl(item, nombre, cantidad, fecha) {

  const url = new URL(`${apiURL}/laboratorio`);

  if (item) {
    url.searchParams.append('item', item);
  }

  if (nombre) {
    url.searchParams.append('nombre', nombre);
  }

  if (cantidad) {
    url.searchParams.append('cantidad', cantidad);
  }

  if (fecha) {
    url.searchParams.append('fecha', fecha);
  }

  return url;
}




  
  //#endregion
  
//#region 8. INICIALIZAMOS FUNCIONALIDAD (CONTROLLER)

initAddProductButtonsHandler();

initFilterButtonsHandler();

getItemData();

//#endregion




