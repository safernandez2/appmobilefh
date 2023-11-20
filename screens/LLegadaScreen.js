import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const LlegadaScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [tiempoLlegada, setTiempoLlegada] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [db, setDb] = useState(null);
 
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });
        setDb(database);
      } catch (error) {
        console.error('Error al abrir la base de datos', error);
      }
    };

    initializeDatabase();
  }, []);


  useEffect(() => {
    if (db) {
      // Cargar participantes desde la base de datos
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM participantes',
            [],
            (tx, result) => {
              const rows = result.rows.raw();
              setParticipantes(rows);
            },
            (error) => {
              console.error('Error al ejecutar la consulta SELECT', error);
            }
          );
        },
        (error) => {
          console.error('Error al iniciar la transacción', error);
        }
      );
    }
  }, [db]);

  const handleParticipantePress = (participante) => {
    setSelectedParticipante(participante);
    setModalVisible(true);
  };

  const handleGuardarTiempo = () => {
    if (selectedParticipante) {
      const updatedParticipantes = participantes.map((p) =>
        p.id === selectedParticipante.id ? { ...p, tiempo: tiempoLlegada } : p
      );
      setParticipantes(updatedParticipantes);
      setModalVisible(false);
      setSelectedParticipante(null);
      setTiempoLlegada('');
    }
  };

  const renderParticipanteItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleParticipantePress(item)} style={styles.participanteItem}>
      <Text style={styles.participanteText}>{`${item.nombre} - ${item.edad} - ${item.cedula} - ${item.sexo}`}</Text>
    </TouchableOpacity>
  );

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
              value={tiempoLlegada}
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
