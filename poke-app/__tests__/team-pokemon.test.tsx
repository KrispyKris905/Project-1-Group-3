import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import PokemonGrid from '@/app/team-pokemon';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); 

describe('PokemonGrid', () => {
  beforeEach(() => {
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

      // Mock the individual Pokémon data fetch 
      if (url === 'https://pokeapi.co/api/v2/pokemon/1/') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 1,
            name: 'bulbasaur',
            sprites: {
              front_default: 'https://example.com/bulbasaur.png', // Mock image URL
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
              front_default: 'https://example.com/charmander.png', // Mock image URL
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
