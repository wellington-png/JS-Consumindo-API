async function getDados(url) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTBmZWI4N2ZkNWViZjM4NjJlNjEyODc4NDY2ZWI4ZCIsInN1YiI6IjY0ZDQyOWNiZGI0ZWQ2MDBmZmI2NzhhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uEN7E4cH_RC0m3bffSVpaAXcH2sIafCGcf30JBNZzbU'
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

function gerenciarPaginacao() {
  let page = 1;
  return {
    proximo: async function () {
      page++;
      const filmes = await getFilmes(page);
      renderFilmes(filmes);
    },
    anterior: async function () {
      if (page > 1) {
        page--;
        const filmes = await getFilmes(page);
        renderFilmes(filmes);
      }
    },
    currentPage: function () {
      return page;
    }
  }
}

const paginacao = gerenciarPaginacao();

const btnProximo = document.querySelector('#btn-proximo');
btnProximo.addEventListener('click', async () => {
  await paginacao.proximo();
});

const btnAnterior = document.querySelector('#btn-anterior');
btnAnterior.addEventListener('click', async () => {
  await paginacao.anterior();
});

function loadingSpinner() {
  const screenLoad = document.querySelector('.screen-load');
  screenLoad.classList.toggle('active-load');
}

async function getFilmes(page = 1, genero = '') {
  loadingSpinner()
  const data = await getDados(`https://api.themoviedb.org/3/discover/movie?language=pt-BR&page=${page}&with_genres=${genero}`);
  loadingSpinner()
  
  return data.results;
}

async function getGeneros() {
  const data = await getDados('https://api.themoviedb.org/3/genre/movie/list?language=pt-BR');
  return data.genres;
}

function renderFilmes(filmes) {
  const divFilmes = document.querySelector('.movie-list');
  divFilmes.innerHTML = '';
  filmes.forEach(filme => {
    const divFilme = document.createElement('div');
    divFilme.classList.add('movie');
    divFilme.innerHTML = `
      <figure class="movie-poster"><img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="#"></figure>
      <div class="movie-title"><a href="single.html?id=${filme.id}">${filme.title}</a></div>
      <p>${filme.overview}</p>

    `;
    divFilmes.appendChild(divFilme);
  });
}

function renderGeneros(generos) {
  const divGeneros = document.querySelector('#select-generos');
  generos.forEach(genero => {
    const option = document.createElement('option');
    option.value = genero.id;
    option.innerHTML = genero.name;
    divGeneros.appendChild(option);
  });
}

async function filterByGenre(id) {
  const filterfilmes = await getFilmes(1, id);
  renderFilmes(filterfilmes);
}

async function searchMovie(name){
  const data = await getDados(`https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${name}`);
  return data.results;
}

const formSearch = document.querySelector('#form-search');
formSearch.addEventListener('submit', async (event) => {
  event.preventDefault();
  const inputSearch = document.querySelector('#input-search');
  const name = inputSearch.value;
  if (name === '') {
    return
  }
  loadingSpinner()
  const filmes = await searchMovie(name);
  renderFilmes(filmes);
  loadingSpinner()
});

const selectInput = document.querySelector('#select-generos');
selectInput.addEventListener('change', async (event) => {
  const id = event.target.value;
  if (id === 'all') {
    return main();
  }
  filterByGenre(id);

});

async function main() {
  let page = 1;

  Promise.all([getFilmes(page), getGeneros()])
    .then(([filmes, generos]) => {
      renderFilmes(filmes);
      renderGeneros(generos);
    });
}
main();
