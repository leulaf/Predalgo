import { firebase, db, storage } from '../../config/firebase';
import { collection, query, getDocs, orderBy, where, startAfter, limit } from "firebase/firestore";


const fetchFirstTenCommentsByRecent = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, 
                "comments",
                replyToPostId, 
                "comments"
            ),
            where("replyToCommentId", "==", commentId), 
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

const fetchFirstTenCommentsByPopular = async (replyToPostId, commentId) => {

    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, "comments", replyToPostId, "comments"), 
            where("replyToCommentId", "==", commentId), 
            orderBy("likesCount", "desc"), 
            limit(10)
        );

        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolvedPosts.unshift({id: "fir", index: resolvedPosts.length});
        resolvedPosts.unshift({id: "sec", index: resolvedPosts.length});

        resolve(resolvedPosts);
    });
}

const fetchNextTenPopularComments = async (replyToPostId, commentId, lastDocument) => {

    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, "comments", replyToPostId, "comments"), 
            where("replyToCommentId", "==", commentId), 
            orderBy("likesCount", "desc"), 
            startAfter(lastDocument),
            limit(10)
        );

        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolve(resolvedPosts);
    });
}

const fetchFirstFiveCommentsByRecent = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, 
                "comments",
                replyToPostId, 
                "comments"
            ),
            where("replyToCommentId", "==", commentId), 
            orderBy("creationDate", "desc"),
            limit(5)
        );

        const snapshot = await getDocs(q);
        

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolvedPosts.unshift({id: "fir", index: resolvedPosts.length});
        // resolvedPosts.unshift({id: "sec", index: resolvedPosts.length});
        
        resolve(resolvedPosts);
    });
}

const fetchFirstFiveCommentsByPopular = async (replyToPostId, commentId) => {

    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, "comments", replyToPostId, "comments"), 
            where("replyToCommentId", "==", commentId), 
            orderBy("likesCount", "desc"), 
            limit(5)
        );

        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolvedPosts.unshift({id: "fir", index: resolvedPosts.length});
        // resolvedPosts.unshift({id: "sec", index: resolvedPosts.length});

        resolve(resolvedPosts);
    });
}

const fetchNextFiveCommentsByPopular = async (replyToPostId, commentId, lastDocument) => {

    return new Promise(async (resolve, reject) => {
        const q = query(
            collection(db, "comments", replyToPostId, "comments"), 
            where("replyToCommentId", "==", commentId), 
            orderBy("likesCount", "desc"),
            startAfter(lastDocument),
            limit(5)
        );

        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        resolve(resolvedPosts);
    });
}

export { fetchFirstTenCommentsByRecent, fetchNextTenPopularComments, fetchFirstTenCommentsByPopular, fetchFirstFiveCommentsByRecent, fetchFirstFiveCommentsByPopular, fetchNextFiveCommentsByPopular };