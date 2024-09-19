import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import * as pokeDb from './poke';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
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
