import { LitElement } from 'lit-element';

export class PokemonDm extends LitElement {

  async dataUrl(url) {
    try {
      const data = await fetch(url);
        if (data.ok) {
          return await data.json();
        }else{return false }
    } catch (error) {
    }};
// Traer los datos desde evolution chain para buscar cada pokemon por su nombnre
  async evolutionPokemon (){
    const url = 'https://pokeapi.co/api/v2/evolution-chain?limit=10';//541
    const urlEvolution = await this.dataUrl(url);
    const datosPokemon = [];
    for (let i = 0; i < urlEvolution.results.length; i++) {
      const firstEvolution = await this.dataUrl(urlEvolution.results[i].url);
      const datosPrimero = await this.dataUrl('https://pokeapi.co/api/v2/pokemon/'+firstEvolution.chain.species.name);
      if(datosPrimero){
        this.evolutionPokemonId(firstEvolution.id);
        datosPokemon.push({
        id: firstEvolution.id,
        name: firstEvolution.chain.species.name,
        img: datosPrimero.sprites.other.home.front_default || datosPrimero.sprites.other.dream_world.front_default,
        types: {
          first : datosPrimero.types[0]?.type.name ,
          second : datosPrimero.types[1]?.type.name ? datosPrimero.types[1]?.type.name : ''
        },
        evolutions: firstEvolution.chain.evolves_to.length ? true : false,
        ev : await this.evolutionPokemonId(firstEvolution.id)
      });
      }else{continue;}  
    }
    return datosPokemon;
  }
  
// por nombre traer los datos de las evoluciones de cada pokemon
  async evolutionPokemonId (id){
   const evolutionId = await this.dataUrl('https://pokeapi.co/api/v2/evolution-chain/'+ id);
      const evolutionsData = [];
        for (let i = 0; i < evolutionId.chain.evolves_to.length; i++) {
          const evolutionName = await this.dataUrl('https://pokeapi.co/api/v2/pokemon/'+ evolutionId.chain.evolves_to[i].species.name);
          if(evolutionName){
            evolutionsData.push({
              name: evolutionName.species.name,
              img: evolutionName.sprites.other.home.front_default || evolutionName.sprites.other.dream_world.front_default,
              types: {
                first : evolutionName.types[0]?.type.name ,
                second : evolutionName.types[1]?.type.name ? evolutionName.types[1]?.type.name : ''
              }
            });
          }
          for (let j = 0; j < evolutionId.chain.evolves_to[i].evolves_to.length; j++) {
            const evolutionName2 = await this.dataUrl('https://pokeapi.co/api/v2/pokemon/'+ evolutionId.chain.evolves_to[i].evolves_to[j].species.name);
            if(evolutionName2){
              evolutionsData.push({
                name: evolutionName2.species.name,
                img: evolutionName2.sprites.other.home.front_default || evolutionName2.sprites.other.dream_world.front_default,
                types: {
                  first : evolutionName2.types[0]?.type.name ,
                  second : evolutionName2.types[1]?.type.name ? evolutionName2.types[1]?.type.name : false
                }
              });
            }
          }
    }
    return evolutionsData;
  }
}
