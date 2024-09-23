import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '@/app/Login';
import * as pokeDb from '@/app/poke';
import { useSQLiteContext  } from 'expo-sqlite'; 


const mockNavigation = jest.fn();

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(() => ({
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  })),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigation, // Mock the navigate function
  }),
}));

jest.mock('@/app/poke'); // Mock the database functions

jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(() => ({
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  })),
}));


describe('LoginScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mock calls before each test
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
  });

  it('updates state when user types into inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows alert when username does not exist', async () => {
    (pokeDb.compareUsernames as jest.Mock).mockResolvedValue(true);

    // Spy on Alert.alert
    jest.spyOn(Alert, 'alert');

    render(<LoginScreen />);
    const loginButton = screen.getByText('Log in');
    fireEvent.press(loginButton);

    // Wait for the alert to be called
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('shows alert when password is incorrect', async () => {
    // Mock the database check to find the username but return wrong password
    (pokeDb.compareUsernames as jest.Mock).mockResolvedValue(false); //username is true!
    (pokeDb.openPokeDatabase as jest.Mock).mockReturnValue({
      getAllAsync: jest.fn().mockResolvedValue([]), //  wrong password no return.
    });

    jest.spyOn(Alert, 'alert');

    render(<LoginScreen />);

    const loginButton = screen.getByText("Log in");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('navigates to the home screen on successful login', async () => {
    // Mock the database functions to return valid data for login
  const mockDb = {
    getAllAsync: jest.fn().mockResolvedValue([{ id: 1 }]), // Correct password
    getFirstAsync: jest.fn().mockResolvedValue({ id: 1 }), // Mock getFirstAsync for userId
  };

  (pokeDb.compareUsernames as jest.Mock).mockResolvedValue(false); // Username exists
  
  // Mock the SQLite context to return our mockDb
  (useSQLiteContext as jest.Mock).mockReturnValue(mockDb);
  
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  
  fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
  fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      
    const loginButton = getByText('Log in');
    await waitFor(async () => {
      fireEvent.press(loginButton);
      expect(mockNavigation).toHaveBeenCalled();
    });
  });
});
