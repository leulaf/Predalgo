import { createContext, useState } from 'react';
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

export {
    ThemeContext,
    ThemeProvider,
    ShowSearchContext,
    ShowSearchProvider
}