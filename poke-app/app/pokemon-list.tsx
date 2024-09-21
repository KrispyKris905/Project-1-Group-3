import React, {useEffect, useState} from 'react';
import { Text, Image, View, StyleSheet, FlatList } from 'react-native';
import {fetchPokemonList} from './(tabs)/pokeDb';

interface Pokemon {
    name: string;
    image: string;
  }
export default function ListScreen() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  useEffect(() => {
    const getPokemonData = async () => {
      const data = await fetchPokemonList();
      setPokemonList(data);
    };

    getPokemonData();
  }, []);
     // Render each item in the list
     const RenderItem = React.memo(({ item }: { item: Pokemon }) => (
        <View style={styles.itemContainer}>
            <Image style={styles.tinyLogo} source={{uri: item.image}}/>
            <Text style={styles.itemText}>{item.name}</Text>
        </View>
      ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon List</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <RenderItem item={item} />}
        // onEndReached={fetchMorePokemon}
      />
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    itemContainer: {
      padding: 10,
      backgroundColor: 'lightgray',
      elevation: 4,
      margin: 5,
      borderRadius: 15,
    },
    itemText: {
      fontSize: 18,
    },
    tinyLogo: {
        width: 50,
        height: 50,
      },
  });