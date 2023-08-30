import { createContext, useState } from 'react';
import Firebase from '../src/config/firebase';
// Initiate context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    // Manage theme state
    const [theme, setTheme] = useState('light');
    return (
        <ThemeContext.Provider
            value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

const ContentContext = createContext();

const ContentProvider = ({ children }) => {
    // Manage theme state
    const [content, setContent] = useState(
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

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [imageReply, setImageReply] = useState(null);
    const [imagePost, setImagePost] = useState(null);
    const [memeTemplates, setMemeTeplates] = useState([{id : "fir"}, {id: "sec"}]);

    return (
        <AuthenticatedUserContext.Provider 
        value={{ 
            user,
            imageReply,
            setImageReply,
            imagePost,
            setImagePost,
            memeTemplates,
            setMemeTeplates,
            setUser,
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