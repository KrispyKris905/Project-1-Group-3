import * as SQLite from 'expo-sqlite';


let db: SQLite.SQLiteDatabase;

// Open the database and create users, teams, and team_pokemon 
// tables if they don't exist

export async function openPokeDatabase(): Promise<SQLite.SQLiteDatabase> {
        db = await SQLite.openDatabaseAsync('poke.db');
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL, 
          username TEXT NOT NULL, 
          password TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT, 
        user_id INTEGER, 
        FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS team_pokemon (
        team_id INTEGER, 
        pokemon_id INTEGER, 
        FOREIGN KEY(team_id) 
        REFERENCES teams(id), 
        FOREIGN KEY(pokemon_id) REFERENCES pokemon(id)
        );
      `);
  
      // Check if the users table is empty
      const existingRows = await db.getAllAsync('SELECT * FROM users');
  
      // If no rows exist, insert some test users
      if (existingRows.length === 0) {
        await db.execAsync(`
          INSERT INTO users (username, password) VALUES ('test1', '123');
          INSERT INTO users (username, password) VALUES ('test2', '456');
        `);
      }
    } catch (error) {
      console.error('Error during database operation:', error);
    }
    return db;
}

// User Table Functions

// List all users and log them to the console
export async function listUsers() {
    if (!db) {
        await openPokeDatabase();
    }
    try {
        const allUsers = await db.getAllAsync('SELECT * FROM users');
        console.log('List of users:');
        console.log(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Check if the username exists
export async function compareUsernames(username: string): Promise<boolean> {
    if (!db) {
        await openPokeDatabase();
    }
  
    const result = await db.getAllAsync('SELECT * FROM users WHERE username = ?', [username]);
    return result.length > 0 ? false : true;
}

// Create a new user if the username is not taken
export async function createUser(username: string, password: string) {
    if (!db) {
        await openPokeDatabase();
    }
    try {
        if (await compareUsernames(username)) {
            await db.execAsync(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`);
            console.log('User created');
            await listUsers();
        } else {
            alert('Username is taken');
            console.log('User already exists');
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
  
}

// Teams Table Functions

// Function to create a team
export async function createTeam(name: string, userId: number) {
    if (!db) {
        await openPokeDatabase();
    }
    try {
      await db.runAsync(`INSERT INTO teams (name, user_id) VALUES (?, ?)`, [name, userId]);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  }
  
  // Function to delete a team by ID
export async function deleteTeam(id: number) {
    if (!db) {
        await openPokeDatabase();
    }
    try {
      await db.runAsync(`DELETE FROM teams WHERE id = ?`, [id]);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  }

// Pokemon in a Team Functions

