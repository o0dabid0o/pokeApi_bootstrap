let pokemonHistory = [];
let count = 0;
document.getElementById('search').addEventListener('click', (e) => {
    displayPokemon();
    document.getElementById('pokemon').value = '';
    e.preventDefault();
});

document.getElementById('show-history').addEventListener('click', () => {
    displayPokemonHistory();
});

document.getElementById('new-team').addEventListener('click', () => {
    disableElements(false);
    document.getElementById('pokemon-container').innerHTML = '';
    document.getElementById('pokemon-alert').innerHTML = '';
    document.getElementById('new-team').disabled = true;
});

async function displayPokemon() {
    const pokemonName = document.getElementById('pokemon').value;
    if (!pokemonName) {
        showAlert('Empty field, please write something!');
        return;
    }
    const pokemon = await getPokemon(pokemonName);
    addPokemon(pokemon);
}

async function getPokemon(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (response.status === 404) {
            showAlert('Pokemon not found');
            return;
        }
        return await response.json();
    } catch (err) {
        showAlert("Bad connection? Try again");
    }
}

function addPokemon(pokemon) {
    pokemonHistory.push(pokemon);
    count++;
    const pokemonList = document.getElementById('pokemon-container');
    const element = document.createElement('div');
    element.classList.add('col-4');
    element.innerHTML = `
        <div class="card border-primary mb-3" style="width: 18rem;">
            <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Nombre del pokemon: ${pokemon.name}</h5>
                <p class="card-text">Experiencia base: ${pokemon.base_experience}.</p>
                <p class="card-text">Primer habilidad: ${pokemon.abilities[0].ability.name}.</p>
         </div>
        </div>            
  
    `;
    pokemonList.appendChild(element);
    if (pokemonList.childElementCount >= 3) {
        document.getElementById('new-team').disabled = false;
        disableElements(true);
        showAlert("You already completed your team! Go and fight");
    }
    pokemonHistory.sort((a, b) => {
        return a.base_experience - b.base_experience;
    });
}

function disableElements(status) {
    document.getElementById('pokemon').disabled = status;
    document.getElementById('search').disabled = status;
}

function showAlert(message) {
    document.getElementById('pokemon-alert').innerHTML = '';
    const pokemonAlert = document.getElementById('pokemon-alert');
    const element = document.createElement('div');
    element.innerHTML = `
        <h2>${message}</h2>
    `;
    pokemonAlert.appendChild(element);
}

function displayPokemonHistory() {
    const pokemonHistoryContainer = document.getElementById('history-container');
    pokemonHistory.innerHTML = "";
    pokemonHistory.forEach((pokemon, index) => {
        const element = document.createElement('div');
        console.log(pokemon);
        element.innerHTML = `

    <div class="accordion accordion-flush" id="accordionFlushExample">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapseOne">
         Pokemon ${index+1}
        </button>
      </h2>
      <div id="flush-collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
       <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
       <img src="${pokemon.sprites.front_default}" class="card-mid">
       <h5 class="card-title">Nombre del pokemon: ${pokemon.name}</h5>
       <p class="card-text">Experiencia base: ${pokemon.base_experience}.</p>
       <p class="card-text">Primer habilidad: ${pokemon.abilities[0].ability.name}.</p     
       </div>
    </div>

    `;
        pokemonHistoryContainer.appendChild(element);
    });
}