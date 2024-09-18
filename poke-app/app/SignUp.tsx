import { Image,View, Button, StyleSheet, TextInput } from 'react-native';
import { useState} from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from "expo-sqlite";

// async function resetDatabase() {
//   const db = SQLite.openDatabaseSync("users.db");
//   const existing = await db.getAllAsync('SELECT * FROM users');
//   if (existing.length > 0) {
//     console.log("existing length>0")
//     db.closeAsync();
//     SQLite.deleteDatabaseSync("users.db");
//   }
// }

async function openDatabase() {

  const db = SQLite.openDatabaseSync("users.db");
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL, 
    username TEXT NOT NULL, 
    password TEXT NOT NULL);
    `);

    // Check if the user table empty
  const existingRows = await db.getAllAsync('SELECT * FROM users');

  // If no rows exist, insert user test data
  if (existingRows.length === 0) {
    await db.execAsync(`
      INSERT INTO users (username, password) VALUES ('test1', '123');
      INSERT INTO users (username, password) VALUES ('test2', '456');
    `);
  }

  // const allRow = await db.getAllAsync('SELECT * FROM users');
  // console.log("test user db: ")
  // console.log(allRow);
}

// list all users on console
async function listUsers() {
  const db = SQLite.openDatabaseSync("users.db");
  const allUsers = db.getAllSync('SELECT * FROM users');
  console.log("listUsers:")
  console.log(allUsers);
}

async function compareUsernames(username: string): Promise<boolean> {
  
  const db = SQLite.openDatabaseSync("users.db");

    // Query to check if the usernames match
    const result = await db.getAllAsync(
      'SELECT * FROM users WHERE username = ?', [username]);
      
    if (result.length > 0) {
      return false; //username already exists
    } 
    return true; //username does not exist
}

async function createUser(username: string, password: string) {
  const db = SQLite.openDatabaseSync("users.db");
  if (await compareUsernames(username) == true) { // user doesnt exist
    await db.execAsync(`
      INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
    );
    console.log("user created");
  } else { // user exists
    console.log("user already exists");
  }
}


const db = openDatabase();
// createUser("test1","testpass");
listUsers();

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    createUser(username,password);
  };

    return (
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <View style={styles.buttonContainer}>
           <TextInput
           style={{padding: 10, borderWidth: 1}}
           placeholder='Username'
           onChangeText={setUsername}
           />
           <TextInput
           style={{padding: 10, borderWidth: 1}}
           placeholder='Password'
           onChangeText={setPassword}
           />
          <Button
            title="Sign up"
            onPress={handleSignUp}
          />
        </View>
      </ThemedView>
    );
  }
  
  const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    buttonContainer: {
      marginVertical: 10,
      width: '80%',
    },
  });