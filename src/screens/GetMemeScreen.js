// import React, {useContext, useState, useEffect,} from 'react';
// import {View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert} from 'react-native';
// import { ScrollView } from 'react-native-virtualized-view';
// import { Overlay } from 'react-native-elements';
// import { db, storage } from '../config/firebase';
// import { collection, addDoc, getDoc, doc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// import firebase from 'firebase/compat/app';

// import uuid from 'react-native-uuid';

// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// import * as ImagePicker from 'expo-image-picker';

// import {ThemeContext} from '../../context-store/context';
// import GlobalStyles from '../constants/GlobalStyles';
// import imgflip from '../api/imgflip';
// import PostBar from '../components/PostBar';
// import AddPostTopBar from '../components/AddPostTopBar';
// import Image from 'react-native-scalable-image';
// import { set } from 'react-native-reanimated';

// import DarkMemeCreate from '../../assets/post_meme_create_dark.svg';
// import LightMemeCreate from '../../assets/post_meme_create_light.svg';

// const ImageContainer = (props) => {    
//     return (
//         <Image 
//             width={200} // this will make image take full width of the device
//             source={props.imageSource} // pass the image source via props
//             style={{borderRadius: 10, marginHorizontal: 3, marginVertical: 6}}
//         />
//     );
// };

// const GetMemeScreen = ({navigation, route}) => {
//     const {theme,setTheme} = useContext(ThemeContext);
    
//     const [leftMemeTemplates, setLeftMemeTemplates] = useState([]);
//     const [rightMemeTemplates, setRightMemeTemplates] = useState([]);

//     const {forCommentOnComment, forCommentOnPost} = route.params;

//     useEffect(() => {
//       getFirstTenTemplates();
//     }, []);

//     const getFirstTenTemplates = async () => {
//         const q = query(
//             collection(db, "imageTemplates"),
//             orderBy("useCount", "desc"),
//             limit(10)
//         );
        
//         await getDocs(q)
//         .then((snapshot) => {
//             let templates = snapshot.docs.map(doc => {
//                 const data = doc.data();
//                 const id = doc.id;
//                 return { id, ...data }
//             })

//             setLeftAndRightMemeTemplates(templates);
//         });
//     };


//     // a function to split the meme templates into two arrays, the left should be odd indexes and the right should be even indexes
//     const setLeftAndRightMemeTemplates = async (memeTemplates) => {
//         let left = [];
//         let right = [];

//         for(let i = 0; i < memeTemplates.length; i++){
//             if(i % 2 == 0){
//                 left.push(memeTemplates[i]);
//             }else{
//                 right.push(memeTemplates[i]);
//             }
//         }

//         setLeftMemeTemplates(left);
//         setRightMemeTemplates(right);
//     };


//     const uploadNewTemplate = async (newTemplateImage, memeName) => {
//       // check if the meme name is unique
//       const q = query(
//           collection(db, "imageTemplates"),
//           where("name", "==", memeName),
//           limit(1)
//       );
      
//       const snapshot = await getDocs(q);

//       if (snapshot.docs.length !== 0) {
//         Alert.alert("Meme with that name already exists. Please choose a different name.");
//         return; // Exit the function immediately
//       }


//       // upload the new template to firebase storage
//       const newResponse = await fetch(newTemplateImage);
//       const newBlob = await newResponse.blob();

//       const newFilename = uuid.v4();
//       const newChildPath = `imageTemplates/${newFilename}`;
      
//       const newStorageRef = ref(storage, newChildPath);
      
//       const newUploadTask = uploadBytesResumable(newStorageRef, newBlob)
//       .catch ((e) => {
//           console.log(e);
//       });

//       await newUploadTask.then(async(snapshot) => {
//           // console.log('Uploaded', snapshot.totalBytes, 'bytes.');
//           // console.log('File metadata:', snapshot.metadata);
          
//           // Let's get a download URL for the file.
//           getDownloadURL(snapshot.ref).then(async (newUrl) => {
//               // console.log(imageUrl);
//               // console.log('File available at', url);
//               await addNewTemplate(newUrl, memeName);
//           }).catch((error) => {
//               console.error('Upload failed', error);
//               // ...
//           });


//       }).catch((error) => {
//           console.error('Upload failed', error);
//           // ...
//       });
//     }

//     const getHeightAndWidth = async (image) => {
//       const manipResult = await manipulateAsync(image, [], {});
//       return {height: manipResult.height, width: manipResult.width};
//     };
    
//     const addNewTemplate = async (newUrl, memeName) => {
//         const userRef = doc(db, "users", firebase.auth().currentUser.uid);
//         const userSnap = await getDoc(userRef);
//         const username = userSnap.data().username;
//         const {height, width} = await getHeightAndWidth(newUrl);
        
//         const addTemplateRef = await addDoc(collection(db, "imageTemplates"), {
//             name: memeName,
//             uploader: username,
//             url: newUrl,
//             height: height,
//             width: width,
//             useCount: 0,
//             creationDate: firebase.firestore.FieldValue.serverTimestamp(),
//         }).then(() => {
//           navigation.navigate('Meme', {memeName: memeName})
//         });

//     }
    
//     // Sets the header to the AddPostTop component
//     useEffect(() => {
//         navigation.setOptions({
//             header: () => <AddPostTopBar />
//         });
//     }, [navigation]);
    
//     // Removes the bottom navigation
//     useEffect(() => {
//       navigation.setOptions({
//         tabBarStyle: {
//           display: "none"
//         }
//       });
//       return () => navigation.getParent()?.setOptions({
//         tabBarStyle: undefined
//       });
//     }, [navigation]);

