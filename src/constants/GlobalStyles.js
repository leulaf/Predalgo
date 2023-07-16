import { StyleSheet } from 'react-native'; 


const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20
    },
    darkContainer: {
        backgroundColor: "#1F1F1F"
    },
    lightContainer: {
        backgroundColor: "#FAFAFA"
    },
    lightPostContainer: {
        backgroundColor: '#FFFFFF',
        borderStyle: "solid",
        borderColor: "#EEEEEE",
        borderWidth: 1.5,
        borderRadius: 15,
        marginBottom: 8,
        // width: '100%',
        // height: 300,
        // maxHeight: 350,
        minHeight: 50,
    },
    darkPostContainer: {
        backgroundColor: '#1A1A1A',
        borderStyle: "solid",
        borderColor: "#393939",
        borderWidth: 1.5,
        borderRadius: 8,
        marginBottom: 107,
        // width: '100%',
        // height: 300,
        // maxHeight: 350,
        minHeight: 50,
    },
    lightTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 13,
        borderColor: "#f0f0f0",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#1D1D1D",
        borderRadius: 13,
        borderColor: "#333333",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lightPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        textAlign: "left",
        marginHorizontal: 10,
        // marginRight: 65,
        marginVertical: 20,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: "left",
        marginHorizontal: 10,
        // marginRight: 65,
        marginVertical: 20,
    },
    lightMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#000000',
        marginVertical: 5,
        // alignSelf: 'center',
    },
    darkMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#FFFFFF',
        marginVertical: 5,
        // alignSelf: 'center',
    },
    lightPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#0147BD', 
        marginTop: 13, 
        marginBottom: 3,
        marginHorizontal: 5
    },
    darkPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#6AA2FF', 
        marginTop: 13, 
        marginBottom: 3,
        marginHorizontal: 5
    },
});

export default GlobalStyles;