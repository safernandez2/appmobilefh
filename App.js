// App.js
import React, {useEffect} from 'react';
import AppNavigator from './AppNavigator';
import initializeDatabase from './database';

const App = () => {

  useEffect(()=>{
    initializeDatabase();
  }, [])

  return <AppNavigator />;
};

export default App;
