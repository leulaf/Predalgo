// import React, {useContext} from 'react';
// import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
// import {ThemeContext} from '../../context-store/context';
// import GlobalStyles from '../constants/GlobalStyles';

// const window = Dimensions.get('window');
// // {
// //     primary: '#f57c00',
// //     gray: '#C5C5C7',
// //     mediumGray: '#F6F7FB',
// //     lightGray: '#FAFAFA'
// // }


// export default ChatScreen = ({navigation}) => {
//     const {theme,setTheme} = useContext(ThemeContext);

//     return (
//         <View style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>

//         </View>
//     );
// }

// const styles = StyleSheet.create({});












import * as React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import  {getDatabase, Database, push, get, ref, onValue, onChildAdded, off, update} from 'firebase/database';
import {firebase} from '../config/firebase';
// import {database} from 'firebase/database';


import {getAuth} from 'firebase/auth';


const auth = getAuth();

export default function GroupChat({ route }){
    const [ messages, updateMessages ] = useState([]);
    const [ user, updateUser ] = useState({
        email:'',
        _id:'',
        name:'',
        avatar:'',  
    })
    const db = getDatabase();

    useEffect(() => {
        let newUserObj = {
            _id: auth?.currentUser?.uid,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL,
        } 
        updateUser(newUserObj)


        onChildAdded(ref(db, 'chatrooms'),snapshot =>
            {
                updateMessages(previous => GiftedChat.append(previous, snapshot.val()))
                // console.log("1" + user._id)
                // console.log(snapshot.val())
            }
        )

        // Stop listening for updates when no longer required
        return () => off(ref(db, 'chatrooms'));
    },[]);


    const send = React.useCallback((messages) => {
        // console.log(messages[0])
        messages.forEach(item =>{
            const message = {
                _id: item._id,
                text: item.text,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                user: item.user
            }
            push(ref(db, 'chatrooms'), message)
        })
    })

    // const getMessages = React.useCallback(async () => {
    //     const snapshot = await get(
    //         ref(db, 'chatrooms'),
    //     );
    //     for (const key in snapshot.val()) {
    //         updateMessages(previous => GiftedChat.append(previous, {_id: key, ...snapshot.val()[key]}))
    //         // console.log(snapshot.val()[key])
    //     }
    //     // addMessages(snapshot)
    // })

    const renderSend = (props) => {
        return (
            <Send {...props}>
            <View>
                <MaterialCommunityIcons
                name="send-circle"
                style={{marginBottom: 5, marginRight: 5}}
                size={32}
                color="#2e64e5"
                />
            </View>
            </Send>
        );
    };
    
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#EEE',
                        borderBottomRightRadius: 15,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                    },
                    right: {
                        backgroundColor: '#2e64e5',
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 15,
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                    },
                }}
                textStyle={{
                    right: {
                    color: '#fff',
                    },
                }}
            />


        );
    };
    
    const scrollToBottomComponent = () => {
        return(
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    }

    return(
        <KeyboardAvoidingView style={{flex:1}} keyboardVerticalOffset={10} enabled>
        {/* <GiftedChat 
            messages={messages} 
            onSend={send} 
            user={user}
            renderUsernameOnMessage={true}
            placeholder="Type here..."
            showUserAvatar={true}
            alwaysShowSend={true}
            scrollToBottom={true}
        /> */}
        <GiftedChat
            messages={messages}
            placeholder="Type here..."
            // renderUsernameOnMessage={true}
            showAvatarForEveryMessage={false}
            alwaysShowSend={true}
            showUserAvatar={false}
            onSend={send}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            textInputStyle={{
                backgroundColor: '#fff',
                borderRadius: 20,
            }}
            user={user}

            renderBubble={renderBubble}
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
        />
        </KeyboardAvoidingView>
    );
}




































































































































// import React, {
//     useCallback,
//     useEffect,
//     useLayoutEffect,
//     useState
//   } from 'react';
//   import {
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     ImageBackground
//   } from 'react-native';
//   import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
//   import { MaterialIcons } from '@expo/vector-icons';
//   import {
//     collection,
//     addDoc,
//     orderBy,
//     query,
//     onSnapshot
//   } from 'firebase/firestore';
  
//   import { auth, db } from '../config/firebase';
//   import { signOut } from 'firebase/auth';

// //   export default {
// //     brand: '#38630E',
// //     bg: '#E1FDC6',
// //     input: '#E1FDC6'
// //   };
//   const ChatScreen = ({ navigation }) => {
//     const [messages, setMessages] = useState([]);
  
//     const onSignOut = () => {
//       signOut(auth).catch((error) => console.log('Error logging out: ', error));
//     };
  
//     useLayoutEffect(() => {
//       navigation.setOptions({
//         headerRight: () => (
//           <TouchableOpacity
//             style={{
//               marginRight: 10
//             }}
//             onPress={onSignOut}
//           >
//             <Text>Logout</Text>
//           </TouchableOpacity>
//         )
//       });
//     }, [navigation]);
  
//     useEffect(() => {
//       const collectionRef = collection(db, 'chats');
//       const q = query(collectionRef, orderBy('createdAt', 'desc'));
  
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         setMessages(
//           querySnapshot.docs.map((doc) => ({
//             _id: doc.data()._id,
//             createdAt: doc.data().createdAt.toDate(),
//             text: doc.data().text,
//             user: doc.data().user
//           }))
//         );
//       });
  
//       return () => unsubscribe();
//     }, []);
  
//     const onSend = useCallback((messages = []) => {
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, messages)
//       );
//       const { _id, createdAt, text, user } = messages[0];
//       addDoc(collection(db, 'chats'), {
//         _id,
//         createdAt,
//         text,
//         user
//       });
//     }, []);
  
//     const renderAvatar = (props) => {
//       console.log(props.currentMessage.user.avatar);
//       return (
//         <View style={styles.avatarContainer}>
//           <Image
//             style={styles.avatar}
//             source={{ uri: props.currentMessage.user.avatar }}
//           />
//         </View>
//       );
//     };
//     const renderSend = (props) => {
//       return (
//         <Send {...props} containerStyle={styles.sendContainer}>
//           <View style={styles.sendButton}>
//             <MaterialIcons name="send" size={24} color={'#38630E'} />
//           </View>
//         </Send>
//       );
//     };
//     return (
//       <ImageBackground
//         style={styles.container}
//         source={require('../../assets/splash.png')}
//       >
//         <GiftedChat
//           messages={messages}
//           showAvatarForEveryMessage={true}
//           onSend={(messages) => onSend(messages)}
//           user={{
//             _id: auth?.currentUser?.email,
//             avatar:
//               'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
//           }}
//           renderAvatar={renderAvatar}
//           renderSend={renderSend}
//           renderBubble={(props) => {
//             return (
//               <Bubble
//                 {...props}
//                 wrapperStyle={{
//                   left: {
//                     backgroundColor: '#FFFFFF',
//                     color: '#ffffff'
//                   },
//                   right: {
//                     backgroundColor: '#38630E',
//                     color: '#ffffff'
//                   }
//                 }}
//               />
//             );
//           }}
//         />
//       </ImageBackground>
//     );
//   };
  
//   export default ChatScreen;
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#E1FDC6'
//     },
//     avatarContainer: {
//       marginRight: 10
//     },
//     avatar: {
//       width: 36,
//       height: 36,
//       borderRadius: 18
//     },
//     sendContainer: {
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: 10
//     },
//     sendButton: {
//       backgroundColor: "#444",
//       borderRadius: 15,
//       padding: 10
//     }
//   });