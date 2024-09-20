import { View, Button, StyleSheet, TextInput } from 'react-native';
import { useState} from 'react';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from "expo-sqlite";
import * as pokeDb from './poke';

let loggedInUserId = 0;

export const getLoggedInUserId = () => loggedInUserId;

export const setLoggedInUserId = (newId: number) => {
  loggedInUserId = newId;
};

async function checkLogin(username: string, password: string, navigation: any) {
  const db = await pokeDb.openPokeDatabase();

    if (await pokeDb.compareUsernames(username) == true) { // user doesnt exist
      alert("Username not found");
    } else { // username found
      // check if passwords match
      const result = await db.getAllAsync(
        'SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
      
        if (result.length > 0) {
          getUserId(username);
          navigation.navigate('(tabs)' as never);
        } else {
          alert("Wrong password");
        }
    }

}

async function getUserId(username: string) {
  const db = await pokeDb.openPokeDatabase();

    const userId = await db.getFirstAsync(`SELECT id FROM users WHERE username = ?`, [username]) as { id: number };
    setLoggedInUserId(userId.id);
    console.log("loggedInUserId: ",loggedInUserId);

}



export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    checkLogin(username, password, navigation);

  };


  
    return (
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <View style={styles.buttonContainer}>
        <TextInput
           style={{padding: 10, borderWidth: 1}}
           placeholder='Username'
           value={username}
           onChangeText={setUsername}
           />
           <TextInput
           style={{padding: 10, borderWidth: 1}}
           placeholder='Password'
           value={password}
           onChangeText={setPassword}
           secureTextEntry={true}
           />
          <Button
            title="Login"
            onPress={handleLogin}
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