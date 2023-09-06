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
        borderColor: "#EBEBEB",
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
        borderColor: "#262626",
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
        // borderColor: "#F6F6F6",
        // borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkTextContainer: {
        // minHeight: 353,
        // maxHeight: 353,
        width: "100%",
        backgroundColor: "#151515",
        borderRadius: 13,
        // borderColor: "#222222",
        // borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lightPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#222222',
        textAlign: "auto",
        marginHorizontal: 13,
        // marginRight: 65,
        marginTop: 3,
    },
    darkPostText: {
        fontSize: 18,
        fontWeight: "400",
        color: '#F4F4F4',
        textAlign: "auto",
        marginHorizontal: 13,
        // marginRight: 65,
        marginTop: 3,
    },
    lightMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#444444',
        marginVertical: 5,
        // alignSelf: 'center',
    },
    darkMemeName: {
        fontSize: 16,
        fontWeight: "400",
        color: '#EEEEEE',
        marginVertical: 5,
        
        // alignSelf: 'center',
    },
    lightPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#0029FF', 
        marginTop: 8, 
        marginBottom: 2,
        marginHorizontal: 9
    },
    darkPostBottomText: {
        fontSize: 20, 
        fontWeight: "400", 
        color: '#6BA3FF', 
        marginTop: 8, 
        marginBottom: 2,
        marginHorizontal: 9
    },
});

export default GlobalStyles;