import React, {useContext, useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert} from 'react-native';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../context-store/context';
import ProfileTop from '../components/ProfileTop';

// light mode icons
import BackLight from '../../assets/back.svg';

// dark mode icons
import BackDark from '../../assets/back_light.svg';

export default function ProfileScreen ({route, navigation}) {
    const {theme, setTheme} = useContext(ThemeContext);
    const user = route.params.user;
    
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Profile",
        });
    }, [navigation]);
    
    const header = () => {
        return (
            <View style={theme == 'light' ? styles.lightProfileContainer :styles.darkProfileContainer }>
               
                 
                 <View style={{flexDirection: 'column', marginTop: 40, position: 'absolute'}}>
                    
                    {/* Username / back button */}
                    <TouchableOpacity 
                        style={{flexDirection: 'row'}}
                        onPress={() => {navigation.goBack()}}
                    >
                        {
                            theme == 'light' ?
                                <BackLight style={styles.backIcon} width={22} height={22}/>
                            :
                                <BackDark style={styles.backIcon} width={22} height={22}/>
                        }

                        <Text style={theme == 'light' ? styles.lightUsername : styles.darkUsername}>
                            @{user.username}
                        </Text>
                    </TouchableOpacity>
                    
                     
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

                    
                     
                 </View>
                     
 
                 {/* Posts, Followers, Following */}
                 <View style={{flexDirection: 'column', marginTop: 65, marginLeft: 115}}>
                     <View style={{flexDirection: 'row'}}>
                         {/* Posts */}
                         <View
                             style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>100</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Posts</Text>
                         </View>
 
                         {/* Following */}
                         <TouchableOpacity
                                 // onPress={onPress}
                                 style={styles.countContainer}
                         >
                             <Text style={theme == 'light' ? styles.lightCountText : styles.darkCountText}>903</Text>
                             <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Following</Text>
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
                { backgroundColor: 'white', height: 100}
            :
                { backgroundColor: '#1A1A1A', height: 100}
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
                    {/* <AllUserPosts posts={userPosts}/> */}
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
        height: 100,
        marginTop: 180
    },
    darkLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        height: 100,
        marginTop: 180
    },
    profilePicture: {
        width: 90,
        height: 90,
        marginLeft: 15,
        marginTop: 10,
        borderRadius: 100,
    },
    countContainer:{
        flexDirection: 'column',
        marginHorizontal: 15,
        marginTop: 15,
        alignItems: 'center'
    },
    backIcon: {
        alignSelf: 'center',
        marginLeft: 5
    },
    lightUsername: {
        fontSize: 20,
        color: '#222222',
        fontWeight: '600',
        alignSelf: 'center',
        marginVertical: 5,
        marginLeft: 5
    },
    darkUsername: {
        fontSize: 20,
        color: '#f2f2f2',
        fontWeight: '600',
        alignSelf: 'center',
        marginVertical: 5,
        marginLeft: 5
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