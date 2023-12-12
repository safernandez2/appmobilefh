// SplashScreen.js
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../imagenes/logoat.png')} style={styles.image} />
      <Text style={styles.title}>Trackinscription</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Puedes ajustar el color de fondo
  },
  image: {
    width: 200, // Ajusta el ancho de la imagen según tus necesidades
    height: 200, // Ajusta la altura de la imagen según tus necesidades
    resizeMode: 'contain', // Puedes ajustar el modo de redimensionamiento
  },
  title: {
    marginTop: 20, // Ajusta el espacio entre la imagen y el título
    fontSize: 20, // Puedes ajustar el tamaño del texto
  },
});

export default SplashScreen;
