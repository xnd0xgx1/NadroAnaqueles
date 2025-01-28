import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,Image, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Grid2 } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { es } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, router, useRouter } from 'expo-router';
import Save, { GetValueFor } from '@/components/utils/Store';
import DeleteIcon from '@mui/icons-material/Delete';


const HistoryItem = ({id, Fecha, Nombre_Mostrador, Direccion, PInvenadro, Resultados,Status} : {id:any,Fecha:any,Nombre_Mostrador:any,Direccion:any,PInvenadro:any,Resultados:any,Status:any}) => {

  let image = require('@/assets/images/Home/Anaquelgreen.png');
  const date = new Date(Fecha);
  // Formateo de fecha
  const day = date.getDate(); // Día como número
  const month = date.toLocaleString('es-CO', { month: 'short' }).toUpperCase(); // Mes como tres letras
  const hour = date.toLocaleTimeString('es-CO', { hour: 'numeric', hour12: true }).toLowerCase(); // Hora en formato 12 horas
  if(PInvenadro >= 90){
    image = require('@/assets/images/Home/Anaquelgreen.png');
  }else if(PInvenadro > 40 && PInvenadro <90){
    image =  require('@/assets/images/Home/AnaquelYellow.png')
  }else{
    image =  require('@/assets/images/Home/Anaquelred.png');
  }

  const showdetails = async () => {
    // console.log("Resultados: ",Resultados);
    await Save("resultados",id);
    await Save("images","['']");
    router.push("/Details");
    

  };



  const borraritem = async () =>{
    const urlBase = `https://func-anaqueles-inteligentes-back.azurewebsites.net/api/DeleteAnalisis?id=${id}`;
    let url = urlBase;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      router.push("/HomeScreen");
    } catch (err) {
     alert(err);
    }

  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas borrar esto?");
  
  if (confirmDelete) {
    console.log("Elemento borrado.");
    borraritem();

  }
    

  };


  return(
  <TouchableOpacity style={styles.historyItem} onPress={showdetails}>
    <Grid2 container columns={7} rowSpacing={2}>
      <Grid2  size={1}>
       <View style={{ flexDirection: 'column',  alignItems: 'flex-start', width: '100%', justifyContent:"center",height:"100%"}}>
              <View style={{ flexDirection: 'row', alignItems:"center"}}>
                          <Text style={[styles.statPercentage, { fontWeight:"700" }]}>{day} </Text>
                          <Text style={[styles.statPercentage, { fontSize: 14}]}>{month}</Text>
                </View>
                  <Text style={[styles.statPercentage, { fontSize: 12}]}>{hour}</Text>
        </View>
      </Grid2>
      <Grid2 size={1}>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1}} />
      </Grid2>
      {/* <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} /> */}
      <Grid2 size={5}>
        <View>
          <Text style={styles.historyCounter}>{Nombre_Mostrador}</Text>
          <Text style={styles.historyAddress}>{Direccion}</Text>
        </View>
      </Grid2>
      {/* <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} /> */}
      <Grid2 size={1}>
          
      </Grid2>
      <Grid2 size={1}>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1}} />
      </Grid2>
      <Grid2 size={5} >
      <View style={{ flexDirection:"row", alignItems: 'flex-start', width: '100%'}}>
        <View style={{ alignItems: 'flex-start', width: '100%', marginRight:10}}>
            <Text style={[styles.statPercentage, { fontSize: 14}]}>Estatus: </Text>
            <Text style={styles.historyCounter}>{Status}</Text>
        </View>
      </View>
      
    </Grid2>
    <Grid2 size={1}>
      </Grid2>
    <Grid2 size={1}>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1}} />
      </Grid2>
    
      {Status == "Listo" &&
      <>
      {/* <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} /> */}
      <Grid2 size={5} >
        <View style={{ flexDirection:"row", alignItems: 'flex-start', width: '100%'}}>
          <View style={{ alignItems: 'flex-start', width: '100%', marginRight:10}}>
            <Text style={styles.percentageText}>% invenadro</Text>
            <Text style={styles.historyCounter}>{PInvenadro}%</Text>
          </View>
        </View>
   
      </Grid2>
      <Grid2 size={1}>
      </Grid2>
    <Grid2 size={1}>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1}} />
      </Grid2>
      <Grid2 size={5}
      >
      
      <View style={{backgroundColor:"white",width:"100%",height:"100%",justifyContent:"center",alignItems:"flex-start"}}>
            <Image
              source={image}
              style={{width:30,height:40}}
            />
          </View>
      </Grid2>
      <Grid2 size={1}>
      </Grid2>
    <Grid2 size={1}>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1}} />
      </Grid2>
      <Grid2 size={5}
      alignItems={"flex-start"}
      flexDirection={"row"}
      alignContent={"center"}
      >
      
      
      <TouchableOpacity  style={{alignItems:"flex-start",width:"100%"}} onPress={() => handleDelete()}>
            <DeleteIcon sx={{color:"red"}}/>
          </TouchableOpacity>
    </Grid2>
    </>
      }
      
      
    </Grid2>
   
    
  </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [selectedCounter, setSelectedCounter] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  // Parámetros dinámicos
  
  const [mostrador, setMostrador] = useState<string>("Todos"); // Mostrador por defecto
  const [mostradores, setmostradores] = useState<string[]>([]);
  const [pinvenadro, setPinvenadro] = useState<string>("Todos"); // PIN por defecto
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [estadisticas, setestadisticas] = useState<any>([]);


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mes, setMes] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0')); // Mes por defecto
  const [anio, setAnio] = useState<string>((new Date().getFullYear()).toString()); // Año por defecto
  const handleDateChange = (date:any) => {

    setSelectedDate(date);

    // Extraer mes y año de la fecha seleccionada
    const month = date.getMonth() + 1; // getMonth() devuelve 0 para enero, por eso sumamos 1
    const year = date.getFullYear();

    setMes(month.toString().padStart(2, '0')); // Asegura que el mes tenga 2 dígitos
    setAnio(year.toString()); // El año ya es una cadena
  };


  const getData = async () => {
    
    const urlBase = `https://func-anaqueles-inteligentes-back.azurewebsites.net/api/Historial?mes=${mes}&anio=${anio}&user=${await GetValueFor("user")}`;
    let url = urlBase;

    if (mostrador && mostrador !== "Todos") {
      // Solo añadir el parámetro mostrador si no es "Todos"
      url += `&mostrador=${encodeURIComponent(mostrador)}`;
    }

    if (pinvenadro && pinvenadro !== "Todos") {
      // Añadir pinvenadro si está definido
      url += `&pinvenadro=${encodeURIComponent(pinvenadro)}`;
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }


      const data = await response.json();
      if(mostradores.length == 0){
        let _mostradores: string[] = [];
        let nombresUnicos = new Set();
        data.forEach((row:any) => {

          if (!nombresUnicos.has(row.Mostrador)) {
            nombresUnicos.add(row.Mostrador);
            _mostradores.push(row.Mostrador);
          }
          
        });
        setmostradores(_mostradores);
      }
      setHistoryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getstatdistics = async () => {
    
    // const url = `https://func-anaqueles-inteligentes-back.azurewebsites.net/api/Historial?mes=${mes}&anio=${anio}&mostrador=${mostrador}&pinvenadro=${pinvenadro}`;

    const urlBase = `https://func-anaqueles-inteligentes-back.azurewebsites.net/api/Estadisticas?mes=${mes}&anio=${anio}&user=${await GetValueFor("user")}`;
    let url = urlBase;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setestadisticas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, [mes, anio, mostrador, pinvenadro]);

  useEffect(() => {
    setLoading(true);
    getstatdistics();
  }, [mes, anio]);


  useEffect(() => {
    const checklogin = async () => {
      const user = await GetValueFor("user");
      if(user == null){
        router.push("/");
      }

    };
    
   
    checklogin();
  }, []);
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
<>
    <ScrollView style={styles.container}>
     
      <>
      <View style={styles.navbar}>
          <Text style={styles.navbarText}>Inicio</Text>
        </View>

        <Box display={"flex"} justifyContent={"space-between"} >
        <Text style={styles.title}>Tus análisis</Text>
        
          <TouchableOpacity onPress={() => router.push("/")} style={{ backgroundColor: 'green',
                  padding: 2,
                  borderRadius: 5,
                  alignItems: 'center',
                  width:"30%",
                  justifyContent:"center"}}>
              <Text style={[styles.buttonText,{fontSize:14,textAlign:"center"}]}>Cerrar sesión</Text>
          </TouchableOpacity>
        
        </Box>
        
        
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" alignItems="center" gap={3}>
            <FormControl variant="standard">
              <InputLabel>Mostradores</InputLabel>
              <Select label="Mostradores" defaultValue={"Todos"} sx={{width:"20vw"}} value={mostrador} onChange={(value) => setMostrador(value.target.value) }>
                <MenuItem value="Todos">Todos</MenuItem>
                {mostradores.map(item => <MenuItem value={item}>{item}</MenuItem>)}
              </Select>
            </FormControl>

            <DatePicker
              views={['year', 'month']}
              label="Mes y año"
              minDate={new Date('2000-01-01')}
              maxDate={new Date('2100-12-31')}
              value={selectedDate}
              onChange={handleDateChange}
              slots={{
                textField: (params) => <TextField
                
                {...params}
                sx={{width:"25vw"}}
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: <CalendarTodayIcon />,
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  value: format(selectedDate, 'MMM yyyy', { locale: es }),
                }}
              />
              }}
            />

      </Box>
      </LocalizationProvider>
        <div style={{height:"2px",width:"100%",marginBlock:20, backgroundColor:"rgba(228, 228, 228, 1)"}} />
        <Text style={styles.text}>Estadísticas</Text>
        <Grid2 container columns={10} spacing={2}>
            <Grid2 size={{sm:6,xs:10}}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>{"Mostradores analizados " + nombresMeses[ Number(mes) - 1]}</Text>
                  <Text style={[styles.statPercentage]}>{estadisticas.Numero_de_registros} / {"80"}</Text>
                </View>
              </Grid2>
              <Grid2 size={{sm:4,xs:10}}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>{"% Completitud anaqueles"}</Text>
                  <Text style={[styles.statPercentage]}>{estadisticas.Promedio_de_completitud ? estadisticas.Promedio_de_completitud.toFixed(2) : ""}%</Text>
                </View>
              </Grid2>
              <Grid2 size={{sm:7,xs:10}}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>{"Productos anaqueles vs productos invenadro"}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.statPercentage, { color: 'red' }]}>{estadisticas.Promedio_de_PInvenadro ? estadisticas.Promedio_de_PInvenadro.toFixed(2) : ""}%</Text>
                    <Text style={[styles.statPercentage, { color: 'black' }]}> / </Text>
                    <Text style={[styles.statPercentage, { color: 'green' }]}>{((estadisticas.Promedio_de_PInvenadro ?? 0) * 100 / estadisticas.Promedio_de_PInvenadro).toFixed(2)}%</Text>
                  </View>
                </View>
              </Grid2>
              <Grid2 size={{sm:3,xs:10}}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>{"Ventas invenadro"}</Text>
                  <Text style={[styles.statPercentage]}>{estadisticas.Promedio_de_Ventas_Invenadro ? estadisticas.Promedio_de_Ventas_Invenadro.toFixed(2) : ""} mxn</Text>
                </View>
              </Grid2>

        </Grid2>
        
        <div style={{height:"2px",width:"100%",marginBlock:20, backgroundColor:"rgba(228, 228, 228, 1)"}} />
        <Text style={styles.text}>Histórico</Text>

        <FlatList
          data={historyData}
          renderItem={({ item }) => <HistoryItem {...item} />}
          keyExtractor={item => item.id}
          style={styles.historyList}
        />

        </>

     
      
        
    </ScrollView>
   
    <TouchableOpacity onPress={() => router.push("/NuevoAnalisis")} style={styles.button}>
      <Text style={styles.buttonText}>Nuevo análisis de mostrador</Text>
    </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    bottom: 40
  },
  navbar: {
    marginBottom: 10,
  },
  navbarText: {
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
    marginBottom: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    borderWidth:0
  },
  calendarIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  statsContainer: {
    marginHorizontal: "auto",
    width: "100%",
    
    
  },
  rowContainer: {
    flexDirection:"row",
    marginBottom:10,
    width:"100%"
  
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding:10,
    alignItems: 'center',
    justifyContent:"center",
    minWidth: 100,
    marginRight:10,
    flex:1,
    shadowRadius:2,
    shadowOpacity:0.1,
    shadowOffset:{width:2,height:2},
    width:"100%"
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight:400,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statPercentage: {
    fontSize: 16,
    fontWeight: '400',
    height:"100%"
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor:"white",
    paddingVertical: 10,
    marginBottom:10,
    marginHorizontal:2,
    paddingHorizontal:10,
    borderRadius:10,
    shadowRadius:2,
    shadowOpacity:0.2,
    shadowOffset:{width:2,height:2},
    // height:"auto"

  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyCounter: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyAddress: {
    fontSize: 14,
    color: '#666',
  },
  historyPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '400',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position:"absolute",
    left:10,
    right:10,
    bottom:10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});