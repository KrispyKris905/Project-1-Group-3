import * as SQLite from "expo-sqlite/legacy"
import axios from "axios"

const db = SQLite.openDatabase('pokemon.db');

// Initialize database tables (can be called when app starts)
export const initDatabase = () => {

  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
    console.log('Foreign keys turned on')
  );

  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY NOT NULL, name TEXT, type TEXT);"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY NOT NULL, name TEXT, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS team_pokemon (team_id INTEGER, pokemon_id INTEGER, FOREIGN KEY(team_id) REFERENCES teams(id), FOREIGN KEY(pokemon_id) REFERENCES pokemon(id));"
    );
  });
};

export const fetchPokemonList = async () => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const pokemonList = response.data.results;

        const detailedPokemonList = await Promise.all(
            pokemonList.map(async (pokemon) => {
                const details = await axios.get(pokemon.url); // Fetch Pokemon details using the URL
                return {
                    name: pokemon.name,
                    // id: details.data.id, // Get ID
                    image: details.data.sprites.front_default, // Get image
                    // types: details.data.types.map((type) => type.type.name), // Get types
                };
            })
        );
        return detailedPokemonList;
    } catch (error) {
        console.error('Error fetching list:',error);
        return []; // Return an empty array on error
    }
};



// Fetch Pokémon data from API and insert into SQLite
export const fetchPokemon = async () => {
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
        (_, error) => {
          console.error("Failed to insert data", error);
          return false;
        }
      );
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

// Create a new team
export const createTeam = (teamName, userId) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO teams (name, user_id) VALUES (?,?);",
      [teamName, userId],
      (_, result) => console.log("Team created successfully!", result),
      (_, error) => {
        console.error("Failed to create team", error);
        return false;
      }
    );
  });
};

const getTeamsByUser = (userId) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM teams WHERE  user_id = ?",
      [userId],
      (_,{rows }) => {
        console.log("teams created: ", rows._array);
        return rows._array;
      },
      (_,error) => {
        console.log("failed to fetch teams ", error);
        return false;
      }
    );
  });
};

// Add Pokémon to team
export const addPokemonToTeam = (teamId, pokemonId) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO team_pokemon (team_id, pokemon_id) VALUES (?, ?);",
      [teamId, pokemonId],
      (_, result) => console.log("Pokemon added to team successfully!", result),
      (_, error) => {
        console.error("Failed to add pokemon to team", error);
        return false;
      }
    );
  });
};

// Get all Pokémon in a team
export const getTeamWithPokemon = (teamId) => {
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
        console.error("Failed to get team pokemon", error);
        return false;
      }
    );
  });
};

// Delete a team and its associated Pokémon
export const deleteTeam = (teamId) => {
  db.transaction((tx) => {
    // First, delete the team's Pokémon associations
    tx.executeSql(
      "DELETE FROM team_pokemon WHERE team_id = ?;",
      [teamId],
      (_, result) => console.log("Team's Pokémon deleted successfully!", result),
      (_, error) => {
        console.error("Failed to delete team Pokémon", error);
        return false;
      }
    );
    
    // delete the team itself
    tx.executeSql(
      "DELETE FROM teams WHERE id = ?;",
      [teamId],
      (_, result) => console.log("Team deleted successfully!", result),
      (_, error) => {
        console.error("Failed to delete team", error);
        return false;
      }
    );
  });
};
