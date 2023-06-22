import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from 'react-native';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../context-store/context';
import { firebase, db, storage } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import AllUserPosts from '../components/postTypes/AllUserPosts';
import SimpleTopBar from '../components/SimpleTopBar';

export default function ProfileScreen ({route, navigation}) {
    const {theme, setTheme} = useContext(ThemeContext);
    const [following, setFollowing] = useState(false);
    const [postList, setPostList] = useState([]);
    const user = route.params.user;

    useEffect(() => {
        navigation.setOptions({
            header: () => <SimpleTopBar title={"@" + user.username}/>
        });
    }, [navigation]);

    // Get users posts by most recent and check if current user is following the user
    useEffect(() => {
        fetchPostsByRecent();

        // Check if current user is following the user
        const docRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user.id);
        const docSnap = getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                setFollowing(true);
            } else {
                setFollowing(false);
            }
        });
    }, []);

    // Get users posts by most recent
    const fetchPostsByRecent = () => {
        const q = query(collection(db, "allPosts"), where("profile", "==", user.id), orderBy("creationDate", "desc"));

        getDocs(q)
        .then((snapshot) => {
            let posts = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const id = doc.id;
                
                return { id, ...data }
            })

            setPostList(posts);
        })
    }

    // Follow current user
    const onFollow = () => {
        // add user to following collection
        const followRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user.id);
        
        setDoc(followRef, {
            id: user.id,
        }).then(() => {
            setFollowing(true);
            Alert.alert('Followed');
        }).catch((error) => {
            console.log(error);
        });

        // add user to followers collection
        const followerRef = doc(db, 'followers', user.id, "userFollowers", firebase.auth().currentUser.uid);

        setDoc(followerRef, {
            id: firebase.auth().currentUser.uid,
        }).then(() => {
            // console.log('Added to followers collection');
        }).catch((error) => {
            console.log(error);
        });

        // update followers count for user being followed
        const userRef = doc(db, 'users', user.id);

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
        const unfollowRef = doc(db, 'following', firebase.auth().currentUser.uid, "userFollowing", user.id);

        deleteDoc(unfollowRef).then(() => {
            setFollowing(false);
            Alert.alert('Unfollowed');
        }).catch((error) => {
            console.log(error);
        });

        // remove user from followers collection
        const followerRef = doc(db, 'followers', user.id, "userFollowers", firebase.auth().currentUser.uid);

        deleteDoc(followerRef).then(() => {
            // console.log('Removed from followers collection');
        }).catch((error) => {
            console.log(error);
        });

        // update followers count for user being unfollowed
        const userRef = doc(db, 'users', user.id);

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
                                <Image source={{uri: user.profilePic}} style={styles.profilePicture}/>
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
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>{postList.length}</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Posts</Text>
                         </View>
 
                         {/* Followers */}
                         <TouchableOpacity
                                 // onPress={onPress}
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
                { backgroundColor: '#1A1A1A'}
            }
            labelStyle = {theme == 'light' ? styles.lightLabel : styles.darkLabel}
            activeColor = {theme == 'light' ? '#222222' : 'white'}
            inactiveColor = {theme == 'light' ? '#333333' : '#F4F4F4'}
        />
    );
   
    return (
        <Tabs.Container
            renderHeader={header}
        //    revealHeaderOnScroll
            pointerEvents="box-none"
            renderTabBar={tabBar}
            initialTabName="Posts"
        >
            <Tabs.Tab name="Posts">
                <AllUserPosts posts={postList}/>
            </Tabs.Tab>
            <Tabs.Tab name="Media">
                <Tabs.ScrollView>
                    <View style={[styles.box, styles.boxA]} />
                    <View style={[styles.box, styles.boxB]} />
                    <View style={[styles.box, styles.boxA]} />
                    <View style={[styles.box, styles.boxB]} />
                    <View style={[styles.box, styles.boxA]} />
                    <View style={[styles.box, styles.boxB]} />
                    <View style={[styles.box, styles.boxA]} />
                    <View style={[styles.box, styles.boxB]} />
                </Tabs.ScrollView>
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
        backgroundColor: '#1A1A1A',
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
        borderColor: '#222222'
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
        borderColor: '#f2f2f2'
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