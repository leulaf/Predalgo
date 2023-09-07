const onSelectMood = async (postId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {

        // update like count for Comment
        const postRef = doc(db, 'allPosts', postId);

        if(mood == "good"){
            await updateDoc(postRef, {
                mood: increment(1),
                moodCount: increment(1)
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
                resolve(false);
            });
        }else if(mood == "bad"){
            await updateDoc(postRef, {
                mood: increment(-1),
                moodCount: increment(1)
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
                resolve(false);
            });
        }
        
    
    }
)};


const onUnselectMood = async (postId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {

        // update like count for Comment
        const postRef = doc(db, 'allPosts', postId);

        if(mood == "good"){
            await updateDoc(postRef, {
                mood: increment(-1),
                moodCount: increment(-1)
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
                resolve(false);
            });
        }else if(mood == "bad"){
            await updateDoc(postRef, {
                mood: increment(1),
                moodCount: increment(-1)
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                console.log(error);
                resolve(false);
            });
        }
    }
)};

export {onSelectMood, onUnselectMood};