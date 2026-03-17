import React from 'react';
import { createRoot } from 'react-dom/client';
import BodyCurveLanding from './BodyCurveLanding.jsx';
import Reservation from './Reservation.jsx';
import Success from './Success.jsx';

const path = window.location.pathname;
const App =
  path === '/reservation' ? Reservation :
  path === '/success'     ? Success :
  BodyCurveLanding;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);