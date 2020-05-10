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

const db = firebase.firestore();
const books = db.collection("books").doc("6Ua9PwuVtdztfGthIhkQ");

const form = document.getElementById("form");
const content = document.querySelector(".content");

let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

const toggleForm = (e) => {
  if (e.target.id === "header-btn") {
    if (form.className === "form-display") {
      form.className = "form-hidden";
    } else {
      form.className = "form-display";
    }
  }
};

const headerBtn = document.getElementById("header-btn");
headerBtn.addEventListener("click", toggleForm);

function addBookToLibrary({ title, author, pages, isRead }) {
  const newBook = new Book(title, author, pages, isRead);
  return newBook;
}

// handle form submission and send to firebase
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const checked = document.getElementById("read-btn").checked;
  const book = addBookToLibrary({
    title: e.target.title.value,
    author: e.target.author.value,
    pages: e.target.pages.value,
    isRead: checked,
  });

  try {
    const addToFB = await db.collection("books").add({ ...book });
    if (addToFB) {
      console.log(`Book added!`);
    }
    form.reset();
  } catch (error) {
    if (error) throw error;
  }
});
