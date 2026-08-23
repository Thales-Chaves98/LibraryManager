const addBookBtn = document.getElementById("add-book-btn");

//Form
let inputBookTitle = document.getElementById("book-title");
let inputBookAuthor = document.getElementById("book-author");


//Add Book Modal
const addBookModal = document.getElementById("add-book-modal");
const cancelAddBook = document.getElementById("cancel-btn");
const saveAddBook = document.getElementById("save-btn");

//Book Container
const bookContainer = document.getElementById("books-container");

let nextBookId = 1;
const books = [];

addBookBtn.addEventListener('click', (event) =>{
    event.preventDefault();

    openModal(addBookModal);

    saveBooks();

});

cancelAddBook.addEventListener('click', () =>{
    closeModal(addBookModal);
});

saveAddBook.addEventListener('click', () =>{
    
    createBookObject();
    
    
    closeModal(addBookModal);
});

function createBookObject(){

    const title = inputBookTitle.value.trim().toUpperCase(); 
    const author = inputBookAuthor.value.trim().toUpperCase(); 
    const isRead = false;
    const isFavorite = false;

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
    bookContainer.innerHTML = '';

    books.forEach(book => {

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

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
        
        const favoriteBtn = document.createElement("button");
        favoriteBtn.classList.add("favorite-btn");

        const favoriteIcon = document.createElement("span");
        favoriteIcon.classList.add("material-symbols-outlined");
        favoriteIcon.textContent = "favorite";

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
}

function openModal(modal){
    modal.classList.add("show");
}
function closeModal(modal){
    modal.classList.remove("show");
    clearBookForm();
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
        tasks = JSON.parse(savedBooks);
        uptadeNextId();
    }
}

function uptadeNextId(){
    if(books.length === 0){
        nextId = 1;
        return;
    }

    const maxId = Math.max(...books.map((b) => {
        return b.id;
    }));

    nextId = maxId + 1;

}

loadBooks();
