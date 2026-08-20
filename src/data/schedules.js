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

const SCHEDULES_COLLECTION = "schedules";

export const getSchedules = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SCHEDULES_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener programaciones: ", error);
    throw error;
  }
};

export const subscribeToSchedules = (callback) => {
  const schedulesRef = collection(db, SCHEDULES_COLLECTION);
  return onSnapshot(schedulesRef, (snapshot) => {
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(schedules);
  });
};

export const addSchedule = async (scheduleData) => {
  try {
    const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), scheduleData);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar programación: ", error);
    throw error;
  }
};

export const updateSchedule = async (id, updatedData) => {
  try {
    const scheduleRef = doc(db, SCHEDULES_COLLECTION, id);
    await updateDoc(scheduleRef, updatedData);
  } catch (error) {
    console.error("Error al actualizar programación: ", error);
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const scheduleRef = doc(db, SCHEDULES_COLLECTION, id);
    await deleteDoc(scheduleRef);
  } catch (error) {
    console.error("Error al eliminar programación: ", error);
    throw error;
  }
};import { doc, getDoc } from "firebase/firestore"; // Asegúrate de importar getDoc y doc arriba si no los tienes

export const getScheduleById = async (id) => {
  try {
    const docRef = doc(db, SCHEDULES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la programación por ID: ", error);
    throw error;
  }
};