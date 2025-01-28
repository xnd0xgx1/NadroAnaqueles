

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default async function Save(key:any, value:any) {
    
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else { // mobile
        await SecureStore.setItemAsync(key, value.toString());
      }
    } catch (error) {
      console.error("Error saving data:", error); 
    }
  }
  

export async function GetValueFor(key:any) {
    try {
      if (Platform.OS === 'web') {
        const result = await AsyncStorage.getItem(key);
        return result;
      } else {
        const result = await SecureStore.getItemAsync(key);
        return result;
      }
    } catch (error) {
      return null;
    }
  }

  