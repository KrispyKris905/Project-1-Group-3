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

    const checkUsernameExists = (username, callback) => {
      db.transaction((tx) => {
          tx.executeSql(
              "SELECT * FROM user WHERE username = ?;",
              [username],
              (_, { rows }) => {
                  if (rows.length > 0) {
                      callback(true); // Username exists
                  } else {
                      callback(false); // Username does not exist
                  }
              },
              (_, error) => {
                  console.error("Failed to query user", error);
                  return false;
              }
          );
      });
  };
  
    // Function to create a new user
    const createUser = (username, password) => {
      checkUsernameExists(username, (exists) => {
          if (exists) {
              console.log("Username already exists. Choose a different one.");
              return;
          }
          
          // Insert new user if username doesn't exist
          db.transaction((tx) => {
              tx.executeSql(
                  "INSERT INTO user (username, password) VALUES (?, ?);",
                  [username, password],
                  (_, result) => console.log("User created successfully!", result),
                  (_, error) => {
                      console.error("Failed to insert user", error);
                      return false;
                  }
              );
          });
      });
  }

  
};