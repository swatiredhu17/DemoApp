import axios from 'axios';

const API_URL = 'url-here';

type Property = {
    name: string;
    color: string;
    description: string;
  };

export const savePropertyToBackend = async (propertyDetails: Property) => {
  try {
    await axios.post(API_URL, { details: propertyDetails });
  } catch (error) {
    console.error('Failed to save data to backend', error);
    throw error; 
  }
};

export const syncLocalPropertyData = async (localData: Property[]) => {
  try {
    await axios.post(API_URL, { details: localData });
  } catch (error) {
    console.error('Failed to sync data with backend', error);
    throw error; 
  }
};