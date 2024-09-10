import { Image,View, Button, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignupScreen() {
    return (
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <View style={styles.buttonContainer}>
          <Button
            title="Sign up"
          //   onPress={() => navigation.navigate('SignUp')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Log in"
          //   onPress={() => navigation.navigate('Login')}
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