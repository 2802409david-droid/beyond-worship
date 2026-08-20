// src/data/team.js
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

const TEAM_COLLECTION = "team";

// Escuchar cambios en tiempo real del equipo desde Firebase
export const subscribeToTeam = (callback) => {
  const teamRef = collection(db, TEAM_COLLECTION);
  
  return onSnapshot(teamRef, (snapshot) => {
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(members);
  });
};

// Agregar un integrante a la nube
export const addMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, TEAM_COLLECTION), memberData);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar integrante: ", error);
    throw error;
  }
};

// Actualizar un integrante
export const updateMember = async (id, updatedData) => {
  try {
    const memberRef = doc(db, TEAM_COLLECTION, id);
    await updateDoc(memberRef, updatedData);
  } catch (error) {
    console.error("Error al actualizar integrante: ", error);
    throw error;
  }
};

// Eliminar un integrante
export const deleteMember = async (id) => {
  try {
    const memberRef = doc(db, TEAM_COLLECTION, id);
    await deleteDoc(memberRef);
  } catch (error) {
    console.error("Error al eliminar integrante: ", error);
    throw error;
  }
};

// Compatibilidad por si algún otro componente aún lo solicita
export const getTeamMembers = () => [];