import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PokemonGrid } from '@/app/team-pokemon';
import { useSQLiteContext } from 'expo-sqlite'; // Import the hook to mock

jest.mock('expo-sqlite'); // Mock the SQLite module

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); // Mock Animated for React Native tests

// Create a mock database object with the required methods
const mockDb = {
  getAllAsync: jest.fn(() => Promise.resolve([{ pokemon_id: 1 }, { pokemon_id: 4 }])),
  getFirstAsync: jest.fn(() => Promise.resolve({ id: 1 })),
};

describe('PokemonGrid', () => {
  beforeEach(() => {
    // Mock the useSQLiteContext to return the mockDb
    (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);

    // Mock the initial Pokémon list fetch
    global.fetch = jest.fn((url) => {
      if (url === 'https://pokeapi.co/api/v2/pokemon?limit=6') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
            ],
          }),
        } as Response);
      }

      // Mock individual Pokémon data fetch
      if (url === 'https://pokeapi.co/api/v2/pokemon/1/') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 1,
            name: 'bulbasaur',
            sprites: {
              front_default: 'https://example.com/bulbasaur.png',
            },
          }),
        } as Response);
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon/4/') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 4,
            name: 'charmander',
            sprites: {
              front_default: 'https://example.com/charmander.png',
            },
          }),
        } as Response);
      }

      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', async () => {
    const { getByText } = render(<PokemonGrid />);

    await waitFor(() => {
      expect(getByText('My Team')).toBeTruthy();
    });
  });

  it('renders pokemon', async () => {
    const { getByText } = render(<PokemonGrid />);

    await waitFor(() => {
      expect(getByText('bulbasaur')).toBeTruthy();
      expect(getByText('charmander')).toBeTruthy();
    });
  });
});
