import React, {useContext, useEffect, useState, Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {AuthenticatedUserContext} from '../../context-store/context';
import {Firebase, auth} from '../config/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../redux/actions/index';

// const auth = getAuth(Firebase);
const user = auth.currentUser;

const handleSignOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.log(error);
    }
};
class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          LoggedIn: false,
          username: '',
          email: '',
        };
    }
    
    // componentDidMount() {
    //     auth.onAuthStateChanged((user) => {
    //         if (!user) {
    //         this.setState({
    //             loggedIn: false,
    //             loaded: true,
    //         });
    //         } else {
    //         this.setState({
    //             loggedIn: true,
    //             loaded: true,
    //         });
    //         }
    //     });
    // }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.fetchUser();
            }
        });
    };
    
    render() {
        
        
        const {currentUser} = this.props;
        
        console.log(currentUser);
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    onPress={() => handleSignOut()}
                    style={{ fontSize: 26, fontWeight: 'bold' }}>Profile email: {currentUser !== undefined ? currentUser.email : ""}</Text>
            </View>
        );
    }
    
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);