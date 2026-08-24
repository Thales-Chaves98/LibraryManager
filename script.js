const addBookBtn = document.getElementById("add-book-btn");
const searchBooks = document.getElementById("search-books");

//Form
let inputBookTitle = document.getElementById("book-title");
let inputBookAuthor = document.getElementById("book-author");


//Add Book Modal
const addBookModal = document.getElementById("add-book-modal");
const cancelAddBook = document.getElementById("cancel-btn");
const saveAddBook = document.getElementById("save-btn");

//Confirm Delete Modal
const deleteBookModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

//Book Container
const bookContainer = document.getElementById("books-container");

//Filter
const allFilterBtn = document.getElementById("all-btn");
const readFilterBtn = document.getElementById("read-btn");
const unreadFilterBtn = document.getElementById("unread-btn");
const favoriteFilterBtn = document.getElementById("favorite-btn");

let books = [];
let nextBookId = 1;

let editingBookId = null;
let deletingBookId = null;
let currentFilter = "all";
let currentSearch = "";

addBookBtn.addEventListener('click', (event) =>{
    event.preventDefault();

    clearBookForm();
    editingBookId = null;

    openModal(addBookModal);

});

cancelAddBook.addEventListener('click', () =>{
    closeModal(addBookModal);
});

saveAddBook.addEventListener('click', () =>{
    saveBookForm();
});

bookContainer.addEventListener('click', (event) =>{
    const bookCard = event.target.closest(".book-card");

    if(!bookCard) return;

    const bookId = Number(bookCard.dataset.id);

    if(event.target.closest(".delete-btn")){
        confirmDeleteBook(bookId);
    } else if(event.target.closest(".edit-btn")){
        editBook(bookId);
    } else if(event.target.closest(".favorite-btn")){
        toggleFavorite(bookId);
    } else if(event.target.closest(".read-btn")){
        toggleRead(bookId);
    }
});

confirmDeleteBtn.addEventListener('click', () =>{
    confirmDelete();
});

cancelDeleteBtn.addEventListener('click', () =>{
    closeModal(deleteBookModal);
});

searchBooks.addEventListener('input', () =>{
    currentSearch = searchBooks.value.trim().toUpperCase();

    renderBooks();
});

allFilterBtn.addEventListener('click', () =>{
    currentFilter = "all";
    renderBooks();
});

readFilterBtn.addEventListener('click', () =>{
    currentFilter = "read";
    renderBooks();
});

unreadFilterBtn.addEventListener('click', () =>{
    currentFilter = "unread";
    renderBooks();
});

favoriteFilterBtn.addEventListener('click', () =>{
    currentFilter = "favorite";
    renderBooks();
});

document.addEventListener('keydown', (event) => {
    if(event.key === "Escape"){
        handleEscape();
    }
    if(event.key === "Enter"){
        handleEnter(event);
    }
});


function createBookObject(){

    const title = inputBookTitle.value.trim().toUpperCase(); 
    const author = inputBookAuthor.value.trim().toUpperCase(); 
    const isRead = false;
    const isFavorite = false;

    if(title === "" || author === "") return;
    
    const book = {
        id: nextBookId,
        title,
        author,
        isRead,
        isFavorite
    };
    
    books.push(book);
    nextBookId++;
    saveBooks();
    clearBookForm();
    renderBooks();
}

function renderBooks(){
    const filteredBooks = getFilteredBooks();

    if(filteredBooks.length > 0){
        bookContainer.innerHTML = '';

        filteredBooks.forEach(book => {

            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.dataset.id = book.id;

            const bookDescription = document.createElement("div");
            bookDescription.classList.add("book-description");

            const bookTitle = document.createElement("p");
            bookTitle.classList.add("book-title");
            bookTitle.textContent = book.title;

            const bookAuthor = document.createElement("p");
            bookAuthor.classList.add("book-author");
            bookAuthor.textContent = book.author;


            const bookActions = document.createElement("div");
            bookActions.classList.add("book-actions");

            const readBtn = document.createElement("button");
            readBtn.classList.add("read-btn");

            const readIcon = document.createElement("span");
            readIcon.classList.add("material-symbols-outlined");
            readIcon.textContent = "bookmark";
            readIcon.style.fontVariationSettings = `"FILL" ${book.isRead ? 1 : 0}`;
            
            const favoriteBtn = document.createElement("button");
            favoriteBtn.classList.add("favorite-btn");

            const favoriteIcon = document.createElement("span");
            favoriteIcon.classList.add("material-symbols-outlined");
            favoriteIcon.textContent = "favorite";
            favoriteIcon.style.fontVariationSettings = `"FILL" ${book.isFavorite ? 1 : 0}`;

            const editBtn = document.createElement("button");
            editBtn.classList.add("edit-btn");

            const editIcon = document.createElement("span");
            editIcon.classList.add("material-symbols-outlined");
            editIcon.textContent = "edit";

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");

            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("material-symbols-outlined");
            deleteIcon.textContent = "delete";

            readBtn.append(readIcon);
            favoriteBtn.append(favoriteIcon);
            editBtn.append(editIcon);
            deleteBtn.append(deleteIcon);

            bookActions.append(
                readBtn, favoriteBtn, editBtn, deleteBtn
            );

            bookDescription.append(
                bookTitle, bookAuthor
            );
            
            bookCard.append(
                bookDescription, bookActions
            );

            bookContainer.append(bookCard);
        });
    } else {
        bookContainer.innerHTML = 
        `
            <div class="empty-state">
                <span class="material-symbols-outlined">auto_stories_off</span>
                <p>Empty Shelves !</p>
            </div>
        `
    }
    
}

