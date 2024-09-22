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
