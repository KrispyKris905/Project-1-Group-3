import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import * as pokeDb from './poke';
import { UserContext } from '@/components/CurrentUser';
import { useNavigation, router } from 'expo-router';

// Interface for Team object
interface Team {
  name: string;
  id: number;
}

const {userId} = React.useContext(UserContext);

// Function to list teams
async function listTeams(db: SQLiteDatabase): Promise<Team[]> {
  try {
    const result = await db.getAllAsync<Team>('SELECT * FROM teams');
    console.log("Teams:", result);
    return result;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// App component that provides SQLite context
export default function TeamsManager() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="poke.db">
        <Content />
      </SQLiteProvider>
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
      const result = await listTeams(db);
      setTeams(result);
    }
    fetchTeams();
  }, [db]); // Run once when the component mounts

  const handleCreateTeam = async () => {
    await pokeDb.createTeam(teamName, userId); // Pass the db instance from the context
    setTeamName('');
    const result = await listTeams(db);
    setTeams(result); // Update the team list after creating a team
  };

  const handleDeleteTeam = async (id: number) => {
    await pokeDb.deleteTeam(id); // Pass the db instance from the context
    const result = await listTeams(db); // Re-fetch the team list after deletion
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
              <TouchableOpacity onPress={() => router.push("/team-pokemon")}>
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
