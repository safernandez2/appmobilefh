import moment from 'moment';
import 'moment/locale/es';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultadosScreen = () => {
  const [resultados, setResultados] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

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
      <Text>{`${index + 1}.${item.nombre}`}</Text>
      <Text>{`Tiempo: ${formatTiempo(item.tiempo)}`}</Text>
    </View>
  );

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }

    const tiempoMoment = moment(tiempo, 'Hmm');
    return tiempoMoment.format('HH:mm');
  };

  const renderGenreButtons = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Masculino' ? 'lightblue' : 'transparent' }}
        onPress={() => setSelectedGenre('Masculino')}
      >
        <Text>Masculino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Femenino' ? 'lightblue' : 'transparent' }}
        onPress={() => setSelectedGenre('Femenino')}
      >
        <Text>Femenino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Otro' ? 'lightblue' : 'transparent' }}
        onPress={() => setSelectedGenre('Otro')}
      >
        <Text>Otro</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredResultados = selectedGenre
    ? resultados.filter((participante) => participante.sexo === selectedGenre)
    : resultados;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Resultados de Participantes</Text>
      {renderGenreButtons()}
      {filteredResultados.length > 0 ? (
        <FlatList
          data={filteredResultados}
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
