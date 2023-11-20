import 'setimmediate';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import SQLite from 'react-native-sqlite-storage';



const InscripcionesScreen = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const [sexo, setSexo] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const database = SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });
          setDb(database);
        } else {
          console.warn('Base de datos no disponible en entorno web');
          // Código alternativo para entornos web si es necesario
        }
      } catch (error) {
        console.error('Error al abrir la base de datos', error);
      }
    };

    initializeDatabase();
  }, []);

  const handleInscribir = () => {
    if (!nombre || !edad || !cedula || !sexo) {
      Alert.alert('Completa todos los campos');
      return;
    }

    if (db) {
      db.transaction(
        (tx) => {
          try {
            tx.executeSql(
              'INSERT INTO participantes (nombre, edad, cedula, sexo, tiempo) VALUES (?, ?, ?, ?, ?)',
              [nombre, parseInt(edad), cedula, sexo, ''],
              (tx, result) => {
                console.log('Participante inscrito con éxito');
                setNombre('');
                setEdad('');
                setCedula('');
                setSexo('');
                Alert.alert('Inscripción exitosa');
              },
              (error) => {
                console.error('Error al inscribir al participante', error);
                Alert.alert('Error al inscribir al participante');
              }
            );
          } catch (error) {
            console.error('Error en la transacción', error);
            Alert.alert('Error en la transacción');
          }
        },
        (error) => {
          console.error('Error al iniciar la transacción', error);
          Alert.alert('Error al iniciar la transacción');
        }
      );
    } else {
      console.error('Base de datos no disponible en entorno web');
      Alert.alert('Error: Base de datos no disponible en entorno web');
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
        keyboardType="numeric" // Teclado numérico para la edad
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginTop: 1,
    marginRight: 20,
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
