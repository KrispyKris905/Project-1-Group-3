import { Image,View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Content />
    </View>
  );
}

export function Content() {

  const navigation = useNavigation();

  return (

    <View style={styles.container}>
      <Image source={require('@/assets/images/Poke-App_Logo.png')}style={styles.headerImage} resizeMode="contain"/>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign up" 
          onPress={() => navigation.navigate('SignUp' as never)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Log in"
          onPress={() => navigation.navigate('Login' as never)}
        />
      </View>
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
    marginBottom: 10,
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
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
    backgroundColor: "#FFC0CB",
  },
});