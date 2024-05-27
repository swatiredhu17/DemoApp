import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { saveProperty } from '../../utils/storageUtils';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePropertyToBackend, syncLocalPropertyData } from '../../services/apiService';

type RootStackParamList = {
  Home: undefined;
  BuildingsTab: undefined;
};

type BuildingsTabScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BuildingsTab'
>;

type BuildingsTabScreenRouteProp = RouteProp<RootStackParamList, 'BuildingsTab'>;

type Props = {
  navigation: BuildingsTabScreenNavigationProp;
  route: BuildingsTabScreenRouteProp;
};

type Property = {
  name: string;
  color: string;
  description: string;
};

const BuildingsTab: React.FC<Props> = ({ navigation }) => {
  const [property, setProperty] = useState<Property>({
    name: '',
    color: '#FFDBE4',
    description: '',
  });

  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      return setIsConnected(state.isConnected ? state.isConnected : false);
    });
  }, []);

  const handleChange = (name: keyof Property, value: string) => {
    setProperty({ ...property, [name]: value });
  };

  const handleSubmit = async () => {
    saveData()
  };

  const saveData = async () => {
    if (isConnected) {
      // send data to the backend
      try {
        await savePropertyToBackend(property);
      } catch (error) {
        console.error('Failed to save data to backend', error);
      }
    } else {
      // save data locally
      saveProperty(property, () => navigation.navigate('Home'));
    }
  };

  const syncData = async () => {
    const storedProperties = JSON.parse(await AsyncStorage.getItem('properties') || '[]') as Property[];
    if (storedProperties && isConnected) {
      try {
        await syncLocalPropertyData(storedProperties);
        await AsyncStorage.removeItem('properties');
      } catch (error) {
        // Handle the error if needed
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      syncData();
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Property Name</Text>
      <TextInput
        style={styles.input}
        value={property.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={property.description}
        onChangeText={(text) => handleChange('description', text)}
      />
      <Button title="Save Property" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
  },
});

export default BuildingsTab;
