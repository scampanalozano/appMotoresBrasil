import React from 'react';


 class Documento {

    busqueda =(documentoPrincipal, documentoProveedor) =>{
        let camposPrincipal = Object.keys(documentoPrincipal[0]);
        let camposProveedor = Object.keys(documentoProveedor[0]);
        let docFinal = [];
        if(this.validacionCampos(camposPrincipal, camposProveedor)){
            // let docPrincipal = this.busquedaCodigoDescripcion(documentoPrincipal, documentoPrincipal, 2);
            // let docProveedor = this.busquedaCodigoDescripcion(documentoProveedor, documentoProveedor, 2);
            docFinal = this.busquedaCodigoDescripcion(documentoPrincipal, documentoProveedor, 1);
        }
        return docFinal;
    }

    busquedaInterna(documento){
        return this.busquedaCodigoDescripcion(documento, documento, 2);
    }

    busquedaCodigoDescripcion = (documentoPrincipal, documentoProveedor, tipo ) =>{
        let camposPrincipal = Object.keys(documentoPrincipal[0]);
        let camposProveedor = Object.keys(documentoProveedor[0]);
        
        let documentoFinal = []
        documentoPrincipal.forEach(principal => {
            documentoProveedor.forEach(proveedor => {
                if (principal[camposPrincipal[0]] === proveedor[camposProveedor[0]]){//valida codigo
                    proveedor[camposPrincipal[1]] = principal[camposProveedor[1]];
                    if (proveedor[camposProveedor[3]] >= 5){// stock 
                        if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                            if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                principal = proveedor;
                                if(tipo === 1){
                                    principal = this.modificarItem(principal, proveedor, camposPrincipal);
                                    principal['ESTADO'] = 'MODIFICADO';
                                }
                            }
                        }else {
                            if(tipo == 1){
                                proveedor['ESTADO'] = 'NUEVO';
                                if(this.validarDuplicado(documentoFinal, proveedor, camposProveedor)){
                                    documentoFinal.push(proveedor);
                                }
                            }
                        }
                    }
                } else {
                    if(this.validacionDescripcion(principal[camposPrincipal[1]], proveedor[camposProveedor[1]])){//valida descripcion
                        proveedor[camposPrincipal[1]] = principal[camposProveedor[1]];
                        if (proveedor[camposProveedor[3]] >= 5){// stock 
                            if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                                if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                    principal = proveedor;
                                    if(tipo == 1){
                                        principal['ESTADO'] = 'MODIFICADO';
                                    }
                                }
                            }else {
                                if(tipo == 1){
                                    proveedor['ESTADO'] = 'NUEVO E';
                                    if(this.validarDuplicado(documentoFinal, proveedor, camposProveedor)){
                                        documentoFinal.push(proveedor);
                                    }
                                }
                            }
                        }
                    }else{
                        if(tipo == 1){
                            proveedor['ESTADO'] = 'NUEVO N';
                            if(this.validarDuplicado(documentoFinal, proveedor, camposProveedor)){
                                documentoFinal.push(proveedor);
                            }
                        }
                    }
                }
            });
            
            if(this.validarDuplicado(documentoFinal, principal, camposPrincipal)){
                documentoFinal.push(principal);
            }
        });
        
        if(tipo === 2){
            documentoFinal = this.ordenarArray(documentoFinal, camposPrincipal[0]);
        } 
        if(tipo == 1){
            documentoFinal = this.ordenarArray(documentoFinal, camposPrincipal[1]);
        }
        return documentoFinal; 
    }
    
    validacionDescripcion = (descripcionPrincipal, descripcionProveedor) => {
        if(descripcionPrincipal != undefined && descripcionProveedor != undefined){
            let arrayDescripcionPrincipal = descripcionPrincipal.split(' ');
            let arrayDescripcionProveedor = descripcionProveedor.split(' ');

            let contadorPalabras = 0;
            arrayDescripcionPrincipal.forEach((palabraPri) => {
                arrayDescripcionProveedor.forEach((palabraPro) => {
                    if(palabraPro != '' && palabraPro != '-' && palabraPro != '.' && palabraPro != ' ' && 
                        palabraPro == palabraPri){
                        contadorPalabras++;
                    }
                });
            });
            let porcentaje = (contadorPalabras * 100)/arrayDescripcionPrincipal.length;
            if(porcentaje >= 90){
                return true;
            }
            return false;
        }
        return false;
    }

    modificarItem(principal, proveedor, camposPrincipal){
        let item = {};
        camposPrincipal.forEach((campo, index) => {
            if(index == 4 || index == 5){
                item[campo] = proveedor[campo];
            }else{
                item[campo] = principal[campo];
            }
        });
        return item;
    }
           
    ordenarArray(documento, campo){
        return documento.sort(function (a, b) {
            if (a[campo] > b[campo]) {
              return 1;
            }
            if (a[campo] < b[campo]) {
              return -1;
            }
            // a must be equal to b
            return 0;
        });
    }

    validarDuplicado(array, itemValidar, campos){
        // let contador = 0;
        let resultado = false;
        let indexItem = array.indexOf(itemValidar);
        //array.forEach(item => {
            //if(item[campos[0]] == itemValidar[campos[0]] &&
              //  item[campos[1]] == itemValidar[campos[1]] &&
                //item[campos[2]] == itemValidar[campos[2]]){
                  //  contador++;
           // }
        //});
        if(indexItem == -1){
            resultado = true;
        }
        return resultado;
    }
    
    validacionCampos(camposPrincipal, camposProveedor){
        let validacion = false;
        let contador = 0;
        if(camposPrincipal.length == camposProveedor.length){
            validacion = true;
        }
        if(validacion){
            camposPrincipal.forEach(campoPrincipal => {
                camposProveedor.forEach(campoProveedor => {
                    if(campoPrincipal.trim() === campoProveedor.trim()){
                        contador++;
                    }
                })
            })
        }
        validacion = false;
        if(contador == camposPrincipal.length){
            validacion = true;
        }
        return validacion;
    }

    busquedaSobrantes(documentoProveedor, documentoFinal){
        console.log('ingresa funcion');
        console.log('antes',documentoProveedor);
        documentoFinal.forEach(proveedor => {
            let index = documentoProveedor.indexOf(proveedor);
            documentoProveedor.splice(index, 1);
        });
        console.log('despues', documentoProveedor);
        return documentoProveedor;
    }



}





 




export default Documento;