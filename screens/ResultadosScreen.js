import moment from 'moment';
import 'moment/locale/es';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultadosScreen = () => {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        const participantesOrdenados = participantes
          .filter((participante) => participante.tiempo !== '')
          .sort((a, b) => {
            const tiempoA = parseInt(a.tiempo, 10);
            const tiempoB = parseInt(b.tiempo, 10);

            return tiempoA - tiempoB;
          });

        setResultados(participantesOrdenados);
      } catch (error) {
        console.error('Error al cargar la lista de participantes para resultados', error);
      }
    };

    cargarResultados();
  }, []);

  const renderParticipanteItem = ({ item, index }) => (
    <View style={{ padding: 10 }}>
      <Text>{`${index + 1}.${item.nombre} - ${formatTiempo(item.tiempo)}`}</Text>
    </View>
  );

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }

    const tiempoMoment = moment(tiempo, 'Hmm');
    return tiempoMoment.format('HH:mm');
  };

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
