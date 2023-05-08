import React, {useContext, useEffect, useState, Component} from 'react';
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Overlay } from 'react-native-elements';
import { doc, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import {AuthenticatedUserContext} from '../../context-store/context';
import {db, Firebase, firebase, auth, storage} from '../config/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../redux/actions/index';
import HomeScreen from './HomeScreen';
import AddIcon from '../../assets/add.svg';

// const auth = getAuth(Firebase);
const user = auth.currentUser;

const handleSignOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.log(error);
    }
};

async function uploadImage(imageUrl) {
    // Convert image to blob format(array of bytes)
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // const filename = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
    const childPath = `profilePics/${firebase.auth().currentUser.uid}`;

    const storageRef = ref(storage, childPath);

    const uploadTask =  uploadBytesResumable(storageRef, blob)
    .catch ((e) => {
        console.log(e);
    })

    uploadTask.then((snapshot) => {
        // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        // console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        getDownloadURL(snapshot.ref).then(async (url) => {
            // console.log(imageUrl);
            // console.log('File available at', url);
            await setProfilePic(url);
        });
    }).catch((error) => {
        console.error('Upload failed', error);
        // ...
    });
};

const pickProfilePic = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
    });

    if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
    }else{
        console.log('cancelled');
    }
};

const setProfilePic = async (url) => {
    const profilePicRef = doc(db, "users", firebase.auth().currentUser.uid);
    await updateDoc(profilePicRef, {
        profilePic: url
    }).then(() => {
        Alert.alert('Profile picture updated \n Please refresh the app to see changes');
    })
};

const setNewBio = async (description) => {
    const profileBioRef = doc(db, "users", firebase.auth().currentUser.uid);
    await updateDoc(profileBioRef, {
        bio: description
    }).then(() => {
        Alert.alert('Profile bio updated');
    })
};

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            profilePic: '',
            bio: '',
            overlayVisible: false,
        };
    }

    finishEdit = () => {
        setNewBio(this.state.bio).then(() => {
            this.setState(() => ({
                overlayVisible: !this.state.overlayVisible
            }))
        });
    };

    header = () => {
        const {currentUser} = this.props;

        if(currentUser == null){
            return (
                <View style={styles.darkProfileContainer}>
                    <TouchableOpacity
                        // onPress={onPress}
                    >
                        <Image source={require('../../assets/profile_default.png')} style={styles.profilePicture}/>
                    </TouchableOpacity>
                    <Text style={styles.lightUsername}>Username</Text>
                </View>
            )
        }

        return (
            <View style={styles.lightProfileContainer}>
                {/* Profile picture and username */}

                <TouchableOpacity
                    onPress={() => pickProfilePic().then(() => {
                        this.setState(() => ({ ProfilePic: currentUser.profilePic}))
                        console.log("profile pic updated");
                    })}
                    style={{flexDirection: 'column'}}
                >
                    {
                        this.state.profilePic != "" ? (                            
                            <Image source={{uri: this.state.profilePic}} style={styles.profilePicture}/>
                        ) : (
                            <Image source={require('../../assets/profile_default.png')} style={styles.profilePicture}/>
                        )
                    }
                    <AddIcon width={30} height={30} style={{position: 'absolute', marginLeft: 85, marginTop: 55}}/>
                    <Text style={styles.lightUsername}>{this.state.username}99999</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'column', marginLeft: 5}}>
                    {/* Posts, Followers, Following */}
                    <View style={{flexDirection: 'row'}}>
                        {/* Posts */}
                        <View
                            style={styles.countContiner}
                        >
                            <Text style={styles.lightCountText}>100</Text>
                            <Text style={styles.lightText}>Posts</Text>
                        </View>

                        {/* Followers */}
                        <TouchableOpacity
                                // onPress={onPress}
                                style={styles.countContiner}
                        >
                            <Text style={styles.lightCountText}>100</Text>
                            <Text style={styles.lightText}>Followers</Text>
                        </TouchableOpacity>

                        {/* Following */}
                        <TouchableOpacity
                                // onPress={onPress}
                                style={styles.countContiner}
                        >
                            <Text style={styles.lightCountText}>903</Text>
                            <Text style={styles.lightText}>Following</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bio */}
                    <Text style={styles.lightText} marginLeft={15} marginTop={10} width={275} numberOfLines={4}>{this.state.bio}</Text>

                    {/* Edit Bio button */}
                    <TouchableOpacity
                        onPress={() => this.setState(() => ({
                            overlayVisible: !this.state.overlayVisible
                        }))}
                        style={styles.lightEditButton}
                    >
                        <Text style={styles.lightEditProfileText}>Edit Bio</Text>
                    </TouchableOpacity>

                    {/* Edit profile bio */}
                    <Overlay isVisible={this.state.overlayVisible} onBackdropPress={this.finishEdit}>
                        <Text style={styles.lightCountText}>Edit Bio</Text>
                        <TextInput
                            secureTextEntry={false}
                            multiline
                            maxLength={150}
                            style={{fontSize: 20, width: 300, height: 200, borderColor: 'gray', borderWidth: 1, marginTop: 10, borderRadius: 10}}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter Bio"
                            placeholderTextColor= "#888888"
                            value={this.state.bio}
                            onChangeText={(newValue) => this.setState({bio: newValue})}
                            // onEndEditing={( ) => console.log('submitted')}
                        />
                        {/* Done editing button */}
                        <TouchableOpacity
                            onPress={() => 
                                this.finishEdit()
                            }
                            style={styles.lightEditButton}
                        >
                            <Text style={styles.lightEditProfileText}>Done</Text>
                        </TouchableOpacity>
                    </Overlay>
                </View>
                    
                    
                
            </View>
        )
    }

    componentDidMount() {
        const {currentUser} = this.props;
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.fetchUser();
                this.setState({
                    username: currentUser.username,
                    profilePic: currentUser.profilePic,
                    bio: currentUser.bio,
                });
            } else {
              // User is signed out
              // ...
            }
          });

    };
    
    render() {
        return (

            <Tabs.Container 
                renderHeader={this.header}
                revealHeaderOnScroll
                pointerEvents="box-none"
                headerHeight={10}
            >
                <Tabs.Tab name="Posts" >
                    <HomeScreen />
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
    
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

const styles = StyleSheet.create({
    lightProfileContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginTop: 10
    },
    darkProfileContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#222222',
        marginTop: 10
    },
    profilePicture: {
        width: 90,
        height: 90,
        marginLeft: 15,
        borderRadius: 100,
    },
    countContiner:{
        flexDirection: 'column',
        marginHorizontal: 15,
        marginTop: 10,
        alignItems: 'center'
    },
    lightUsername: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10
    },
    darkUsername: {
        fontSize: 20,
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10
    },
    lightCountText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        // marginTop: 20,
    },
    darkCountText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        marginTop: 5,
    },
    lightText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: '400',
    },
    darkText: {
        fontSize: 16,
        color: '#222222',
        fontWeight: '600',
    },
    lightEditButton: {
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#333333', 
        width: 80, height: 30, 
        marginVertical: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf: 'flex-end'
    },
    darkEditButton: {
        borderRadius: 20, 
        borderWidth: 2, 
        borderColor: '#666666', 
        width: 80, height: 30, 
        marginVertical: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf: 'flex-end'
    },
    lightEditProfileText: {
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
        alignSelf: 'center'
        // marginTop: 20,
    },
    darkEditProfileText: {
        fontSize: 18,
        color: '#222222',
        fontWeight: '600',
        // marginTop: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);