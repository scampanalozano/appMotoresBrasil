import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Container from 'react-bootstrap/Container'
import Contenido from './Contenido' ;

function App() {
  return (
    <Container fluid>
      <Header/>
      <Contenido/>

    </Container>
   
  );
}

export default App;
