import firebase from 'firebase/compat/app';
import { db, storage } from '../../src/config/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { SEARCH_STATE_CHANGE, USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE} from '../constants/index';

export function updateSeach(newSearch) {
    return ((dispatch) => {
        dispatch({ type: SEARCH_STATE_CHANGE, currentSearch: newSearch });
    })
}

export function fetchUser() {
    const docRef = doc(db, "users", firebase.auth().currentUser.uid);

    return ((dispatch) => {
         getDoc(docRef)
        .then((snapshot) => {
            if (snapshot.exists) {
                dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
            }
            else {
                console.log('does not exist')
            }
        })
    })
}
