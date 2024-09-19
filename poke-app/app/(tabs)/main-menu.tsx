import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setLoggedInUserId } from '../Login';


export default function MenuScreen() {
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon App</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="View Pokémon List"
        onPress={() => navigation.navigate('pokemon-list' as never)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Team Manager"
          onPress={() => navigation.navigate('teams' as never)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Profile"
        //   onPress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign out"
          onPress={() => {
            setLoggedInUserId(0);
            navigation.navigate('index' as never);
          }}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: "#FFC0CB",
  }
});