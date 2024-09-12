import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import * as SQLite from 'expo-sqlite/legacy';
import axios from "axios";


export default function Index() {
    const db = SQLite.openDatabase('user.db');
  
    useEffect(() => {
      // Initialize the user table
      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, username TEXT, password TEXT);"
        );
      });
    }, []);
  
    // Function to create a new user
    const createUser = (username, password) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user (username, password) VALUES (?, ?);", // Insert into the correct table (user)
          [username, password],
          (_, result) => console.log("User created successfully!", result),
          (_, error) => {
            console.error("Failed to insert user", error);
            return false;
          }
        );
      });
    };
  
    return (
      <View>
        <Text>User Management</Text>
        <Button title="Create User" onPress={() => createUser("testUser", "password123")} />
      </View>
    );
  }
  