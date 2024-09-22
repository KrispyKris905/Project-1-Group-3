import { Content } from "@/app/teams";
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite'; 

// Mock the SQLiteProvider for testing
const MockSQLiteProvider = ({ children }: { children: React.ReactNode }) => {
    // Optionally, you can mock the SQLite database instance here if necessary
    return (
        <SQLiteProvider databaseName="mock.db">
            {children}
        </SQLiteProvider>
    );
};

describe('Content', () => {
    it('renders team page components', () => {
        const { getByPlaceholderText, getByText } = render(
            <NavigationContainer>
                <MockSQLiteProvider>
                    <Content />
                </MockSQLiteProvider>
            </NavigationContainer>
        );

        expect(getByText('Teams')).toBeTruthy();
        expect(getByPlaceholderText('Team Name')).toBeTruthy();
        expect(getByText('Create Team')).toBeTruthy();
    });
});
