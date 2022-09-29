const books = [
  {
    id: "1",
    title: `Apple. Эволюция компьютера`,
    author: `Владимир Невзоров`,
    img: `https://bukva.ua/img/products/449/449532_200.jpg`,
    plot: `Богато иллюстрированный хронологический справочник по истории компьютеров, в котором увлекательно
    и в структурированном виде изложена информация о создании и развитии техники Apple на фоне истории
    персональных компьютеров в целом.
    В книге даны описания десятков наиболее значимых моделей устройств как Apple, так и других производителей,
    сопровождающиеся большим количеством оригинальных студийных фотографий.
    Книга предназначена для широкого круга читателей, интересующихся историей электроники.
    Она также может послужить источником вдохновения для дизайнеров, маркетологов и предпринимателей.`,
  },

  {
    id: "2",
    title: `Как объяснить ребенку информатику`,
    author: `Кэрол Вордерман`,
    img: `https://bukva.ua/img/products/480/480030_200.jpg`,
    plot: `Иллюстрированная энциклопедия в формате инфографики о технических, социальных и культурных аспектах
    в информатике. Пошагово объясняет, как детям максимально эффективно использовать компьютеры и интернет-сервисы,
    оставаясь в безопасности.
    Книга рассказывает обо всем: от хранения данных до жизни в интернет-пространстве,
    от программирования до компьютерных атак. О том, как компьютеры функционируют, о современном программном
    обеспечении, устройстве Интернета и цифровом этикете. Все концепты - от хакера до биткоина -
    объясняются наглядно с помощью иллюстраций и схем.`,
  },
  {
    id: "3",
    title: `Путь скрам-мастера. #ScrumMasterWay`,
    author: `Зузана Шохова`,
    img: `https://bukva.ua/img/products/480/480090_200.jpg`,
    plot: `Эта книга поможет вам стать выдающимся скрам-мастером и добиться отличных результатов с вашей командой.
    Она иллюстрированная и легкая для восприятия - вы сможете прочитать ее за выходные, а пользоваться полученными
    знаниями будете в течение всей карьеры.
    Основываясь на 15-летнем опыте, Зузана Шохова рассказывает, какие роли и обязанности есть у скрам-мастера,
    как ему решать повседневные задачи, какие компетенции нужны, чтобы стать выдающимся скрам-мастером,
    какими инструментами ему нужно пользоваться.`,
  },
];

const STORAGE_KEY = "books";
localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

const rootEl = document.querySelector("#root");

const firstDivEl = document.createElement("div");
firstDivEl.classList.add("firstDiv");

const secondDivEl = document.createElement("div");
secondDivEl.classList.add("secondDiv");

rootEl.append(firstDivEl, secondDivEl);

const headingEl = document.createElement("h1");
headingEl.textContent = "Library";

const ulEl = document.createElement("ul");
const btnEl = document.createElement("button");
btnEl.textContent = "ADD";
btnEl.setAttribute("type", "button");

firstDivEl.append(headingEl, ulEl, btnEl);

function renderList() {
  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const markup = books
    .map(({ id, title }) => {
      return `
        <li id = "${id}">
            <p>${title}</p>
                <button class = "edit"> Edit </button>
                <button class = "delete"> Delete </button>
            
        </li>
        `;
    })
    .join("");

  ulEl.insertAdjacentHTML("beforeend", markup);

  const bookTitlesArray = document.querySelectorAll("p");

  bookTitlesArray.forEach((element) => {
    element.addEventListener("click", renderPreview);
  });

  const btnEdit = document.querySelectorAll(".edit");
  const btnDelete = document.querySelectorAll(".delete");

  btnEdit.forEach((element) => {
    element.addEventListener("click", renderEdit);
  });

  btnDelete.forEach((element) => {
    element.addEventListener("click", onBtnDeleteClick);
  });
}

renderList();

function renderPreview(event) {
  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));

  const titleTC = event.target.textContent;

  const titleObject = books.find((element) => element.title === titleTC);
  secondDivEl.innerHTML = createPreviewMarkup(titleObject);
}

function createPreviewMarkup({ id, title, author, img, plot }) {
  const oneBook = `<div class="container" data-id="${id}">
    <h2>${title}</h2>
    <p>${author}</p>
    <img src="${img}" alt="" />
    <p>${plot}</p>
</div>`;

  return oneBook;
}

function renderEdit(event) {
  const bookId = event.target.parentNode.id;
  console.log(bookId);
  console.log("edit");

  const books = JSON.parse(localStorage.getItem(STORAGE_KEY));

  const idObj = books.find((options) => options.id === bookId);
  console.log(idObj);

  secondDivEl.innerHTML = createFormMarkUp(idObj);

  fillObject(idObj);

  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", onEditForm);

  function onEditForm(event) {
    event.preventDefault();

    const values = Object.values(idObj);
    const isEmptyString = values.some((elm) => elm === "");
    if (isEmptyString) {
      alert("Введите все данные!");
      return;
    }

    const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const bookIndex = books.findIndex((option) => option.id === bookId);
    books.splice(bookIndex, 1, idObj);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    ulEl.innerHTML = "";
    renderList();
    secondDivEl.innerHTML = "";
    secondDivEl.innerHTML = createPreviewMarkup(idObj);
  }
}

function onBtnDeleteClick(event) {
  const bookId = event.target.parentNode.id;

  const deleteId = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const filterId = deleteId.filter((element) => element.id !== bookId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filterId));
  ulEl.innerHTML = "";
  renderList();

  const divContainer = document.querySelector(".container");
  if (!divContainer) {
    return;
  }
  if (bookId === divContainer.dataset.id) {
    secondDivEl.innerHTML = "";
  }
}

btnEl.addEventListener("click", addBook);

function addBook() {
  const newObject = {
    id: `${Date.now()}`,
    title: "",
    author: "",
    img: "",
    plot: "",
  };
  secondDivEl.innerHTML = "";
  secondDivEl.insertAdjacentHTML("beforeend", createFormMarkUp(newObject));
  fillObject(newObject);

  const formEL = document.querySelector("form");
  formEL.addEventListener("submit", onSubmitForm);

  function onSubmitForm(event) {
    event.preventDefault();

    const values = Object.values(newObject);
    const isEmptyString = values.some((elm) => elm === "");

    if (isEmptyString) {
      alert("Введите все данные!");
      return;
    }

    const books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    books.push(newObject);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

    ulEl.innerHTML = "";
    renderList();
    secondDivEl.innerHTML = "";
    secondDivEl.innerHTML = createPreviewMarkup(newObject);
  }
}

function createFormMarkUp({ title, author, img, plot }) {
  const form = `<form action="" class = "form">
      <label> Title:
        <input name="title" type="text" value="${title}" />
      </label>
      <label> Author:
        <input name="author" type="text" value="${author}" />
      </label>
      <label> Image:
        <input name="img" type="url" value="${img}" />
      </label>
      <label> Plot:
        <input name="plot" type="textarea" value="${plot}" />
        </label>
      <button type='submit' class = "btn_submit">Save</button>
    </form>
`;
  return form;
}

function fillObject(book) {
  const allInputEl = document.querySelectorAll("input");
  allInputEl.forEach((input) =>
    input.addEventListener("change", onInputChange)
  );

  function onInputChange(event) {
    book[event.target.name] = event.target.value;
  }
}
