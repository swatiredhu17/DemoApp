// __tests__/HomeScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mocking useNavigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
  });

  it('should render correctly and fetch properties from storage', async () => {
    const dummyProperties = [
      { name: 'Property Data', description: 'Inspection Report', color: '#D9E8FC' },
      { name: 'Subject Property', description: 'Property\nAddress\nIdentification', color: '#FFD8F4' },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(dummyProperties));

    const { getByText } = render(<HomeScreen navigation={useNavigation()} />);

    await waitFor(() => {
      expect(getByText('Property Data')).toBeTruthy();
      expect(getByText('Inspection Report')).toBeTruthy();
      expect(getByText('Subject Property')).toBeTruthy();
      expect(getByText('Property\nAddress\nIdentification')).toBeTruthy();
    });
  });

  it('should render dummy data if no data in storage', async () => {
    const dummyProperties = [
      { name: 'Property Data', description: 'Inspection Report', color: '#D9E8FC' },
      { name: 'Subject Property', description: 'Property\nAddress\nIdentification', color: '#FFD8F4' },
      { name: 'Site Info', description: 'Lot\nSite Features\nOffsite Features\nSite Utilities', color: '#FDE99D' },
      { name: 'Buildings', description: 'Building Details\nExterior Deficiencies\nExterior Updates', color: '#B0E9CA' },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(<HomeScreen navigation={useNavigation()} />);

    await waitFor(() => {
      dummyProperties.forEach(property => {
        expect(getByText(property.name)).toBeTruthy();
        expect(getByText(property.description.split('\n')[0])).toBeTruthy();
      });
    });
  });

  it('should navigate to PropertyDetails screen when a property is pressed', async () => {
    const dummyProperties = [
      { name: 'Property Data', description: 'Inspection Report', color: '#D9E8FC' },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(dummyProperties));

    const { getByText } = render(<HomeScreen navigation={useNavigation()} />);
    const propertyButton = await waitFor(() => getByText('Property Data'));

    fireEvent.press(propertyButton);

    await waitFor(() => {
      expect(useNavigation().navigate).toHaveBeenCalledWith('PropertyDetails');
    });
  });

  it('should navigate to Add Property screen when Add Property button is pressed', async () => {
    const { getByText } = render(<HomeScreen navigation={useNavigation()} />);
    const addPropertyButton = await waitFor(() => getByText('Add Property'));

    fireEvent.press(addPropertyButton);

    await waitFor(() => {
      expect(useNavigation().navigate).toHaveBeenCalledWith('PropertyDetails');
    });
  });
});
