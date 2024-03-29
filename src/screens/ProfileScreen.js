import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../context-store/context';
import { firebase, db, storage } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import AllUserPosts from '../components/posts/AllUserPosts';
import AllUserMediaPosts from '../components/posts/AllUserMediaPosts';
import {fetchUserPostsByRecent, fetchUserPostsByPopular} from '../shared/post/GetUserPosts';

const navigateTo = (navigation, user) => () => {
    navigation.navigate("Followers", {profile: user})
}

const ProfileScreen = ({route, navigation}) => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [following, setFollowing] = useState(false);
    const {profile, username, profilePic, bioData, followersCountData, postsCountData} = route.params;

    const [postsCount, setPostsCount] = useState(postsCountData ? postsCountData : 0);
    const [followersCount, setFollowersCount] = useState(followersCountData ? followersCountData : 0);
    const [bio, setBio] = useState(bioData ? bioData : "User Bio");

    const [postList, setPostList] = useState([]);
    const [byNewPosts, setByNewPosts] = useState(true);
    const [byPopularPosts, setByPopularPosts] = useState(false);

    // useEffect(() => {
    //     navigation.setOptions({
    //         header: () => <SimpleTopBar title={"@" + username}/>
    //     });
    // }, []);

    // Check if current user is following the user
    useEffect(() => {

        if (!(bioData || followersCountData || postsCountData)) {
            const userRef = doc(db, 'users', profile);
            
            getDoc(userRef)
            .then((userSnap) => {
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    // console.log(data)
                    setPostsCount(data.posts);
                    setFollowersCount(data.followers);
                    setBio(data.bio);
                } else {
                    setFollowing(false);
                }
            });
        }

        populateInitialPosts();

        // *** catch array of following users and use that instead of making a request
        const docRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", profile);
        const docSnap = getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                setFollowing(true);
            } else {
                setFollowing(false);
            }
        });
    }, []);

    const populateInitialPosts = React.useCallback(async () => {
        setByNewPosts(true);
        setByPopularPosts(false);
        const posts = await fetchUserPostsByRecent(profile);
        setPostList(posts);
    }, []);

    const handleNewPostsClick = React.useCallback(() => async () => {
        setByNewPosts(true);
        setByPopularPosts(false);
        const posts = await fetchUserPostsByRecent(profile);
        setPostList(posts);
    }, []);
    
    const handlePopularPostsClick = React.useCallback(() => async () => {
        setByNewPosts(false);
        setByPopularPosts(true);
        const posts = await fetchUserPostsByPopular(profile);
        setPostList(posts);
    }, []);

    // Follow current user
    const onFollow = React.useCallback(() => {
        // add user to following collection
        const followRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", profile);
        
        setDoc(followRef, {
            id: profile,
        }).then(() => {
            setFollowing(true);
            Alert.alert('Followed');
        }).catch((error) => {
            // console.log(error);
        });

        // add user to followers collection
        const followerRef = doc(db, 'followers', profile, "userFollowers", firebase.auth().currentUser.uid);

        setDoc(followerRef, {
            id: firebase.auth().currentUser.uid,
        }).then(() => {
            // console.log('Added to followers collection');
        }).catch((error) => {
            // console.log(error);
        });

        // update followers count for user being followed
        const userRef = doc(db, 'users', profile);

        updateDoc(userRef, {
            followers: increment(1)
        });

        // update following count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        updateDoc(currentUserRef, {
            following: increment(1)
        });
    }, [])

    // Unfollow current user
    const onUnfollow = React.useCallback(() => {
        // remove user from following collection
        const unfollowRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", profile);

        deleteDoc(unfollowRef).then(() => {
            setFollowing(false);
            Alert.alert('Unfollowed');
        }).catch((error) => {
            // console.log(error);
        });

        // remove user from followers collection
        const followerRef = doc(db, 'followers', profile, "userFollowers", firebase.auth().currentUser.uid);

        deleteDoc(followerRef).then(() => {
            // console.log('Removed from followers collection');
        }).catch((error) => {
            // console.log(error);
        });

        // update followers count for user being unfollowed
        const userRef = doc(db, 'users', profile);

        updateDoc(userRef, {
            followers: increment(-1)
        });

        // update following count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        updateDoc(currentUserRef, {
            following: increment(-1)
        });
    }, [])

    const toggleFollowing = React.useCallback(() => () => {
        following ? onUnfollow() : onFollow();
    }, [following]);
    
    const header = React.useCallback(() => {
        return (
            <View style={theme == 'light' ? styles.lightProfileContainer : styles.darkProfileContainer }>
               
                 <View style={{flexDirection: 'column', marginTop: 5,}}>               
                     
                    {/* Profile picture*/}
                    <View
                        style={{flexDirection: 'column'}}
                    >
                        {
                            profilePic != "" &&                          
                            <Image source={{uri: profilePic}} style={styles.profilePicture} placeholder={require('../../assets/profile_default.png')} cachePolicy='disk'/>
                        }
                    </View>

                    {/* Follow/Following button */}
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightFollowButton : styles.darkFollowButton}
                        onPress={toggleFollowing()}
                    >
                        <Text style={theme == 'light' ? styles.lightFollowText : styles.darkFollowText}>
                            {following ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                     
                 </View>
                     
 
                 {/* Posts, Followers */}
                 <View style={{flexDirection: 'column', marginTop: 0, marginLeft: 2}}>
                     <View style={{flexDirection: 'row'}}>
                         
                         {/* Posts */}
                         <View
                             style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{postsCount}</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Posts</Text>
                         </View>
 
                         {/* Followers */}
                         <TouchableOpacity
                                onPress={navigateTo(navigation, profile)}
                                 style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{followersCount}</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Followers</Text>
                         </TouchableOpacity>

                         {/* Share comment */}
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{flexDirection: 'row',  marginTop: 14, marginLeft: 1, alignItems: 'center'}}
                            onPress={() => 
                                navigation.navigate("Chat", {
                                    profile: profile,
                                    username: username,
                                    avatar: profilePic,
                                })
                            }
                        >
                            <Ionicons
                                name={"chatbubble-ellipses-outline"}
                                // name={"chatbox-ellipses-outline"}
                                size={32}

                                color={theme == 'light' ? '#222' : '#F8F8F8'}
                                // marginLeft={15}
                                // marginRight={13}
                                // marginTop={0}
                            />
                            <Text
                                style={
                                    // theme == 'light' ? styles.lightChatText : styles.darkChatText
                                    [theme == 'light' ? styles.lightText : styles.darkText, {marginLeft: 6}]
                                }
                            >
                                Chat
                            </Text>
                        </TouchableOpacity>
                     </View>
 
                     {/* Bio */}
                     <Text style={theme == 'light' ? styles.lightText : styles.darkText} marginLeft={15} marginTop={10} width={275} numberOfLines={4}>
                         {bio}
                     </Text>


                    
                 </View>

                 
 
            </View>
        )
    }, [theme, following, postsCount, followersCount, bio])
 
 
    const tabBar = React.useCallback(props => (
        <MaterialTabBar
            {...props}
            indicatorStyle={theme == 'light' ?
                { backgroundColor: '#888888' }
            :
                { backgroundColor: '#BBBBBB' }
            }
            style= {theme == 'light' ?
                { backgroundColor: 'white'}
            :
                { backgroundColor: '#0A0A0A', borderBottomWidth: 3, borderBottomColor: '#262626'}
            }
            labelStyle = {theme == 'light' ? styles.lightLabel : styles.darkLabel}
            activeColor = {theme == 'light' ? '#222222' : 'white'}
            inactiveColor = {theme == 'light' ? '#333333' : '#F4F4F4'}
        />
    ), []);
   
    return (
        <Tabs.Container
            onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
            onTouchEnd={e => {
            if (e.nativeEvent.pageX - this.touchX > 150)
                // console.log('Swiped Right')
                navigation.goBack()
            }}
            renderHeader={header}
            headerContainerStyle={{
                shadowColor: theme == 'light' ? '#000000' : '#F4F4F4',
                shadowOffset: {
                    width: 0,
                    height: theme == 'light' ? 2 : 5,
                },
                shadowOpacity: theme == 'light' ? 0.14 : 0.16,
                shadowRadius: theme == 'light' ? 6 : 8,
            }}
            lazy={true}
        //    revealHeaderOnScroll
            pointerEvents="box-none"
            renderTabBar={tabBar}
            initialTabName="Posts"
        >
            <Tabs.Tab name="Posts">
                <AllUserPosts
                    userId={profile}
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
                    userId={profile}
                    postList={postList}
                    profilePic={profilePic}
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
        fontWeight: "600",
    },
    profilePicture: {
        width: 100,
        height: 100,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 100,
    },
    countContainer:{
        flexDirection: 'column',
        marginHorizontal: 15,
        marginTop: 15,
        alignItems: 'center'
    },
    lightFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    darkFollowButton: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginTop: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#888888'
    },
    lightFollowText: {
        fontSize: 18,
        color: '#000',
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 1
    },
    darkFollowText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: "600",
        alignSelf: 'center',
        marginTop: 1
    },
    lightCountText: {
        fontSize: 18,
        color: '#000',
        fontWeight: "600",
        marginTop: 5,
    },
    darkCountText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: "600",
        marginTop: 5,
    },
    lightText: {
        fontSize: 16,
        color: '#000',
        fontWeight: "500",
    },
    darkText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: "500",
    },
    lightChatText: {
        fontSize: 17,
        color: '#000',
        fontWeight: "600",
        marginLeft: 6
    },
    darkChatText: {
        fontSize: 17,
        color: '#FFF',
        fontWeight: "600",
        marginLeft: 6
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

export default React.memo(ProfileScreen);
