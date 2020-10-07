import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import * as XLSX from 'xlsx'
import Button from "react-bootstrap/Button"
import Documento from '../Servicios/Documento'
import './Principal.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

class Principal extends React.Component {

    constructor() {
        super();
        this.state = {
            archivo1: null,
            archivo2: null,
            archivoFinal:[],
            camposArchivo: []
        }
        this.Documento= new Documento();
    }

    handleInputChange = (event) => {
        const target = event.target
        const name = target.name
        let reader = new FileReader();
        reader.readAsArrayBuffer(target.files[0])
        reader.onloadend = (e) => {
            this.readFile(e, name);
        } 
        
    }

    readFile = (e, name) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        workbook.SheetNames.forEach((sheetName) => {
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if(name == 'file1'){
                this.setState({
                    archivo1: XL_row_object
                });
            }else{
                this.setState({
                    archivo2: XL_row_object
                });
            }
        })
    }

    procesarPorCodigo = () =>{
        console.log(this.state);
        let archivoFinal =  this.Documento.busqueda(this.state.archivo1, this.state.archivo2);
        if(archivoFinal.length > 0){
            let camposArchivo = Object.keys(archivoFinal[0]);
            console.log(archivoFinal);
            this.setState({
                archivoFinal: archivoFinal,
                camposArchivo: camposArchivo
            })
        }else{
            alert('Los archivos no tienen campos iguales');
        }
    }
    

    descargar = ()=>{
        console.log('descargar');
        let ws = XLSX.utils.json_to_sheet(this.state.archivoFinal, {header: this.state.camposArchivo});
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS")
        let exportFileName = `workbook.xls`;
        XLSX.writeFile(wb, exportFileName)
    }

    render(){
        return (
            <Container className='contenedor'>

                
                <Row>
    
                    <Col>
                    <div>
                    <label>
                    <strong>
                    Base de datos Principal
                    </strong>
                        </label>
                        </div>
                    <input 
                        required
                        type= "file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        name="file1"
                        id="file1"
                        onChange = {this.handleInputChange}
                        placeholder="Archivo excel"
                        />
                    </Col>
    
                    <Col>
                    <div>

                 
                    <label>
                       
                        <strong>
                        Base de datos Proveedor

                        </strong>
                        </label>
                        </div>
                    <input 
                        required
                        type= "file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        name="file2"
                        id="file2"
                        onChange = {this.handleInputChange}
                        placeholder="Archivo excel"
                        />
                    </Col>
        
                </Row>
                <Row>
                    <div className= 'botones'>
                    <Button type="button" onClick={this.procesarPorCodigo} className='separador'>Procesar</Button>
                    <Button type="button" onClick={this.descargar}>Descargar</Button>
                    </div>
                </Row>
                <Row>
                    <Table striped bordered className= 'tabla'>
                        <thead>
                            <tr>
                                {this.state.camposArchivo.map((campo, indexC)=> (
                                    <th key={indexC}>
                                        {campo}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.archivoFinal.map ((item, index)=>
                            (<tr key={index}>
                                {this.state.camposArchivo.map((campo, indexC)=> (
                                    <td key={indexC}>
                                        {item[campo]}
                                    </td>
                                ))}
                            </tr>) 
                        )}
                        </tbody>
                    </Table> 
                </Row>

            </Container>
        );
    
    }
}

export default Principal;