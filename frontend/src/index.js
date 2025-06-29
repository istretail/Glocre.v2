import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store, persistor } from './store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersistGate } from 'redux-persist/integration/react';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>

  </Provider>
);


