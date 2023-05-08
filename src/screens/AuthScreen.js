import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import PredalgoLogo from '../../assets/Predalogo_SignUp_logo.svg';
import {firebase, Firebase, auth} from '../config/firebase';

// import auth from '@react-native-firebase/auth';

const AuthScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);

    const onSignUp = async () => {
        try {
            if (email !== '' && password !== '' && confirmEmail !== '' && username !== '' && email === confirmEmail) {
                await auth.createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    // Signed in 
                    firebase.firestore().collection('users')
                    .doc(firebase.auth().currentUser.uid).set({
                        username: username,
                        email: email,
                        profilePic: "",
                        bio: "User bio is empty",
                    })
                })
                .catch((error) =>{
                    // alert(error);
                    console.log(error);
                })
            }
            
            let error = "";
            if(email !== confirmEmail){
                error += "Emails do not match \n";
            }

            if(username === ''){
                error += "Username cannot be empty \n";
            }

            if(email === '' || confirmEmail === ''){
                error += "Email cannot be empty \n";
            }

            if(password === ''){
                error += "Password cannot be empty \n";
            }

            

            if(error.length !== 0){
                alert(error);
            }
        } catch (error) {
            alert("Pleace enter a valid email address\n" + error);
        }
    }
    
    const onLogin = async () => {
        try {
            if (email !== '' && password !== '') {
                await auth.signInWithEmailAndPassword(email, password);
            }
        } catch (error) {
            alert("Pleace enter a valid email address\n" + error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity 
                style={styles.smallButtonContainer}
                onPress={() => setNewAccount(!newAccount)}
            >
                <Text style={styles.smallButtonText}>{newAccount ? "Log In" : "Sign Up"}</Text>
            </TouchableOpacity>
            {
                newAccount ?
                        <PredalgoLogo width={300} height={200} marginTop={40} marginLeft={0} marginBottom={20}/>
                :
                    <PredalgoLogo width={380} height={300} marginTop={50} marginLeft={4} marginBottom={20}/>
            }

            {
                newAccount ?
                    <ScrollView automaticallyAdjustKeyboardInsets={true} width={"100%"}>
                        <TextInput
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
                        />

                        {/* Emain input */}
                        <TextInput
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
                        <TextInput
                            secureTextEntry={false}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Confirm Email"
                            placeholderTextColor= "#888888"
                            value={confirmEmail}
                            onChangeText={(newValue) => setConfirmEmail(newValue)}
                            // onEndEditing={( ) => console.log('submitted')}
                        />

                        {/* Password input */}
                        <TextInput
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
                    </ScrollView>
                    
                :
                    <ScrollView automaticallyAdjustKeyboardInsets={true} width={"100%"}>
                        {/* Emain input */}
                        <TextInput
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
                    </ScrollView>
            }

            

            

            <TouchableOpacity 
                style={styles.largeButtonContainer}
                onPress={() =>
                    newAccount ? onSignUp() : onLogin()
                }
            >
                <Text style={styles.largeButtonText}>{newAccount ? "Sign Up" : "Log In"}</Text>
            </TouchableOpacity>

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
        backgroundColor: "#1155C5",
        flex: 1, 
        alignItems: 'center', 
        // justifyContent: 'center' 
    },
    smallButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 40,
        width: 120,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#DDDDDD',
        marginTop: 60,
        marginLeft: 260,
    },
    largeButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 60,
        width: 250,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#DDDDDD',
        marginBottom: 150,
    },
    skipButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#4D80D3',
        height: 40,
        width: 100,
        borderRadius: 50,
        marginTop: 80,
        marginBottom: 50,
        marginLeft: 260
    },
    smallButtonText: {
        fontWeight: 600,
        fontSize: 20,
        color: "white",
        marginTop: 5,
    },
    largeButtonText: {
        fontWeight: 600,
        fontSize: 33,
        color: "white",
        marginTop: 5,
    },
    skipButtonText: {
        fontWeight: 600,
        fontSize: 20,
        color: "white",
        marginTop: 7,
    },
    input: {
        marginTop: 15,
        width: "95%",
        alignSelf: 'center',
        height: 55,
        backgroundColor: "#FFFFFF",
        borderColor: '#CCCCCC',
        borderWidth: 3,
        borderRadius: 20,
        padding: 10,
        fontSize: 18,
    }
});

export default AuthScreen;