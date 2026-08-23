const addBookBtn = document.getElementById("add-book-btn");

//Form
let inputBookTitle = document.getElementById("book-title");
let inputBookAuthor = document.getElementById("book-author");


//Add Book Modal
const addBookModal = document.getElementById("add-book-modal");
const cancelAddBook = document.getElementById("cancel-btn");
const saveAddBook = document.getElementById("save-btn");


let nextBookId = 1;
const books = [];

addBookBtn.addEventListener('click', (event) =>{
    event.preventDefault();

    openModal(addBookModal);


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
    clearBookForm();

    console.log(books);
}

function renderBooks(){

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