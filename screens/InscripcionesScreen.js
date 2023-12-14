import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Picker, Text, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const InscripcionesScreen = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const [sexo, setSexo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInscribir = async () => {
    if (!nombre || !edad || !cedula || !sexo) {
      // Muestra el modal de error si faltan campos
      setErrorMessage('Completa todos los campos.');
      setErrorModalVisible(true);
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

      // Mostrar el modal de éxito
      setModalVisible(true);
    } catch (error) {
      console.error('Error al inscribir al participante', error);
      Alert.alert('Error al inscribir al participante');
    }
  };

  const closeModal = () => {
    // Cerrar los modales y hacer otras acciones necesarias
    setModalVisible(false);
    setErrorModalVisible(false);
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
        onChangeText={(text) => setEdad(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        maxLength={3}
      />
      <TextInput
        style={styles.input}
        placeholder="Cedula"
        value={cedula}
        onChangeText={(text) => setCedula(text.replace(/[^0-9]/g, '').substring(0, 10))}
        keyboardType="numeric"
        maxLength={10}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Género:</Text>
        <Picker
          style={styles.picker}
          selectedValue={sexo}
          onValueChange={(itemValue) => setSexo(itemValue)}
        >
          <Picker.Item label="Seleccionar" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
          <Picker.Item label="Otro" value="Otro" />
        </Picker>
      </View>

      <Button title="Inscribir" onPress={handleInscribir} />

      {/* Modales */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Inscripción Exitosa!</Text>
            <Text>Tu participante ha sido registrado con éxito.</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text>{errorMessage}</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 45,
  },
  pickerLabel: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    flex: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default InscripcionesScreen;
