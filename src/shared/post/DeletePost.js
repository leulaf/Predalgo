import { firebase, storage, db, ref, deleteObject } from '../../config/firebase';
import { doc, getDoc, getDocs, where, collection, query, deleteDoc, updateDoc, increment } from "firebase/firestore";

export default deletePost = async(postId)  => {
    return new Promise(async (resolve, reject) => {
        const postRef = doc(db, 'allPosts', postId);
        const postSnapshot = await getDoc(postRef);
        data = postSnapshot.data();

        if (postSnapshot.exists) {
            await deleteDoc(postRef).then(async () => {

                // update posts count for current user
                const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

                await updateDoc(currentUserRef, {
                    posts: increment(-1)
                });


                if (data.imageUrl) {
                    const imageRef = ref(storage, data.imageUrl);

                    // Delete the file
                    await deleteObject(imageRef).then(() => {
                        // File deleted successfully
                        // console.log('Image deleted!');
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                        // console.log(error);
                    });
                } else if (data.memeName) {
                    const templateRef = doc(db, "imageTemplates", data.memeName);

                    await updateDoc(templateRef, {
                        useCount: increment(-1)
                    });
                }

            })
            .then(() => {
                // console.log("Post deleted!");
                resolve(true);
            })
            .catch((error) => {
                // console.log("Post not deleted!     ", error);
                reject(false);
            })
        }
    });
};