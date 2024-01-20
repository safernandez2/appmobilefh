import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome5 } from '@expo/vector-icons';

// Función para generar un id único
const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const LlegadaScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isArrivalDatePickerVisible, setArrivalDatePickerVisibility] = useState(false);
  const [isDepartureDatePickerVisible, setDepartureDatePickerVisibility] = useState(false);
  const [selectedArrivalHour, setSelectedArrivalHour] = useState(0);
  const [selectedArrivalMinute, setSelectedArrivalMinute] = useState(0);
  const [selectedDepartureHour, setSelectedDepartureHour] = useState(0);
  const [selectedDepartureMinute, setSelectedDepartureMinute] = useState(0);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [participanteToDelete, setParticipanteToDelete] = useState(null);

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        const participantesConId = participantes.map((p) => ({
          ...p,
          id: p.id || generateUniqueId(),
          selectedArrivalHour: p.selectedArrivalTime ? Math.floor(p.selectedArrivalTime / 100) : 0,
          selectedArrivalMinute: p.selectedArrivalTime ? p.selectedArrivalTime % 100 : 0,
          selectedDepartureHour: p.selectedDepartureTime ? Math.floor(p.selectedDepartureTime / 100) : 0,
          selectedDepartureMinute: p.selectedDepartureTime ? p.selectedDepartureTime % 100 : 0,
        }));

        setParticipantes(participantesConId);
      } catch (error) {
        console.error('Error al cargar la lista de participantes', error);
      }
    };

    cargarParticipantes();
  }, []);

  const handleParticipantePress = (participante) => {
    setSelectedParticipante(JSON.parse(JSON.stringify(participante)));
    setModalVisible(true);
  };

  const handleGuardarTiempo = async () => {
    if (selectedParticipante) {
      const arrivalTimeNumerical = parseInt(`${selectedArrivalHour.toString().padStart(2, '0')}${selectedArrivalMinute.toString().padStart(2, '0')}`, 10);
      const departureTimeNumerical = parseInt(`${selectedDepartureHour.toString().padStart(2, '0')}${selectedDepartureMinute.toString().padStart(2, '0')}`, 10);
  
      const participantesActualizados = participantes.map((p) => ({
        ...p,
        selectedArrivalTime: p.id === selectedParticipante.id ? arrivalTimeNumerical : p.selectedArrivalTime,
        selectedDepartureTime: p.id === selectedParticipante.id ? departureTimeNumerical : p.selectedDepartureTime,
      }));
  
      // Actualizar directamente el estado con los participantes actualizados
      setParticipantes(participantesActualizados);
  
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('participantes', JSON.stringify(participantesActualizados));
  
      setModalVisible(false);
      setSelectedParticipante(null);
      setSelectedArrivalHour(0);
      setSelectedArrivalMinute(0);
      setSelectedDepartureHour(0);
      setSelectedDepartureMinute(0);
    }
  };


  const borrarParticipante = async (participanteId) => {
    const participante = participantes.find((p) => p.id === participanteId);
    setParticipanteToDelete(participante);
    setDeleteConfirmationVisible(true);
  };

  const confirmarBorrarParticipante = async () => {
    try {
      const participantesActualizados = participantes.filter((p) => p.id !== participanteToDelete.id);

      await AsyncStorage.setItem('participantes', JSON.stringify(participantesActualizados));

      setParticipantes(participantesActualizados);
      setDeleteConfirmationVisible(false);
    } catch (error) {
      console.error('Error al intentar borrar el participante', error);
    }
  };

  const keyExtractor = (item, index) => item.id || index.toString();

  const renderParticipanteItem = ({ item }) => (
    <View style={styles.participanteItemContainer}>
      <TouchableOpacity onPress={() => handleParticipantePress(item)} style={styles.participanteItem}>
        <Text style={styles.participanteText}>{`${item.nombre} - ${item.edad} - ${item.cedula} - ${item.sexo} - Llegada: ${formatTiempo(item.selectedArrivalTime) || 'Sin tiempo'} - Salida: ${formatTiempo(item.selectedDepartureTime) || 'Sin tiempo'}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => borrarParticipante(item.id)} style={styles.deleteButton}>
        <FontAwesome5 name="trash-alt" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }
    const horas = Math.floor(tiempo / 100);
    const minutos = tiempo % 100;
    const horasStr = horas < 10 ? `0${horas}` : horas.toString();
    const minutosStr = minutos < 10 ? `0${minutos}` : minutos.toString();
    return `${horasStr}:${minutosStr}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Participantes</Text>
      <FlatList
        data={participantes}
        renderItem={renderParticipanteItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal visible={deleteConfirmationVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text>{`¿Seguro que quieres eliminar a ${participanteToDelete?.nombre}?`}</Text>
            <View style={styles.confirmationButtonsContainer}>
              <Button title="Cancelar" onPress={() => setDeleteConfirmationVisible(false)} />
              <Button title="Sí, eliminar" onPress={confirmarBorrarParticipante} color="red" />
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome5 name="times" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{`Detalles de ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Nombre: ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Edad: ${selectedParticipante?.edad}`}</Text>
            <Text>{`Cedula: ${selectedParticipante?.cedula}`}</Text>
            <Text>{`Sexo: ${selectedParticipante?.sexo}`}</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora de Salida:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedDepartureHour}
                onValueChange={(itemValue) => setSelectedDepartureHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i} />
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedDepartureMinute}
                onValueChange={(itemValue) => setSelectedDepartureMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora de Llegada:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedArrivalHour}
                onValueChange={(itemValue) => setSelectedArrivalHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i} />
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedArrivalMinute}
                onValueChange={(itemValue) => setSelectedArrivalMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i} />
                ))}
              </Picker>
            </View>

            <Button title="Guardar Tiempo" onPress={handleGuardarTiempo} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  participanteItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participanteItem: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  participanteText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pickerLabel: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default LlegadaScreen;
