import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

const SONGS_COLLECTION = "songs";

// Obtener todas las canciones una sola vez
export const getSongs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SONGS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener canciones: ", error);
    throw error;
  }
};

// Escuchar cambios en tiempo real en la colección de canciones
export const subscribeToSongs = (callback) => {
  const songsRef = collection(db, SONGS_COLLECTION);
  
  return onSnapshot(songsRef, (snapshot) => {
    const songs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(songs);
  });
};

// Agregar una nueva canción
export const addSong = async (songData) => {
  try {
    const docRef = await addDoc(collection(db, SONGS_COLLECTION), songData);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar canción: ", error);
    throw error;
  }
};

// Actualizar una canción existente
export const updateSong = async (id, updatedData) => {
  try {
    const songRef = doc(db, SONGS_COLLECTION, id);
    await updateDoc(songRef, updatedData);
  } catch (error) {
    console.error("Error al actualizar canción: ", error);
    throw error;
  }
};

// Eliminar una canción
export const deleteSong = async (id) => {
  try {
    const songRef = doc(db, SONGS_COLLECTION, id);
    await deleteDoc(songRef);
  } catch (error) {
    console.error("Error al eliminar canción: ", error);
    throw error;
  }
};