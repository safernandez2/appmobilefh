import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const InscripcionesScreen = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const [sexo, setSexo] = useState('');

  const handleInscribir = async () => {
    if (!nombre || !edad || !cedula || !sexo) {
      Alert.alert('Completa todos los campos');
      return;
    }

    try {
      // Obtener la lista actual de participantes desde el almacenamiento
      const participantesStr = await AsyncStorage.getItem('participantes');
      const participantes = participantesStr ? JSON.parse(participantesStr) : [];

      // Agregar el nuevo participante a la lista
      const nuevoParticipante = { id: generateUniqueId(), nombre, edad: parseInt(edad), cedula, sexo, tiempo: '' };
      participantes.push(nuevoParticipante);

      // Actualizar el almacenamiento con la nueva lista de participantes
      await AsyncStorage.setItem('participantes', JSON.stringify(participantes));

      // Limpiar los campos después de la inscripción exitosa
      setNombre('');
      setEdad('');
      setCedula('');
      setSexo('');

      Alert.alert('Inscripción exitosa');
    } catch (error) {
      console.error('Error al inscribir al participante', error);
      Alert.alert('Error al inscribir al participante');
    }
  };


  // Función para borrar los datos almacenados
  const borrarDatos = async () => {
    try {
      await AsyncStorage.removeItem('participantes');
      console.log('Datos eliminados exitosamente');
    } catch (error) {
      console.error('Error al intentar borrar los datos', error);
    }
  };



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cedula"
        value={cedula}
        onChangeText={setCedula}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={sexo}
        onChangeText={setSexo}
      />
      <Button title="Inscribir" onPress={handleInscribir} />

      <Button title="Borrar Datos" onPress={borrarDatos} color="red" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 100,
    marginRight: 60,
  },
  input: {
    width: 200,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 45,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default InscripcionesScreen;
