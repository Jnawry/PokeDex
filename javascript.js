const pokeContainer = document.querySelector("#poke-container");
let pokemonStore = [];

const fetchpokemonList = async () => {
    const resp = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=151");
    const list = await resp.json();
    pokemons = await list.results;
    pokeDeck = [];
    for(let p in pokemons){
        let poke_f = await fetchPokemons(pokemons[p]);
        pokeDeck.push(poke_f);
    }
    pokeDeck.forEach(poke => {
            pokeContainer.append(poke.content)
        });
}

async function fetchPokemons(poke){
    const url = poke.url;
    const resp = await fetch(url);
    const pokeData = await resp.json();
    let pokeS = pokeStats(pokeData)
    pokemonStore.push(pokeS);
    pokemonStore.sort((a, b) => a.id - b.id);
    const pokeDeckCard = buildPokeCards(pokeS);
    return pokeDeckCard;
}

function pokeStats(poke){
    let types = [];
    poke.types.forEach(t => {types.push(t.type.name)});

    return {id: poke.id, name: poke.name, types: types, img: poke.sprites.other.dream_world.front_default, height: poke.height, weight: poke.weight, ability: poke.abilities.ability}
}

function buildPokeCards(poke){
    const card = document.createElement('div');
    card.classList.add("pokeCard");

    const typeList = poke.types.map(t => `<li>${t}</li>`);
    const typeText = typeList.join('');

    card.innerHTML = `
        <div class='pokeIdent'>
        <h4>${poke.name}</h4>
        <p>#${poke.id}</p>
        </div>
        <img src="${poke.img}">
        <ul>
        ${typeText}
        </ul>
    `;

    return {id: poke.id, content: card};
}

fetchpokemonList()
