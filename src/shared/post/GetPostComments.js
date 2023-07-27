import { firebase, db, storage } from '../../config/firebase';
import { collection, query, getDocs, orderBy, where, limit } from "firebase/firestore";


const fetchFirstTenPostCommentsByRecent = async (replyToPostId) => {
    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, 
                "comments",
                replyToPostId, 
                "comments"
            ),
            where("isMainComment", "==", true),
            orderBy("creationDate", "desc"),
            limit(10)
        );

        const snapshot = await getDocs(q);
        

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolvedPosts.unshift({id: "fir", index: resolvedPosts.length});
        resolvedPosts.unshift({id: "sec", index: resolvedPosts.length});
        
        resolve(resolvedPosts);
    });
}

const fetchFirstTenPostCommentsByPopular = async (replyToPostId) => {

    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, "comments", replyToPostId, "comments"), 
            where("isMainComment", "==", true), 
            orderBy("likesCount", "desc"), 
            limit(10)
        );

        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolvedPosts.unshift({id: "fir", index: resolvedPosts.length});
        resolvedPosts.unshift({id: "sec", index: resolvedPosts.length});

        resolve(resolvedPosts);
    });
}

export { fetchFirstTenPostCommentsByRecent, fetchFirstTenPostCommentsByPopular };