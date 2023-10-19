import React, {  } from 'react';
import Firebase from '../src/config/firebase';

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
    const [user, setUser] = React.useState(null);
    

    const [imageReply, setImageReply] = React.useState(null);
    const [imagePost, setImagePost] = React.useState(null);
    const [options, setOptions] = React.useState(null);
    const [memeTemplates, setMemeTemplates] = React.useState([{id : "fir"}, {id: "sec"}]);
    
    
    
    
    
    
    // console.log(user);
    React.useEffect(() => {
        getUser(auth.currentUser.uid).then(async(user) => {
            setUser({
              ...user,
            })
            // console.log(user);
          }).catch((e) => {
            // *** NEED TO MAKE SURE THAT USER DOCUMENT IS CACHED, MAYBE RETRY ONCE OR TWICE ***
        });
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