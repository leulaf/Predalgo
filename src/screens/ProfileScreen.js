import React, {useContext, useEffect, useState, Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view'
import {AuthenticatedUserContext} from '../../context-store/context';
import {Firebase, auth} from '../config/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../redux/actions/index';
import HomeScreen from './HomeScreen';

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

    headerTemp = () => {
        const {currentUser} = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                <Text
                    onPress={() => handleSignOut()}
                    style={{ fontSize: 26, fontWeight: 'bold' }}>Profile email: {currentUser !== undefined ? currentUser.email : ""}</Text>
            </View>
        )
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.fetchUser();
            }
        });
    };
    
    render() {
        
        
        const {currentUser} = this.props;
        
        // console.log(currentUser);
        return (



        <Tabs.Container 
            renderHeader={this.headerTemp}
            revealHeaderOnScroll
            pointerEvents="box-none"
        >
            <Tabs.Tab name="A">
                <HomeScreen />
            </Tabs.Tab>
            <Tabs.Tab name="B">
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