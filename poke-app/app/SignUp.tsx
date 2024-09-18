import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from 'expo-sqlite';

// Open the database and create the users table if it doesn't exist
export async function openUserDatabase() {
  const db = await SQLite.openDatabaseAsync('users.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL, 
      username TEXT NOT NULL, 
      password TEXT NOT NULL
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
}

// List all users and log them to the console
export async function listUsers() {
  const db = await SQLite.openDatabaseAsync('users.db');
  const allUsers = await db.getAllAsync('SELECT * FROM users');
  console.log('List of users:');
  console.log(allUsers);
}

// Check if the username exists
export async function compareUsernames(username: string): Promise<boolean> {
  const db = await SQLite.openDatabaseAsync('users.db');
  const result = await db.getAllAsync('SELECT * FROM users WHERE username = ?', [username]);

  return result.length > 0 ? false : true;
}

// Create a new user if the username is not taken
async function createUser(username: string, password: string) {
  const db = await SQLite.openDatabaseAsync('users.db');

  if (await compareUsernames(username)) {
    await db.execAsync(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`);
    console.log('User created');
    await listUsers();
  } else {
    alert('Username is taken');
    console.log('User already exists');
  }
}

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUser(username, password);
  };

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Welcome!</ThemedText>
      <View style={styles.buttonContainer}>
        <TextInput
          style={{ padding: 10, borderWidth: 1 }}
          placeholder='Username'
          onChangeText={setUsername}
        />
        <TextInput
          style={{ padding: 10, borderWidth: 1 }}
          placeholder='Password'
          onChangeText={setPassword}
          secureTextEntry={true}
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
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});
