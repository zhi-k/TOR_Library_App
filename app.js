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

const db = firebase.firestore().collection("books");

// To make new book object
function newBook({ title, author, pages, isRead, bookCover }) {
  // Object class
  function Book(title, author, pages, isRead, bookCover) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.bookCover = bookCover;
  }

  const newBook = new Book(title, author, pages, isRead, bookCover);
  return newBook;
}

/*
 * following are 4 functions that deal with firecloud directly
 */

// Send to firecloud
async function addBooktoFB(bookObj) {
  const { title, author } = bookObj;
  const docName = title.concat(",", author).replace(/\s/g, "").toLowerCase();

  try {
    const added = await db.doc(docName).set({ ...bookObj }, { merge: false });
    if (added) {
      console.log(`Book added`);
    }
  } catch (err) {
    if (err) throw err;
  }
}

// delete from firecloud
async function deleteBookfromFB(id) {
  try {
    const deleted = await db.doc(id).delete();
    if (deleted) {
      console.log(`Book deleted`);
    }
  } catch (err) {
    if (err) throw err;
  }
}

// update read status to firecloud
async function updateBooktoFB(id, status) {
  try {
    const updated = await db.doc(id).update({
      isRead: status,
    });
    if (updated) console.log(`Entry ${id} updated`);
  } catch (err) {
    if (err) throw err;
  }
}

async function getBooksfromFB() {
  try {
    const querySnapshot = await db.get();
    return querySnapshot;
  } catch (err) {
    if (err) throw err;
  }
}

// add book from list
async function addBook(e) {
  e.preventDefault();
  const checked = e.target.read.checked;

  const book = newBook({
    title: e.target.title.value,
    author: e.target.author.value,
    pages: e.target.pages.value,
    isRead: checked,
    bookCover: e.target.bookCover.value || "notFound.svg",
  });

  const added = await addBooktoFB(book);

  db.onSnapshot((snapshot) => {
    const content = document.querySelector(".content");
    snapshot.docChanges().forEach((change) => {
      const doc = change.doc;
      if (change.type === "added") {
        const data = doc.data();
        if (data.title === book.title) {
          let html = `
          <div class="cards" data-id="${doc.id}">
            <div class="image-div"><img class="image" src="${data.bookCover}"/></div>
            <ul class="card-list">
              <li>Title: ${data.title}</li>
              <li>Author: ${data.author}</li>
              <li>Number of Pages: ${data.pages}</li>
              <li id="list-read">Read: ${data.isRead ? "Yes" : "No"}
            </ul>
            <button data-read="${data.isRead}" id="read-list-btn">Read</button>
            <button id="delete-btn">Delete Book</button>
          </div>
        `;
          content.innerHTML += html;
        }
        console.log(`Entry added`);
      } else {
        return;
      }
    });
  });
  document.getElementById("form").reset();
}

async function deleteBook(e) {
  e.preventDefault();
  const id = e.target.parentNode.getAttribute("data-id");

  const content = document.getElementById("content");
  [...content.children].forEach((div) => {
    if (div.getAttribute("data-id") === id) {
      div.remove();
    }
  });

  const deleted = deleteBookfromFB(id);
  if (deleted) {
    console.log(`Entry deleted`);
  }
}

async function toggleRead(e) {
  e.preventDefault();
  if (e.target.id === "read-list-btn") {
    const id = e.target.parentNode.getAttribute("data-id");
    const listRead = e.target.parentNode.children[1].children[3];
    if (e.target.getAttribute("data-read") === "false") {
      await db.doc(id).update({
        isRead: true,
      });
      e.target.setAttribute("data-read", "true");
      listRead.textContent = `Read: Yes`;
    } else {
      await db.doc(id).update({
        isRead: false,
      });
      e.target.setAttribute("data-read", "false");
      listRead.textContent = `Read: No`;
    }
  }
}

function toggleForm(e) {
  if (e.target.id === "header-btn") {
    const form = document.getElementById("form");
    if (form.classList.value === "form-hidden") {
      form.classList.value = "form-display";
    } else {
      form.classList.value = "form-hidden";
    }
  }
}

function noToggleForm(e) {
  if (e.target.id === "header-btn") {
    const container = document.querySelector(".container");
    container.innerHTML += `<strong id="error-msg">Maximum 10 entries reached! Please delete before adding new entry!</strong>`;
    setTimeout(function () {
      location.reload();
    }, 3000);
  }
}

async function main() {
  // display all results from firebase
  const snapshot = await getBooksfromFB();
  const content = document.querySelector(".content");
  const fragment = new DocumentFragment();
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    const divHead = document.createElement("div");
    divHead.className = "cards";
    divHead.setAttribute("data-id", id);
    let html = `
            <div class="image-div"><img class="image" src="${data.bookCover}"/></div>
            <ul class="card-list">
              <li>Book Title: ${data.title}</li>
              <li>Book Author: ${data.author}</li>
              <li>Number of Pages: ${data.pages}</li>
              <li id="list-read">Read: ${data.isRead ? "Yes" : "No"}
            </ul>
            <button id="read-list-btn" data-read="${data.isRead}">Read</button>
            <button id="delete-btn">Delete Book</button>
        `;
    divHead.innerHTML += html;
    fragment.appendChild(divHead);
  });
  content.appendChild(fragment);

  // form toggling
  const formBtn = document.getElementById("header-btn");
  if (content.childNodes.length >= 10) {
    formBtn.addEventListener("click", noToggleForm);
  } else {
    formBtn.addEventListener("click", toggleForm);
  }

  //handle form
  const form = document.getElementById("form");
  form.addEventListener("submit", addBook);

  // handle delete button
  const deleteBtn = document.querySelectorAll("#delete-btn");
  deleteBtn.forEach((selected) => {
    selected.addEventListener("click", deleteBook);
  });

  // handle read button
  content.addEventListener("click", toggleRead);
}

main();
