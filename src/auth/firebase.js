import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwd5vrMd1eTpkf8VYxDDHXUU7hBLOmC78",
  authDomain: "dsfdfas-55894.firebaseapp.com",
  projectId: "dsfdfas-55894",
  storageBucket: "dsfdfas-55894.appspot.com",
  messagingSenderId: "433660270978",
  appId: "1:433660270978:web:f405452321144244fd579b",
  measurementId: "G-6GVM33CXCD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const logout = () => {
  auth.signOut();
};

const addFavouriteToFirebase = async (uid, name) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  try {
    await addDoc(collection(db, `users/${uid}/favourites`), { name });
    console.log("favourite added to firebasse");
  } catch (error) {
    console.log("error favourite to firebase", error);
  }
};

const removeFavouriteFromFirebase = async (uid, name) => {
  try {
    if (!name) {
      console.error(
        "Error removing favourite from firebase: Name parameter undefined"
      );
      return;
    }
    const q = query(
      collection(db, `users/${uid}/favourites`),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("Favourite removed from Firebase");
    });
  } catch (error) {
    console.log("Error removing favourite from firebase", error);
  }
};

const getFavourites = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  return userDoc.exists() ? userDoc.data().favourites : [];
};

const clearFavouritesFromFirebase = async (uid) => {
  try {
    const q = query(collection(db, `users/${uid}/favourites`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
      console.log("Favourites cleared from Firebase");
    });
  } catch (error) {
    console.log("Error clearing favourites from firebase", error);
  }
};

export {
  addFavouriteToFirebase,
  app,
  auth,
  clearFavouritesFromFirebase,
  db,
  getFavourites,
  loginWithEmailAndPassword,
  logout,
  registerWithEmailAndPassword,
  removeFavouriteFromFirebase,
};
