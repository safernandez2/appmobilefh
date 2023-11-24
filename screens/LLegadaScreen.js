import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para generar un id único
const generateUniqueId = () => {
  return new Date().getTime().toString();
};


const LlegadaScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [tiempoLlegada, setTiempoLlegada] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];
        
        // Asignar un id único a los participantes que no lo tienen
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
    if (selectedParticipante && tiempoLlegada.trim() !== '') {
      const tiempoRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  
      if (!tiempoRegex.test(tiempoLlegada)) {
        Alert.alert('Formato de tiempo inválido. Utiliza el formato HH:mm');
        return;
      }
  
      // Utilizar una fecha fija para todos los tiempos
      const fechaTiempo = new Date(2000, 0, 1);
  
      // Obtener las horas y minutos de la cadena de tiempo
      const [horas, minutos] = tiempoLlegada.split(':').map(Number);
  
      // Establecer las horas y minutos en la fecha fija
      fechaTiempo.setHours(horas, minutos);
  
      // Crear una nueva lista actualizada desde cero
      const participantesActualizados = participantes.map((p) => ({
        ...p,
        tiempo: p.id === selectedParticipante.id ? fechaTiempo : p.tiempo,
      }));
  
      const participantesOrdenados = participantesActualizados.sort((a, b) => (a.tiempo || 0) - (b.tiempo || 0));
  
      await AsyncStorage.setItem('participantes', JSON.stringify(participantesOrdenados));
  
      setParticipantes(participantesOrdenados);
      setModalVisible(false);
      setSelectedParticipante(null);
      setTiempoLlegada('');
    }
  };
  
  
  
  
  
  


  const keyExtractor = (item, index) => item.id || index.toString();

  const renderParticipanteItem = ({ item }) => (
    <TouchableOpacity key={keyExtractor(item)} onPress={() => handleParticipantePress(item)} style={styles.participanteItem}>
      <Text style={styles.participanteText}>{`${item.nombre} - ${item.edad} - ${item.cedula} - ${item.sexo} - ${formatTiempo(item.tiempo) || 'Sin tiempo'}`}</Text>
    </TouchableOpacity>
  );

  // Función para dar formato a la hora en formato de 24 horas
  const formatTiempo = (tiempo) => {
    if (tiempo instanceof Date) {
      // Obtén solo la hora y los minutos
      const horas = tiempo.getHours();
      const minutos = tiempo.getMinutes();
      const minutosStr = minutos < 10 ? `0${minutos}` : minutos;
  
      // Devuelve la hora y minutos formateados sin la fecha
      return `${horas}:${minutosStr}`;
    }
  
    return tiempo;
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

            <TextInput
              style={styles.input}
              placeholder="Tiempo de llegada"
              value={formatTiempo(tiempoLlegada)}
              onChangeText={setTiempoLlegada}
            />

            <Button title="Guardar" onPress={handleGuardarTiempo} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LlegadaScreen;
