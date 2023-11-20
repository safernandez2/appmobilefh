import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

const ResultadosScreen = ({ participantes }) => {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    console.log('Participantes en ResultadosScreen:', participantes);

    // Filtrar participantes que han llegado y ordenarlos por tiempo
    const participantesOrdenados = participantes
      .filter((participante) => participante.tiempo !== '')
      .sort((a, b) => a.tiempo.localeCompare(b.tiempo));

    setResultados(participantesOrdenados);
  }, [participantes]);

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
