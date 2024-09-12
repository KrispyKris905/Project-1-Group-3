import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import * as SQLite from 'expo-sqlite/legacy';
import axios from "axios";


export default function Index() {
    const db = SQLite.openDatabase('user.db');

  useEffect(() => {

    // Initialize database tables
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, username TEXT, password TEXT);"
      );
    });

    const createUser = (username : string, password : string) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO users (username,password) VALUES (?,?);",
                [username,password],
                (_, result) => console.log("User created successfully!", result),
                (_, error) => {console.error("Failed to insert user", error);
                    return false;}
            )
        }
    
    )
    }
  }, []);

  

  

  

 
}