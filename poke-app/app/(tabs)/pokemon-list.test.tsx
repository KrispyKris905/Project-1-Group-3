import React from "react";
import { render, waitFor } from '@testing-library/react-native';
import ListScreen from "./pokemon-list";

test("renders the ListScreen component correctly", async () => {
  const { getByText } = render(<ListScreen />);

  // Wait for the Pokémon list to be fetched and rendered
  await waitFor(() => {
    expect(getByText("Pokémon List")).toBeTruthy();
  });
});