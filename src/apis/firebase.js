import { getFirestore, collection } from "firebase/firestore";
import firebaseApp from "../config/FirebaseConfig";

const firestore = getFirestore(firebaseApp);

export const boardsRef = collection(firestore, "boards");