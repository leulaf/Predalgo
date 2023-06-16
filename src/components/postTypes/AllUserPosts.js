import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions} from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Tabs } from 'react-native-collapsible-tab-view'
import {ThemeContext} from '../../../context-store/context';
import ImagePost from './ImagePost';
import MultiImagePost from './MultiImagePost';
import TextPost from './TextPost';
import GlobalStyles from '../../constants/GlobalStyles';

const { height: windowHeight, width: windowWidth} = Dimensions.get("window");

const boxHeight = windowHeight / 2;

export default function AllUserPosts({navigation, posts}){
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    const {theme,setTheme} = useContext(ThemeContext);

    const [postList, setPostList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const newPostList = [];
            for (let item of posts) {
                const docRef = doc(db, "allPosts", item.refId);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                data.refId = item.refId;
                data.id = item.id;
                
                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                    newPostList.push(data);
                } else {
                    // console.log("No such document!");
                }
            }
            setPostList(newPostList);
        };

        fetchData();
    }, [posts]);

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
                postId={item.refId}
                userPostId={item.id}
            />
        }else if(item.imageUrls){
            post = <MultiImagePost
                key={index}
                title={item.title}
                imageUrls={item.imageUrls}
                tags={item.tags}
                profile={item.profile}
                postId={item.refId}
                userPostId={item.id}
            />
        }else if(item.text){
            post = <TextPost 
                title={item.title}
                text={item.text}
                tags={item.tags}
                profile={item.profile}
                postId={item.refId}
                userPostId={item.id}
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
        marginTop: 25,
    },
    lightContainer: {
        flex: 1,
        backgroundColor: "#F6F6F6",
        marginTop: 25,
    },
});
