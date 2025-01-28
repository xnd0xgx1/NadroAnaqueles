import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Box, FormControl, Grid2, InputLabel, MenuItem, Select } from '@mui/material'; // Asegúrate de que este import sea correcto
import { Link, useRouter } from 'expo-router';
import ImageCarousel from '@/components/Carrousel';
import { GetValueFor } from '@/components/utils/Store';

const ProductItem = ({valor_optimo, similitud, marca, cantidad_actual_img, optimo_invenadro,nombre_oficial,percentage,nombre_inferido ,flag_invenadro} : {nombre_oficial:any,valor_optimo:any,marca:any,percentage:any,cantidad_actual_img:any,similitud:any,valor_comercial:any,optimo:any,nombre_inferido:any,optimo_invenadro:any,flag_invenadro:any}) => {

  let image = require('@/assets/images/Home/Anaquelgreen.png');

  let color = "red";

  if(flag_invenadro == "NO"){
    color = "red"
  }else{
    color = "green";
  }

  const [seemore, setseemore] = useState(true);

  

  if(nombre_oficial != "" && nombre_oficial != "UNKNOWN"){
      return(
      <View style={[styles.historyItem,{borderLeftColor:color,borderLeftWidth:3}]}>
        <Grid2 container columns={11} rowSpacing={0}>
          <Grid2 size={3}>
          <View style={{ flexDirection: 'column',  alignItems: 'flex-start', width: '100%', justifyContent:"center"}}>
                
                      <Text style={[styles.productname, { fontWeight:"700" }]}>{nombre_inferido} </Text>
                      <Text style={[styles.statPercentage, { fontSize: 12}]}>{marca}</Text>
            </View>
          </Grid2>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} />
          <Grid2 size={4}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.statPercentage, { color: 'black' }]}>{flag_invenadro}</Text>
              </View>
              <Text style={[styles.statPercentage, { fontSize: 12}]}>Existe en invenadro</Text>
            
              
          </Grid2>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} />
          <Grid2 size={2} >
            <TouchableOpacity style={{width:"100%",alignItems:"center",justifyContent:"center"}} onPress={() => setseemore(!seemore)}>
                <Text style={{color:"green",textDecorationLine:"underline"}}>{seemore ? "Ver más" : "Ver menos"}</Text>
              </TouchableOpacity>
          </Grid2>
          
        </Grid2>

        { !seemore && 
              
              <View style={{ flexDirection: 'column',  alignItems: 'flex-start', width: '100%', justifyContent:"center"}}>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Producto</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{(nombre_oficial == "NaN" ) ? "No especificado" :  nombre_oficial}</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Porcentaje de coincidencia</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{ (similitud == "NaN" ) ? "No especificado" :  similitud.toFixed(2)} %</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Existencias</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{(cantidad_actual_img == "NaN" ) ? "No especificado" :  cantidad_actual_img }</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Valor óptimo</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{(valor_optimo == "NaN" ) ? "No especificado" :  valor_optimo } mxn</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Cantidad óptima</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{(optimo_invenadro == "NaN" ) ? "No especificado" :  optimo_invenadro }</Text>
                  
                  
            </View>}
      
        
      </View>
      );
    }
};



