import { View, Button, StyleSheet, TextInput } from 'react-native';
import { useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as pokeDb from './poke';
import { useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';

let loggedInUserId = 0;

export const getLoggedInUserId = () => loggedInUserId;

export const setLoggedInUserId = (newId: number) => {
  loggedInUserId = newId;
};

async function checkLogin(db: SQLiteDatabase,username: string, password: string, navigation: any) {

    if (await pokeDb.compareUsernames(username) == true) { // user doesnt exist
      alert("Username not found");
    } else { // username found
      // check if passwords match
      const result = await db.getAllAsync(
        'SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
      
        if (result.length > 0) {
          getUserId(db, username);
          navigation.navigate('main-menu' as never);
        } else {
          alert("Wrong password");
        }
    }

}

async function getUserId(db:SQLiteDatabase,username: string) {
    const userId = await db.getFirstAsync(`SELECT id FROM users WHERE username = ?`, [username]) as { id: number };
    setLoggedInUserId(userId.id);
    console.log("loggedInUserId: ",loggedInUserId);

}


// App component that provides SQLite context
export default function LoginScreen() {
  return (
    <View>
        <Content />
    </View>
  );
}


export function Content() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const db = useSQLiteContext();

  useEffect 

  const handleLogin = () => {
    checkLogin(db, username,password, navigation);

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