import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, limit, updateDoc, increment } from "firebase/firestore";

const getRepost = async(repostedPostId, profile, username) => {
    const repostRef = doc(db, 'allPosts', repostedPostId);
    const repostSnapshot = await getDoc(repostRef);

    if(repostSnapshot.exists){
        const repostData = repostSnapshot.data();
        const id = repostedPostId;
        const reposterProfile = profile;
        const reposterUsername = username;
        const reposterProfilePic = repostData.profilePic;
        // Return the reposted post data along with the original post data
        return { id, reposterProfile, reposterUsername, reposterProfilePic, ...repostData }
    }
}

const fetchMostRecentPost = async(userId) => {
    const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("creationDate", "desc"), limit(1));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;

        if (data.repostedPostId) {
            // Get the reposted post data
            const repostData = await getRepost(data.repostedPostId, data.profile, data.username);
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

const fetchUserPostsByRecent = async(userId) => {
    const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("creationDate", "desc"));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;

        if (data.repostedPostId) {
        // Get the reposted post data
        const repostData = await getRepost(data.repostedPostId, data.profile, data.username);
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

export { fetchUserPostsByRecent, fetchUserPostsByPopular, fetchMostRecentPost };