const Recomendacionitem = ({Valor_Optimo_x,Optimo_x,Precio_Publico_Material, Precio_Farmacia_x, Precio_Publico_Invenadro, Fecha_Generacion, Descripcion,percentage,Estatus_Material} : {Descripcion:any,Precio_Publico_Material:any,Precio_Publico_Invenadro:any,percentage:any,Fecha_Generacion:any,Precio_Farmacia_x:any,optimo:any,Estatus_Material:any,Optimo_x:any,Valor_Optimo_x:any}) => {

  let image = require('@/assets/images/Home/Anaquelgreen.png');

  let color = "red";

  if(percentage >= 90){
    color = "green"
  }else if(percentage > 40 && percentage <90){
    color = "yellow";
  }else{
   color = "red"
  }

  const [seemore, setseemore] = useState(true);

  if(Descripcion != "" && Descripcion != "UNKNOWN"){
      return(
      <View style={[styles.historyItem]}>
        <Grid2 container columns={11} rowSpacing={0}>
          <Grid2 size={3}>
          <View style={{ flexDirection: 'column',  alignItems: 'flex-start', width: '100%', justifyContent:"center"}}>
                
                      <Text style={[styles.productname, { fontWeight:"700" }]}>{Descripcion} </Text>
                      {/* <Text style={[styles.statPercentage, { fontSize: 12}]}>{marca}</Text> */}
            </View>
          </Grid2>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} />
          <Grid2 size={4}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.statPercentage, { color: 'black' }]}>{Precio_Publico_Material} mxn</Text>
                    
              </View>
              <Text style={[styles.statPercentage, { fontSize: 12}]}>Precio público</Text>
            
              
          </Grid2>
          <View style={{ height: "100%", backgroundColor: '#ccc', width: 1, marginHorizontal:10 }} />
          <Grid2 size={2} >
            <TouchableOpacity style={{width:"100%",alignItems:"center",justifyContent:"center"}} onPress={() => setseemore(!seemore)}>
                <Text style={{color:"green",textDecorationLine:"underline"}}>{seemore ? "Ver más" : "Ver menos"}</Text>
              </TouchableOpacity>
          </Grid2>
          
        </Grid2>

        { !seemore && 
              
              <View style={{ flexDirection: 'column',  alignItems: 'flex-start', width: '100%', justifyContent:"center"}}>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Fecha generación</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{Fecha_Generacion}</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Cantidad óptima</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{Optimo_x}</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>Valor óptimo</Text>
                  <Text style={[styles.text, { color: 'black' }]}>{Valor_Optimo_x}</Text>

            </View>}
      
        
      </View>
      );
    }
};





