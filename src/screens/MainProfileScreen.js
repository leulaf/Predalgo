import React, {useContext, useEffect, useState, Component, useReducer} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Image } from 'expo-image';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Overlay } from 'react-native-elements';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import {ThemeContext, AuthenticatedUserContext} from '../../context-store/context';
import {db, Firebase, firebase, storage} from '../config/firebase';
import { getAuth, updateProfile } from "firebase/auth";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {fetchUserPostsByRecent, fetchUserPostsByPopular, fetchMostRecentPost} from '../shared/post/GetUserPosts';

import MainProfileTop from '../ScreenTop/MainProfileTop';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../redux/actions/index';

import AddIconLight from '../../assets/add.svg';
import AddIconDark from '../../assets/add_dark.svg';

import AllUserPosts from '../components/posts/AllUserPosts';
import AllUserMediaPosts from '../components/posts/AllUserMediaPosts';

const navigateTo = (navigation, screen) => () => {
    navigation.navigate(screen, {profile: auth.currentUser.uid})
}

const auth = getAuth();

function MainProfileScreen ({navigation, route, ...props }) {
    const {theme, setTheme} = useContext(ThemeContext);
    // const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [username, setUsername] = useState(auth.currentUser.displayName);
    const [profilePic, setProfilePic] = useState(auth.currentUser.photoURL);
    const [bio, setBio] = useState('');
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [postList, setPostList] = useState([]);
    const [byNewPosts, setByNewPosts] = useState(true);
    const [byPopularPosts, setByPopularPosts] = useState(false);
    const [getLatestPost, setGetLatestPost] = useState(route?.params?.newPost || false);

    useEffect(() => {
        // Fetch user info
        props.fetchUser();

        // Fetch posts
        populateInitialPosts();

        const { currentUser } = props;
        
        if(currentUser != null){
            // setUser(currentUser);
            setFollowers(currentUser.followers);
            setFollowing(currentUser.following);
            setPostCount(currentUser.posts);
            setBio(currentUser.bio);
        }
    }, []);

    useEffect(() => {
        if(getLatestPost && postList.length > 0){
            getMostRecentPost()
        }
        setGetLatestPost(false);
    }, [getLatestPost]);


    const uploadImage = React.useCallback(async(imageUrl) => {
        // Convert image to blob format(array of bytes)
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        
        // const filename = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
        const childPath = `profilePics/${auth.currentUser.uid}`;
        
        
        const storageRef = ref(storage, childPath);
        
        
        const uploadTask =  uploadBytesResumable(storageRef, blob)
        .catch ((e) => {
            // console.log(e);
        })
        
        
        uploadTask.then((snapshot) => {
            // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            // console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            getDownloadURL(snapshot.ref).then(async (url) => {
                // console.log(imageUrl);
                // console.log('File available at', url);
                await addProfilePic(url);
            });
        }).catch((error) => {
            // console.error('Upload failed', error);
            // ...
        });
    }, [auth.currentUser]);
    
    
    const pickProfilePic = React.useCallback(() => async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
        });
        
        
        if (!result.canceled) {
                const compressedImage = await compressImage(result.assets[0].uri);
                await uploadImage(compressedImage);
        }else{
            //  console.log('cancelled');
        }
    }, []);
    

    const compressImage = React.useCallback(async(imageUrl) => {
        const compressedImage = await manipulateAsync(
        imageUrl,
        [{ resize: {height:100}}],
        { compress: 0.7, format: SaveFormat.JPEG }
        );
    
        return compressedImage.uri;
    }, [])
    
    
    const addProfilePic = React.useCallback(async (url) => {
        await updateProfile(auth.currentUser, {
            photoURL: url,
            displayName: "Leesn"
        }).then(() => {
            setProfilePic(url);
        }).catch((error) => {
            // An error occurred
            // ...
        });

        const profilePicRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(profilePicRef, {
            profilePic: url
        }).then(() => {
            
            // Alert.alert('Profile picture updated successfully \n Refresh App to see changes');
        })

        // console.log(auth.currentUser.photoURL)

    }, []);
    
    
    const setNewBio = React.useCallback(async (description) => {
        const profileBioRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(profileBioRef, {
            bio: description
        }).then(() => {
            Alert.alert('Profile bio updated');
        })
    }, []);

    // const getMostRecentPost = React.useCallback(async () => {
    //     const posts = await fetchMostRecentPost(auth.currentUser.uid);
    //     setPostList(postList => [...posts, ...postList]);
    // }, []);

    const populateInitialPosts = React.useCallback(async () => {
        // setGetLatestPost(false);
        const posts = await fetchUserPostsByRecent(auth.currentUser.uid);
        setPostList(posts);
    }, []);

    const handleNewPostsClick = React.useCallback(() => async () => {
        setByNewPosts(true);
        setByPopularPosts(false);
        const posts = await fetchUserPostsByRecent(auth.currentUser.uid);
        setPostList(posts);
    }, []);
    

    const handlePopularPostsClick = React.useCallback(() => async () => {
        setByNewPosts(false);
        setByPopularPosts(true);
        const posts = await fetchUserPostsByPopular(auth.currentUser.uid);
        setPostList(posts);
    }, []);

    
    const finishEdit = React.useCallback(() => () => {
        setNewBio(bio);
        setOverlayVisible(!overlayVisible);
        props.fetchUser();
    }, []);

    const toggleOverlay = React.useCallback(() => () => {
        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);


   const header = React.useCallback(() => {
       return (
           <View style={theme == 'light' ? styles.lightProfileContainer : styles.darkProfileContainer }>
              
                <View style={{flexDirection: 'column'}}>
                    {/* Profile picture and username */}
                    <TouchableOpacity
                        onPress={pickProfilePic()}
                        style={{flexDirection: 'column'}}
                    >
                        {
                            profilePic != "" &&                           
                            
                            <Image source={{uri: profilePic}} style={styles.profilePicture} placeholder={require('../../assets/profile_default.png')} cachePolicy='disk'/>
                        }
                        
                        {theme == 'light' ?
                            <AddIconLight width={30} height={30} style={styles.addIcon}/>
                        :
                            <AddIconDark width={30} height={30} style={styles.addIcon}/>
                        }

                    </TouchableOpacity>
                    
                    {/* Edit Bio button */}
                    <TouchableOpacity
                        onPress={toggleOverlay()}
                        style={theme == 'light' ? styles.lightEditButton : styles.darkEditButton}
                    >
                        <Text style={theme == 'light' ? styles.lightEditText : styles.darkEditText}>Edit Bio</Text>
                    </TouchableOpacity>
                </View>
                    

                {/* Posts, Followers, Following */}
                <View style={{flexDirection: 'column', marginLeft: 10, }}>
                    <View style={{flexDirection: 'row'}}>
                        {/* Posts */}
                        <View
                            style={styles.countContainer}
                        >
                            <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{postCount}</Text>
                            <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Posts</Text>
                        </View>

                        {/* Followers */}
                        <TouchableOpacity
                            onPress={navigateTo(navigation, "Followers")}
                            style={styles.countContainer}
                        >
                            <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{followers}</Text>
                            <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Followers</Text>
                        </TouchableOpacity>


                        {/* Following */}
                        <TouchableOpacity
                            onPress={navigateTo(navigation, "Following")}
                            style={styles.countContainer}
                        >
                            <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{following}</Text>
                            <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Following</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bio */}
                    <Text style={theme == 'light' ? styles.lightText : styles.darkText} marginLeft={15} marginTop={10} width={275} numberOfLines={4}>
                        {bio}
                    </Text>

                </View>

                {/* Edit profile bio */}
                <Overlay isVisible={overlayVisible} onBackdropPress={finishEdit()} overlayStyle={{borderRadius: 20}}>
                    <Text style={styles.lightCountText}>Edit Bio</Text>
                    <TextInput
                        secureTextEntry={false}
                        // multiline
                        blurOnSubmit
                        maxLength={150}
                        style={{fontSize: 20, width: 300, height: 200, borderColor: 'gray', borderWidth: 1, marginTop: 10, borderRadius: 10}}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter Bio"
                        placeholderTextColor= "#888888"
                        value={bio}
                        onChangeText={(newValue) => setBio(newValue)}
                        // onEndEditing={( ) => console.log('submitted')}
                    />
                    {/* Done editing button */}
                    <TouchableOpacity
                        onPress={finishEdit()}
                        style={styles.lightDoneButton}
                    >
                        <Text style={styles.lightEditText}>Done</Text>
                    </TouchableOpacity>
                </Overlay>

           </View>
       )
   }, [profilePic, bio, theme]);


   const tabBar = props => (
       <MaterialTabBar
           {...props}
           indicatorStyle={theme == 'light' ?
               { backgroundColor: '#888888' }
           :
               { backgroundColor: '#BBBBBB' }
           }
           style= {theme == 'light' ?
               { backgroundColor: 'white',}
           :
               { backgroundColor: '#0A0A0A', 
            //    borderBottomWidth: 3, 
            //    borderBottomColor: '#262626' 
            }
           }
           labelStyle = {theme == 'light' ? styles.lightLabel : styles.darkLabel}
           activeColor = {theme == 'light' ? '#222222' : 'white'}
           inactiveColor = {theme == 'light' ? '#333333' : '#F4F4F4'}
       />
   );
  
   return (
        
            <Tabs.Container
                renderHeader={header}
                headerContainerStyle={{
                    shadowColor: theme == 'light' ? '#000000' : '#F4F4F4',
                    shadowOffset: {
                        width: 0,
                        height: theme == 'light' ? 2 : 5,
                    },
                    shadowOpacity: theme == 'light' ? 0.18 : 0.16,
                    shadowRadius: theme == 'light' ? 6 : 8,
                }}
                lazy={true}
                revealHeaderOnScroll
                pointerEvents="box-none"
                renderTabBar={tabBar}
                initialTabName="Posts"
            >
                <Tabs.Tab name="Feedback">
                    <Tabs.ScrollView>
                        <View style={[styles.box, styles.boxA]} />
                        {/* <View style={[styles.box, styles.boxB]} />
                        <View style={[styles.box, styles.boxA]} />
                        <View style={[styles.box, styles.boxB]} />
                        <View style={[styles.box, styles.boxA]} />
                        <View style={[styles.box, styles.boxB]} />
                        <View style={[styles.box, styles.boxA]} />
                        <View style={[styles.box, styles.boxB]} /> */}
                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name="Posts">
                        <AllUserPosts
                            userId={auth.currentUser.uid}
                            username={username}
                            profilePic={profilePic}
                            postList={postList}
                            byNewPosts={byNewPosts}
                            byPopularPosts={byPopularPosts}
                            setByNewPosts={setByNewPosts}
                            setByPopularPosts={setByPopularPosts}
                            handleNewPostsClick={handleNewPostsClick}
                            handlePopularPostsClick={handlePopularPostsClick}
                        />
                </Tabs.Tab>
                <Tabs.Tab name="Media">
                        <AllUserMediaPosts
                            userId={auth.currentUser.uid}
                            postList={postList}
                        />
                </Tabs.Tab>
            </Tabs.Container>
   );
  
}


