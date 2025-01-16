import { db } from "../firebase.service";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

const DB_NAME = "voice_models";

export type VoiceModelDoc = {
  avatarPath: string;
  name: string;
  creator: string;
  id: string;
  slug: string;
  uid: string;
  url: string;
};

const createFirestoreId = (userString: string) => {
  // Convert to lowercase
  let firestoreId = userString.toLowerCase();
  // Remove spaces
  firestoreId = firestoreId.replace(/\s+/g, "");
  // Remove any non-alphanumeric characters except underscores
  firestoreId = firestoreId.replace(/\W+/g, "");
  return firestoreId;
};

const createVoiceModelDoc = async (
  id: string,
  userId: string,
  voiceModelObj: any
): Promise<void> => {
  const d = doc(db, DB_NAME, createFirestoreId(id) + "_" + userId);
  await setDoc(d, voiceModelObj);
};

const getVoiceModels = async (): Promise<VoiceModelDoc[]> => {
  const res = await getDocs(
    query(collection(db, DB_NAME), orderBy("creator", "desc"), limit(18))
  );
  return res.docs.map((doc) => doc.data() as VoiceModelDoc);
};

export { createVoiceModelDoc, getVoiceModels };
