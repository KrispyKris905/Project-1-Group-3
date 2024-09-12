import { Image,View, Button, StyleSheet, Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/Poke-App_Logo.png')}style={styles.headerImage} resizeMode="contain"/>
      <ThemedView style={styles.buttonContainer}>
        <Button
          title="Sign up" 
          onPress={() => navigation.navigate('SignUp' as never)}
        />
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <Button
          title="Log in"
          onPress={() => navigation.navigate('Login' as never)}
        />
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
    position: 'absolute',
    alignContent: 'center',
    width: 400,
    height: 400,
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
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: "#FFC0CB",
  },
});