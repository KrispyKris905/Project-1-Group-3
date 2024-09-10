import { PokemonClient } from 'pokenode-ts';

// https://pokenode-ts.vercel.app/

(async () => {
  const api = new PokemonClient();

  try {
    const pokemonData = await api.getPokemonByName('luxray');
    console.log(pokemonData.name); // Outputs "Luxray"
  } catch (error) {
    console.error(error);
  }
})();
