import { db } from '../../../config/firebase';
import { getDocs, where, limit, collection, query } from "firebase/firestore";

export default NavigateToTag = async(tag, navigation) => {

    if(tag.charAt(0) == '#'){
        navigation.push('Tag', {tag: tag});
    }else if(tag.charAt(0) == '@'){
        const username = tag.substring(1);

        const q = query(collection(db, "users"), where("username", "==", username), limit(1));

        const userSnap = await getDocs(q);   

        if(userSnap.docs.length > 0){
            const user = userSnap.docs[0].data();
            user.id = userSnap.docs[0].id;

            navigation.push('Profile', { user: user });
        }

    }
}