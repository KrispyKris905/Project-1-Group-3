import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import SignupScreen from '@/app/SignUp';
import * as pokeDb from '@/app/poke';

jest.mock('@/app/poke'); // Mock the database functions

describe('SignupScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
  });

  it('updates state when user types into inputs', () => {
    const { getByPlaceholderText } = render(<SignupScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(usernameInput, 'newuser');
    fireEvent.changeText(passwordInput, 'newpassword');

    expect(usernameInput.props.value).toBe('newuser');
    expect(passwordInput.props.value).toBe('newpassword');
  });

  it('calls createUser on sign up button press', () => {
    (pokeDb.createUser as jest.Mock).mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Sign up');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpassword');
    fireEvent.press(signUpButton);

    expect(pokeDb.createUser).toHaveBeenCalledWith('testuser', 'testpassword');
  });

});
