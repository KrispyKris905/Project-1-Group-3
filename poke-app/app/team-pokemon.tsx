import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import axios from "axios"

interface Pokemon {
  name: string;
  image: string;
}

// Function to list 6 pokemon
async function listPokemon(db: SQLiteDatabase): Promise<Pokemon[]> {
  try {
    const result = await db.getAllAsync<Pokemon>(`SELECT * FROM team_pokemon`);
    console.log("Pokemon in team:", result);
    return result;
  } catch (error) {
    console.error("Error fetching pokemon in teams:", error);
    return [];
  }
}

async function fetchPokemon(id: number): Promise<Pokemon> {
  console.log("id:",id);
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = response.data;
    return {
      name: pokemon.name,
      image: pokemon.sprites.front_default
    };
  } catch (error) {
    console.error("Error fetching pokemon:",error);
    return {name:"",image:""};
  }
}

// App component that provides SQLite context
export default function PokemonTeam() {
  return (
    <View style={styles.container}>
        <PokemonGrid />
    </View>
  );
}

// Content component that handles team display and interactions
export function PokemonGrid() {
  const [pokemonList, setPokemonList] = useState<(Pokemon | null)[]>(Array(6).fill(null)); // Initialize 6 empty slots
  const db = useSQLiteContext();

  // Fetch pokemon in the selected team when component mounts
  useEffect(() => {
    async function fetchPokemonList() {
      const data = await listPokemon(db);
      setPokemonList((prevList) =>
        prevList.map((item, index) => data[index] || null)
      );
    }
    fetchPokemonList();
    console.log("Pokemon Team screen setup");
  }, [db]);

  // Add a pokemon to the specific slot
  const handleAddPokemon = async (index: number) => {
    const newPokemon= await fetchPokemon(8);

    setPokemonList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = newPokemon;
      return updatedList;
    });
  };

  // Delete pokemon from the specific slot
  const handleDeletePokemon = (index: number) => {
    setPokemonList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = null; // Set the slot to empty
      return updatedList;
    });
  };

  const RenderItem = React.memo(({ item, index }: { item: Pokemon | null; index: number }) => (
    <View style={styles.itemContainer}>
      {item ? (
        <>
          <Image style={styles.tinyLogo} source={{ uri: item.image }} />
          <Text style={styles.itemText}>{item.name}</Text>
        </>
      ) : (
        <Text style={styles.itemText}>Empty Slot</Text>
      )}
      <Button
        title={item ? 'Delete' : 'Add'}
        onPress={() => (item ? handleDeletePokemon(index) : handleAddPokemon(index))}
      />
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Team</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={(item, index) => `${index}`} // Unique key for each slot
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        numColumns={2} // Display in 2 columns
      />
    </View>
  );
}

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
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },
});
