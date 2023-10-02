import { firebase, db, storage } from '../../config/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy, where, limit,} from "firebase/firestore";
import deletePost from './DeletePost';

const getRepost = async(repostedPostId, reposterProfile, reposterUsername, reposterProfilePic, repostComment,repostId) => {

    const repostRef = doc(db, 'allPosts', repostedPostId);
    const repostSnapshot = await getDoc(repostRef);

    if(repostSnapshot.exists()){
        const repostData = repostSnapshot.data();
        const id = repostedPostId;
        // console.log(reposterProfile, reposterUsername, reposterProfilePic)
        // Return the reposted post data along with the original post data
        return { id, repostId, reposterProfile, reposterUsername, reposterProfilePic, repostComment, ...repostData }
    }else{
       deletePost(repostId);
    }
}

const fetchMostRecentPost = async(userId) => {
    const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("creationDate", "desc"), limit(1));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map( async(doc) => {
        const data = doc.data();
        const id = doc.id;

        if (data.repostedPostId) {
            // Get the reposted post data
            const repostData = await getRepost(data.repostedPostId, data.profile, data.username, data.profilePic, data.repostComment, id);
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
        const repostData = await getRepost(data.repostedPostId, data.profile, data.username, data.profilePic, id);
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
        const repostData = await getRepost(data.repostedPostId, data.profile, data.username, data.profilePic, id);
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