export default function Resultados() {
  const [selectedtab, setselectedtab] = useState(0);
  const [images, setimages] = useState<string[]>([]);
  const [images2, setimages2] = useState<string[]>([]);
  const [resultado, setresultado] = useState<any>(null);
  const [productos, setproductos] = useState<any>(null);
  const [productos2, setproductos2] = useState<any>(null);
  const [anaquel, setanaquel] = useState('');
  const { width: screenWidth } = Dimensions.get('window');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);


  const getdata = async () => {
    // const imagesupload = await GetValueFor("images") ?? [];
   
    // let parsedImages: any[] = [];
    // if (typeof imagesupload === 'string') {
    //   try {
    //     parsedImages = JSON.parse(imagesupload); // Convierte el string a un array
    //   } catch (error) {
    //     console.error("Error al parsear imagesupload:", error);
    //   }
    // } else if (Array.isArray(imagesupload)) {
    //   parsedImages = imagesupload; // Si ya es un array, lo usamos directamente
    // }
  
    // const newimages = parsedImages.map((image: any) => image.url);
    // // console.log(imagesupload);
    // console.log(parsedImages);
    //   setimages(newimages);



      const resultmodel = await GetValueFor("resultados") ?? {};
   
      let resultadosparsed: any = {};
      if (typeof resultmodel === 'string') {
        try {
          resultadosparsed = JSON.parse(resultmodel); // Convierte el string a un array
          
        } catch (error) {
          console.error("Error al parsear imagesupload:", error);
        }
      } else if (Array.isArray(resultmodel)) {
        resultadosparsed = resultmodel; // Si ya es un array, lo usamos directamente
      }

      console.log("Resultados: ",resultadosparsed);
      const newimages = resultadosparsed.output_imagenes.map((image: any) => { return {"path": image.ruta_img_original,"porcentaje":image.porcentaje_calidad_imagen}});
      const newimages2 = resultadosparsed.output_imagenes.map((image: any) => { return {"path": image.ruta_img_anaquel,"porcentaje":""}});
      console.log("NEW IMAGES2: ",newimages2);
      setimages2(newimages2);
      setimages(newimages);
      setresultado(resultadosparsed);
      const productosUnicos: any[] = [];
      const nombresUnicos = new Set();
      const productosUnicos2: any[] = [];
      const nombresUnicos2 = new Set();

      resultadosparsed.output_imagenes.forEach((image: any) => {
        image.detalle_materiales.forEach((producto: any) => {
          if (!nombresUnicos.has(producto.nombre_oficial)) {
            nombresUnicos.add(producto.nombre_oficial);
            
          }
          productosUnicos.push(producto);
        });
        image.detalle_anaquel_perfecto.forEach((producto: any) => {
          if (!nombresUnicos2.has(producto.Codigo_Material)) {
            nombresUnicos2.add(producto.Codigo_Material);
            
          }
          productosUnicos2.push(producto);
        });
      });

      setproductos(productosUnicos);
      setproductos2(productosUnicos2);
      console.log("Productos: ",productosUnicos);
      console.log("Productos2: ",productosUnicos2);

  };
 
  useEffect(() => {
    getdata();

  },[]);

  useEffect(() => {
    const checklogin = async () => {
      const user = await GetValueFor("user");
      if(user == null){
        router.push("/");
      }

    };
    
   
    checklogin();
  }, []);

  const saveresults = async () => {
    setLoading(true);
      //Save resultados

      const resultadoitem = {
          "Mostrador": resultado.codigo_mostrador,
          "Nombre_Mostrador": resultado.nombre_mostrador,
          "PInvenadro":((resultado.productos_detectados_en_invenadro ?? 0) * 100 / resultado.total_productos_inferidos).toFixed(0),
          "Direccion":"",
          "Resultados":JSON.stringify(resultado),
          "Completitud":resultado.completitud_anaqueles,
          "Ventas":resultado.monto_ventas_totales_mostrador,
          "User": await GetValueFor("user")
      };
      try {
        // URL de tu función de Azure
        const url = import.meta.env.VITE_BASE_URL + "api/InsertarRegistro"; // Cambia esto según tu función

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultadoitem) // Convierte el objeto a JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // const data = await response.json();
        // console.log("Registro insertado correctamente:", data);
        setLoading(false);
        router.push("/HomeScreen");
    } catch (error) {
      setLoading(false);
        console.error("Error al guardar los resultados:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
    { resultado && <>
      <View style={styles.navbar}>
      <Text style={styles.navbarText}>Resultado</Text>
    </View>

    <Grid2 container columns={10} spacing={0} marginBottom={6}>
      {/* <Grid2 size={6}>
        <View style={styles.statBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%"}}>
            <Text style={[styles.statTitle,{marginRight:10}]}>{"Lectura de la imagen"}</Text>
            <Text style={[styles.statTitle, { color: 'rgba(49, 86, 27, 1)',fontWeight:"700"},resultado.completitud_anaqueles < 50 ? {color:"red"} : {color:"green"}]} >{resultado.completitud_anaqueles}%</Text>
            </View>
          </View>
      </Grid2> */}

      <Grid2 size={4} height={"100%"} alignContent={"left"}>
            <TouchableOpacity style={{width:"100%",alignItems:"flex-start"}} onPress={() => router.push("/SubirFotos")}>
              <Text style={{color:"green",textDecorationLine:"underline",fontWeight:"700"}}>Cambiar fotografías</Text>
            </TouchableOpacity>
      </Grid2>

      <Grid2 size={10}>
        <View style={styles.statBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%",justifyContent:"center"}}>
            <Text style={[styles.statTitle,{marginRight:10}]}>{"Fotografías cargadas: "}</Text>
            <Text style={[styles.statTitle, { color: 'rgba(49, 86, 27, 1)',fontWeight:"700"}]}>{images.length}</Text>
            </View>
          </View>
      </Grid2>
      
    </Grid2>

    <Text style={styles.mdtext}>Resultados</Text>
    <Grid2 container columns={10} spacing={1} marginBottom={2}>
        <Grid2 size={5}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>{"Invenadro vs Detectados"}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>{(resultado.productos_detectados_en_invenadro )}</Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}> / </Text>
                  <Text style={[styles.statPercentage, { color: 'black' }]}>{(resultado.total_productos_inferidos ?? 0)}</Text>
                </View>
              </View>
            </Grid2>
            <Grid2 size={5}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>{"% Completitud anaquel"}</Text>
                <Text style={[styles.statPercentage]}>{(resultado.completitud_anaqueles ?? 0).toFixed(2)}%</Text>
              </View>
            </Grid2>
            <Grid2 size={5}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>{"Monto ventas totales mostrador"}</Text>
                <Text style={[styles.statPercentage]}>{(resultado.monto_ventas_totales_mostrador ?? 0).toFixed(2)} mxn</Text>
              </View>
            </Grid2>
            <Grid2 size={5}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>{"Número de ventas totales mostrador"}</Text>
                <Text style={[styles.statPercentage]}>{(resultado.numero_ventas_totales_mostrador ?? 0).toFixed(0)}</Text>
              </View>
            </Grid2>
            <Grid2 size={10}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>{"Nombre mostrador"}</Text>
                <Text style={[styles.statPercentage,{fontSize:14}]}>{(resultado.nombre_mostrador)}</Text>
              </View>
            </Grid2>

            <Grid2 size={5}>
              <TouchableOpacity onPress={() => setselectedtab(0)}>
                <View style={selectedtab == 0 ? styles.statBox : styles.statBoxunselected}>
                  <Text style={ selectedtab == 0 ? styles.TabTitleselected : styles.TabTitle}>{"Lectura"}</Text>
                </View>
               </TouchableOpacity>
            </Grid2>
            <Grid2 size={5}>
            <TouchableOpacity onPress={() => setselectedtab(1)}>
              <View style={selectedtab == 1 ? styles.statBox : styles.statBoxunselected}>
                <Text style={selectedtab == 1 ? styles.TabTitleselected : styles.TabTitle}>{"Recomendación"}</Text>
               
              </View>
            </TouchableOpacity>
            </Grid2>

    </Grid2>

    { selectedtab == 0 ? 
    <ImageCarousel images={images} />
    
    : 

    <ImageCarousel images={images2} />
    
    
    }
    
{/* 
      <FormControl variant="standard">
            <InputLabel>Producto</InputLabel>
            <Select label="Producto" defaultValue="Todos" sx={{width:"20vw"}}>
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Opción 1">Opción 1</MenuItem>
              <MenuItem value="Opción 2">Opción 2</MenuItem>
            </Select>
          </FormControl> */}

      
      <Text style={[styles.text,{marginVertical:20}]}>Productos</Text>

      {selectedtab == 0 ? 
      
      <FlatList
        data={productos}
        renderItem={({ item }) => <ProductItem {...item} />}
        keyExtractor={item => item.id}
        style={{flex:1}}
      />
      : 
      <FlatList
      data={productos2}
      renderItem={({ item }) => <Recomendacionitem {...item} />}
      keyExtractor={item => item.id}
      style={{flex:1}}
     />
      
      }

        <TouchableOpacity style={styles.button} onPress={() => saveresults()}>
          <Text style={styles.buttonText}>Guardar Lectura</Text>
        </TouchableOpacity>
    </>}
    
    { loading  && 
    <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="green" />
    </View>
    }
    </ScrollView>

    
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
  mdtext: {
    fontSize: 12,
    fontWeight: 400,
    textAlign: 'left',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
    marginBottom: 10,
  },
  statBox2: {
    backgroundColor: 'rgba(193, 224, 175, 1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: "center",
    minWidth: 100,
    marginRight: 10,
    flex: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    width: "100%",
  },
  statBoxunselected: {
    backgroundColor: 'rgba(233, 233, 233, 1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: "center",
    minWidth: 100,
    marginRight: 10,
    flex: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    height:"100%"
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: "center",
    minWidth: 100,
    marginRight: 10,
    flex: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    height:"100%"
  },
  TabTitleselected: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color:"green",
  },
  TabTitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color:"rgba(0, 0, 0, 1)"
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    color:"rgba(0, 0, 0, 1)"
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    width:"100%"
  },
  button2: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: "center",
    width:"100%"
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  historyCounter: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyAddress: {
    fontSize: 12,
    color: 'gray',
  },
  statPercentage: {
    fontSize: 18,
    color: '#000',
  },
  percentageText: {
    fontSize: 12,
    color: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '20%',
    height: 'auto', // Permite que la altura sea automática
    aspectRatio: 1,    // Puedes ajustar este valor si conoces la proporción de la imagen
    resizeMode:"contain",
    marginBottom:10
  },
  image2: {
    width: '100%',
    height: 'auto', // Permite que la altura sea automática
    aspectRatio: 1,    // Puedes ajustar este valor si conoces la proporción de la imagen
    resizeMode:"contain",
    marginBottom:10,
    alignSelf: 'flex-start',
   
  },
  deformimage:{
  
    borderRadius: 5,

  },
  recomentaciontitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color:"rgba(0, 0, 0, 1)",
    height:"100%",
    justifyContent:"center",
    alignContent:"center",
  },
  image3: {
    width: '100%',
    height: 'auto',
    resizeMode:"contain",
    alignSelf: 'center',
    aspectRatio:1,
   
  },
  image4: {
    width: '100%',
    height: 'auto',
    resizeMode:"contain",
    alignSelf: 'center',
    aspectRatio:0.7,
   
  },
  productname:{
    fontSize:13,
    fontWeight:"700"
  }
});
