import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 50,
        marginLeft: 8,
        marginRight: 5,
        marginVertical: 0,
        marginBottom: -3 // fix for bottom margin, change it later
    },
    lightCommentContainer: {
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
        // marginTop: 3,
        borderLeftWidth: 1,
        borderLeftColor: '#DDDDDD',
        borderTopWidth: 1,
        borderTopColor: "#EBEBEB",
        borderBottomWidth: 0.5,
        borderBottomColor: "#DDDDDD",

        borderRadius: 10,
    },
    darkCommentContainer: {
        marginTop: 5,
        backgroundColor: '#141414',
        marginLeft: 10,
        // marginTop: 3,
        borderLeftWidth: 1,
        borderLeftColor: '#202020',
        borderTopWidth: 1,
        borderTopColor: "#222222",
        borderBottomWidth: 0.5,
        borderBottomColor: "#242424",
        borderRadius: 10,
    },
    lightUsername: {
        fontSize: 14.7,
        fontWeight: "600",
        color: '#5D5D5D',
        textAlign: "left",
    },
    darkUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: '#DADADA',
        textAlign: "left",
    },
    lightCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#222222',
        letterSpacing: 0.3,
        textAlign: 'auto',
        marginHorizontal: 8,
        // marginBottom: 6,
        marginTop: 8,
    },
    darkCommentText: {
        fontSize: 16,
        fontWeight: "400",
        color: '#F2F2F2',
        letterSpacing: 0.3,
        textAlign: "left",
        marginHorizontal: 8,
        // marginBottom: 6,
        marginTop: 8,
    },
    lightViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 20,
        marginRight: 7,
    },
    darkViewReplyLine: {
        backgroundColor: '#BBBBBB',
        height: 1.5,
        width: 20,
        marginRight: 7,
    },
    lightViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#444444',
        marginRight: 2,
    },
    darkViewText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#DDDDDD',
        marginRight: 2,
    },
    lightBottomText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#555555',
        marginRight: 20,
    },
    darkBottomText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#DDDDDD',
        marginRight: 20,
    },
    overlayText: {
        fontSize: 22,
        fontWeight: "500",
        color: '#000000',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});