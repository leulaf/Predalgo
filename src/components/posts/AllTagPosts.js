import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, RefreshControl, Dimensions} from 'react-native';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, startAfter, updateDoc, increment } from "firebase/firestore";
import {ThemeContext} from '../../../context-store/context';
import ImagePost from '../postTypes/ImagePost';
import MultiImagePost from '../postTypes/MultiImagePost';
import TextPost from '../postTypes/TextPost';
import GlobalStyles from '../../constants/GlobalStyles';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useNavigation } from '@react-navigation/native';
import TagScreenTopBar from '../../ScreenTop/TagScreenTopBar';

import { FlashList } from '@shopify/flash-list';


const refreshAnimation = require('../../../assets/animations/Refreshing.json');
const refreshingHeight = 100;

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const renderItem = ({ item, index }) => {
    let post;

    if(item.imageUrl || item.template){
        // console.log("here")
        post = <ImagePost
            username={item.username}
            profilePic={item.profilePic}
            reposterUsername={item.reposterUsername}
            reposterProfilePic={item.reposterProfilePic}
            reposterProfile={item.reposterProfile}
            repostComment={item.repostComment}
            imageUrl={item.imageUrl}
            template={item.template}
            imageHeight={item.imageHeight}
            imageWidth={item.imageWidth}
            templateUploader={item.templateUploader}
            templateState={item.templateState}
            text={item.text}
            title={item.title}
            tags={item.tags}
            memeName={item.memeName}
            profile={item.profile}
            repostId={item.repostId}
            postId={item.id}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            repostsCount={item.repostsCount}
        />
    }else if(item.imageUrls){
        post = <MultiImagePost
            username={item.username}
            profilePic={item.profilePic}
            reposterUsername={item.reposterUsername}
            reposterProfilePic={item.reposterProfilePic}
            reposterProfile={item.reposterProfile}
            repostComment={item.repostComment}
            title={item.title}
            imageUrls={item.imageUrls}
            tags={item.tags}
            profile={item.profile}
            repostId={item.repostId}
            postId={item.id}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            repostsCount={item.repostsCount}
        />
    }else if(item.text){
        post = <TextPost
            username={item.username}
            profilePic={item.profilePic}
            reposterUsername={item.reposterUsername}
            reposterProfilePic={item.reposterProfilePic}
            reposterProfile={item.reposterProfile}
            repostComment={item.repostComment}
            title={item.title}
            text={item.text}
            tags={item.tags}
            profile={item.profile}
            repostId={item.repostId}
            postId={item.id}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            repostsCount={item.repostsCount}
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
    const [newPosts, setNewPosts] = useState(true);
    const [popularPosts, setPopularPosts] = useState(false);
    const [newPostsList, setNewPostsList] = useState([{id: "fir"}]);
    const [popularPostsList, setPopularPostsList] = useState([{id: "fir"}]);

    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const refreshViewRef = React.useRef(null);

    // Used for tracking the scroll to make the refresh animation work correctly
    const [offsetY, setOffsetY] = React.useState(0);


    React.useEffect(() => {

        fetchPostsByRecent();
    }, []);


    React.useEffect(() => {
        if (isRefreshing) {
        //   setExtraPaddingTop(true);

          refreshViewRef.current.play();
        } else {
        //   setExtraPaddingTop(false);
        }
    }, [isRefreshing]);


    function onScroll(event) {
        const { nativeEvent } = event;
        const { contentOffset } = nativeEvent;
        const { y } = contentOffset;
        setOffsetY(y);
    }

    const getRepost = async(repostedPostId, reposterProfile, reposterUsername, reposterProfilePic, repostId) => {

        const repostRef = doc(db, 'allPosts', repostedPostId);
        const repostSnapshot = await getDoc(repostRef);
    
        if(repostSnapshot.exists()){
            const repostData = repostSnapshot.data();
            const id = repostedPostId;
    
            // Return the reposted post data along with the original post data
            return { id, repostId, reposterProfile, reposterUsername, reposterProfilePic, ...repostData }
        }else{
           deletePost(repostId);
        }
    }


    const fetchPostsByRecent = async() => {
        let q

        if(newPostsList[0].id == "fir"){
            q = query(collection(db, "allPosts"), 
                where("tags", "array-contains", tag), 
                orderBy("creationDate", "desc")
            );
        }else{
            const lastPost = newPostsList[newPostsList.length - 1];

            q = query(collection(db, "allPosts"), 
                where("tags", "array-contains", tag), 
                orderBy("creationDate", "desc"),
                startAfter(lastPost.snap)
            );
        }
        
        const snapshot = await getDocs(q);

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(data.repostPostId){
                // Get the reposted post data
                const repostData = await getRepost(data.repostedPostId, data.profile, data.username, data.profilePic, id);
                if(repostData){
                    // Add the reposted post data to the postList array
                    return { ...repostData }
                }
            }
            
            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });
            
    
        // Wait for all promises to resolve before setting the postList state

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        if(newPostsList[0].id == "fir"){
            setNewPostsList(resolvedPosts);
            return true;
        }else{
            newPostsList[newPostsList.length - 1].snap = null;
            setNewPostsList([...newPostsList, ...resolvedPosts]);
            return true;
        }
    }
    
    const fetchPostsByPopular = async() => {
        let q

        if(popularPostsList[0].id == "fir"){
            q = query(collection(db, "allPosts"), 
                where("tags", "array-contains", tag), 
                orderBy("likesCount", "desc")
            );
        }else{
            const lastPost = popularPostsList[popularPostsList.length - 1];

            q = query(collection(db, "allPosts"), 
                where("tags", "array-contains", tag), 
                orderBy("likesCount", "desc"),
                startAfter(lastPost.snap)
            );
        }
    
        const snapshot = await getDocs(q)

        const posts = snapshot.docs.map(async (doc, index) => {
            const data = doc.data();
            const id = doc.id;

            if(data.repostPostId){
                // Get the reposted post data
                const repostData = await getRepost(data.repostedPostId, data.profile, data.username, data.profilePic, id);
                if(repostData){
                    // Add the reposted post data to the postList array
                    return { ...repostData }
                }
            }
            
            if(index == snapshot.docs.length - 1){
                return { id, snap: doc, ...data, index };
            }

            return { id, ...data, index };
        });
            
    
        // Wait for all promises to resolve before setting the postList state

        // Wait for all promises to resolve before returning the resolved posts
        const resolvedPosts = await Promise.all(posts);

        if(popularPostsList[0].id == "fir"){
            setPopularPostsList(resolvedPosts);
            return true;
        }else{
            popularPostsList[popularPostsList.length - 1].snap = null;
            setPopularPostsList([...popularPostsList, ...resolvedPosts]);
            return true;
        }

    }

    {/* New/Popular/Refresh button */}
    const filterButtons = React.memo(() =>
        <View style={[{backgroundColor: theme == 'light' ? 'white' : '#151515'},
            isRefreshing ?
                {
                    marginTop: 30, 
                    backgroundColor: theme == 'light' ? 'white' : '#151515'
                }
            :
                {}
        ]}>
            <TagScreenTopBar tag={tag} theme={theme} navigation={navigation}/>

            <View style={{flexDirection: 'row', marginBottom: 15, marginTop: 15}}>


                {/* New button */}
                <TouchableOpacity
                    style={[
                        theme == 'light' ? 
                            newPosts ? styles.lightActiveButton : styles.lightInactiveButton
                        : 
                            newPosts ? styles.darkActiveButton : styles.darkInactiveButton
                        ,
                        {marginHorizontal: 10}
                    ]}
                    onPress={
                        !newPosts ?

                            () => { 
                                setNewPosts(true);
                                setPopularPosts(false);
                                fetchPostsByRecent(); 
                            }
                        :
                            () => {}
                    }
                >
                    <Text 
                        style={theme == 'light' ? 
                            newPosts ? styles.lightActiveFilterText : styles.lightInactiveFilterText
                        : 
                            newPosts ? styles.darkActiveFilterText : styles.darkInactiveFilterText
                        }
                    >
                        New
                    </Text>
                </TouchableOpacity>


                {/* Popular button */}
                <TouchableOpacity
                    style={
                        theme == 'light' ? 
                            popularPosts ? styles.lightActiveButton : styles.lightInactiveButton
                        : 
                            popularPosts ? styles.darkActiveButton : styles.darkInactiveButton
                    }
                    onPress={
                        !popularPosts ?

                            () => { 
                                setPopularPosts(true);
                                setNewPosts(false);
                                fetchPostsByPopular(); 
                            }
                        :
                            () => {}
                    }
                >
                    <Text 
                        style={theme == 'light' ? 
                            popularPosts ? styles.lightActiveFilterText : styles.lightInactiveFilterText
                        : 
                            popularPosts ? styles.darkActiveFilterText : styles.darkInactiveFilterText
                        }
                    >
                        Popular
                    </Text>
                </TouchableOpacity>

                
            </View>
        </View>
        
    , [newPosts, popularPosts, isRefreshing, theme]);
    

    return (
        <View 
            style={[theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer, { flex: 1 },
            // isRefreshing ?
            //     {
            //         backgroundColor: theme == 'light' ? 'white' : '#151515'
            //     }
            // :
            //     { }
        
        ]}
        >

            <View style={{height: Constants.statusBarHeight-5, backgroundColor: theme == 'light' ? 'white' : '#151515'}}/>

            {/* Refresh animation */}
            {
                offsetY < 0 && <LottieView
                    ref={refreshViewRef}
                    autoPlay
                    style={[styles.lottieView]}
                    source={refreshAnimation}
                    // progress={progress}
                    colorFilters={[
                        { keypath: "Path", 
                            color: theme == 'light' ? "#005fff" : "#FFF" },
                    ]}
                />
            }

            <FlashList
                data={newPosts ? newPostsList : popularPostsList}
                // extraData={[newPosts, popularPosts]}

                renderItem={renderItem}

                removeClippedSubviews={true}

                estimatedItemSize={400}
                estimatedListSize={{height: windowHeight, width: windowWidth}}
                
                keyExtractor={keyExtractor}
                
                ListHeaderComponent={filterButtons}  // Use ListHeaderComponent to render buttons at the top
                ListFooterComponent={
                    <View style={{height: 200}}/>
                }

                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            setIsRefreshing(true);

                            if(newPosts){
                                fetchPostsByRecent().then(() => {
                                    setIsRefreshing(false);
                                });
                            }else if(popularPosts){
                                fetchPostsByPopular().then(() => {
                                    setIsRefreshing(false);
                                });
                            }
                        }}
                        // progressViewOffset={progress}
                        tintColor={'rgba(255, 255, 255, 0.0)'}
                        // progressViewOffset={0}
                    />
                }

                onScroll={onScroll}

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
    // lightMainContainer: {
    //     flex: 1,
    //     backgroundColor: '#F4F4F4',
    // },
    // darkMainContainer: {
    //     flex: 1,
    //     // backgroundColor: '#0C0C0C',
    //     backgroundColor: '#000000',
    // },
    lottieView: {
        height: refreshingHeight,
        position: 'absolute',
        top: 10,
        left: 0,
        right: 9,
    },
    lightActiveButton: {
        flexDirection: 'column',
        backgroundColor: '#000',
        borderRadius: 20,
        width: 'auto',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 5,
        // marginBottom: 5,
    },
    lightInactiveButton: {
        flexDirection: 'column',
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        width: 'auto',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 5,
        // marginBottom: 5,
        // borderWidth: 1,
        // borderColor: '#BBBBBB'
    },
    darkActiveButton: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 'auto',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 5,
        // marginBottom: 5,
        // borderWidth: 1,
        // borderColor: '#393939'
    },
    darkInactiveButton: {
        flexDirection: 'column',
        backgroundColor: '#3d3d3d',
        borderRadius: 20,
        width: 'auto',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft: 5,
        // marginBottom: 5,
    },
    lightActiveFilterText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: "600",
        marginHorizontal: 15,
        marginBottom: 1
    },
    darkActiveFilterText: {
        fontSize: 18,
        color: '#000',
        fontWeight: "600",
        marginHorizontal: 15,
        marginBottom: 1
    },
    lightInactiveFilterText: {
        fontSize: 18,
        color: '#444444',
        fontWeight: "600",
        marginHorizontal: 15,
        marginBottom: 1
    },
    darkInactiveFilterText: {
        fontSize: 18,
        color: '#F4F4F4',
        fontWeight: "600",
        marginHorizontal: 15,
        marginBottom: 1
    },
});

export default AllTagPosts;