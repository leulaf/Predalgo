import React, {} from 'react';
import { Alert, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import {
    Bubble,
    GiftedChat,
    IMessage,
    Send,
    SendProps,
    SystemMessage,
    Time,
} from 'react-native-gifted-chat';
import { Image } from 'expo-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import  {serverTimestamp, getDatabase, push, get, ref, onValue, onChildAdded, off, update} from 'firebase/database';
import {ThemeContext} from '../../context-store/context';
import ChatTopBar from '../ScreenTop/ChatTopBar';

import {getAuth} from 'firebase/auth';


const auth = getAuth();

export default function ChatScreen({ navigation, route }){
    const {theme, setTheme} = React.useContext(ThemeContext);
    const [ messages, updateMessages ] = React.useState([]);
    const [ user, updateUser ] = React.useState({
        _id: auth?.currentUser?.uid,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
    })
    const [chatroom, setChatroom] = React.useState(
        route.params.profile >= auth?.currentUser?.uid ?
        route.params.profile + '-' + auth?.currentUser?.uid :
        auth?.currentUser?.uid + '-' + route.params.profile
    )
    // console.log(user)
    const db = getDatabase();

    useEffect(() => {
        // let newUserObj = {
        //     _id: auth?.currentUser?.uid,
        //     name: auth?.currentUser?.displayName,
        //     avatar: auth?.currentUser?.photoURL,
        // } 
        // updateUser(newUserObj)


        onChildAdded(ref(db, chatroom),snapshot =>
            {
                updateMessages(previous => GiftedChat.append(previous, snapshot.val()))
                // console.log("1" + user._id)
                // console.log(snapshot.val())
            }
        )

        // Stop listening for updates when no longer required
        return () => off(ref(db, chatroom));
    },[]);


    const send = React.useCallback((messages) => {
        // console.log(messages[0])
        messages.forEach(item =>{
            const message = {
                _id: item._id,
                text: item.text,
                timestamp: serverTimestamp(),
                user: item.user
            }
            push(ref(db, chatroom), message)
        })
    })

    // const getMessages = React.useCallback(async () => {
    //     const snapshot = await get(
    //         ref(db, chatroom),
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

    // const renderAvatar = (props) => {
    //     var sameUserInPrevMessage = false;

    //     if (props.previousMessage.user !== undefined && props.previousMessage.user) {
    //         props.previousMessage.user._id === props.currentMessage.user._id ?
    //             sameUserInPrevMessage = true
    //         :
    //             sameUserInPrevMessage = false
    //     }
    //     if (sameUserInPrevMessage 
    //         // || props.currentMessage.user._id === auth?.currentUser?.uid
    //         ) {
    //         return null;
    //     }

    //     return (
    //         <Image
    //             source={{uri: props.currentMessage.user.avatar}}
    //             style={{width: 30, height: 30, borderRadius: 15}}
    //         />
    //     )
    // }
    
    const renderBubble = (props) => {
        const createdAt = new Date(props.currentMessage.timestamp).toLocaleString();
        // console.log(createdAt)

        var sameUserInPrevMessage = false;

        if (props.previousMessage.user !== undefined && props.previousMessage.user) {
            props.previousMessage.user._id === props.currentMessage.user._id ?
                sameUserInPrevMessage = true
            :
                sameUserInPrevMessage = false
        }

        var messageBelongsToCurrentUser = auth?.currentUser?.uid == props.currentMessage.user._id;

        return (
                    <View
                    //   style={messageBelongsToCurrentUser ? styles.messageTimeAndNameContainerRight : styles.messageTimeAndNameContainerLeft}
                    >
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
                                left: {
                                    color: '#000',
                                },
                                right: {
                                    color: '#FFF',
                                },
                            }}
                        />

                        {
                            // !messageBelongsToCurrentUser &&
                            // <Text size={10} style={{marginHorizontal: 10, marginBottom: 5}} bold color={props.position === "left" ? 'gray' : 'white'}>
                            //     {`${createdAt}`}
                            // </Text>
                        }
                    </View>
        );
    };
    
    const scrollToBottomComponent = () => {
        return(
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    }

    const onPressAvatar = React.useCallback(() => {
        Alert.alert('On avatar press')
    }, [])

    
    const renderSystemMessage = React.useCallback(props => {
        return (
          <SystemMessage
            {...props}
            containerStyle={{
              marginBottom: 15,
            }}
            textStyle={{
              fontSize: 14,
            }}
          />
        )
    }, [])
    

    return(
        <View style={{flex:1, backgroundColor: theme == 'light' ? '#FFF' : '#151515',}}>
            <KeyboardAvoidingView 
                style={{
                    flex:1,
                    // backgroundColor: theme == 'light' ? '#000' : '#151515',
                    marginBottom: Platform.OS === 'ios' && 20
                }}
                keyboardVerticalOffset={10} enabled>

                <ChatTopBar username={route.params.username} profilePic={route.params.avatar} theme={theme} navigation={navigation} />

                <GiftedChat
                    messages={messages}
                    placeholder="Type here..."
                    // renderUsernameOnMessage={true}
                    showAvatarForEveryMessage={false}
                    alwaysShowSend={true}
                    showUserAvatar={false}
                    onSend={send}

                    textInputStyle={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        height: 200
                    }}
                    user={user}
                    onPressAvatar={onPressAvatar}
                    timeTextStyle={{
                        left: { color: 'red' },
                        right: { color: 'yellow' },
                    }}
                    // minInputToolbarHeight={50}
                    // bottomOffset={50}
                    multiline={false}
                    renderSystemMessage={renderSystemMessage}
                    messagesContainerStyle={{
                        backgroundColor: theme == 'light' ? '#FFF' : '#151515',
                    }}

                    renderBubble={renderBubble}
                    // renderAvatar={renderAvatar}
                    renderAvatar={null}
                    // renderAvatarOnTop={true}
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            </KeyboardAvoidingView>
            
            {/* {
                Platform.OS === 'ios' &&
                <View style={{height: Platform.OS === 'ios' && 20, width: 1000, backgroundColor: 'red'}}/>
            } */}
            
        </View>
        
    );
}
