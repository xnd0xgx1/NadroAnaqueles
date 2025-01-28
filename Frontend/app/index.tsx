import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Box } from '@mui/material';
import Save from '@/components/utils/Store';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setloading(true);
    try {
      // Aquí puedes ajustar el endpoint de autenticación

      const myHeaders = new Headers();
      myHeaders.append("x-api-version", "1.0");

      const urlencoded = new URLSearchParams();
      urlencoded.append("codigoDeEmpleado", username);
      urlencoded.append("codigoDeAcceso", password);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ "codigoDeEmpleado":username,"codigoDeAcceso": password }),
      };
      const response = await fetch(import.meta.env.VITE_BASE_URL + 'api/Login', requestOptions);
      setloading(false)
      if (response.status === 200) {
        await Save("user",username)
        router.push('/HomeScreen');
      } else {
        setErrorModalVisible(true);
      }
      
    } catch (error) {
      setloading(false)
      console.error("Error al iniciar sesión:", error);
      setErrorModalVisible(true);
    }
  };

  return (
    <Box width={"100vw"} height={"100vh"}  alignItems={"center"} justifyContent={"center"} justifyItems={"center"}>
      <Image
        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-CWdMm6EnIe8XQIsSy9lNFaYcrSgbNh.png' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <View >
        <Text style={styles.subtitle}>Aplicativo para la optimización y análisis de mostradores</Text>
      </View>
       <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu número de empleado"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Codigo de acceso"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
         <Box width={"100%"} display={"flex"} alignItems={"center"} justifyItems={"center"} sx={{
            background: "linear-gradient(90deg, #54823B 0%, #449E14 100%)"
          }}  height={"100%"} padding={2} borderRadius={3} >
          {loading ? 
          <View style={{width:"100%",justifyContent:"center"}}>
            <ActivityIndicator size={"small"} color={"white"}/>
          </View>
          : <Text style={styles.loginButtonText}>Iniciar sesión</Text>}
          
        </Box>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Error al iniciar sesión. Verifique sus credenciales.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorModalVisible(false)}
            >
             
                <Text style={styles.modalButtonText}>Cerrar</Text>
        
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>

      <Image
        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/elementosmedicos-Me8T2xie25F7fcMXS6vsk8Jb7MAVgE.png' }}
        style={styles.medicalItems}
        resizeMode="contain"
      /> 
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    width: "50%",
    height: "auto",
    aspectRatio:1,
    marginBottom:"-20%"
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: "30%",
    color: '#333',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: 'green',
    width: '90%',
    alignItems: 'center'

  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width:"100%",
    textAlign:"center",
  },
  medicalItems: {
    width: "auto",
    height: "35%",
    // maxHeight:"30%",
    aspectRatio:0.7,
    position: 'absolute',
    bottom: 20,
    right: -20,
    marginRight:20,
    resizeMode:"contain",
    zIndex:-9999,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});