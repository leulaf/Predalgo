// import * as React from 'react';
// import {ThemeProvider} from './context-store/context';
// import {ShowSearchProvider} from './context-store/context';
// import DrawerScreen from './src/screens/DrawerScreen';
// import 'react-native-gesture-handler';

// function App() {
//   return (
//     <ShowSearchProvider>
//       <ThemeProvider>
//         <DrawerScreen />
//       </ThemeProvider>
//     </ShowSearchProvider>
//   );
// }

// export default App;

import * as React from 'react';
import {ThemeProvider} from './context-store/context';
import {ShowSearchProvider} from './context-store/context';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import LogInScreen from './src/screens/LogInScreen';
import DrawerScreen from './src/screens/DrawerScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <ShowSearchProvider>
      <ThemeProvider>
        {/* <DrawerScreen /> */}
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LogIn">
            <Stack.Screen name="LogIn" component={LogInScreen} />
            <Stack.Screen name="Drawer" component={DrawerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </ShowSearchProvider>
  );
}

export default App;