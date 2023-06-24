import { StyleSheet } from 'react-native'; 


const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20
    },
    darkContainer: {
        backgroundColor: "#282828"
    },
    lightContainer: {
        backgroundColor: "#F6F6F6"
    },
    lightPostContainer: {
        backgroundColor: '#FFFFFF',
        borderStyle: "solid",
        borderColor: "#DDDDDD",
        borderWidth: 1.5,
        borderRadius: 15,
        marginBottom: 15,
        // width: '100%',
        // height: 300,
        // maxHeight: 350,
        minHeight: 50,
    },
    darkPostContainer: {
        backgroundColor: '#222222',
        borderStyle: "solid",
        borderColor: "#444444",
        borderWidth: 1.5,
        borderRadius: 15,
        marginBottom: 15,
        // width: '100%',
        // height: 300,
        // maxHeight: 350,
        minHeight: 50,
    },
    lightMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#000000',
        marginVertical: 10,
    },
    darkMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#FFFFFF',
        marginVertical: 10,
    },
    lightPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#0147BD', 
        marginVertical: 7, 
        marginHorizontal: 5
    },
    darkPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#FFFFFF', 
        marginVertical: 7, 
        marginHorizontal: 5
    },
});

export default GlobalStyles;