const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTBmZWI4N2ZkNWViZjM4NjJlNjEyODc4NDY2ZWI4ZCIsInN1YiI6IjY0ZDQyOWNiZGI0ZWQ2MDBmZmI2NzhhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uEN7E4cH_RC0m3bffSVpaAXcH2sIafCGcf30JBNZzbU'
  }
};

function loadingSpinner() {
  const screenLoad = document.querySelector('.screen-load');
  screenLoad.classList.toggle('active-load');
}


function getMovie(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

}

function detalhesFilme() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  loadingSpinner()
  fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      document.getElementById('titulo').innerHTML = response.title;
      document.getElementById('descricao').innerHTML = response.overview;
      document.getElementById('imagem').src = `https://image.tmdb.org/t/p/w500/${response.poster_path}`;
      document.getElementById('genres').innerText = '' + response.genres.map(genre => genre.name).join('/');
      document.getElementById('name-movie').innerText = response.title;
      document.getElementById('tagline').innerText = response.tagline;
      document.getElementById('runtime').innerText = response.runtime;
      document.getElementById('production_companies').innerText = '' + response.production_companies.map(company => `${company.name} (${company.origin_country})`).join('/ ');
      document.getElementById('release_date').innerText = response.release_date.replace(/-/g, '/');


    })
    .catch(err => console.error(err));
    loadingSpinner()
}
// name-movie

detalhesFilme();