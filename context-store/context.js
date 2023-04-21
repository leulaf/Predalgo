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

const ShowSearchContext = createContext();

const ShowSearchProvider = ({ children }) => {
    // Manage theme state
    const [showSearch, setShowSearch] = useState(true);

    // const handleChange = () => {
    //     setHide(hide);
    // }

    // useEffect(() => {
    //     console.log('theme changed');
    // }, [hide]);

    return (
        <ShowSearchContext.Provider
            value={{ showSearch, setShowSearch }}>
            {children}
        </ShowSearchContext.Provider>
    )
}

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthenticatedUserContext.Provider 
        value={{ 
            user, 
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
    ShowSearchContext,
    ShowSearchProvider,
    AuthenticatedUserContext,
    AuthenticatedUserProvider
}