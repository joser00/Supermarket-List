import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

//Creamos un objeto con la clave databaseURL con el valor del link que nos proporciona FireBase de nuestra DB
const appSettings = {
  databaseURL: "https://playground-8ce9c-default-rtdb.firebaseio.com/",
};

//Usamos la funcion initializeApp que recien exportamos pasandole como argumento nuestro objeto que contiene nuestra DB encargandose de conectarnos con FireBase
const app = initializeApp(appSettings); /* Creates and initializes a FirebaseApp instance.*/
const database = getDatabase(app);
const shopingListInDB = ref(database, "shoppingList"); //De esta formas asignamos una referencia a nuestra base de datos

/* const newRef = ref(getDatabase(initializeApp(appSettings)),'shoppingList) */

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shopingListInDB, inputValue); //Con la funcion push() anadimos la referencia, y el valor que queramos anadir
  clear();
});

onValue(shopingListInDB, function (snapshot) {
  //Iteractuamos en tiempo real con la DB
  if (snapshot.exists()) {
    let items = Object.entries(snapshot.val());
    refreshItems();

    for (let i = 0; i < items.length; i++) {
      let currentItem = items[i]; //Obtenemos el array con la sgte estructura [[key, value]]

      appendItem(currentItem);
    }
  }else {
    shoppingListEl.innerHTML = 'No items here... yet'
  }
});

function appendItem(item) {
  let itemID = item[0];//Obtenemos key
  let itemValue = item[1];//Obtenemos value
  let newEl = document.createElement("li");
  let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);//Nos da la localizacion exacta del elemento basado en su ID unico
  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", () => {
    remove(exactLocationOfItemInDB); //Eliminamos ese elemento de la DB basado en su ID unico
  });

  shoppingListEl.append(newEl);
}

function refreshItems() {
  shoppingListEl.innerHTML = "";
}

function clear() {
  inputFieldEl.value = "";
}

