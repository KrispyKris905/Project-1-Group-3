import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MenuScreen from '../main-menu';
import ListScreen from '../pokemon-list';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
    }}>
      
      <Tab.Screen
        name="pokemon-list"
        component={ListScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="main-menu"
        component={MenuScreen}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    
  );
}