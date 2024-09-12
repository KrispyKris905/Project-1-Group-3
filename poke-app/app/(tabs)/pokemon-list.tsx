import React, {useEffect} from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const DATA = [
    {
        id: '35',
        title:"clefairy",
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
  ];

  type ItemProps = {title: string};

  const Item = ({title}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

export default function ListScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    // Initialize the database when the component is mounted
    
  }, []);
    
  return (
    <SafeAreaView style={styles.container}>
        {/* <Button title="Fetch Pokemon" onPress={fetchPokemon} /> */}
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: "#FFC0CB",
  }
});