//     return (
//       <View
//         onTouchStart={e=> this.touchX = e.nativeEvent.pageX}
//         onTouchEnd={e => {
//         if (e.nativeEvent.pageX - this.touchX > 150)
//             // console.log('Swiped Right')
//             navigation.goBack()
//         }}
//         style={styles.container}
//       >
//         <ScrollView style={theme == 'light' ? GlobalStyles.lightContainer : GlobalStyles.darkContainer}>
          

//           <View style={{width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
//               <View style={theme == 'light' ? styles.lightMemeTemplateContainer : styles.darkMemeTemplateContainer}>
//                   <Text style={theme == 'light' ? styles.lightText : styles.darkText}>
//                       Meme Templates
//                   </Text>
//               </View>
//           </View> 

//           {/* left side of meme templates */}
//           <View style={{flexDirection: 'row'}}>
//             <View style={{flex: 1}}>
//               <FlatList
//                 // nestedScrollEnabled={true}
//                 numColumns={1}
//                 data={leftMemeTemplates}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => {
//                   return (
//                     <TouchableOpacity
//                       onPress={() => navigation.navigate('Meme', {memeName: item.name})}
//                     >
//                       <ImageContainer
//                         imageSource={{ uri: item.url }}
//                       />
//                     </TouchableOpacity>
//                   );
//                 }}
//               />
//             </View>

//             {/* right side of meme templates */}
//             <View style={{flex: 1}}>
//               <FlatList
//                 // nestedScrollEnabled={true}
//                 numColumns={1}
//                 data={rightMemeTemplates}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => {
//                   return (
//                     <TouchableOpacity
//                       onPress={() => navigation.navigate('Meme', {memeName: item.name})}
//                     >
//                       <ImageContainer
//                         imageSource={{ uri: item.url }}
//                       />
//                     </TouchableOpacity>
//                   );
//                 }}
//               />
//             </View>
//           </View>

          
//         </ScrollView>

//         {/* Add template button */}
//         <TouchableOpacity
//               style={theme == 'light' ? styles.lightAddTemplateButton : styles.darkAddTemplateButton}
//               onPress={() => 
//                 navigation.navigate("Upload", {
//                   forCommentOnComment: forCommentOnComment,
//                   forCommentOnPost: forCommentOnPost,
//                   forMeme: true
//                 })
//               }
//           >
//             {theme == "light" ?
//                 <LightMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
//                 :
//                 <DarkMemeCreate width={28} height={28} alignSelf={'center'} marginRight={5} marginTop={4}/>
//             }

//             <Text style={theme == 'light' ? styles.lightAddTemplateText : styles.darkAddTemplateText}>
//                 Add meme template
//             </Text>
//         </TouchableOpacity>


//       </View>
//     );
// }

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//   },
//   image: {
//     width: 200,
//     height: 250,
//     marginHorizontal: 3,
//     marginVertical: 5,
//     borderRadius: 10,
//   },
//   lightMemeTemplateContainer: {
//     flexDirection: 'column',
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     // width: 110,
//     height: 40,
//     marginLeft: 5,
//     marginTop: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#C9C9C9'
//   },
//   darkMemeTemplateContainer: {
//     flexDirection: 'column',
//     backgroundColor: '#1A1A1A',
//     borderRadius: 15,
//     // width: 110,
//     height: 40,
//     marginLeft: 5,
//     marginTop: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#484848'
//   },
//   lightText: {
//     fontSize: 22,
//     color: '#444444',
//     fontWeight: "600",
//     alignSelf: 'center',
//     marginHorizontal: 10,
//     marginTop: 5,
//   },
//   darkText: {
//     fontSize: 22,
//     color: '#f2f2f2',
//     fontWeight: "600",
//     alignSelf: 'center',
//     marginHorizontal: 10,
//     marginTop: 5,
//   },
//   lightAddTemplateButton: {
//     width: 245,
//     height: 55,
//     borderRadius: 100,
//     flexDirection: 'row',
//     marginTop: 700,
//     position: 'absolute',
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     borderWidth: 1.5,
//     borderColor: '#DDDDDD'
//   },
//   darkAddTemplateButton: {
//     width: 245,
//     height: 55,
//     borderRadius: 100,
//     flexDirection: 'row',
//     marginTop: 700,
//     position: 'absolute',
//     backgroundColor: '#151515',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     borderWidth: 1.5,
//     borderColor: '#444444'
//   },
//   lightAddTemplateText: {
//       fontSize: 20,
//       color: '#111111',
//       fontWeight: "500",
//       alignSelf: 'center',
//   },
//   darkAddTemplateText: {
//       fontSize: 20,
//       color: '#F0F0F0',
//       fontWeight: "500",
//       alignSelf: 'center',
//   },
//   askText: {
//     fontSize: 20,
//     color: '#222222',
//     fontWeight: "500",
//     alignSelf: 'center',
//     marginTop: 5,
//     marginBottom: 15,
//   },
//   answerButton: {
//       width: 85,
//       height: 50,
//       borderRadius: 100,
//       borderWidth: 2,
//       borderColor: '#AAAAAA',
//       marginLeft: 10,
//       marginTop: 15,
//       marginRight: 40,
//       marginBottom: 20,
//       alignItems: 'center',
//       justifyContent: 'center',
//       alignSelf: 'flex-end',
//   },
//   answerText: {
//       fontSize: 20,
//       color: '#222222',
//       fontWeight: "500",
//       alignSelf: 'center'
//   },
// });

// export default GetMemeScreen;