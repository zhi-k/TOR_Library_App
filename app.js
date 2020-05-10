// Firebase configurations
var firebaseConfig = {
  apiKey: "AIzaSyBdhgxux0oI-bLfvPQCIwuMVKL4CCpYrwU",
  authDomain: "torlibrary-9f31d.firebaseapp.com",
  databaseURL: "https://torlibrary-9f31d.firebaseio.com",
  projectId: "torlibrary-9f31d",
  storageBucket: "torlibrary-9f31d.appspot.com",
  messagingSenderId: "774259895722",
  appId: "1:774259895722:web:bf25909fdae2b1c964cfd3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
