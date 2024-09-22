import { View, Button, StyleSheet, TextInput, Pressable, Text, Image, Alert } from 'react-native';
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

  const handleLogin = async () => {
    if(username== null || username.length == 0){
      Alert.alert('Username must not be empty');
      return;
    }
    if(password.length == 0 || password == null){
      Alert.alert('Password must not be empty');
      return;
    }
    checkLogin(db, username,password, navigation);

  };

    return (
      <View style={styles.container}>
      <Image source={require('@/assets/images/Poke-App_Logo.png')} style={styles.headerImage} resizeMode="contain" />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ThemedView style={styles.buttons}>
        <Pressable style={styles.pressable} onPress={handleLogin}>
          <Text style={styles.pressableText}>Log in</Text>
        </Pressable>
      <Text>
        Don't have an account?
      </Text>
        <Pressable style={styles.pressable} onPress={() => navigation.navigate('SignUp' as never)}>
          <Text style={styles.pressableText}>Sign up</Text>
        </Pressable>
      </ThemedView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      color: '#808080',
      top: 0,
      alignContent: 'center',
      width: 400,
      height: 300,
    },
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
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      width: '80%',
      color:'black',
    },
    pressable: {
      marginVertical: 10,
      backgroundColor: "#2a75bb",
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      height: 50,
    },
    pressableText: {
      color: '#ffcb05',
      fontSize: 35,
      fontWeight: 'bold',
    },
    buttons:{
      marginVertical: 10,
      width: '80%',

    },
  });