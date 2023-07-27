import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Image } from 'expo-image';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../context-store/context';
import { firebase, db, storage } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import AllUserPosts from '../components/postTypes/AllUserPosts';
import SimpleTopBar from '../components/SimpleTopBar';
import AllUserMediaPosts from '../components/postTypes/AllUserMediaPosts';
import {fetchUserPostsByRecent, fetchUserPostsByPopular} from '../shared/GetUserPosts';

export default function ProfileScreen ({route, navigation}) {
    const {theme, setTheme} = useContext(ThemeContext);
    const [following, setFollowing] = useState(false);
    const user = route.params.user;

    const [postList, setPostList] = useState([]);
    const [byNewPosts, setByNewPosts] = useState(true);
    const [byPopularPosts, setByPopularPosts] = useState(false);

    // useEffect(() => {
    //     navigation.setOptions({
    //         header: () => <SimpleTopBar title={"@" + user.username}/>
    //     });
    // }, [navigation]);

    // Check if current user is following the user
    useEffect(() => {
        const docRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user);
        const docSnap = getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                setFollowing(true);
            } else {
                setFollowing(false);
            }
        });
    }, []);

    // Fetch posts
    // Fetch posts
    useEffect(() => {
        handleNewPostsClick();
    }, []);

    const handleNewPostsClick = async () => {
        setByNewPosts(true);
        setByPopularPosts(false);
        const posts = await fetchUserPostsByRecent(user);
        setPostList(posts);
    };
    
    const handlePopularPostsClick = async () => {
        setByNewPosts(false);
        setByPopularPosts(true);
        const posts = await fetchUserPostsByPopular(user);
        setPostList(posts);
    };

    // Follow current user
    const onFollow = () => {
        // add user to following collection
        const followRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user);
        
        setDoc(followRef, {
            id: user,
        }).then(() => {
            setFollowing(true);
            Alert.alert('Followed');
        }).catch((error) => {
            console.log(error);
        });

        // add user to followers collection
        const followerRef = doc(db, 'followers', user, "userFollowers", firebase.auth().currentUser.uid);

        setDoc(followerRef, {
            id: firebase.auth().currentUser.uid,
        }).then(() => {
            // console.log('Added to followers collection');
        }).catch((error) => {
            console.log(error);
        });

        // update followers count for user being followed
        const userRef = doc(db, 'users', user);

        updateDoc(userRef, {
            followers: increment(1)
        });

        // update following count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        updateDoc(currentUserRef, {
            following: increment(1)
        });
    }

    // Unfollow current user
    const onUnfollow = () => {
        // remove user from following collection
        const unfollowRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user);

        deleteDoc(unfollowRef).then(() => {
            setFollowing(false);
            Alert.alert('Unfollowed');
        }).catch((error) => {
            console.log(error);
        });

        // remove user from followers collection
        const followerRef = doc(db, 'followers', user, "userFollowers", firebase.auth().currentUser.uid);

        deleteDoc(followerRef).then(() => {
            // console.log('Removed from followers collection');
        }).catch((error) => {
            console.log(error);
        });

        // update followers count for user being unfollowed
        const userRef = doc(db, 'users', user);

        updateDoc(userRef, {
            followers: increment(-1)
        });

        // update following count for current user
        const currentUserRef = doc(db, 'users', firebase.auth().currentUser.uid);

        updateDoc(currentUserRef, {
            following: increment(-1)
        });
    }
    
    const header = () => {
        return (
            <View style={theme == 'light' ? styles.lightProfileContainer :styles.darkProfileContainer }>
               
                 <View style={{flexDirection: 'column', marginTop: 5,}}>               
                     
                    {/* Profile picture*/}
                    <View
                        style={{flexDirection: 'column'}}
                    >
                        {
                            user.profilePic != "" ? (                           
                                <Image source={{uri: user.profilePic}} style={styles.profilePicture} cachePolicy='disk'/>
                            ) : (
                                <Image source={require('../../assets/profile_default.png')} style={styles.profilePicture}/>
                            )
                        }
                    </View>

                    {/* Follow/Following button */}
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightFollowButton : styles.darkFollowButton}
                        onPress={() => { following ? onUnfollow() : onFollow()}}
                    >
                        <Text style={theme == 'light' ? styles.lightFollowText : styles.darkFollowText}>
                            {following ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                     
                 </View>
                     
 
                 {/* Posts, Following */}
                 <View style={{flexDirection: 'column', marginTop: 0, marginLeft: 2}}>
                     <View style={{flexDirection: 'row'}}>
                         
                         {/* Posts */}
                         <View
                             style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{user.posts}</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Posts</Text>
                         </View>
 
                         {/* Followers */}
                         <TouchableOpacity
                                onPress={() => navigation.push('Followers', {profile: user})}
                                 style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{user.followers}</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Followers</Text>
                         </TouchableOpacity>
                     </View>
 
                     {/* Bio */}
                     <Text style={theme == 'light' ? styles.lightText : styles.darkText} marginLeft={15} marginTop={10} width={275} numberOfLines={4}>
                         {user.bio}
                     </Text>
 
                 </View>
 
            </View>
        )
    }
 
 
    const tabBar = props => (
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
    );
   
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
                    userId={user}
                    username={user.username}
                    profilePic={user.profilePic}
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
                    userId={user}
                    postList={postList}
                    profilePic={user.profilePic}
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
        color: '#880808',
        fontSize: 16,
        fontWeight: '600',
    },
    darkLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
        color: '#222222',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    darkFollowText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 1
    },
    lightCountText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        marginTop: 5,
    },
    darkCountText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
        marginTop: 5,
    },
    lightText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: '500',
    },
    darkText: {
        fontSize: 16,
        color: '#f4f4f4',
        fontWeight: '500',
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