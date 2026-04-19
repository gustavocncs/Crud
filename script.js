const form = document.getElementById('form');
const lista = document.getElementById('lista');
const search = document.getElementById('search');

let contatos = JSON.parse(localStorage.getItem('contatos')) || [];
let editIndex = null;

function salvarLocal() {
  localStorage.setItem('contatos', JSON.stringify(contatos));
}

function render() {
  lista.innerHTML = "";

  const filtro = search.value.toLowerCase();

  contatos
    .filter(c => 
      c.nome.toLowerCase().includes(filtro) ||
      c.email.toLowerCase().includes(filtro)
    )
    .forEach((contato, index) => {
      const li = document.createElement('li');

      li.innerHTML = `
        <div>
          <strong>${contato.nome}</strong><br>
          ${contato.email}
        </div>
        <div class="actions">
          <button onclick="editar(${index})">Editar</button>
          <button onclick="deletar(${index})">Excluir</button>
        </div>
      `;

      lista.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  if (editIndex !== null) {
    contatos[editIndex] = { nome, email };
    editIndex = null;
  } else {
    contatos.push({ nome, email });
  }

  salvarLocal();
  render();
  form.reset();
});

function deletar(index) {
  contatos.splice(index, 1);
  salvarLocal();
  render();
}

function editar(index) {
  const contato = contatos[index];
  document.getElementById('nome').value = contato.nome;
  document.getElementById('email').value = contato.email;
  editIndex = index;
}

search.addEventListener('input', render);

render();