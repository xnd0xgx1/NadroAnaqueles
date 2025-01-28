import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Alert,Platform, ActivityIndicator } from 'react-native';
import { Box, Grid2 } from '@mui/material';
import { Link, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Save from '@/components/utils/Store';


async function getValueFor(key:any) {
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

export default function SubirFotos() {
  const [photos, setPhotos] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);


  const agregarFotoslibrary = async () => {

    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    

    console.log(result);
    if (!result.canceled) {

       const nuevasFotos = result.assets.map((asset) => (asset ));
      setPhotos([...photos, ...nuevasFotos]);

    }
  };


  const agregarFotos = async () => {

    
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar fotos.');
    //   return;
    // }
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsMultipleSelection: true,
    //   quality: 1,
    // });

       // Solicitar permisos para la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara.');
      return;
    }

    // Abrir la cámara
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {

       const nuevasFotos = result.assets.map((asset) => (asset ));
      setPhotos([...photos, ...nuevasFotos]);

    }
  };
  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64.split(",")[1]); // Quita el encabezado de la cadena Base64
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  

  const analizarFotos = async () => {
    // router.push("/Loading");
    setLoading(true);
    try {
      const formdata = new FormData();
      const mostrador = await getValueFor("mostrador") ?? null;
      if(mostrador){
      formdata.append("mostrador", mostrador);
      await Promise.all(photos.map(async (photo: ImagePicker.ImagePickerAsset) => {
        const mimeType = photo.uri.match(/data:(.*?);base64/)?.[1] || "image/jpeg"; // Asumimos que es JPEG si no se puede determinar
        const blob = base64ToBlob(photo.uri, mimeType);
        formdata.append("files", blob, photo.fileName ?? "photo.png");
      }));
      // Aquí implementa la lógica para enviar las fotos al endpoint
      const response = await fetch(import.meta.env.VITE_BASE_URL + "api/uploadimages", {
        method: "POST",
        body: formdata
      });
      
      if (response.ok) {
        Alert.alert("Éxito", "Fotos cargadas correctamente");
        const responseData = await response.json();
        const responseString = JSON.stringify(responseData);
        console.log("String:",responseString);
        
        await Save("images",responseString);
        router.push("/Loading");
      } else {
        setLoading(false);
        Alert.alert("Error", "No se logró cargar las fotos");
      }
    }else{
      setLoading(false);
      Alert.alert("Error", "Hubo un problema al enviar las fotos");
    }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Hubo un problema al enviar las fotos");
    }
  };


  useEffect(() => {

    console.log("Photos: ",photos);
  },[photos]);

  useEffect(() => {
    const checklogin = async () => {
      const user = await getValueFor("user");
      if(user == null){
        router.push("/");
      }

    };
    
   
    checklogin();
  }, []);

  

  return (
    <>
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Fotografías</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.imageContainer}>
        <Grid2 container columns={3} spacing={2}>
         {photos.length <= 0 &&   <Text style={[styles.buttonText, { color: "red" }]}>{"Por favor cargue fotografías"}</Text>}

          {photos && photos.map((photo:any, indx:any) => (
            <Grid2 size={{ sm: 1, xs: 1 }} key={indx}>
              <Image source={{uri:photo.uri}} style={styles.image} />
            </Grid2>
          ))}
        </Grid2>
      </ScrollView>

      <View style={styles.fixedButtons}>
        <Grid2 container columns={2} spacing={2}>
          <Grid2 size={1}>
            <TouchableOpacity style={styles.button2} onPress={agregarFotos}>
              <Text style={[styles.buttonText, { color: "green" }]}>{photos.length > 0 ? "Abrir cámara" : "Cargar desde cámara"}</Text>
            </TouchableOpacity>
          </Grid2>
          <Grid2 size={1}>
            <TouchableOpacity style={styles.button2} onPress={agregarFotoslibrary}>
              <Text style={[styles.buttonText, { color: "green" }]}>{photos.length > 0 ? "Abrir galería" : "Cargar desde galería"}</Text>
            </TouchableOpacity>
          </Grid2>
          <Grid2 size={2}>
            { photos.length > 0  && 
            <TouchableOpacity style={styles.button} onPress={analizarFotos}>
              <Text style={styles.buttonText}>Analizar fotografías</Text>
            </TouchableOpacity> }
           
          </Grid2>
          <Grid2 size={2}>
            {/* <Link href={"/HomeScreen"} style={{ width: "100%" }}> */}
              <TouchableOpacity style={{width:"100%",alignItems:"center"}} onPress={() => router.push("/HomeScreen")}>
                <Text style={{ color: "green", textDecorationLine: "underline" }}>Volver</Text>
              </TouchableOpacity>
            {/* </Link> */}
          </Grid2>
        </Grid2>
      </View>
    </View>
    { loading  && 
      <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="green" />
      </View>
    }
    </>
   
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute', // Posición absoluta para superponerse
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
    zIndex: 1000, // Asegurarse de que esté por encima de otros elementos
  },
  container: { flex: 1, paddingHorizontal: 10 },
  imageContainer: { paddingBottom: 80, backgroundColor: "white" },
  navbar: { padding: 16, backgroundColor: '#fff' },
  navbarText: { fontSize: 14, fontWeight: '400' },
  fixedButtons: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 10 },
  button: { backgroundColor: 'green', borderRadius: 5, paddingVertical: 10, marginVertical: 5, alignItems: 'center', width: "100%" },
  button2: { borderWidth: 1, borderColor: 'green', borderRadius: 5, paddingVertical: 10, marginVertical: 5, alignItems: "center", width: "100%" },
  buttonText: { fontSize: 16, color: '#fff' },
  image: { width: '100%', height: 'auto', aspectRatio: 0.5, resizeMode: "contain", alignSelf: 'center' },
});
