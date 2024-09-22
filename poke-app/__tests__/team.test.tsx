import { Content } from "@/app/teams";
import React from 'react';
import * as pokeDb from '@/app/poke';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite'; // Import SQLiteProvider
import listTeams from "@/app/teams";

//jest.mock('@/app/teams');
jest.mock('expo-sqlite'); // Mock the SQLite module
jest.mock('@/app/poke'); // Mock the pokeDb module

const mockDb = {
    getAllAsync: jest.fn(() => Promise.resolve([])),
    executeSqlAsync: jest.fn(() => Promise.resolve({})),
};

(pokeDb.createTeam as jest.Mock) = jest.fn();

beforeEach(() => {
    // Mock the useSQLiteContext to return the mockDb
    (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
});

describe('Content', () => {
  
  it('renders team page components', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Content />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Teams')).toBeTruthy();
      expect(getByPlaceholderText('Team Name')).toBeTruthy();
      expect(getByText('Create Team')).toBeTruthy();
    });
  });

  it('renders a list of teams', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      { team_id: 1, name: 'Team Rocket' },
      { team_id: 2, name: 'Team Mystic' },
    ]);
  
    const { getByText } = render(
      <NavigationContainer>
        <Content />
      </NavigationContainer>
    );
  
    await waitFor(() => {
      expect(getByText('Team Rocket')).toBeTruthy();
      expect(getByText('Team Mystic')).toBeTruthy();
    });
  });

  it('disables Create Team button when input is empty', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Content />
      </NavigationContainer>
    );
  
    const createButton = getByText('Create Team');
    await waitFor(() => {
      expect(createButton.props.disabled).toBe(true);
    });
  });

  it('creates a new team', async () => {
    // Mock the createTeam function
    (pokeDb.createTeam as jest.Mock).mockResolvedValueOnce({}); // Simulate successful creation
    // Mock the listTeams function to return the new team after creation
    mockDb.getAllAsync.mockResolvedValueOnce([
      { team_id: 1, name: 'Team Valor' }, // Newly created team
    ]);

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Content />
      </NavigationContainer>
    );

    const input = getByPlaceholderText('Team Name');
    const createButton = getByText('Create Team');

    // Change the text in the input
    fireEvent.changeText(input, 'Team Valor');

    // Press the create button
    fireEvent.press(createButton);

    await waitFor(() => {
      expect(getByText('Team Valor')).toBeTruthy();
    });
    });
});
