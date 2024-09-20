import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './index';
import LoginScreen from './Login';
import SignupScreen from './SignUp';
import MenuScreen from './main-menu';
import ListScreen from './pokemon-list';
import TeamsScreen from './teams';
import PokemonTeam from './team-pokemon';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="poke.db">
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen name="index" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="main-menu" component={MenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="SignUp" component={SignupScreen}/>
        <Stack.Screen name="pokemon-list" component={ListScreen}/>
        <Stack.Screen name="teams" component={TeamsScreen}/>
        <Stack.Screen name="team-pokemon" component={PokemonTeam}/>
      </Stack.Navigator>
  </SQLiteProvider>

    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack initialRouteName='index' >
    //     <Stack.Screen name="index" options={{ headerShown: false }}/>
    //     <Stack.Screen name="(tabs)"  options={{ headerShown: false }}/>
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    // </ThemeProvider>
  );
}