function openModal(modal){
    modal.classList.add("show");
}

function closeModal(modal){
    modal.classList.remove("show");
    
    if(modal === addBookModal){
        clearBookForm();
        editingBookId = null;
    }
}

function clearBookForm(){
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
}

function saveBooks(){
    localStorage.setItem("books", JSON.stringify(books));

}

function loadBooks(){
    const savedBooks = localStorage.getItem("books");

    if(savedBooks){
        books = JSON.parse(savedBooks);
        uptadeNextId();
    }
}

function uptadeNextId(){
    if(books.length === 0){
        nextBookId = 1;
        return;
    }

    const maxId = Math.max(...books.map((b) => {
        return b.id;
    }));

    nextBookId = maxId + 1;

}

function deleteBook(bookId){
    books = books.filter((b) => {
        return b.id !== bookId;
    });

    refresh();
    closeModal(deleteBookModal);
}

function confirmDeleteBook(bookId){
    deletingBookId = bookId;
    openModal(deleteBookModal);
}

function editBook(bookId){
    const book = books.find((b) => {
        return b.id === bookId
    });

    if(!book) return;

    editingBookId = bookId;

    inputBookTitle.value = book.title;
    inputBookAuthor.value = book.author;

    openModal(addBookModal);
}

function updateBook(bookId){
    const title = inputBookTitle.value.trim().toUpperCase(); 
    const author = inputBookAuthor.value.trim().toUpperCase(); 

    if(title === "" || author === "") return;

    const book = books.find((b) => {
        return b.id === bookId;
    });

    if(!book) return;

    book.title = title;
    book.author = author;

    editingBookId = null;

    refresh();
}

function toggleFavorite(bookId){
    const book = books.find((b) => {
        return b.id === bookId
    });

    if(!book) return;

    book.isFavorite = !book.isFavorite;

    refresh();
}

function toggleRead(bookId){
    const book = books.find((b) => {
        return b.id === bookId
    });

    if(!book) return;

    book.isRead = !book.isRead;

    refresh();
}

function getFilteredBooks(){
    let filteredBooks = books;

    if(currentFilter === "read"){
        filteredBooks = filteredBooks.filter(b => b.isRead);
    }
    if(currentFilter === "unread"){
        filteredBooks = filteredBooks.filter(b => !b.isRead);
    }
    if(currentFilter === "favorite"){
        filteredBooks = filteredBooks.filter(b => b.isFavorite);
    }

    if(currentSearch !==""){
        filteredBooks = filteredBooks.filter(b => {
            return b.title.includes(currentSearch) || b.author.includes(currentSearch);
        });
    }
    return filteredBooks;
}

function saveBookForm(){

     if(editingBookId === null){
            createBookObject();
        } else {
            updateBook(editingBookId);
        }

        closeModal(addBookModal);
}

function confirmDelete(){
    if(deletingBookId !== null){
        deleteBook(deletingBookId);
    }

    deletingBookId = null;
}

function handleEscape(){
    if(addBookModal.classList.contains("show")){
        closeModal(addBookModal);
        return;
    }

    if(deleteBookModal.classList.contains("show")){
        closeModal(deleteBookModal);
    }

}

function handleEnter(e){
    if(addBookModal.classList.contains("show")){
        e.preventDefault();
        saveBookForm();
        return;
    }

    if(deleteBookModal.classList.contains("show")){
        e.preventDefault();

        confirmDelete();
        return;
    }
}

function refresh(){
    saveBooks();
    renderBooks();
}

loadBooks();
renderBooks();