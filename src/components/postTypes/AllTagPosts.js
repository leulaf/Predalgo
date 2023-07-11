import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import GlobalStyles from '../../constants/GlobalStyles';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function AllTagPosts({ tag }){
    if(tag === "" || tag === null){
        return null;
    }
    const {theme,setTheme} = useContext(ThemeContext);
    const [postList, setPostList] = useState([]);
    const [newPosts, setNewPosts] = useState(true);
    const [popularPosts, setPopularPosts] = useState(false);

    useEffect(() => {

        fetchPostsByRecent();
    }, []);

    const getRepost = async(repostPostId, profile) => {
        const repostRef = doc(db, 'allPosts', repostPostId);
        const repostSnapshot = await getDoc(repostRef);
    
        if(repostSnapshot.exists){
            const repostData = repostSnapshot.data();
            const id = repostSnapshot.id;
            const repostProfile = profile;
    
            // Return the reposted post data along with the original post data
            return { id, repostProfile, ...repostData }
        }else{
            return;
        }
    }


    const fetchPostsByRecent = async() => {
        const q = query(collection(db, "allPosts"), 
            where("tags", "array-contains", tag), 
            orderBy("creationDate", "desc")
        );
        
        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const id = doc.id;

            if(data.repostPostId){
                // Get the reposted post data
                const repostData = await getRepost(data.repostPostId, data.profile);
                if(repostData){
                    // Add the reposted post data to the postList array
                    return { ...repostData }
                }
            }
            
            return { id, ...data }
        });
            
    
        // Wait for all promises to resolve before setting the postList state

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);
        setPostList(resolvedPosts);
    }
    
    const fetchPostsByPopular = async() => {
        const q = query(collection(db, "allPosts"), 
            where("tags", "array-contains", tag), 
            orderBy("likesCount", "desc")
        );
    
        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const id = doc.id;

            if(data.repostPostId){
                // Get the reposted post data
                const repostData = await getRepost(data.repostPostId, data.profile);
                if(repostData){
                    // Add the reposted post data to the postList array
                    return { ...repostData }
                }
            }
            
            return { id, ...data }
        });
            
    
        // Wait for all promises to resolve before setting the postList state

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);
        setPostList(resolvedPosts);
    }

    {/* New/Popular/Refresh button */}
    const topButtons = (
        <View style={{flexDirection: 'row', marginBottom: 7, marginTop: 10}}>
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
    );

    const renderItem = ({ item, index }) => {
        let post;

        if(item.imageUrl){
            post = <ImagePost
                key={index}
                repostProfile={item.repostProfile ? item.repostProfile : null}
                imageUrl={item.imageUrl}
                title={item.title}
                tags={item.tags}
                memeName={item.memeName}
                profile={item.profile}
                postId={item.id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
        }else if(item.imageUrls){
            post = <MultiImagePost
                key={item.repostProfile ? item.id + "1" : item.id}
                repostProfile={item.repostProfile ? item.repostProfile : null}
                title={item.title}
                imageUrls={item.imageUrls}
                tags={item.tags}
                profile={item.profile}
                postId={item.id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
        }else if(item.text){
            post = <TextPost
                key={item.repostProfile ? item.id + "1" : item.id}
                repostProfile={item.repostProfile ? item.repostProfile : null}
                title={item.title}
                text={item.text}
                tags={item.tags}
                profile={item.profile}
                postId={item.id}
                likesCount={item.likesCount}
                commentsCount={item.commentsCount}
            />
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
        <View style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
            <FlatList
                data={postList}
                keyExtractor={(result) => result.id}
                ListHeaderComponent={topButtons}  // Use ListHeaderComponent to render buttons at the top
                renderItem={({ item, index }) => {
                    return (
                        renderItem({ item, index })
                    );
                }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    darkContainer: {
        flex: 1,
        backgroundColor: "#282828",
    },
    lightContainer: {
        flex: 1,
        backgroundColor: "#F6F6F6",
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
        borderColor: '#BBBBBB'
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
        borderColor: '#494949'
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
        borderColor: '#3f3f3f'
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
        borderColor: '#BBBBBB'
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
        borderColor: '#494949'
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
        borderColor: '#3f3f3f'
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
