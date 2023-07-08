import { firebase, db, storage } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";

const getRepost = async(repostPostId, profile) => {
    const repostRef = doc(db, 'allPosts', repostPostId);
    const repostSnapshot = await getDoc(repostRef);

    if(repostSnapshot.exists){
        const repostData = repostSnapshot.data();
        const id = repostSnapshot.id;
        const repostProfile = profile;

        // Return the reposted post data along with the original post data
        return { id, repostProfile, ...repostData }
    }else{
        return;
    }
}

const fetchUserPostsByRecent = async(userId) => {
    const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("creationDate", "desc"));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;

        if (data.repostPostId) {
        // Get the reposted post data
        const repostData = await getRepost(data.repostPostId, data.profile);
        if (repostData) {
            // Add the reposted post data to the postList array
            return { ...repostData };
        }
        }

        return { id, ...data };
    });

    // Wait for all promises to resolve before returning the resolved posts
    const resolvedPosts = await Promise.all(posts);
    return resolvedPosts;
}

const fetchUserPostsByPopular = async(userId) => {
    const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("likesCount", "desc"));

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;

        if (data.repostPostId) {
        // Get the reposted post data
        const repostData = await getRepost(data.repostPostId, data.profile);
        if (repostData) {
            // Add the reposted post data to the postList array
            return { ...repostData };
        }
        }

        return { id, ...data };
    });

    // Wait for all promises to resolve before returning the resolved posts
    const resolvedPosts = await Promise.all(posts);
    return resolvedPosts;
}

export { fetchUserPostsByRecent, fetchUserPostsByPopular };