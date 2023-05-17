import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { Feather } from '@expo/vector-icons';
import {firebase, db} from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";


import PredalgoLight from '../../assets/Predalgo_logo_light.svg';
import PredalgoDark from '../../assets/Predalgo_logo_dark.svg';


// light mode icons
import MenuLight from '../../assets/menu_light.svg';
import SettingLight from '../../assets/setting_light.svg';


// dark mode icons
import MenuDark from '../../assets/menu_dark.svg';
import SettingDark from '../../assets/setting_dark.svg';


const windowWidth = Dimensions.get('window').width;


async function getUsername() {
   const docRef = doc(db, "users", firebase.auth().currentUser.uid);
   const docSnap = await getDoc(docRef)
   .catch((error) => {
       console.log("Error getting document:", error);
   })
   .then(() => {
       console.log("Got document" + docSnap.data().username);
   });


   return docSnap.data().username;
}


const MainProfileTop = ({navigation, term, onTermChange, onTermSubmit, openDrawer}) => {
   const {theme,setTheme} = useContext(ThemeContext);
   const {username, setUsername} = useState("");


   useEffect( () => {
       getUsername().then((username) => {
           setUsername(username);
           console.log("username213" + username)
       });
   }, []);


   return <View style={theme == 'light' ? styles.lightContainer : styles.darkContainer}>
      
      
       <TouchableOpacity
               // onPress={() => }
               style={styles.setting}
       >
           <Text style={theme == 'light' ? styles.lightText : styles.darkText}>Account</Text>
          
           {theme == "light" ?
               <SettingLight width={23} height={23}/>
               :
               <SettingDark width={23} height={23}/>
           }
       </TouchableOpacity>


      
   </View>
}


const styles = StyleSheet.create({
   lightContainer: {
       backgroundColor: 'white',
       height: 100,
       flexDirection: 'row',
   },
   darkContainer: {
       backgroundColor: '#1A1A1A',
       height: 100,
       flexDirection: 'row',
   },
   lightText: {
       fontSize: 18,
       color: '#555555',
       fontWeight: '600',
       marginRight: 10,
   },
   darkText: {
       fontSize: 18,
       color: '#eeeeee',
       fontWeight: '600',
       marginRight: 10,
   },
   setting: {
       flexDirection: 'row',
       marginTop: 56,
       marginLeft: windowWidth - 120,
   }
});


export default MainProfileTop;