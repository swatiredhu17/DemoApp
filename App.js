import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Import createMaterialTopTabNavigator
import BuildingsTab from './src/screens/PropertyDetails/BuildingsTab';
import SubjectPropertyTab from './src/screens/PropertyDetails/SubjectPropertyTab';
import SiteInfoTab from './src/screens/PropertyDetails/SiteInfoTab';
import PropertyDataTab from './src/screens/PropertyDetails/PropertyDataTab';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator(); // Create Tab navigator

const PropertyDetailsTabs = () => {
  return (
    <Tab.Navigator>
    
      <Tab.Screen name="Buildings" component={BuildingsTab} />
      <Tab.Screen name="Subject Property" component={SubjectPropertyTab} />
      <Tab.Screen name="Site Info" component={SiteInfoTab} />
      <Tab.Screen name="Property Data " component={PropertyDataTab} />
    </Tab.Navigator>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen
          name="PropertyDetails"
          component={PropertyDetailsTabs} 
          options={{ title: 'Property Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
