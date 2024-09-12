import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import * as SQLite from 'expo-sqlite/legacy';
import axios from "axios";


export default function Index() {
    const db = SQLite.openDatabase('pokemon.db');

  useEffect(() => {

    // Initialize database tables
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY NOT NULL, name TEXT, type TEXT);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY NOT NULL, name TEXT, userid INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS team_pokemon (team_id INTEGER, pokemon_id INTEGER, FOREIGN KEY(team_id) REFERENCES teams(id), FOREIGN KEY(pokemon_id) REFERENCES pokemon(id));"
      );
    });
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon/1");
      const { id, name, types } = response.data;
      const type = types[0].type.name;

      // Insert Pokémon data into SQLite
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT OR REPLACE INTO pokemon (id, name, type) VALUES (?, ?, ?);",
          [id, name, type],
          (_, result) => console.log("Pokemon added successfully!", result),
          (_, error) => 
            {
              console.error("Failed to insert data", error);
              return false;
           }
        );
      });
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const createTeam = (teamName: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO teams (name) VALUES (?);",
        [teamName],
        (_, result) => console.log("Team created successfully!", result),
        (_, error) => 
          {
            console.error("Failed to create team", error)
            return false;
          }
      );
    });
  };

  const addPokemonToTeam = (teamId: number, pokemonId: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO team_pokemon (team_id, pokemon_id) VALUES (?, ?);",
        [teamId, pokemonId],
        (_, result) => console.log("Pokemon added to team successfully!", result),
        (_, error) => {
          console.error("Failed to add pokemon to team", error)
          return false;
        }
      );
    });
  };

  const getTeamWithPokemon = (teamId: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT p.* FROM pokemon p
         JOIN team_pokemon tp ON p.id = tp.pokemon_id
         WHERE tp.team_id = ?;`,
        [teamId],
        (_, { rows }) => {
          console.log("Team Pokémon:", rows._array);
        },
        (_, error) => {
          console.error("Failed to get team pokemon", error)
          return false;
        }
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Pokemon Teams</Text>
      <Button title="Fetch Pokemon" onPress={fetchPokemon} />
      <Button title="Create Team" onPress={() => createTeam("My First Team")} />
      <Button title="Add Pokemon to Team" onPress={() => addPokemonToTeam(1, 1)} />
      <Button title="Get Team Pokémon" onPress={() => getTeamWithPokemon(1)} />
    </View>
  );
}