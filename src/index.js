import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ThemeProvider } from 'styled-components';
const theme = {
  colors: {
    primary: '#8600FF',
    secondary: '#FF0080'
  }
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

