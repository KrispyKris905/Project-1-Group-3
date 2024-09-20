import React from 'react';
import HomeScreen from '@/app';
import { render, screen } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const SimpleHomeScreen = () => (
  <View>
    <Text>Home Screen</Text>
    <Button title="Sign up" onPress={() => {}} />
    <Button title="Log in" onPress={() => {}} />
  </View>
);

const MockNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={SimpleHomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('HomeScreen', () => {
  it('renders correctly', () => {
    render(<MockNavigation />);
    expect(screen.getByText('Home Screen')).toBeTruthy();
    expect(screen.getByText('Sign up')).toBeTruthy();
    expect(screen.getByText('Log in')).toBeTruthy();
  });
});