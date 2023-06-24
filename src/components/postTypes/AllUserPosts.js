import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import { Tabs } from 'react-native-collapsible-tab-view'
import {ThemeContext} from '../../../context-store/context';
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import GlobalStyles from '../../constants/GlobalStyles';

export default function AllUserPosts({ userId }){
    const {theme,setTheme} = useContext(ThemeContext);
    const [postList, setPostList] = useState([]);
    const [newPosts, setNewPosts] = useState(true);
    const [popularPosts, setPopularPosts] = useState(false);

    useEffect( () => {
        fetchPostsByRecent();
    }, []);

    // Get users posts by most recent
    const fetchPostsByRecent = () => {
        const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("creationDate", "desc"));

        getDocs(q)
        .then((snapshot) => {
            let posts = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const id = doc.id;
                
                return { id, ...data }
            })

            setPostList([...posts])
        })
    }

    // Get users posts by most recent
    const fetchPostsByPopular = () => {
        const q = query(collection(db, "allPosts"), where("profile", "==", userId), orderBy("likesCount", "desc"));

        getDocs(q)
        .then((snapshot) => {
            let posts = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const id = doc.id;
                
                return { id, ...data }
            })

            setPostList([...posts])
        })
    }

    {/* New/Popular/Refresh button */}
    const topButtons = (
        <View style={{flexDirection: 'row', marginBottom: 7}}>
            {/* New button */}
            {
                newPosts ?
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightNewButtonActive : styles.darkNewButtonActive}
                        onPress={() => { 
                            setNewPosts(true);
                            setPopularPosts(false);
                            fetchPostsByRecent(); 
                        }}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            New
                        </Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightNewButtonInactive : styles.darkNewButtonInactive}
                        onPress={() => { 
                            setNewPosts(true);
                            setPopularPosts(false);
                            fetchPostsByRecent(); 
                        }}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            New
                        </Text>
                    </TouchableOpacity>
            }
            
            {/* Popular button */}
            {
                popularPosts ?
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightPopularButtonActive : styles.darkPopularButtonActive}
                        onPress={() => { 
                            setPopularPosts(true);
                            setNewPosts(false);
                            fetchPostsByPopular(); 
                        }}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            Popular
                        </Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={theme == 'light' ? styles.lightPopularButtonInactive : styles.darkPopularButtonInactive}
                        onPress={() => { 
                            setPopularPosts(true);
                            setNewPosts(false);
                            fetchPostsByPopular(); 
                        }}
                    >
                        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
                            Popular
                        </Text>
                    </TouchableOpacity>
            }

            
        </View>
    );<TouchableOpacity
        style={theme == 'light' ? styles.lightPopularButtonActive : styles.darkPopularButtonActive}
        // onPress={() => { Popularing ? onUnPopular() : onPopular()}}
    >
        <Text style={theme == 'light' ? styles.lightPopularText : styles.darkPopularText}>
            Popular
        </Text>
    </TouchableOpacity>

    const renderItem = ({ item, index }) => {
        let post;
        if(item.imageUrl){
            post = <ImagePost
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}
                tags={item.tags}
                memeText={item.memeText}
                profile={item.profile}
                postId={item.id}
            />
        }else if(item.imageUrls){
            post = <MultiImagePost
                key={index}
                title={item.title}
                imageUrls={item.imageUrls}
                tags={item.tags}
                profile={item.profile}
                postId={item.id}
            />
        }else if(item.text){
            post = <TextPost 
                title={item.title}
                text={item.text}
                tags={item.tags}
                profile={item.profile}
                postId={item.id}
            />
        }

        if(index == 0){
            return (
                <View style={{}}>
                    {/* New/Popular/Refresh button */}
                    {topButtons}

                    {post}
                </View>
            );
        }

        if(index == postList.length -1){
            return (
                <View style={{marginBottom: 150}}>
                    {post}
                </View>
            );
        }
        return post;
    };

    return (
        <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
            <Tabs.FlatList
                data={postList}
                renderItem={renderItem}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    darkContainer: {
        flex: 1,
        backgroundColor: "#282828",
        marginTop: 15,
    },
    lightContainer: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        marginTop: 15,
    },
    // Popular button
    lightPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#AAAAAA'
    },
    darkPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#555555'
    },
    lightPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#CCCCCC'
    },
    darkPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#282828',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#444444'
    },
    // New button
    lightNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#AAAAAA'
    },
    darkNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#555555'
    },
    lightNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#BBBBBB'
    },
    darkNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#282828',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1.5,
        borderColor: '#444444'
    },
    lightPopularText: {
        fontSize: 18,
        color: '#555555',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 4
    },
    darkPopularText: {
        fontSize: 18,
        color: '#EEEEEE',
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 4
    },
});
