import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type Property = {
  name: string;
  color: string;
  description: string;
};

export const saveProperty = async (property: Property, onSuccess: () => void) => {
  try {
    const existingProperties = JSON.parse(await AsyncStorage.getItem('properties') || '[]') as Property[];
    existingProperties.push(property);
    await AsyncStorage.setItem('properties', JSON.stringify(existingProperties));
    Alert.alert('Success', 'Property details saved locally.');
    onSuccess();
  } catch (error) {
    Alert.alert('Error', 'Failed to save property details.');
  }
};
