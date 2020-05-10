let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead || false;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}, ${this.isRead ? "read" : "not read yet"}`;
  };
}

function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
}
