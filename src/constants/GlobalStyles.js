import { StyleSheet } from 'react-native'; 


const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20
    },
    darkContainer: {
        backgroundColor: "#0D0D0D"
    },
    lightContainer: {
        backgroundColor: "#FAFAFA"
    },
    lightPostContainer: {
        backgroundColor: '#FFFFFF',
        borderStyle: "solid",
        borderColor: "#F2F2F2",
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 10,
        // width: '100%',
        // height: 300,
        // maxHeight: 350,
        minHeight: 50,
    },
    darkPostContainer: {
        backgroundColor: '#151515',
        borderStyle: "solid",
        borderColor: "#202020",
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 10,
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
        borderColor: "#F4F4F4",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#151515",
        borderRadius: 13,
        borderColor: "#1B1B1B",
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
        color: '#6BA3FF', 
        marginTop: 13, 
        marginBottom: 3,
        marginHorizontal: 5
    },
});

export default GlobalStyles;