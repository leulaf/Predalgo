import { firebase, db, storage } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";

export default async function fetchUser(userId) {
    return new Promise(async (resolve, reject) => {  
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            resolve(userSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            reject("No such document!");
        }
    })
}