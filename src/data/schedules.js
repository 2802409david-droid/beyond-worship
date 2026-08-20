import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

const SCHEDULES_COLLECTION = "schedules";

// Escuchar programaciones en tiempo real (para la lista)
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

// Obtener un solo culto por ID (para ScheduleDetail)
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
    console.error("Error al obtener la programación: ", error);
    return null;
  }
};

// Agregar una programación
export const addSchedule = async (scheduleData) => {
  try {
    const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), scheduleData);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar programación: ", error);
    throw error;
  }
};

// Actualizar una programación
export const updateSchedule = async (id, updatedData) => {
  try {
    const scheduleRef = doc(db, SCHEDULES_COLLECTION, id);
    await updateDoc(scheduleRef, updatedData);
  } catch (error) {
    console.error("Error al actualizar programación: ", error);
    throw error;
  }
};

// Eliminar una programación
export const deleteSchedule = async (id) => {
  try {
    const scheduleRef = doc(db, SCHEDULES_COLLECTION, id);
    await deleteDoc(scheduleRef);
  } catch (error) {
    console.error("Error al eliminar programación: ", error);
    throw error;
  }
};

// Compatibilidad por si acaso
export const getSchedules = () => [];