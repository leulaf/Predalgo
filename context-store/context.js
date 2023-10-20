import React, {  } from 'react';
import Firebase, {db} from '../src/config/firebase';

import { doc, onSnapshot } from "firebase/firestore";

import getUser from '../src/shared/functions/GetUser';
import urlToLocal from '../src/shared/functions/UrlToLocal';
import { getAuth } from 'firebase/auth';
const auth = getAuth();



// Initiate context
const ThemeContext = React.createContext();


const ThemeProvider = ({ children }) => {
    // Manage theme state
    const [theme, setTheme] = React.useState('light');
    return (
        <ThemeContext.Provider
            value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}



const ContentContext = React.createContext();

const ContentProvider = ({ children }) => {
    // Manage theme state
    const [content, setContent] = React.useState(
        // {
        //     postId:"",
        //     commentId:"",
        //     replyToPostId:"",
        //     replyToCommentId:"",
        //     replyToProfile:"",
        //     replyToUsername:"",
        //     imageUrl:"",
        //     memeName:"",
        //     template:"",
        //     templateState:"",
        //     imageHeight:"",
        //     imageWidth:"",
        //     text:"",
        //     likesCount:"",
        //     commentsCount:"",
        //     onReply:"",
        //     profile:"",
        //     username:"",
        //     profilePic:"",
        // }
        []
        
    );
    return (
        <ContentContext.Provider
            value={{ content, setContent }}>
            {children}
        </ContentContext.Provider>
    )
}



const AuthenticatedUserContext = React.createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [imageReply, setImageReply] = React.useState(null);
    const [imagePost, setImagePost] = React.useState(null);
    const [options, setOptions] = React.useState(null);
    const [memeTemplates, setMemeTemplates] = React.useState([{id : "fir"}, {id: "sec"}]);
    
    
    const [user, setUser] = React.useState(null);

    const [savedPosts, setSavedPosts] = React.useState([]);
    const [savedComments, setSavedComments] = React.useState([]);

    const [following, setFollowing] = React.useState([]);
    const [followers, setFollowers] = React.useState([]);

    const [flaggedPosts, setFlaggedPosts] = React.useState([]);
    const [flaggedComments, setFlaggedComments] = React.useState([]);
    
    const [flaggedImageTemplates, setFlaggedImageTemplates] = React.useState([]);
    const [flaggedGifTemplates, setFlaggedGifTemplates] = React.useState([]);

    const [favoriteImageTemplates, setFavoriteImageTemplates] = React.useState([]);
    const [favoriteGifTemplates, setFavoriteGifTemplates] = React.useState([]);

    const [repostedPosts, setRepostedPosts] = React.useState([]);

    const [blockedUsers, setBlockedUsers] = React.useState([]);
    const [blockedByUsers, setBlockedByUsers] = React.useState([]);
    // console.log(savedPosts);


    /*
        ***

        check if listerner data is cached

        NEED to create the documents first on signUp

        ***
    */

    React.useEffect(() => {
        // getUser(auth.currentUser.uid).then(async(user) => {
        //     setUser({
        //       ...user,
        //     })
        //     // console.log(user);
        //   }).catch((e) => {
        //     // *** NEED TO MAKE SURE THAT USER DOCUMENT IS CACHED, MAYBE RETRY ONCE OR TWICE ***
        // });

        const userSnap = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
            // console.log("userSnap data: ", doc.data());
            setUser(doc.data());
        });

        const savedPostsSnap = onSnapshot(doc(db, "savedPosts", auth.currentUser.uid), (doc) => {
            // console.log("savedPostsSnap data: ", doc.data());
            setSavedPosts(doc?.data()?.savedPosts);
        });

        const savedCommentsSnap = onSnapshot(doc(db, "savedComments", auth.currentUser.uid), (doc) => {
            // console.log("savedCommentsSnap data: ", doc.data());
            setSavedComments(doc?.data()?.savedComments);
        });

        // const followingSnap = onSnapshot(doc(db, "following", auth.currentUser.uid), (doc) => {
        //     // console.log("followingSnap data: ", doc.data());
        //     setFollowing(doc?.data()?.following);
        // });

        const followersSnap = onSnapshot(doc(db, "followers", auth.currentUser.uid), (doc) => {
            // console.log("followersSnap data: ", doc.data());
            setFollowers(doc?.data()?.followers);
        });

        const flaggedPostsSnap = onSnapshot(doc(db, "flaggedPosts", auth.currentUser.uid), (doc) => {
            // console.log("flaggedPostsSnap data: ", doc.data());
            setFlaggedPosts(doc?.data()?.flaggedPosts);
        });

        const flaggedCommentsSnap = onSnapshot(doc(db, "flaggedComments", auth.currentUser.uid), (doc) => {
            // console.log("flaggedCommentsSnap data: ", doc.data());
            setFlaggedComments(doc?.data()?.flaggedComments);
        });

        // const flaggedImageTemplatesSnap = onSnapshot(doc(db, "flaggedImageTemplates", auth.currentUser.uid), (doc) => {
        //     // console.log("flaggedImageTemplatesSnap data: ", doc.data());
        //     setFlaggedImageTemplates(doc?.data()?.flaggedImageTemplates);
        // });

        // const flaggedGifTemplatesSnap = onSnapshot(doc(db, "flaggedGifTemplates", auth.currentUser.uid), (doc) => {
        //     // console.log("flaggedGifTemplatesSnap data: ", doc.data());
        //     setFlaggedGifTemplates(doc?.data()?.flaggedGifTemplates);
        // });

        // const favoriteImageTemplatesSnap = onSnapshot(doc(db, "favoriteImageTemplates", auth.currentUser.uid), (doc) => {
        //     // console.log("favoriteImageTemplatesSnap data: ", doc.data());
        //     setFavoriteImageTemplates(doc?.data()?.favoriteImageTemplates);
        // });

        // const favoriteGifTemplatesSnap = onSnapshot(doc(db, "favoriteGifTemplates", auth.currentUser.uid), (doc) => {
        //     // console.log("favoriteGifTemplatesSnap data: ", doc.data());
        //     setFavoriteGifTemplates(doc?.data()?.favoriteGifTemplates);
        // });

        const repostedPostsSnap = onSnapshot(doc(db, "repostedPosts", auth.currentUser.uid), (doc) => {
            // console.log("repostedPostsSnap data: ", doc.data());
            setRepostedPosts(doc?.data()?.repostedPosts);
        });

        const blockedUsersSnap = onSnapshot(doc(db, "blockedUsers", auth.currentUser.uid), (doc) => {
            // console.log("blockedUsersSnap data: ", doc.data());
            setBlockedUsers(doc?.data()?.blockedUsers);
        });

        const blockedByUsersSnap = onSnapshot(doc(db, "blockedByUsers", auth.currentUser.uid), (doc) => {
            // console.log("blockedByUsersSnap data: ", doc.data());
            setBlockedByUsers(doc?.data()?.blockedByUsers);
        });

        // return () => {
        //     userSnap();
        //     savedPostsSnap();
        //     savedCommentsSnap();
        //     followingSnap();
        //     followersSnap();
        //     flaggedPostsSnap();
        //     flaggedCommentsSnap();
        //     flaggedImageTemplatesSnap();
        //     flaggedGifTemplatesSnap();
        //     favoriteImageTemplatesSnap();
        //     favoriteGifTemplatesSnap();
        //     repostedPostsSnap();
        //     blockedUsersSnap();
        //     blockedByUsersSnap();
        // }



    }, []);


    

    return (
        <AuthenticatedUserContext.Provider 
        value={{ 
            user,
            imageReply,
            setImageReply,
            imagePost,
            setImagePost,
            memeTemplates,
            setMemeTemplates,
            setUser,
            options,
            setOptions,
            savedPosts,
            setSavedPosts,
            savedComments,
            setSavedComments,
            following,
            setFollowing,
            followers,
            setFollowers,
            flaggedPosts,
            setFlaggedPosts,
            flaggedComments,
            setFlaggedComments,
            flaggedImageTemplates,
            setFlaggedImageTemplates,
            flaggedGifTemplates,
            setFlaggedGifTemplates,
            favoriteImageTemplates,
            setFavoriteImageTemplates,
            favoriteGifTemplates,
            setFavoriteGifTemplates,
            repostedPosts,
            setRepostedPosts,
            blockedUsers,
            setBlockedUsers,
            blockedByUsers,
            setBlockedByUsers,
            login: async (email, password) => {
                try {
                    if (email !== '' && password !== '') {
                        await Firebase.auth().signInWithEmailAndPassword(email, password);
                    }
                } catch (error) {
                    alert(error);
                }
            },
            register: async (email, confirmEmail, password, username) => {
                try {
                    if (email !== '' && password !== '' && username !== '' && email === confirmEmail) {
                        await Firebase.auth().createUserWithEmailAndPassword(email, password);
                    }
                    
                    let error = "";
                    if(email !== confirmEmail){
                        error += "Emails do not match \n";
                    }
        
                    if(username === ''){
                        error += "Username cannot be empty \n";
                    }
                    
                    if(email === '' || confirmEmail === ''){
                        error += "Email cannot be empty \n";
                    }
        
                    if(password === ''){
                        error += "Password cannot be empty \n";
                    }
        
                    
        
                    if(error.length !== 0){
                        alert(error);
                    }
                } catch (error) {
                    alert(error);
                }
            },
            logout: async () => {
                try {
                    await Firebase.auth().signOut();
                } catch (error) {
                    alert(error);
                }
            },
        
        }}>
        {children}
        </AuthenticatedUserContext.Provider>
    );
};

export {
    ThemeContext,
    ThemeProvider,
    AuthenticatedUserContext,
    AuthenticatedUserProvider,
    ContentContext,
    ContentProvider
}