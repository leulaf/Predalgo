import React, {useState, useEffect, useContext, useRef} from 'react';
import {TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, TextInput, FlatList, Dimensions, Animated, PanResponder} from 'react-native';
import { firebase, db, storage } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, query, getDocs, orderBy, where, updateDoc, increment } from "firebase/firestore";
import { Tabs } from 'react-native-collapsible-tab-view';
import {ThemeContext} from '../../../context-store/context';
import GlobalStyles from '../../constants/GlobalStyles';

ImageContainer = (props) => {    
    return (
        <Image 
            width={200} // this will make image take full width of the device
            source={props.imageSource} // pass the image source via props
            style={{borderRadius: 10}}
        />
    );
};

export default function AllUserMediaPosts({ userId }){
    const {theme,setTheme} = useContext(ThemeContext);
    const [leftMediaPosts, setLeftMediaPosts] = useState([]);
    const [rightMediaPosts, setRightMediaPosts] = useState([]);

    useEffect(() => {
        fetchPostsByRecent();
    }, []);

    // a function to split the meme templates into two arrays, the left should be odd indexes and the right should be even indexes
    const setLeftAndRightMediaPosts = async (posts) => {
        let left = [];
        let right = [];

        for(let i = 0; i < posts.length; i++){
            if(i % 2 == 0){
                left.push(posts[i]);
            }else{
                right.push(posts[i]);
            }
        }


        setLeftMediaPosts(left);
        setRightMediaPosts(right);
    };

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

    const fetchPostsByRecent = async () => {
        const q = query(
          collection(db, "allPosts"),
          where("profile", "==", userId),
          orderBy("creationDate", "desc")
        );
        const postsSnapshot = await getDocs(q);
      
        const posts = postsSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const id = doc.id;
      
          if (data.repostPostId) {
            // Get the reposted post data
            const repostData = await getRepost(data.repostPostId, data.profile);
            if (repostData && repostData.imageUrl) {
              // Add the reposted post data to the postList array
              return { ...repostData };
            }
          }
      
          if (data.imageUrl) {
            return { id, ...data };
          }
        });
      
        // Wait for all promises to resolve before setting the postList state
        Promise.all(posts).then(async (resolvedPosts) => {
            const filteredPosts = resolvedPosts.filter(post => post !== undefined);
            // console.log("resolvedPosts: ", resolvedPosts);
            await setLeftAndRightMediaPosts(filteredPosts);
        });
      };

      
    const renderMedia = ({ item, index, length }) => {
      // If the item is the last item in the list, add some extra bottom padding
      if (index == length - 1) {
        return (
          <TouchableOpacity
            style={{ marginBottom: 150 }}
          >
            <ImageContainer imageSource={{ uri: item.imageUrl }}  />
          </TouchableOpacity>
        );
      }

      return (
        <TouchableOpacity
          style={{  }}
        >
          <ImageContainer imageSource={{ uri: item.imageUrl }} />
        </TouchableOpacity>
      );
    };
    
    return (
      <Tabs.ScrollView
        style={theme == 'light' ? styles.lightContainer : styles.darkContainer}
      >
        <View style={{ flexDirection: "row" }}>
          {/* left side of images */}
          <View style={{ flex: 1 }}>
            <FlatList
              numColumns={1}
              data={leftMediaPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  renderMedia({ item, index, length: leftMediaPosts.length })
                );
              }}
            />
          </View>

          {/* right side of images */}
          <View style={{ flex: 1 }}>
            <FlatList
              numColumns={1}
              data={rightMediaPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  renderMedia({ item, index, length: rightMediaPosts.length })
                );
              }}
            />
          </View>
        </View>
      </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    darkContainer: {
        backgroundColor: "#282828",
        marginTop: 15,
    },
    lightContainer: {
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
        borderColor: '#4b4b4b'
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
        borderColor: '#4b4b4b'
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
