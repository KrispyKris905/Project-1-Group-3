import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TextInput, Pressable, Text, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import * as pokeDb from './poke';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setRE_Password] = useState('');

  const handleSignUp = async () => {
    if(username== null || username.length == 0){
      Alert.alert('Username must not be empty');
      return;
    }
    if(password.length < 8){
      Alert.alert('Password must be at least 8 characters long');
      return;
    }
    if(password != re_password){
      Alert.alert('Passwords do not match');
      return;
    }
    pokeDb.createUser(username, password);
    };
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/Poke-App_Logo.png')}style={styles.headerImage} resizeMode="contain"/>
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
      <TextInput
        style={styles.input}
        placeholder="Re-Enter Password"
        value={re_password}
        onChangeText={setRE_Password}
        secureTextEntry
      />
      <ThemedView style={styles.buttons}>
        <Pressable style={styles.pressable} onPress={handleSignUp}>
          <Text style={styles.pressableText}>Sign Up</Text>
        </Pressable>
      <Text>
        Already have an account?
      </Text>
        <Pressable style={styles.pressable} onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.pressableText}>Log in</Text>
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
