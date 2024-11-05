import { createSlice } from "@reduxjs/toolkit";
import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { isLoading } from "./countriesSlice";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../auth/firebase";

// Initial state for the favourites slice
const initialState = {
  favourites: [],
  isLoading:true,
};

// Create the favourites slice
const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action) => {

      state.favourites = action.payload;
    },
    isLoading:(state, action) => {
      state.isLoading = action.payload
    }

  },
});

// Export the action creator
export const { setFavourites } = favouritesSlice.actions;

// Thunk to initialize favourites
export const initializeFavourites = () => async (dispatch) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const q = query(collection(db,`users/${user.uid}/favourites`))
    const querySnapShot = await getDocs(q) 
    
  const firebaseFavourites = querySnapShot.docs.map((doc)=>doc.data().name)
  console.log('firebase favourite',firebaseFavourites)
  dispatch(setFavourites(firebaseFavourites))
  dispatch(isLoading(false))
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