const styles = StyleSheet.create({
   lightProfileContainer: {
       flex: 1,
       flexDirection: 'row',
       backgroundColor: '#ffffff',
   },
   darkProfileContainer: {
       flex: 1,
       flexDirection: 'row',
       backgroundColor: '#0A0A0A',
   },
   lightLabel: {
       color: '#666666',
       fontSize: 16,
       fontWeight: "600",
   },
   darkLabel: {
       color: '#FFFFFF',
       fontSize: 16,
       fontWeight: "500",
   },
   profilePicture: {
       width: 90,
       height: 90,
       marginLeft: 15,
       marginTop: 10,
       borderRadius: 100,
   },
   addIcon: {
       position: 'absolute',
       marginLeft: 80,
       marginTop: 70
   },
   countContainer:{
       flexDirection: 'column',
       marginHorizontal: 15,
       marginTop: 15,
       alignItems: 'center'
   },
   lightUsername: {
       fontSize: 18,
       color: '#222222',
       fontWeight: "500",
       alignSelf: 'center',
       marginTop: 15,
       marginLeft: 10
   },
   darkUsername: {
       fontSize: 20,
       color: '#f2f2f2',
       fontWeight: "500",
       alignSelf: 'center',
       marginTop: 15,
       marginLeft: 10
   },
   lightCountText: {
       fontSize: 18,
       color: '#222222',
       fontWeight: "600",
   },
   darkCountText: {
       fontSize: 18,
       color: '#ffffff',
       fontWeight: "600",
   },
   lightText: {
       fontSize: 16,
       color: '#222222',
       fontWeight: "500",
   },
   darkText: {
       fontSize: 16,
       color: '#f4f4f4',
       fontWeight: "500",
   },
   lightDoneButton: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#222222',
        width: 80,
        height: 30,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
   lightEditButton: {
        width: 85,
        height: 30,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#CCCCCC',
        marginLeft: 10,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
   },
   darkEditButton: {
        width: 85,
        height: 30,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#181818',
        borderColor: '#363636',
        marginLeft: 10,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
   },
   lightEditText: {
       fontSize: 18,
       color: '#333333',
       fontWeight: "500",
       alignSelf: 'center'
   },
   darkEditText: {
       fontSize: 18,
       color: '#f8f8f8',
       fontWeight: "600",
       alignSelf: 'center'
   },
   box: {
       height: 250,
       width: '100%',
   },
       boxA: {
       backgroundColor: 'white',
   },
       boxB: {
       backgroundColor: '#D8D8D8',
   },
});


const mapStateToProps = (store) => ({
   currentUser: store.userState.currentUser,
})


const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(MainProfileScreen);