// favouritesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth } from "firebase/auth";

// Initial state for the favourites slice
const initialState = {
  favourites: [],
};

// Create the favourites slice
const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action) => {
      state.favourites = action.payload;
    },
  },
});

// Export the action creator
export const { setFavourites } = favouritesSlice.actions;

// Thunk to initialize favourites
export const initializeFavourites = () => async (dispatch) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase();
    const favRef = ref(db, `favourites/${user.uid}`);
    const snapshot = await get(favRef);
    if (snapshot.exists()) {
      const favs = snapshot.val();
      const favCountries = Object.keys(favs).filter(key => favs[key]);
      dispatch(setFavourites(favCountries));
    }
  }
};

// Thunk to add a favourite country
export const addFavouriteThunk = (country) => async (dispatch) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase();
    const favRef = ref(db, `favourites/${user.uid}/${country.name.common}`);
    await set(favRef, true);
    dispatch(initializeFavourites());  // Re-fetch favourites after adding a new one
  } else {
    console.error("User not authenticated");
  }
};

// Export the reducer
export default favouritesSlice.reducer;
