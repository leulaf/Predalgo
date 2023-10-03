import { firebase, db, storage } from '../../config/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy, where, limit,} from "firebase/firestore";

export default async function fetchUserByName(name) {
    const q = query(collection(db, "users"), where("username", "==", name), limit(1));
    const snapshot = await getDocs(q);
    const user = snapshot.docs.map( async(doc) => {
        const data = doc.data();
        const id = doc.id;

        return {profile: id, ...data };
    });

    return user[0];
}