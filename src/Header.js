import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Header.css';
import MB from './MB.png';
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container';


const Header = () => {
  return (
    <Container fluid>
      <Row className='header'>
        <Col lg="10" md="10" xs="12">
          <Row>
            <Col className='titulo' lg="12" md="12" xs="12">
              Comparador de Repuestos
            </Col>
            <Col className='titulo' lg="12" md="12" xs="12">
              Motores del Brasil
            </Col>
          </Row>
        </Col>
        <Col lg="2" md="2" xs="12" className='div-image'>
          <div >
            <Image className='MB'
              src={MB}
              fluid

            />
          </div>
        </Col>
      </Row>
    </Container>
  );


}

export default Header;