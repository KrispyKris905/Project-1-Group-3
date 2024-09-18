import { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from "expo-sqlite";
import {SQLiteProvider} from 'expo-sqlite';
import { loggedInUserId } from '../Login';

async function openTeamDatabase() {
  const db = await SQLite.openDatabaseAsync("teams.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY NOT NULL, 
      name TEXT NOT NULL, 
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

async function listTeams(db: any): Promise<Team[]> {
  try {
    const result = await db.getAllAsync('SELECT * FROM teams');
    console.log("listTeams:");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

async function createTeam(name: string) {

    const db = await SQLite.openDatabaseAsync('teams.db');
    await db.execAsync(`INSERT INTO teams (name, user_id) VALUES ('${name}', '${loggedInUserId}')`);
}

// Delete a team from the database by ID
async function deleteTeam(id: number) {
    const db = await SQLite.openDatabaseAsync('teams.db');
    await db.execAsync(`DELETE FROM teams WHERE id = ${id};`);
  }

export default function App() {
    return (
      <View style={styles.container}>
        <SQLiteProvider databaseName="teams.db">
          <Content />
        </SQLiteProvider>
      </View>
    );
  }

interface Team {
    name: string;
    id: number;

}

export function Content() {
    const [teamname, setTeamName] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);

    const db=SQLite.useSQLiteContext();

  useEffect(() => {
    // Initialize the database and list teams after it is set up
    async function setupDatabase () {
      const result = await db.getAllAsync<Team>(`SELECT * FROM teams`);
      console.log("teams: ",result);
      setTeams(result);
    };
    openTeamDatabase();
    setupDatabase();
  }, []); // Runs once when the component mounts

  const handleCreateTeam = async () => {
    await createTeam(teamname);
    setTeamName('');

    const result = await listTeams(db);
    setTeams(result);
  };

  const handleDeleteTeam = async (id: number) => {
    await deleteTeam(id);
    
    // Re-fetch teams after deletion
    const result = await listTeams(db);
    setTeams(result);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Teams</ThemedText>
      <View>
        <TextInput
        placeholder='Team Name'
        onChangeText={setTeamName}
        />
        <Button
            title="Create Team"
            onPress={handleCreateTeam}
            disabled={teamname.trim() === ''}
        />

        <Text>Created Teams</Text>
            {teams.map((team)=>(
                <View key={team.id}>
                    <Text>{`${team.name}`}</Text>
                    <TouchableOpacity onPress={() => handleDeleteTeam(team.id)}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    </View>
            ))}
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
});
