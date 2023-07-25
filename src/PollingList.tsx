import axios from 'axios';
import React, {useEffect, useState} from 'react';
import debounce from "lodash.debounce";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
type formTypes = {
  navigation: any;
  route: any;
};

type itemType = {
 created_at: string;
 url:string;
 author:string;
 title:string;
 objectID:string;
};

function PollingList({navigation, route}: formTypes): JSX.Element {
  const [pollingData, setPollingData] = useState<itemType[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const getPollingDetails = async () => {
    try{
      console.log(pageNumber,"page number");
      const response = await axios.get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`,
      );
      const data: any= response.data.hits;
      setPollingData([...data,...pollingData]);
    }catch(e:any){
      Alert.alert("Error");
    }
  };

  // const debouncedGetPollingDetails = debounce(getPollingDetails, 1000);
// 
  useEffect(() => {
    // debouncedGetPollingDetails();
    getPollingDetails();
  }, [pageNumber]); 


  const onEndReached = () => {
    console.log(pageNumber,"page number")
    if(pageNumber >49)
    return
    setPageNumber(pageNumber+1);
  }

  const navigateTOJSONPage = (item:any) => {
    navigation.navigate("json-details", {jsonDetails:JSON.stringify(item)});
  }

  const renderItem = ({item, index}: {item:itemType, index:number}) => {
    return (
      <>
      <TouchableOpacity onPress={() => navigateTOJSONPage(item)} testID="navigate-to-json">
         <View style={styles.itemContainer} key={item.objectID}>
          <Text style={{fontSize:16,color:'blue',marginBottom:20}}>Created:{item.created_at}</Text>
        <Text style={styles.capital}>Title:{item.title}</Text>
        <Text style={styles.latitudeLongitude}>
         URL : {item.url}
        </Text>
      </View>
      </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.sectionContainer}>
        <FlatList testID="flatlist" data={pollingData} renderItem={renderItem} keyExtractor={item => item.objectID} 
        onEndReached={debounce(onEndReached,500)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  flatlist:{
    marginBottom : 20,
    backgroundColor: "#fff"
  },
  flatlistItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  itemContainer: {
    marginBottom: 8,
    backgroundColor:'lightgreen'
  },
  capital: {
    fontSize: 18,
    fontWeight: '600',
  },
  latitudeLongitude: {
    fontSize: 16,
    color: 'gray',
  },
  population: {
    fontSize: 16,
  },
  flag: {
    fontSize: 44,
  },
});

export default PollingList;
