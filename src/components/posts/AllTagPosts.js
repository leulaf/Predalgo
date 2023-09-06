import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';
import ImagePost from '../postTypes/ImagePost';
import MultiImagePost from '../postTypes/MultiImagePost';
import TextPost from '../postTypes/TextPost';
import GlobalStyles from '../../constants/GlobalStyles';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const renderItem = ({ item, index }) => {
    let post;

    if(item.imageUrl || item.template){
        post = <ImagePost
            username={item.username}
            profilePic={item.profilePic}
            repostProfile={item.repostProfile}
            repostComment={item.repostComment}
            imageUrl={item.imageUrl}
            template={item.template}
            templateUploader={item.templateUploader}
            templateState={item.templateState}
            imageHeight={item.imageHeight}
            imageWidth={item.imageWidth}
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
            username={item.username}
            profilePic={item.profilePic}
            repostProfile={item.repostProfile}
            repostComment={item.repostComment}
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
            username={item.username}
            profilePic={item.profilePic}
            repostProfile={item.repostProfile}
            repostComment={item.repostComment}
            title={item.title}
            text={item.text}
            tags={item.tags}
            profile={item.profile}
            postId={item.id}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
        />
    }

    return post;
};

const itemEquals = (prev, next) => {
    return true
};

const keyExtractor = (item, index) => item.id.toString + "-" + index.toString();

const AllTagPosts = ({ tag }) => {
    if(tag === "" || tag === null){
        return null;
    }
    const navigation = useNavigation();
    const {theme,setTheme} = useContext(ThemeContext);
    const [postList, setPostList] = useState([{id: "fir"}]);
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
    const topButtons = React.memo(() =>
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
    , [newPosts, popularPosts]);
    

    return (
        <View 
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 }]}
        >
            <FlashList
                data={postList}
                extraData={[postList]}

                renderItem={renderItem}

                removeClippedSubviews={true}

                estimatedItemSize={400}
                estimatedListSize={{height: windowHeight, width: windowWidth}}
                
                keyExtractor={keyExtractor}
                
                ListHeaderComponent={topButtons}  // Use ListHeaderComponent to render buttons at the top
                ListFooterComponent={
                    <View style={{height: 200}}/>
                }

                showsVerticalScrollIndicator={false}
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
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkPopularButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#121212',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    lightPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkPopularButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#1F1F1F',
        borderRadius: 20,
        width: 95,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
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
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkNewButtonActive: {
        flexDirection: 'column',
        backgroundColor: '#121212',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#393939'
    },
    lightNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#BBBBBB'
    },
    darkNewButtonInactive: {
        flexDirection: 'column',
        backgroundColor: '#1F1F1F',
        borderRadius: 20,
        width: 70,
        height: 35,
        marginLeft: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#3B3B3B'
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

export default AllTagPosts;