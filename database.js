// database.js
import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';

const initializeDatabase = () => {
  console.log('Iniciando la inicialización de la base de datos...');

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const db = SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });

    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS participantes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, edad INTEGER, cedula TEXT, sexo TEXT, tiempo TEXT)',
            [],
            (tx, result) => {
              console.log('Tabla de participantes creada con éxito');
              resolve();
            },
            (error) => {
              console.error('Error al crear la tabla de participantes', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error('Error al iniciar la transacción', error);
          reject(error);
        }
      );
    });
  }
};


export default initializeDatabase;
