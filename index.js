let input = document.querySelector(".search--input");
let search = document.querySelector(".search--button");
let containerRepositories = document.querySelector(".container-repositories");
let loadMore = document.querySelector(".load-more-button");
let totalCount = document.querySelector(".container-total-count");

const USER_PER_PAGE = 10;
let currentPage = 1;

search.onclick = (e) => {
    e.preventDefault();

    currentPage = 1;

    fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${USER_PER_PAGE}`)
        .then((response) => {
            if (!response.ok) throw new Error("Упс! Произошла ошибка.");
            return response.json();
        })
        .then((response) => createUI(response))
        .catch((e) => (totalCount.innerHTML = `<h2 style="color:lightcoral">${e.message}</h2>`));
};

loadMore.onclick = () => {
    ++currentPage;
    fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${USER_PER_PAGE}&page=${currentPage}`)
        .then((response) => {
            if (!response.ok) throw new Error("Упс! Произошла ошибка.");
            return response.json();
        })
        .then((response) => {
            response.items.forEach((item) => createRepoName(item));
        })
        .catch((e) => (totalCount.innerHTML = `<h2>${e.message}</h2>`));
};

function createRepoName(item) {
    let repository = document.createElement("div");
    repository.classList.add("repository");

    let contentRepo = `
    <div class="repository--header">
        <img src="${item.owner.avatar_url}" width="40" height="auto"/>
        <a class="repository--url" href="${item.html_url}">
            <span>
                ${item.name}
            </span>
        </a>
        <a class="repository--author" href="${item.owner.html_url}">
            <span class="repository--author">${item.owner.login}</span>   
        </a>
    </div>
    <div class="repository--footer">
        <p class="repository--updated">Последнее обновление: ${item.updated_at.slice(0, 10)}</p>
        <p class="repository--language">Язык: ${item.language}</p>
        <p class="repository--description">${item.description}</p>
        
    </div>`;

    repository.innerHTML = contentRepo;
    containerRepositories.append(repository);
}

function notFound(request) {
    let message = document.createElement("h2");

    message.innerHTML = `По запросу "${request}" ничего не найдено.`;
    containerRepositories.append(message);

    input.value = "";
}

function createUI(response) {
    containerRepositories.innerHTML = "";
    totalCount.innerHTML = "";

    if (response.total_count === 0) return notFound(input.value);
    if (response.total_count > 10) loadMore.style.display = "inline";

    totalCount.innerHTML = `<h2>Найдено результатов: ${response.total_count}</h2>`;

    response.items.forEach((item) => createRepoName(item));
}
