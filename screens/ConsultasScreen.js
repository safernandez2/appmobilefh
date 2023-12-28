import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConsultasScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [filteredParticipante, setFilteredParticipante] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        setParticipantes(participantes);
      } catch (error) {
        console.error('Error al cargar la lista de participantes', error);
      }
    };

    cargarParticipantes();
  }, []);

  const handleSearch = () => {
    setError(''); // Limpiar el mensaje de error al comenzar una nueva búsqueda

    const isNumeric = /^\d+$/.test(searchText);
    if (isNumeric && searchText.length === 10) {
      const filtered = participantes.find((participante) => participante.cedula === searchText);
      if (filtered) {
        setFilteredParticipante(filtered);
      } else {
        setError('Participante no encontrado');
        setFilteredParticipante(null); // Limpiar los datos del participante si no se encuentra
      }
    } else {
      setError('La cédula debe contener solo números y tener una longitud de 10 dígitos');
      setFilteredParticipante(null); // Limpiar los datos del participante si hay error
    }
  };

  const renderParticipanteDetails = () => {
    if (filteredParticipante) {
      return (
        <View style={{ padding: 10 }}>
          <Text>{`Nombre: ${filteredParticipante.nombre}`}</Text>
          <Text>{`Cedula: ${filteredParticipante.cedula}`}</Text>
          <Text>{`Tiempo: ${formatTiempo(filteredParticipante.tiempo)}`}</Text>
        </View>
      );
    } else if (error) {
      return <Text>{error}</Text>;
    } else {
      return null;
    }
  };

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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Consulta de Participantes</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        placeholder="Buscar por cédula"
        onChangeText={(text) => {
          // Validar que solo se ingresen números
          if (/^\d+$/.test(text) || text === '') {
            setSearchText(text);
          }
        }}
        value={searchText}
        keyboardType="numeric"
        maxLength={10}
      />
      <Button
        title="Buscar"
        onPress={handleSearch}
        disabled={searchText.length !== 10}
      />
      {renderParticipanteDetails()}
    </View>
  );
};

export default ConsultasScreen;
