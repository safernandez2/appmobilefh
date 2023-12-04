import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Función para generar un id único
const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const LlegadaScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];
  
        const participantesConId = participantes.map((p) => ({
          ...p,
          id: p.id || generateUniqueId(),
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
      // Combina las horas y los minutos en un solo número (ejemplo: 1130)
      const tiempoNumerico = selectedHour * 100 + selectedMinute;
  
      // Asegura que las horas sean siempre de dos dígitos
      const horasStr = selectedHour < 10 ? `0${selectedHour}` : selectedHour.toString();
      // Asegura que los minutos sean siempre de dos dígitos
      const minutosStr = selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute.toString();
  
      const tiempoFormateado = parseInt(horasStr + minutosStr, 10);
  
      const participantesActualizados = participantes.map((p) => ({
        ...p,
        // Almacena el tiempo como un número
        tiempo: p.id === selectedParticipante.id ? tiempoFormateado : p.tiempo,
      }));
    
      await AsyncStorage.setItem('participantes', JSON.stringify(participantesActualizados));
  
      setParticipantes(participantesActualizados);
      setModalVisible(false);
      setSelectedParticipante(null);
      setSelectedHour(0);
      setSelectedMinute(0);
    }
  };


  const keyExtractor = (item, index) => item.id || index.toString();

  const renderParticipanteItem = ({ item }) => (
    <TouchableOpacity key={keyExtractor(item)} onPress={() => handleParticipantePress(item)} style={styles.participanteItem}>
      <Text style={styles.participanteText}>{`${item.nombre} - ${item.edad} - ${item.cedula} - ${item.sexo} - ${formatTiempo(item.tiempo) || 'Sin tiempo'}`}</Text>
    </TouchableOpacity>
  );

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }
    // Extrae las dos últimas cifras para las horas y los minutos
    const horas = Math.floor(tiempo / 100);
    const minutos = tiempo % 100;
    // Asegura que las horas y los minutos sean siempre de dos dígitos
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

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{`Detalles de ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Nombre: ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Edad: ${selectedParticipante?.edad}`}</Text>
            <Text>{`Cedula: ${selectedParticipante?.cedula}`}</Text>
            <Text>{`Sexo: ${selectedParticipante?.sexo}`}</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedHour}
                onValueChange={(itemValue) => setSelectedHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString()} value={i} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Minutos:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedMinute}
                onValueChange={(itemValue) => setSelectedMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString()} value={i} />
                ))}
              </Picker>
            </View>

            <Button title="Guardar" onPress={handleGuardarTiempo} />
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          setSelectedHour(date.getHours());
          setSelectedMinute(date.getMinutes());
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
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
  participanteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  participanteText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 2,
  },
});

export default LlegadaScreen;
