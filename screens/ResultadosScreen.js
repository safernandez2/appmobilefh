import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultadosScreen = () => {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        // Obtener la lista actual de participantes desde el almacenamiento
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        // Filtrar participantes que han llegado y ordenarlos por tiempo
        const participantesOrdenados = participantes
          .filter((participante) => participante.tiempo !== '')
          .sort((a, b) => a.tiempo.localeCompare(b.tiempo));

        setResultados(participantesOrdenados);
      } catch (error) {
        console.error('Error al cargar la lista de participantes para resultados', error);
      }
    };

    cargarResultados();
  }, []);

  const renderParticipanteItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{`Nombre: ${item.nombre} - Tiempo de llegada: ${item.tiempo}`}</Text>
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Resultados de Participantes</Text>
      {resultados.length > 0 ? (
        <FlatList
          data={resultados}
          renderItem={renderParticipanteItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>Ningún participante ha llegado todavía.</Text>
      )}
    </View>
  );
};

export default ResultadosScreen;
