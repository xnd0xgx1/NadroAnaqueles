import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Grid2 } from "@mui/material"; // Asegúrate de que este import sea correcto
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetValueFor } from "@/components/utils/Store";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface Business {
  codigoMostrador: string;
  razonSocial: string;
  negocio: string;
}

async function save(key: any, value: any) {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      // mobile
      await SecureStore.setItemAsync(key, value.toString());
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

export default function NuevoAnalisis() {
  const [anaquel, setanaquel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checklogin = async () => {
      const user = await GetValueFor("user");
      if (user == null) {
        router.push("/");
      }
    };

    checklogin();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
    }

    if (searchQuery?.length >= 2) {
      const timeoutId = setTimeout(() => {
        fetchResults(searchQuery);
      }, 3000);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const fetchResults = async (term: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://func-anaqueles-inteligentes-back.azurewebsites.net/api/search-business-name?querySearch=${term}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data: Business[] = await response.json();
      // const business = data.map((business) => business.negocio);
      console.log("response: ", data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (
    _event: React.SyntheticEvent,
    business: Business
  ) => {
    console.log("Selected item:", business);
    setSearchQuery(business?.negocio);
    setanaquel(business?.codigoMostrador);
  };

  const handleInputChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchQuery(newValue);
    console.log("Texto ingresado:", newValue); // Aquí puedes hacer la búsqueda
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Nuevo análisis de anaquel</Text>
      </View>

      <Text style={styles.title}>Recomendaciones</Text>
      <Text style={styles.text}>
        Recuerda que la calidad del análisis depende de las fotografías que
        subas, por eso:
      </Text>
      <Text style={styles.text}>Estadísticas</Text>
      <Grid2 container columns={10} spacing={2}>
        <Grid2 size={{ sm: 5, xs: 10 }}>
          <View style={styles.statBox}>
            <Image
              source={require("@/assets/images/Home/foco.png")}
              style={styles.image}
            />

            <Text style={styles.statTitle}>
              {"Las fotos deben tener buena iluminación"}
            </Text>
          </View>
        </Grid2>
        <Grid2 size={{ sm: 5, xs: 10 }}>
          <View style={styles.statBox}>
            <Image
              source={require("@/assets/images/Home/medicamento.png")}
              style={styles.image}
            />
            <Text style={styles.statTitle}>
              {
                "Los productos deben mostrar claramente su etiqueta y ser legible."
              }
            </Text>
          </View>
        </Grid2>
        <Grid2 size={{ sm: 5, xs: 10 }}>
          <View
            style={[
              styles.statBox,
              { backgroundColor: "rgba(193, 224, 175, 1)" },
            ]}
          >
            <Image
              source={require("@/assets/images/Home/Ejemplo.png")}
              style={styles.image2}
            />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
            <Text
              style={[
                styles.statTitle,
                { color: "rgba(49, 86, 27, 1)", fontWeight: "700" },
              ]}
            >
              ¡Importante!
            </Text>
            <Text
              style={[
                styles.statTitle,
                { color: "rgba(49, 86, 27, 1)", fontWeight: "400" },
              ]}
            >
              {" "}
              para realizar el análisis, debes
            </Text>
            <Text
              style={[
                styles.statTitle,
                { color: "rgba(49, 86, 27, 1)", fontWeight: "700" },
              ]}
            >
              subir foto de todos los anaqueles del mostrador.
            </Text>
            {/* </View> */}
          </View>
        </Grid2>
        {/* <Grid2 height={"45vh"} borderRadius={4} borderColor={"#6e8f49"} border={1} size={{ sm: 5, xs: 10 }} bgcolor={"rgba(193, 224, 175, 1)"} flexDirection={"column"} display={"flex"} alignItems={"flex-start"} justifyContent={"center"}>
            <Image
              source={require('@/assets/images/Home/Ejemplo.png')}
              style={styles.image2}
            />
            <Box  padding={2} borderRadius={4} borderColor={"#6e8f49"}  borderBottom={1} borderRight={1} width={"90vw"} height={"30vh"} bgcolor={"rgba(193, 224, 175, 1)"}>
              <Text style={styles.recomentaciontitle}>{"¡Importante! para realizar el análisis, debes subir foto de todos los anaqueles del mostrador."}</Text>
            </Box>
        </Grid2> */}
        <Grid2 size={{ sm: 5, xs: 10 }} height={{ xs: "300px", md: "auto" }}>
          <View style={[styles.statBox, { height: "70%" }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Image
                source={require("@/assets/images/Home/anaquel.png")}
                style={{ width: 40, height: 70, resizeMode: "contain" }}
              />
              <Image
                source={require("@/assets/images/Home/anaquel.png")}
                style={{ width: 40, height: 70, resizeMode: "contain" }}
              />
              <Image
                source={require("@/assets/images/Home/anaquel.png")}
                style={{ width: 40, height: 70, resizeMode: "contain" }}
              />
            </View>
            <Text style={styles.statTitle}>
              {
                "Cada una de las fotos debe mostrar únicamente un anaquel y debe ser tomada de manera frontal."
              }
            </Text>
          </View>
        </Grid2>

        <Grid2 size={{ sm: 6, xs: 10 }}>
          <Image
            source={require("@/assets/images/Home/malo.png")}
            style={styles.image3}
          />
        </Grid2>
        <Grid2 size={{ sm: 4, xs: 10 }}>
          <Image
            source={require("@/assets/images/Home/bueno.png")}
            style={styles.image4}
          />
        </Grid2>
      </Grid2>

      <Text style={[styles.text, { marginVertical: 20 }]}>
        Buscar mostrador
      </Text>
      <Autocomplete
        value={searchQuery}
        onInputChange={handleInputChange}
        onChange={(event, value) => handleSelectItem(event, value as Business)}
        selectOnFocus
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={results}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Regular option
          return option.negocio;
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={Math.random()} {...optionProps}>
              {option.codigoMostrador} - {option.negocio}
            </li>
          );
        }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nombre o código del mostrador"
            InputProps={{
              ...params.InputProps,
              endAdornment: loading ? <CircularProgress size={20} /> : null,
            }}
          />
        )}
      />
      {/* <Link href={"/SubirFotos"} style={{width:"100%"}}> */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (anaquel != "") {
            await save("mostrador", anaquel);
            router.push("/SubirFotos");
          } else {
            alert("Coloque el numero de mostrador");
          }
        }}
      >
        <Text style={styles.buttonText}>Subir Fotos</Text>
      </TouchableOpacity>
      {/* </Link> */}

      <TouchableOpacity
        style={styles.button2}
        onPress={() => router.push("/HomeScreen")}
      >
        <Text style={{ color: "green" }}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  navbar: {
    marginBottom: 10,
  },
  navbarText: {
    fontSize: 14,
    fontWeight: "400",
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: "left",
    marginBottom: 10,
  },
  statBox2: {
    backgroundColor: "rgba(193, 224, 175, 1)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    marginRight: 10,
    flex: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    width: "100%",
  },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    marginRight: 10,
    flex: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    // height:"100%"
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "rgba(0, 0, 0, 1)",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "green",
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  button2: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  historyItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  historyCounter: {
    fontSize: 14,
    fontWeight: "bold",
  },
  historyAddress: {
    fontSize: 12,
    color: "gray",
  },
  statPercentage: {
    fontSize: 16,
    color: "#000",
  },
  percentageText: {
    fontSize: 12,
    color: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "20%",
    height: "auto", // Permite que la altura sea automática
    aspectRatio: 1, // Puedes ajustar este valor si conoces la proporción de la imagen
    resizeMode: "contain",
    marginBottom: 10,
  },
  image2: {
    width: "100%",
    height: "auto", // Permite que la altura sea automática
    aspectRatio: 1, // Puedes ajustar este valor si conoces la proporción de la imagen
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  deformimage: {
    borderRadius: 5,
  },
  recomentaciontitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "rgba(0, 0, 0, 1)",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  image3: {
    width: "100%",
    height: "auto",
    resizeMode: "contain",
    alignSelf: "center",
    aspectRatio: 1,
  },
  image4: {
    width: "100%",
    height: "auto",
    resizeMode: "contain",
    alignSelf: "center",
    aspectRatio: 0.7,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
    color: "#666",
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
  },
});
