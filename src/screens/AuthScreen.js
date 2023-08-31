import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import PredalgoLogo from '../../assets/Predalogo_SignUp_logo.svg';
import { getAuth, updateProfile } from "firebase/auth";
import {firebase, auth} from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// import auth from '@react-native-firebase/auth';

const width = Dimensions.get('window').width;

const currentUser = getAuth().currentUser;

const AuthScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);

    const onSignUp = async () => {
        let error = "";


        try {
            
            // if (email !== '' && password !== '' && confirmEmail !== '' && username !== '' && email === confirmEmail) {
                
            //     await createUserWithEmailAndPassword(auth, email, password)
            //     .then((result) => {
            //         // Signed in 
            //         firebase.firestore().collection('users')
            //         .doc(firebase.auth().currentUser.uid).set({
            //             username: username,
            //             email: email,
            //             profilePic: "",
            //             bio: "User bio is empty",
            //             posts: 0,
            //             followers: 0,
            //             following: 0,
            //         })

            //         updateProfile(auth.currentUser, {
            //             displayName: username,
            //         }).then(() => {
            //             // Profile updated!
            //             // ...
            //         }
            //         ).catch((error) => {
            //             // An error occurred
            //             // ...
            //         }
            //         );
            //     })
            //     .catch((error) =>{
            //         // alert(error);
            //         console.log(error);
            //     })
            // }
            
            
            // if(email !== confirmEmail){
            //     error += "Emails do not match \n";
            // }

            // if(username === ''){
            //     error += "Username cannot be empty \n";
            // }

            // if(email === '' || confirmEmail === ''){
            //     error += "Email cannot be empty \n";
            // }

            if (email !== '' && password !== '') {
                
                await createUserWithEmailAndPassword(auth, email, password)
                .then((result) => {
                    // Signed in 
                    firebase.firestore().collection('users')
                    .doc(firebase.auth().currentUser.uid).set({
                        username: "",
                        email: email,
                        profilePic: "",
                        bio: "User bio is empty",
                        posts: 0,
                        followers: 0,
                        following: 0,
                    })
                }).catch((error) =>{
                    // alert(error);
                    console.log(error);
                })
                
            }

            if(email === ''){
                error += "Email cannot be empty \n";
            }

            if(password === ''){
                error += "Password cannot be empty \n";
            }
            

            if(error.length != 0){
                alert(error);
            }

        } catch (error) {
            alert("Pleace enter a valid email address\n" + error);
        }
    }
    
    const onLogin = async () => {
        try {
            if (email !== '' && password !== '') {
                await signInWithEmailAndPassword(auth, email, password)
                    .catch((error) => {

                    })
            }
        } catch (error) {
            alert("Pleace enter a valid email address\n" + error);
        }
    };


    return (
        <View style={styles.mainContainer}>
            <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={{alignItems: 'center'}}>
            
                <TouchableOpacity 
                    style={styles.smallButtonContainer}
                    onPress={() => setNewAccount(!newAccount)}
                >
                    <Text style={styles.smallButtonText}>{newAccount ? "Log In" : "Sign Up"}</Text>
                </TouchableOpacity>
                

                <PredalgoLogo
                    width={350}
                    height={350}
                    marginTop={40}
                    // marginLeft={3}
                    marginBottom={20}
                />

                    

                {
                    newAccount ?
                        <View automaticallyAdjustKeyboardInsets={true} style={{ width: '100%' }}>
                           {/* Username input */}
                           {/* <TextInput
                                textContentType="username"
                                secureTextEntry={false}
                                style={styles.input}
                                maxLength={15}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Username"
                                placeholderTextColor= "#888888"
                                value={username}
                                onChangeText={(newValue) => setUsername(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            /> */}

                            {/* Emain input */}
                            <TextInput
                                textContentType="emailAddress"
                                secureTextEntry={false}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Email"
                                placeholderTextColor= "#888888"
                                value={email}
                                onChangeText={(newValue) => setEmail(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />
                            
                            {/* Confirm Emain input */}
                            {/* <TextInput
                                textContentType="emailAddress"
                                secureTextEntry={false}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Confirm Email"
                                placeholderTextColor= "#888888"
                                value={confirmEmail}
                                onChangeText={(newValue) => setConfirmEmail(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            /> */}

                            {/* Password input */}
                            <TextInput
                                textContentType="newPassword"
                                secureTextEntry={true}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Password"
                                placeholderTextColor= "#888888"
                                value={password}
                                onChangeText={(newValue) => setPassword(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />
                        </View>
                        
                    :
                        <View automaticallyAdjustKeyboardInsets={true} style={{ width: '100%' }}>
                            {/* Emain input */}
                            <TextInput
                                textContentType="emailAddress"
                                secureTextEntry={false}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={!newAccount ? "Email or Username" : "Confirm Email"}
                                placeholderTextColor= "#888888"
                                value={email}
                                onChangeText={(newValue) => setEmail(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />

                            {/* Password input */}
                            <TextInput
                                textContentType="password"
                                secureTextEntry={true}
                                style={styles.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Password"
                                placeholderTextColor= "#888888"
                                value={password}
                                onChangeText={(newValue) => setPassword(newValue)}
                                // onEndEditing={( ) => console.log('submitted')}
                            />
                        </View>
                }

            
                <TouchableOpacity 
                    style={styles.largeButtonContainer}
                    onPress={() =>
                        newAccount ? onSignUp() : onLogin()
                    }
                >
                    <Text style={styles.largeButtonText}>{newAccount ? "Sign Up" : "Log In"}</Text>
                </TouchableOpacity>
                
            </ScrollView>

            

            {/* Skip button */}
            {/* <TouchableOpacity 
                style={styles.skipButtonContainer}
                onPress={() => navigation.navigate("Drawer")}
            >
                <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity> */}

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: width,
        backgroundColor: "#005FFF",
        // flexDirection: 'column',
        alignItems: 'center',
        // alignItems: 'center', 
        // justifyContent: 'center' 
    },
    smallButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: 45,
        width: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#0041A4',
        marginTop: 60,
        marginLeft: 260,
    },
    largeButtonContainer: {
        // flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: 70,
        width: 250,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#0041A4',
        marginTop: 30,
        // marginBottom: 75,
    },
    skipButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#0F6FFF',
        height: 35,
        width: 100,
        borderRadius: 50,
        marginTop: 80,
        marginBottom: 50,
        marginLeft: 260
    },
    smallButtonText: {
        fontWeight: '600',
        fontSize: 20,
        color: "#000000",
    },
    largeButtonText: {
        fontWeight: '600',
        fontSize: 36,
        color: "#000000",
        alignSelf: 'center',
        marginBottom: 2,
    },
    skipButtonText: {
        fontWeight: '600',
        fontSize: 20,
        color: "white",
        marginTop: 7,
    },
    input: {
        marginTop: 15,
        width: width * 0.96,
        // alignSelf: 'center',
        height: 55,
        backgroundColor: "#FFFFFF",
        borderColor: '#0043B4',
        // borderColor: '#0041A4',
        borderWidth: 2,
        borderRadius: 22,
        padding: 10,
        fontSize: 18,
    }
});

export default AuthScreen;