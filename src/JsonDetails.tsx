import axios from 'axios';
import React, { useState , useEffect} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
type formTypes = {
  navigation : any;
  route : any;
}

const JsonDetails = ({navigation,route}:formTypes) => {

  const { jsonDetails  } = route.params;
  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Text testID="json-test">{jsonDetails}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    width:'100%',
    height:"100%"
  }

});


export default JsonDetails;
