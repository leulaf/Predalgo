import { firebase, db } from '../../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, increment } from "firebase/firestore";

const onNavToComment =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount) => () => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}

const onReply =  (navigation, commentId, replyToPostId, replyToCommentId, profile, profilePic, username, image, memeName, template, templateUploader, imageHeight, imageWidth, text, likesCount, commentsCount) => () => () => {
    navigation.push('Comment', {
        commentId: commentId,
        replyToPostId: replyToPostId,
        replyToCommentId: replyToCommentId,
        replyToProfile: profile,
        replyToUsername: username,
        imageUrl: image,
        memeName: memeName,
        template: template,
        templateUploader: templateUploader,
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        text: text,
        likesCount: likesCount,
        commentsCount: commentsCount,
        onReply: true,
        profile: profile,
        username: username,
        profilePic: profilePic,
    })
}



const navToMeme = (navigation, memeName, template, templateUploader, imageHeight, imageWidth) => () => {
    console.log(memeName)
    navigation.navigate('Meme', {
        uploader: templateUploader,
        memeName: memeName,
        template: template,
        height: imageHeight,
        width: imageWidth,
    })
}


//React.memo???????????????????????
const intToString = (commentCount) => {
    if (commentCount === 0) {

      return "0";
    } else if (commentCount > 999 && commentCount < 1000000) {

        return Math.floor(commentCount / 1000) + "k";
    } else if (commentCount > 999999) {

        return Math.floor(commentCount / 1000000) + "m";
    } else {

        return commentCount;
    }
};


// update like count and add post to liked collection
const onLike = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        const likedRef = doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId);

        // add post to likes collection
        await setDoc(likedRef, {});
        
        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        await updateDoc(commentRef, {
            likesCount: increment(1)
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    });
};


// update like count and add post to liked collection
const onDisike = async (replyToPostId, commentId) => {
    return new Promise(async (resolve, reject) => {
        // delete comment from likedComments collection
        await deleteDoc(doc(db, "likedComments", firebase.auth().currentUser.uid, "comments", commentId))

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        await updateDoc(commentRef, {
            likesCount: increment(-1)
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    });
};


const onSelectMood = async (replyToPostId, commentId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        if(mood == "good"){
            await updateDoc(commentRef, {
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
            await updateDoc(commentRef, {
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


const onUnselectMood = async (replyToPostId, commentId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {

        // update like count for Comment
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);

        if(mood == "good"){
            await updateDoc(commentRef, {
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
            await updateDoc(commentRef, {
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




export { onNavToComment, onReply, navToMeme, intToString, onDisike, onLike, onSelectMood, onUnselectMood };