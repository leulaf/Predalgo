import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {ThemeContext} from '../../context-store/context';
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/actions/index';

// light mode icons
import SettingLight from '../../assets/setting_light.svg';


// dark mode icons
import SettingDark from '../../assets/setting_dark.svg';

import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();
const windowWidth = Dimensions.get('window').width;

const MainProfileTop = (props) => {
    const {theme,setTheme} = useContext(ThemeContext);
    const [username, setUsername] = useState(auth.currentUser.displayName);

   return (
        <View style={theme == 'light' ? styles.lightTopContainer : styles.darkTopContainer}>
            
            <Text style={theme == 'light' ? styles.lightUsernameText : styles.darkUsernameText}>
                    @{username}-9999
                </Text>
            
            {/* Account/Setting button */}
            <TouchableOpacity
                    // onPress={() => }
                    style={styles.setting}
            >
                <Text style={theme == 'light' ? styles.lightAccountText : styles.darkAccountText}>
                    Account
                </Text>
                
                {theme == "light" ?
                    <SettingLight width={23} height={23}/>
                    :
                    <SettingDark width={23} height={23}/>
                }
            </TouchableOpacity>


            
        </View>
   );
}


const styles = StyleSheet.create({
   lightTopContainer: {
       backgroundColor: 'white',
       height: 100,
       flexDirection: 'row',
   },
   darkTopContainer: {
       backgroundColor: '#0C0C0C',
       height: 100,
       flexDirection: 'row',
   },
   lightUsernameText: {
        fontSize: 18,
        color: '#444444',
        fontWeight: '600',
        marginTop: 63,
        marginLeft: 10,
    },
    darkUsernameText: {
        fontSize: 18,
        color: '#dddddd',
        fontWeight: '600',
        marginTop: 63,
        marginLeft: 10,
    },
    lightAccountText: {
        fontSize: 18,
        color: '#444444',
        fontWeight: '600',
        marginRight: 10,
    },
    darkAccountText: {
        fontSize: 18,
        color: '#dddddd',
        fontWeight: '600',
        marginRight: 10,
    },
    setting: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 60,
        marginLeft: 300,
    }
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, null)(MainProfileTop);
