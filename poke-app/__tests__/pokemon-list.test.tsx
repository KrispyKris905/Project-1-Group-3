import React from "react";
import { render, waitFor } from '@testing-library/react-native';
import ListScreen from "../app/pokemon-list";

test("renders the ListScreen component correctly", async () => {
  const { getByText } = render(<ListScreen />);

  // Wait for the Pokémon list to be fetched and rendered
  //checks for title
  await waitFor(() => {
    expect(getByText("Pokémon List")).toBeTruthy();
  });
  //checks for first item of api(id = 1 is bulbasaur)
  await waitFor(() => {
    expect(getByText("bulbasaur")).toBeTruthy();
  });
  
});