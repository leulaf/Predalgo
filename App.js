import React, {Component, useContext, useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import {ThemeProvider} from './context-store/context';
import {ShowSearchProvider} from './context-store/context';
import {AuthenticatedUserProvider} from './context-store/context';
import {AuthenticatedUserContext} from './context-store/context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import AuthScreen from './src/screens/AuthScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import Firebase from './src/config/firebase';
const Stack = createStackNavigator();

const auth = Firebase.auth();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render () {
    const { loggedIn, loaded } = this.state;
    if (!loaded) return null;

    if(!loggedIn) {
      return(
        <AuthenticatedUserProvider>
          <ShowSearchProvider>
            <ThemeProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LogIn">
                  <Stack.Screen name="Drawer" component={DrawerScreen} />
                  <Stack.Screen name="LogIn" component={AuthScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          </ShowSearchProvider>
        </AuthenticatedUserProvider>
      );
    } else {
      return(
        <AuthenticatedUserProvider>
          <ShowSearchProvider>
            <ThemeProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Drawer">
                  <Stack.Screen name="Drawer" component={DrawerScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          </ShowSearchProvider>
        </AuthenticatedUserProvider>
      );
    }

    
  }
}

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     // Adding listener for firebase auth
//     const unsubscribe = auth.onAuthStateChanged((currUser) => {
//       if (currUser) {
//         setUser(currUser);
//         setLoggedIn(true);
//       } else {
//         console.log('user not logged in')
//         setLoggedIn(false);
//       }
//     });

//     return unsubscribe
//   }, [])

//   if(!loggedIn) {
//     return <AuthenticatedUserProvider>
//       <ShowSearchProvider>
//         <ThemeProvider>
//           <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LogIn">
//               <Stack.Screen name="Drawer" component={DrawerScreen} />
//               <Stack.Screen name="LogIn" component={AuthScreen} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </ThemeProvider>
//       </ShowSearchProvider>
//     </AuthenticatedUserProvider>
//   } else {
//     return <AuthenticatedUserProvider>
//       <ShowSearchProvider>
//         <ThemeProvider>
//           <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Drawer">
//               <Stack.Screen name="Drawer" component={DrawerScreen} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </ThemeProvider>
//       </ShowSearchProvider>
//     </AuthenticatedUserProvider>
//   }
// }
export default App;