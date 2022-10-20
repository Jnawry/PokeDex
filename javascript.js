const pokeContainer = document.querySelector("#poke-container");
const modal = document.querySelector('.modal');


let pokemonStore = [];

const fetchpokemonList = async (limit, offset) => {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
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

    return {id: poke.id, name: poke.name, types: types, img: poke.sprites.other.dream_world.front_default, height: poke.height, weight: poke.weight, ability: poke.abilities}
}

function buildPokeCards(poke){
    const card = document.createElement('div');
    card.classList.add("pokeCard");
    card.id = `pokeId_${poke.id}`;
    const style = typeRend(poke.types);

    card.innerHTML = `
        <div class="border" style="background:${style.background}; background-size:${style.background_size}">
        <div class='pokeIdent'>
        <h4>${poke.name}</h4>
        <p>#${poke.id}</p>
        </div>
        <img src="${poke.img}">
        <div class="deco_bar"></div>
        <div>
    `;

    card.addEventListener('click', (e) => {
        populatemodal(e.currentTarget.id);
    })

    return {id: poke.id, content: card};
}

function typeRend(types){
    if(types.length > 1){
        const clr1 = typeColor(types[0]);
        const clr2 = typeColor(types[1]);
        return {background: `url('./smoky.png'), linear-gradient(125deg, ${clr1} 33%, ${clr2} 66%);`, background_size: `cover`};
    }
    else{
        return {background: `url('./smoky.png'), ${typeColor(types[0])}`, background_size: `cover;`};
    }
}

function typeColor(type){
    let clr;
    switch(type){
        case "bug":
            clr = "rgb(119, 152, 0)";
            break;
        case "dark":
            clr = "rgb(80, 57, 45)";
            break;
        case "dragon":
            clr = "rgb(122, 100, 221)";
            break;
        case "electric":
            clr = "rgb(248, 191, 38)";
            break;
        case "fairy":
            clr = "rgb(232, 169, 234)";
            break;
        case "fighting":
            clr = "rgb(188, 92, 68)";
            break;
        case "fire":
            clr = "rgb(228, 59, 9)";
            break;
        case "flying":
            clr = "rgb(120, 140, 229)";
            break;
        case "ghost":
            clr = "rgb(85, 85, 158)";
            break;
        case "grass":
            clr = "rgb(102, 188, 41)";
            break;
        case "ground":
            clr = "rgb(214, 185, 108)";
            break;
        case "ice":
            clr = "rgb(166, 231, 255)";
            break;
        case "normal":
            clr = "rgb(194, 191, 181)";
            break;
        case "poison":
            clr = "rgb(143, 69, 147)";
            break;
        case "psychic":
            clr = "rgb(230, 76, 130)";
            break;
        case "rock":
            clr = "rgb(183, 126, 70)";
            break;
        case "steel":
            clr = "rgb(209, 204, 233)";
            break;
        case "water":
            clr = "rgb(60, 153, 249)";
            break;
        default:
            clr = "rgb(255, 255, 255)";
            break;
    }
    return clr;
}

function modalHide(){
    modal.classList.add('hidden');
}

function populatemodal(pokeId){
    pokeId = pokeId.replace(/\D/gi, '');
    const pokeStat = pokemonStore.find(obj => obj.id == pokeId);
    
    const typesCap = [];
    const abilities = [];

    pokeStat.ability.forEach(a => {abilities.push(a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1))});

    pokeStat.types.forEach(t => {typesCap.push(t.charAt(0).toUpperCase() + t.slice(1))})
    const types = typesCap.join(', ');
    const mdStyle = typeRend(pokeStat.types);
    modal.setAttribute("style", `background: ${mdStyle.background}; background-size: ${mdStyle.background_size};`);
    modal.style.backgroundSize = mdStyle.background_size;

    modal.innerHTML = `
        <button onClick="modalHide()">X</button>
        <div class="ident">
            <div class="name">${pokeStat.name}</div>
            <div class="poke_id"># ${pokeStat.id}</div>
        </div>
        <div class="modal_image"><img src=${pokeStat.img}></div>
        <div class="stats">
            <div class="height"><b>Height:</b> ${pokeStat.height/10} m</div>
            <div class="weight"><b>Weight:</b> ${pokeStat.weight/10} kg</div>
            <div class="types"><b>Type(s):</b> ${types}</div>
            <div class="ablities"><b>Ablities:</b> <p>&ensp;${abilities.join('</p><p>&ensp;')}</p></div>
        </div>
    `

    modal.classList.remove('hidden')
}



fetchpokemonList(151, 0)

// johtoPokemon = fetchpokemonList(100, 151);


