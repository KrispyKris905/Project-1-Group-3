import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import * as pokeDb from './poke';
import { getLoggedInUserId } from './Login';

// Interface for Team object
interface Team {
  name: string;
  id: number;
}

let currentTeamId=0;

export const getCurrentTeamId = () => currentTeamId;

export const setCurrentTeamId = (newId: number) => {
  currentTeamId = newId;
};

// Function to list teams
async function listTeams(db: SQLiteDatabase, userId: number): Promise<Team[]> {
  try {
    const result = await db.getAllAsync<Team>('SELECT * FROM teams WHERE user_id = ?', [userId]);
    console.log("Teams:", result);
    return result;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// App component that provides SQLite context
export default function TeamsScreen() {
  return (
    <View style={styles.container}>
      
        <Content />
      
    </View>
  );
}

// Content component that handles team display and interactions
export function Content() {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const navigation = useNavigation();
  const db = useSQLiteContext(); // Get the SQLite database instance from the context

  // Fetch teams when the component mounts
  useEffect(() => {
    async function fetchTeams() {
      const result = await listTeams(db,userId);
      setTeams(result);
    }
    fetchTeams();
  }, [db]); // Run once when the component mounts

  const userId = getLoggedInUserId(); // Get logged-in user ID

  const handleCreateTeam = async () => {
    
    await pokeDb.createTeam(teamName, userId); // Pass the db instance from the context
    setTeamName('');
    const result = await listTeams(db,userId);
    setTeams(result); // Update the team list after creating a team
  };

  const handleDeleteTeam = async (id: number) => {
    await pokeDb.deleteTeam(id); // Pass the db instance from the context
    const result = await listTeams(db,userId); // Re-fetch the team list after deletion
    setTeams(result);
  };

  return (
    <ThemedView style={styles.container}>
      <View>
        <ThemedText type="title">Teams</ThemedText>
      </View>
      <View>
        <TextInput
          placeholder="Team Name"
          value={teamName}
          onChangeText={setTeamName}
        />
        <Button
          title="Create Team"
          onPress={handleCreateTeam}
          disabled={teamName.trim() === ''}
        />

        <Text>Created Teams</Text>
        <ScrollView>
          {teams.map((team) => (
            <View key={team.id}>
              <Text>{`${team.name}`}</Text>
              <TouchableOpacity onPress={() => handleDeleteTeam(team.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setCurrentTeamId(team.id);
                navigation.navigate('team-pokemon' as never);
              }
                
                }>
                <Text>Edit Team</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
});
