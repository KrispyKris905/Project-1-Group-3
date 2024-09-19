import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

interface Pokemon {
    id: number;
    name: string;
    url:string,
    image: string;
}

const PokemonGrid = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  // Fetch a Pokémon by its ID
  const fetchPokemonById = async (id: number) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonDetails = await response.json();

      // Return Pokémon with its image
      return {
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        image: pokemonDetails.sprites.front_default,
      };
    } catch (error) {
      console.error(`Error fetching Pokémon with ID ${id}:`, error);
    }
  };

  // Fetch 6 Pokémon from the PokéAPI
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6');
        const data = await response.json();
        
        // Get the basic data and map to include the Pokémon image from the sprites
        const pokemonWithImages = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();
            return {
              name: pokemon.name,
            //   url: pokemon.url,
              image: pokemonDetails.sprites.front_default // Get Pokémon image
            };
          })
        );

        setPokemonList(pokemonWithImages);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, []);

  const RenderItem = React.memo(({ item }: { item: Pokemon }) => (
    <View style={styles.itemContainer}>
        <Image style={styles.tinyLogo} source={{uri: item.image}}/>
        <Text style={styles.itemText}>{item.name}</Text>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Team</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </View>
  );
};

export default PokemonGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize', 
  },
  itemContainer: {
    padding: 10,
    backgroundColor: 'lightgray',
    elevation: 4,
    margin: 5,
    borderRadius: 15,
    width:300,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems:'center',
    justifyContent: 'space-around'
  },
  itemText: {
    fontSize: 18,
  },
  tinyLogo: {
      width: 70,
      height: 70,
    },
});
