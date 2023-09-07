import {  db } from '../../config/firebase';
import {  doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const auth = getAuth();

        
const addMoodWithArrayToPost = async (postRef, mood, moodArray) => {
    return new Promise(async (resolve, reject) => {

        if(mood == "laughing"){
            await updateDoc(postRef, {
                laughing: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "loving"){
            await updateDoc(postRef, {
                loving: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "shocked"){
            await updateDoc(postRef, {
                shocked: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "lightBulb"){
            await updateDoc(postRef, {
                lightBulb: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "confetti"){
            await updateDoc(postRef, {
                confetti: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "wink"){
            await updateDoc(postRef, {
                wink: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "skeptical"){
            await updateDoc(postRef, {
                skeptical: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "eyeRoll"){
            await updateDoc(postRef, {
                eyeRoll: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "crying"){
            await updateDoc(postRef, {
                crying: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "sad"){
            await updateDoc(postRef, {
                sad: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "angry"){
            await updateDoc(postRef, {
                angry: increment(1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }
    });
}

const addMoodToPost = async (postRef, mood) => {
    if(mood == "laughing"){
        await updateDoc(postRef, {
            laughing: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "loving"){
        await updateDoc(postRef, {
            loving: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "shocked"){
        await updateDoc(postRef, {
            shocked: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "lightBulb"){
        await updateDoc(postRef, {
            lightBulb: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "confetti"){
        await updateDoc(postRef, {
            confetti: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "wink"){
        await updateDoc(postRef, {
            wink: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "skeptical"){
        await updateDoc(postRef, {
            skeptical: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "eyeRoll"){
        await updateDoc(postRef, {
            eyeRoll: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "crying"){
        await updateDoc(postRef, {
            crying: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "sad"){
        await updateDoc(postRef, {
            sad: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "angry"){
        await updateDoc(postRef, {
            angry: increment(1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }
}


const removeMoodWithArrayToPost = async (postRef, mood, moodArray) => {
    return new Promise(async (resolve, reject) => {

        if(mood == "laughing"){
            await updateDoc(postRef, {
                laughing: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "loving"){
            await updateDoc(postRef, {
                loving: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "shocked"){
            await updateDoc(postRef, {
                shocked: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "lightBulb"){
            await updateDoc(postRef, {
                lightBulb: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "confetti"){
            await updateDoc(postRef, {
                confetti: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "wink"){
            await updateDoc(postRef, {
                wink: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "skeptical"){
            await updateDoc(postRef, {
                skeptical: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "eyeRoll"){
            await updateDoc(postRef, {
                eyeRoll: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "crying"){
            await updateDoc(postRef, {
                crying: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "sad"){
            await updateDoc(postRef, {
                sad: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }else if(mood == "angry"){
            await updateDoc(postRef, {
                angry: increment(-1),
                moodArray: moodArray
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                // console.log(error);
                resolve(false);
            });
        }
    });
}

const removeMoodToPost = async (postRef, mood) => {
    if(mood == "laughing"){
        await updateDoc(postRef, {
            laughing: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "loving"){
        await updateDoc(postRef, {
            loving: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "shocked"){
        await updateDoc(postRef, {
            shocked: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "lightBulb"){
        await updateDoc(postRef, {
            lightBulb: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "confetti"){
        await updateDoc(postRef, {
            confetti: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "wink"){
        await updateDoc(postRef, {
            wink: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "skeptical"){
        await updateDoc(postRef, {
            skeptical: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "eyeRoll"){
        await updateDoc(postRef, {
            eyeRoll: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "crying"){
        await updateDoc(postRef, {
            crying: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "sad"){
        await updateDoc(postRef, {
            sad: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }else if(mood == "angry"){
        await updateDoc(postRef, {
            angry: increment(-1),
        })
        .then(() => {
            resolve(true);
        })
        .catch((error) => {
            // console.log(error);
            resolve(false);
        });
    }
}


const onSelectMood = async (postId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {
        const likedRef = doc(db, "likedPosts", auth.currentUser.uid, "posts", postId);

        await updateDoc(likedRef, {
            emoji: mood,
        });
        // .then(() => {
        //     resolve(true);
        // })
        // .catch((error) => {
        //     // console.log(error);
        //     resolve(false);
        // });

        // update like count for Comment
        const postRef = doc(db, 'allPosts', postId);
        const post = await getDoc(postRef);

        let moodInOrder = [
            {
                mood: "laughing", count: post?.data()?.laughing 
                ? mood == "laughing" ? post?.data()?.laughing + 1 : post?.data()?.laughing
                : mood == "laughing" ? 1 : 0
            },
            {
                mood: "loving", count: post?.data()?.loving ? 
                mood == "loving" ? post?.data()?.loving + 1 : post?.data()?.loving 
                : mood == "loving" ? 1 : 0
            },
            {
                mood: "shocked", count: post?.data()?.shocked ? 
                mood == "shocked" ? post?.data()?.shocked + 1 : post?.data()?.shocked 
                : mood == "shocked" ? 1 : 0
            },
            {
                mood: "lightBulb", count: post?.data()?.lightBulb ? 
                mood == "lightBulb" ? post?.data()?.lightBulb + 1 : post?.data()?.lightBulb : 
                mood == "lightBulb" ? 1 : 0
            },
            {
                mood: "confetti", count: post?.data()?.confetti ? 
                mood == "confetti" ? post?.data()?.confetti + 1 : post?.data()?.confetti : 
                mood == "confetti" ? 1 : 0
            },
            {
                mood: "wink", count: post?.data()?.wink ? 
                mood == "wink" ? post?.data()?.wink + 1 : post?.data()?.wink : 
                mood == "wink" ? 1 : 0
            },
            {
                mood: "skeptical", count: post?.data()?.skeptical ? 
                mood == "skeptical" ? post?.data()?.skeptical + 1 : post?.data()?.skeptical : 
                mood == "skeptical" ? 1 : 0
            },
            {
                mood: "eyeRoll", count: post?.data()?.eyeRoll ? 
                mood == "eyeRoll" ? post?.data()?.eyeRoll + 1 : post?.data()?.eyeRoll : 
                mood == "eyeRoll" ? 1 : 0
            },
            {
                mood: "crying", count: post?.data()?.crying ? 
                mood == "crying" ? post?.data()?.crying + 1 : post?.data()?.crying : 
                mood == "crying" ? 1 : 0
            },
            {
                mood: "sad", count: post?.data()?.sad ? 
                mood == "sad" ? post?.data()?.sad + 1 : post?.data()?.sad : 
                mood == "sad" ? 1 : 0
            },
            {
                mood: "angry", count: post?.data()?.angry ? 
                mood == "angry" ? post?.data()?.angry + 1 : post?.data()?.angry : 
                mood == "angry" ? 1 : 0
            },
        ];
        

        moodInOrder.sort((a, b) => {
            return b.count - a.count;
        });

        let newMoodArrayInOrder = [];

        for(let i = 0; i < moodInOrder.length; i++){
            newMoodArrayInOrder.push(moodInOrder[i].mood);
        }

        if((post?.data()?.moodArray && (post?.data()?.moodArray !== newMoodArrayInOrder))){
            await addMoodToPost(postRef, mood)
            .catch((error) => {
                // console.log(error);
                resolve(false);
            })
            .then(() => {
                resolve(true);
            });
        }else{
            await addMoodWithArrayToPost(postRef, mood, newMoodArrayInOrder)
            .catch((error) => {
                // console.log(error);
                resolve(false);
            })
            .then(() => {
                resolve(true);
            });
        }

    }
)};


const onUnselectMood = async (postId, mood) => {
    // console.log(replyToPostId, "  ", commentId, "  ", mood)
    return new Promise(async (resolve, reject) => {

        // update like count for Comment
        const postRef = doc(db, 'allPosts', postId);
        const post = await getDoc(postRef);

        let moodInOrder = [
            {
                mood: "laughing", count: post?.data()?.laughing 
                ? mood == "laughing" ? post?.data()?.laughing - 1 : post?.data()?.laughing :
                0
            },
            {
                mood: "loving", count: post?.data()?.loving ? 
                mood == "loving" ? post?.data()?.loving - 1 : post?.data()?.loving : 
                0
            },
            {
                mood: "shocked", count: post?.data()?.shocked ? 
                mood == "shocked" ? post?.data()?.shocked - 1 : post?.data()?.shocked : 
                0
            },
            {
                mood: "lightBulb", count: post?.data()?.lightBulb ? 
                mood == "lightBulb" ? post?.data()?.lightBulb - 1 : post?.data()?.lightBulb : 
                0
            },
            {
                mood: "confetti", count: post?.data()?.confetti ? 
                mood == "confetti" ? post?.data()?.confetti - 1 : post?.data()?.confetti : 
                0
            },
            {
                mood: "wink", count: post?.data()?.wink ? 
                mood == "wink" ? post?.data()?.wink - 1 : post?.data()?.wink : 
                0
            },
            {
                mood: "skeptical", count: post?.data()?.skeptical ? 
                mood == "skeptical" ? post?.data()?.skeptical - 1 : post?.data()?.skeptical : 
                0
            },
            {
                mood: "eyeRoll", count: post?.data()?.eyeRoll ? 
                mood == "eyeRoll" ? post?.data()?.eyeRoll - 1 : post?.data()?.eyeRoll : 
                0
            },
            {
                mood: "crying", count: post?.data()?.crying ? 
                mood == "crying" ? post?.data()?.crying - 1 : post?.data()?.crying : 
                0
            },
            {
                mood: "sad", count: post?.data()?.sad ? 
                mood == "sad" ? post?.data()?.sad - 1 : post?.data()?.sad : 
                0
            },
            {
                mood: "angry", count: post?.data()?.angry ? 
                mood == "angry" ? post?.data()?.angry - 1 : post?.data()?.angry : 
                0
            },
        ];
        

        moodInOrder.sort((a, b) => {
            return b.count - a.count;
        });

        let newMoodArrayInOrder = [];

        for(let i = 0; i < moodInOrder.length; i++){
            newMoodArrayInOrder.push(moodInOrder[i].mood);
        }

        if(post?.data()?.moodArray && (post?.data()?.moodArray !== newMoodArrayInOrder)){
            await removeMoodToPost(postRef, mood)
            .catch((error) => {
                // console.log(error);
                resolve(false);
            })
            .then(() => {
                resolve(true);
            });
        }else{
            await removeMoodWithArrayToPost(postRef, mood, newMoodArrayInOrder)
            .catch((error) => {
                // console.log(error);
                resolve(false);
            })
            .then(() => {
                resolve(true);
            });
        }

    }
)};

export {onSelectMood, onUnselectMood};







// if(mood == "good"){
//     await updateDoc(postRef, {
//         mood: increment(1),
//         moodCount: increment(1)
//     })
//     .then(() => {
//         resolve(true);
//     })
//     .catch((error) => {
//         console.log(error);
//         resolve(false);
//     });
// }else if(mood == "bad"){
//     await updateDoc(postRef, {
//         mood: increment(-1),
//         moodCount: increment(1)
//     })
//     .then(() => {
//         resolve(true);
//     })
//     .catch((error) => {
//         console.log(error);
//         resolve(false);
//     });
// }