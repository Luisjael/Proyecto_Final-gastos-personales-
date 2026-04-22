let transacciones = [];
let transaccionEditandoId = null;

async function obtenerTransacciones() {
  try {
    const response = await fetch('https://proyecto-final-gastos-personales-2.onrender.com/api/transacciones');
    transacciones = await response.json();
    renderizarLista();
    actualizarResumen();
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderizarLista() {
  const lista = document.getElementById('lista-transacciones');
  const filtro = document.getElementById('filtro').value;
  
  let filtradas = transacciones;
  if (filtro !== 'todas') {
    filtradas = transacciones.filter(t => t.tipo === filtro);
  }

  lista.innerHTML = '';

  if (filtradas.length === 0) {
    lista.innerHTML = '<p id="sin-resultados">No hay transacciones aún.</p>';
    return;
  }

  filtradas.forEach(t => {
    lista.innerHTML += `
      <div class="transaccion ${t.tipo}">
        <div>
            <strong>${t.descripcion}</strong>
            <small>${t.categoria}</small>
        </div>
        <div>
          <span>$${t.monto}</span>
          <button onclick="editarTransaccion('${t._id}')">✏️</button>
          <button onclick="eliminarTransaccion('${t._id}')">🗑️</button>
        </div>
      </div>
    `;
  });
}

function actualizarResumen() {
  const ingresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balance = ingresos - gastos;

  document.getElementById('total-ingresos').textContent = `$${ingresos.toFixed(2)}`;
  document.getElementById('total-gastos').textContent = `$${gastos.toFixed(2)}`;
  document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

async function agregarTransaccion() {
  const descripcion = document.getElementById('descripcion').value;
  const monto = parseFloat(document.getElementById('monto').value);
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;

  if (!descripcion || !monto || !categoria) {
    alert('Por favor llena todos los campos');
    return;
  }

  try {
    const url = transaccionEditandoId 
  ? `https://proyecto-final-gastos-personales-2.onrender.com/api/transacciones/${transaccionEditandoId}`
  : 'https://proyecto-final-gastos-personales-2.onrender.com/api/transacciones';

      const method = transaccionEditandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, monto, tipo, categoria })
      });

      transaccionEditandoId = null;
      document.querySelector('.formulario button').textContent = 'Agregar';

    await obtenerTransacciones();

    document.getElementById('descripcion').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('categoria').value = '';
  } catch (error) {
    console.error('Error:', error);
  }
}

async function eliminarTransaccion(id) {
  if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;

  try {
    await fetch(`https://proyecto-final-gastos-personales-2.onrender.com/api/transacciones/${id}`, {
      method: 'DELETE'
    });

    transacciones = transacciones.filter(t => t._id !== id);
    renderizarLista();
    actualizarResumen();
  } catch (error) {
    console.error('Error:', error);
  }
}

function filtrarTransacciones() {
  renderizarLista();
}

function editarTransaccion(id) {
  const t = transacciones.find(t => t._id === id);
  transaccionEditandoId = id;

  document.getElementById('descripcion').value = t.descripcion;
  document.getElementById('monto').value = t.monto;
  document.getElementById('tipo').value = t.tipo;
  document.getElementById('categoria').value = t.categoria;

  document.querySelector('.formulario button').textContent = 'Actualizar';
}

obtenerTransacciones();