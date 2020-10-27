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
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from '../Componentes/ProgressBar';

class Principal extends React.Component {

    constructor() {
        super();
        this.state = {
            archivo1: null,
            archivo2: null,
            archivoFinal: [],
            archivoSobrantesProveedor: [],
            camposArchivo: [],
            procesando: 0,
            inicioProceso: false,
            cargaArchivo: false,
            datosVisualizar: [],
        }
        this.Documento = new Documento();
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
        var workbook = XLSX.read(data, { type: 'array' });
        workbook.SheetNames.forEach((sheetName) => {
            this.setState({cargaArchivo: true});
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            setTimeout(()=>{
                let archivo = this.Documento.busquedaInterna(XL_row_object);
                if (name == 'file1') {
                    this.setState({
                        archivo1: archivo,
                        cargaArchivo: false,
                    });
                } else {
                    this.setState({
                        archivo2: archivo,
                        cargaArchivo: false,
                    });
                }
            }, 200)
        })
    }

    procesarPorCodigo = () => {
        if(this.state.archivo1 != null && this.state.archivo2 != null){
            this.setState({inicioProceso: true});
            setTimeout(()=>{
                let archivoFinal = this.Documento.busqueda(this.state.archivo1, this.state.archivo2);
                if (!Array.isArray(archivoFinal)) {
                    if (archivoFinal.docFinal.length > 0) {
                        let camposArchivo = Object.keys(archivoFinal.docFinal[0]);
                        let datosVisualizar = this.agregarCssArray(archivoFinal.docFinal);
                        this.setState({
                            archivoFinal: archivoFinal.docFinal,
                            archivoSobrantesProveedor: archivoFinal.docSobrantes,
                            camposArchivo: camposArchivo,
                            datosVisualizar: datosVisualizar,
                            inicioProceso: false
                        })
                    } else {
                        this.setState({inicioProceso: false});
                        alert('Los archivos no tienen campos iguales');
                    }
                } else {
                    this.setState({inicioProceso: false});
                    alert('Los archivos no tienen campos iguales');
                }
            }, 200);
        }else{
            alert('No se han cargardo los archivos');
        }
    }

    descargar = () => {
        this.procesoDescarga(this.state.archivoFinal, this.state.camposArchivo, 'principal');
        this.procesoDescarga(this.state.archivoSobrantesProveedor, this.state.camposArchivo, 'sobrantes');
        
    }


    agregarCssArray(array){
        let datosVisualizar = [];
        array.map((itemArray) => {
            let item = Object.assign({}, itemArray);
            item['css'] = '';
            if(itemArray['ESTADO'] == 'MODIFICADO Y NORMALIZADO'){
                item['css'] = 'modificados';
            }
            if(itemArray['ESTADO'] == 'NUEVA MARCA Y NORMALIZADO'){
                item['css'] = 'nuevos-marca';
            }
            if(itemArray['ESTADO'] == 'NUEVO'){
                item['css'] = 'nuevos';
            }
            datosVisualizar.push(item);
        });;
        return datosVisualizar;
    }


    procesoDescarga(archivo, campos, nombre){
        let ws = XLSX.utils.json_to_sheet(archivo, { header: campos });
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let fechaString = fecha.getFullYear()+'-'+mes+'-'+fecha.getDate();
        let exportFileName = `${nombre}-${fechaString}.xls`;
        XLSX.writeFile(wb, exportFileName)
    }

    render() {
        let disabled = '';
        if(this.state.inicioProceso){
            disabled  = 'disabled';
        }

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
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            name="file1"
                            id="file1"
                            onChange={this.handleInputChange}
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
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            name="file2"
                            id="file2"
                            onChange={this.handleInputChange}
                            placeholder="Archivo excel"
                        />
                    </Col>

                </Row>
                <Row>
                    <div className='botones'>
                        <Button type="button" onClick={this.procesarPorCodigo} className='separador' disabled={disabled}>Procesar</Button>
                        {/* <Button type="button" onClick={this.sobrantes} className='separador' disabled={disabled}>Sobrantes</Button> */}
                        <Button type="button" onClick={this.descargar} disabled={disabled}>Descargar</Button>
                    </div>
                </Row>
                <Row>
                    {this.state.inicioProceso || this.state.cargaArchivo?(
                    <Spinner className='progress-bar' animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    ):(
                        <div></div>
                    )}
                </Row>
                <Row>
                    <Table>
                        <tr>
                            <td align="center">
                                <span>Modificado</span> 
                                <div className="div-senal modificados"></div>
                            </td>
                            <td align="center">
                                <span>Nueva Marca</span> 
                                <div className="div-senal nuevos-marca"></div>
                            </td>
                            <td align="center">
                                <span>Nuevo</span> 
                                <div className="div-senal nuevos"></div>
                            </td>
                        </tr>
                    </Table>
                </Row>
                <Row>
                    <Table striped bordered className='tabla'>
                        <thead>
                            <tr>
                                {this.state.camposArchivo.map((campo, indexC) => (
                                    <th key={indexC}>
                                        {campo}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.datosVisualizar.map((item, index) =>
                                (<tr key={index} className={item['css']}>
                                    {this.state.camposArchivo.map((campo, indexC) => (
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