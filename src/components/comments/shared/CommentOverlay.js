import React from 'react';

import styles from '../mainComment/Styles';

import { Overlay } from 'react-native-elements';

import {View, Text, TouchableOpacity, Alert} from 'react-native';

import {ref, deleteObject} from 'firebase/storage';
import {doc, deleteDoc, getDoc, updateDoc, increment} from 'firebase/firestore';
import {db, firebase} from '../../../config/firebase';


import DeleteIcon from '../../../../assets/trash_delete.svg';
import ReportIcon from '../../../../assets/danger.svg';

// An overlay popup that appears when you click on the three dots.
// if the post is from the current users, user can delete it.
// if the post is not from the current users, user can report it.
export default CommentOverlay = ({commentId, profile, replyToCommentId, replyToPostId, toggleOverlay, setFinished, theme}) => {

    const deleteComment = React.useCallback(() => async() => {
        const commentRef = doc(db, 'comments', replyToPostId, "comments", commentId);
        const commentSnapshot = await getDoc(commentRef);
        data = commentSnapshot.data();

        if (commentSnapshot.exists) {
            await deleteDoc(commentRef).then(async () => {


                // update comment count for Comment or Post
                if(replyToCommentId){
                    const commentRef = doc(db, 'comments', replyToPostId, "comments", replyToCommentId);

                    await updateDoc(commentRef, {
                        commentsCount: increment(-1)
                    })
                }else{
                    const postRef = doc(db, 'allPosts', replyToPostId);

                    await updateDoc(postRef, {
                        commentsCount: increment(-1)
                    })
                }


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

                    Alert.alert('Comment deleted!');
                    setFinished("deleted");
                }else{
                    Alert.alert('Comment deleted!');
                    setFinished("deleted");
                }

            }).catch((error) => {
                // console.log(error);
            })
        }
    }, []);


    return (
        <Overlay isVisible={true} onBackdropPress={toggleOverlay()} overlayStyle={{borderRadius: 100}}>
            
            {profile === firebase.auth().currentUser.uid ?
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{flexDirection: 'row'}}
                    onPress={deleteComment()}
                >
                    <DeleteIcon width={40} height={40} style={{marginLeft: 2}}/>
                    <Text style={styles.overlayText}>Delete Post</Text>
                </TouchableOpacity>
            :
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flexDirection: 'row'}}
                    onPress={toggleOverlay()}
                >
                    <ReportIcon width={35} height={35} style={{marginLeft: 2}}/>
                    <Text style={styles.overlayText}>Report Post</Text>
                </TouchableOpacity>
            }
        </Overlay>
    )
};