const table_pokemons = document.querySelector(".table_pokemons");
const container_modal = document.querySelector(".container_modal");
const modal_name = document.querySelector(".modal_name");
const modal_img = document.querySelector(".modal_img");
const modal_type = document.querySelector(".modal_type");
const modal_abilities = document.querySelector(".modal_abilities");
const modal_height = document.querySelector(".modal_height");
const modal_weight = document.querySelector(".modal_weight");
const modal_close = document.querySelector(".modal_close");
const input_search = document.querySelector(".input_search");
const select_filter = document.querySelector('.select_filter');

window.addEventListener("DOMContentLoaded", () => {

  const url = "https://pokeapi.co/api/v2/pokemon/";
  let array_pokemon;

  const dictionaryTypes = {
    grass: "planta",
    poison: "veneno",
    fire: "fuego",
    water: "agua",
    bug: "bicho",
    flying: "vuelo",
    normal: "normal"
  };
  const dictionaryAbilities = {
    overgrow: "espesura",
    chlorophyll: "clorofila",
    blaze: "mar llamas",
    solar_power: "poder solar",
    torrent: "torrente",
    rain_dish: "cura lluvia",
    shield_dust: "polvo escudo",
    run_away: "fuga",
    compound_eyes: "ojos compuestos",
    tinted_lens: "cromolente",
    shed_skin: "mudar la piel",
    swarm: "enjambre",
    sniper: "francotirador",
    keen_eye: "vista lince",
    tangled_feet: "tumbos",
    big_pecks: "sacapecho",
    guts: "agallas",
    hustle: "estusiasmo"
  };


  function events_btns() {
    const btns = document.querySelectorAll(".btn_table");
  
    btns.forEach((btn) => {
      btn.addEventListener("click",(e)=>{
        get_info_pokemon(e.currentTarget.id)
      })
    })
  }

  async function get_data_pokeapi() {
    const request = await fetch(url);
    const data = await request.json();
    array_pokemon = data.results.sort();

    for (let i = 0; i < array_pokemon.length; i++) {
      const poq = array_pokemon[i];
      const idPoq = parseInt(poq.url.split("/")[6]);
      poq["id"] = idPoq;
    }
    array_pokemon = array_pokemon.sort(async function (a, b) {
      return a.id - b.id;
    });
    add_types_pokemon();
    show_data_table(array_pokemon);
    events_btns();
    return array_pokemon;
  }
  get_data_pokeapi();

  async function add_types_pokemon() {
    
    for (let i = 0; i < array_pokemon.length; i++) {

      const element = array_pokemon[i];
      const response = await fetch(url+element.id);
      const poke = await response.json();
      let types = [];
      
      poke.types.map((type) => {
        let key = type.type.name;
        types.push(dictionaryTypes[key]);
      })
      element["types"] = types;
    }
  }

  function show_data_table(array) {
    table_pokemons.innerHTML = `
        <th>#</th>
        <th>Nombre</th>
        <th>Detalles</th>
        <tr>`
    array.map((element, index) => {
    
      table_pokemons.innerHTML += `
        <tr>
        <td>${index+1}</td>
        <td class="name_table">${element.name}</td>
        <td>
          <button id=${element.id} class="btn_table">Ver <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
        </td>
        </tr>
        `
    });
  }

  async function get_info_pokemon(endpoint) {

    let response = await fetch(url + endpoint.toString());
    let pokemon = await response.json();

    modal_img.setAttribute("src",pokemon.sprites.back_default)
    modal_name.innerText = pokemon.name;
    let types = [];
    let abilities = [];
    
    // obtener los tipos del pokemon
    pokemon.types.map((type) => {
      let key = type.type.name;
      types.push(dictionaryTypes[key]);
    })
    modal_type.innerText = types.join(", ");

    // obtener las habilidades del pokemon
    pokemon.abilities.map((item) => {
      let key = item.ability.name.replace("-","_");
      abilities.push(dictionaryAbilities[key]);
    })
    modal_abilities.innerText = abilities.join(", ");

    // obtener el peso y altura del pokemon
    modal_height.innerText = pokemon.height/10 + " m";
    modal_weight.innerText = pokemon.weight/10 + " kg";

    container_modal.classList.remove("ocult");
  }

  modal_close.addEventListener("click",()=>{
    container_modal.classList.add("ocult");
  })
  
  async function search(word) {
    const array_filter = array_pokemon.filter((item)=>item.name.includes(word.toLowerCase().replaceAll(" ","")))
    show_data_table(array_filter);
    events_btns();
  }

  function filter(word_filter) {
    
    if (word_filter === "todos") {
      show_data_table(array_pokemon);
    }else{
      const array_filter = array_pokemon.filter((item)=>item.types.includes(word_filter));
      show_data_table(array_filter);
    }
    events_btns();
  }

  input_search.addEventListener("input",(e)=>{
    search(e.target.value);
  })

  select_filter.addEventListener("change",(e)=>{
    filter(select_filter.value);
  })
})

