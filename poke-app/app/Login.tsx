import { View, Button, StyleSheet, TextInput } from 'react-native';
import { useState} from 'react';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from "expo-sqlite";
import {compareUsernames} from './SignUp';

async function checkLogin(username: string, password: string, navigation: any) {
  const db = SQLite.openDatabaseSync("users.db");

  if (await compareUsernames(username) == true) { // user doesnt exist
    alert("Username not found");
  } else { // username found
    // check if passwords match
    const result = db.getAllSync(
    'SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    if (result.length > 0) {
      navigation.navigate('(tabs)' as never);
    } else {
      alert("Wrong password");
    }

  }

  
}


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    checkLogin(username,password, navigation);

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