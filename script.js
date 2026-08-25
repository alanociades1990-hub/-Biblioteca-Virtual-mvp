// Datos iniciales y persistencia en localStorage
let books = JSON.parse(localStorage.getItem('libraryBooks')) || [
  { id: 1, title: "Cien Años de Soledad", author: "Gabriel García Márquez", year: 1967 },
  { id: 2, title: "Don Quijote", author: "Miguel de Cervantes", year: 1605 },
  { id: 3, title: "La sombra del viento", author: "Carlos Ruiz Zafón", year: 2001 },
];

const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');

const bookModalEl = document.getElementById('bookModal');
const bookModal = new bootstrap.Modal(bookModalEl);
const bookForm = document.getElementById('bookForm');
const bookIdField = document.getElementById('bookId');
const titleField = document.getElementById('title');
const authorField = document.getElementById('author');
const yearField = document.getElementById('year');

let editingId = null;

// Función para guardar en localStorage
function saveBooks() {
  localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// Función para renderizar libros
function renderBooks(filter = "") {
  booksContainer.innerHTML = "";
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(filter.toLowerCase()) ||
    b.author.toLowerCase().includes(filter.toLowerCase())
  );
  if (filtered.length === 0) {
    booksContainer.innerHTML = `<div class="col-12 text-center text-muted">No se encontraron libros.</div>`;
    return;
  }
  filtered.forEach(book => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card bg-white bg-opacity-10 text-white border-0 shadow-sm rounded-3 p-3" style="backdrop-filter: blur(10px);">
        <div class="card-body d-flex flex-column justify-content-between h-100">
          <h5 class="card-title">${book.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
          <p class="card-text">Año: ${book.year}</p>
          <div class="mt-auto d-flex justify-content-end gap-2">
            <button class="btn btn-warning btn-sm" onclick="editBook(${book.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    booksContainer.appendChild(col);
  });
}

// Función para preparar para añadir un libro
function prepareAdd() {
  editingId = null;
  document.getElementById('bookModalLabel').innerText = "Agregar Libro";
  bookForm.reset();
  $('#bookModal').modal('show');
}

// Evento para buscar en tiempo real
searchInput.addEventListener('input', () => {
  renderBooks(searchInput.value);
});

// Evento para guardar libro (nuevo o editar)
document.getElementById('bookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleField.value.trim();
  const author = authorField.value.trim();
  const year = parseInt(yearField.value.trim());

  if (editingId !== null) {
    // Editar
    const index = books.findIndex(b => b.id === editingId);
    if (index !== -1) {
      books[index] = { id: editingId, title, author, year };
    }
  } else {
    // Añadir nuevo
    const newBook = { id: Date.now(), title, author, year };
    books.push(newBook);
  }
  saveBooks();
  renderBooks(searchInput.value);
  $('#bookModal').modal('hide');
});

// Función para editar
function editBook(id) {
  const book = books.find(b => b.id === id);
  if (book) {
    editingId = id;
    document.getElementById('bookModalLabel').innerText = "Editar Libro";
    titleField.value = book.title;
    authorField.value = book.author;
    yearField.value = book.year;
    $('#bookModal').modal('show');
  }
}

// Función para eliminar
function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  saveBooks();
  renderBooks(searchInput.value);
}

// Iniciar renderizado
renderBooks();
