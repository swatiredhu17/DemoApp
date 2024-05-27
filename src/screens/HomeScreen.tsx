import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView,Button } from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { RFValue } from 'react-native-responsive-fontsize'; 


type RootStackParamList = {
  Home: undefined;
  PropertyDetails: undefined;
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type Property = {
  name: string;
  description: string;
  color: string;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [properties, setProperties] = useState<Property[]>([]);


  const fetchProperties = async () => {
    /* 
    When user enters the screen check 
    if there is any data stored in storage ,
    Yes => add data to local variable
    No => you can hit api(right now, dummy data added)
    */

    const storedProperties = JSON.parse(await AsyncStorage.getItem('properties') || '[]') as Property[];

    if (storedProperties.length === 0) {
      const dummyProperties: Property[] = [
        { name: 'Property Data', description: 'Inspection Report', color: '#D9E8FC' },
        { name: 'Subject Property', description: 'Property\nAddress\nIdentification', color: '#FFD8F4' },
        { name: 'Site Info', description: 'Lot\nSite Features\nOffsite Features\nSite Utilities', color: '#FDE99D' },
        { name: 'Buildings', description: 'Building Details\nExterior Deficiencies\nExterior Updates', color: '#B0E9CA' },
        { name: 'Units', description: 'Unit Details\nUnit Features\nHeating Systems\nCooling Systems\nMechanical Deficiencies\nGarages', color: '#FFEADD' },
        { name: 'Levels', description: 'Level 1', color: '#FCFAD9' },
        { name: 'Rooms', description: 'Room 1', color: '#FFDBE4' },
        { name: 'Ancillary', description: 'Ancillary Details\nAlley\nAppliances\nExterior\nGas', color: '#BFF4FF' },
      ];
      await AsyncStorage.setItem('properties', JSON.stringify(dummyProperties));
      setProperties(dummyProperties);
    } else {
      setProperties(storedProperties);
    }
  };

  useEffect(() => {
    fetchProperties(); // Fetch properties when the component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProperties(); // Fetch properties when the screen is focused
    }, [])
  );

  const renderCategory = ({ item }: { item: Property }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PropertyDetails')
      }}
      style={[styles.card, { backgroundColor: item.color }]}>
    {/*   <Icon name="albums" size={24} color="#4F8EF7" style={styles.icon} />  */}
      <Text style={styles.cardTitle}>{item.name}</Text>
      {/* Render subtitle with line breaks */}
      {item.description.split('\n').map((line, index) => (
        <Text key={index} style={styles.cardSubtitle}>{line}</Text>
      ))}
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
            <Button title="Add Property" onPress={() => navigation.navigate('PropertyDetails')} />

      <FlatList
        data={properties}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    padding: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
  },
  icon: {
    marginBottom: 10, // Adjust icon spacing
  },
  cardTitle: {
    fontSize: 14, // RFValue used for responsive font sizes
    fontWeight: 'bold',
    lineHeight: 20,
    color: '#3F434C'
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#3F434C'
  },
});

export default HomeScreen;
