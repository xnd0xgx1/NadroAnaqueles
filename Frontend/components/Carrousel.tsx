import React, { useState, useRef } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, FlatList} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel = ({ images }: {images:any}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onViewRef = React.useRef((viewableItems:any) => {
      if (viewableItems.viewableItems.length > 0) {
        setActiveIndex(viewableItems.viewableItems[0].index);
       
      }
    });
  
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  
  
    return (
      <View>
         <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Text style={styles.caption}>Fotografía {index + 1}</Text>
            {item.porcentaje != "" && <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%",justifyContent:"center"}}>
              <Text style={[styles.imagepercentage,{marginRight:10}]}>{"Calidad de la imagen"}</Text>
              <Text style={[styles.imagepercentage, { color: 'rgba(49, 86, 27, 1)',fontWeight:"700"},item.porcentaje < 0.50 ? {color:"red"} : {color:"green"}]} >{(item.porcentaje * 100).toFixed()}%</Text>
            </View>
            }
            
            <Image source={{ uri: item.path }} style={styles.image} />
            
          </View>
        )}
      />
      <View style={styles.pagination}>
        {images.map((_:any, i:any) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      </View>
    );
  };
  

  const styles = StyleSheet.create({
    slide: {
      width: screenWidth,
      alignItems: 'center',
    },
    image: {
      width: screenWidth * 0.9,
      aspectRatio:1,
      borderRadius: 10,
      marginBottom: 10,
      resizeMode:"contain"
    },
    caption: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
      top: 10,
      marginBottom:20
    },
    imagepercentage: {
      fontSize: 14,
      fontWeight: '400',
      top: 10,
      marginBottom:20
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: 'rgba(85, 136, 255, 1)',
      borderWidth:1,
      borderColor:"white"
    },
    inactiveDot: {
      backgroundColor: 'white',
      borderWidth:1,
      borderColor:"rgba(85, 136, 255, 1)"
    },
  });
  

export default ImageCarousel;
