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
        
        let documentoFinal = [];
        let documentoProveedoresModificado = [];
        documentoPrincipal.forEach(principal => {
            let itemModifocado = false;
            documentoProveedor.forEach(proveedor => {
                if (principal[camposPrincipal[0]].toString() === proveedor[camposProveedor[0]].toString()){//valida codigo
                    console.log('cod:',principal[camposPrincipal[0]], proveedor[camposProveedor[0]]);
                    proveedor[camposPrincipal[1]] = principal[camposProveedor[1]];
                    if (proveedor[camposProveedor[3]] >= 5){// stock 
                        if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                            if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                principal = proveedor;
                                itemModifocado = true;
                            }
                        }else {
                            if(tipo == 1){
                                if(this.validarDuplicado(documentoFinal, proveedor, camposProveedor)){
                                    proveedor['ESTADO'] = 'NUEVA MARCA Y NORMALIZADO';
                                    documentoFinal.push(proveedor);
                                }
                            }
                        }
                    }
                } else {
                    if(this.validacionDescripcion(principal[camposPrincipal[1]], proveedor[camposProveedor[1]])){//valida descripcion
                        if(tipo == 1){
                            proveedor[camposPrincipal[1]] = principal[camposProveedor[1]];
                        }
                        console.log('desc:',principal[camposPrincipal[0]], proveedor[camposProveedor[0]]);
                        if (proveedor[camposProveedor[3]] >= 5){// stock 
                            if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                                if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                    principal = proveedor;
                                    itemModifocado = true;
                                }
                            }else {
                                if(tipo == 1){
                                    if(this.validarDuplicado(documentoFinal, proveedor, camposProveedor)){
                                        proveedor['ESTADO'] = 'NUEVA MARCA Y';
                                        documentoFinal.push(proveedor);
                                        console.log('agrega NuevoDes', proveedor[camposProveedor[0]], proveedor);
                                    }
                                }
                            }
                        }
                    }
                }
                if(tipo == 1){
                    if(this.validarDuplicado(documentoProveedoresModificado, proveedor, camposProveedor)){
                        documentoProveedoresModificado.push(proveedor);
                    }
                }
            });
            
            if(this.validarDuplicado(documentoFinal, principal, camposPrincipal)){
                if(principal[camposPrincipal[0]] == '96143112'){
                    console.log('agrega Mod', principal[camposPrincipal[0]], principal);
                }
                if(tipo === 1 && itemModifocado){
                    principal['ESTADO'] = 'MODIFICADO Y NORMALIZADO';
                }
                documentoFinal.push(principal);
            }
        });
       
        if(tipo === 2){
            documentoFinal = this.ordenarArray(documentoFinal, camposPrincipal[0]);
            return documentoFinal;
        } 
        if(tipo == 1){
            let documentoUsados = [];
            let documentoSobrantes = [];
            let documentoNuevos = [];
            documentoFinal.forEach(principal => {
                documentoProveedoresModificado.forEach(proveedor => {
                    if(proveedor[camposProveedor[0]] == principal[camposPrincipal[0]] &&
                        proveedor[camposProveedor[1]] == principal[camposPrincipal[1]] &&
                        proveedor[camposProveedor[2]] == principal[camposPrincipal[2]]){
                            if(proveedor[camposProveedor[4]] > principal[camposPrincipal[4]]){
                                if(this.validarDuplicado(documentoSobrantes, proveedor, camposProveedor)){
                                    documentoSobrantes.push(proveedor);
                                }
                            }else{
                                if(this.validarDuplicado(documentoUsados, proveedor, camposProveedor)){
                                    documentoUsados.push(proveedor);
                                }
                            }
                    }else{
                        if (proveedor[camposProveedor[3]] < 5){
                            if(this.validarDuplicado(documentoSobrantes, proveedor, camposProveedor)){
                                documentoSobrantes.push(proveedor);
                            }
                        }
                    }
                })

            })
            documentoUsados.forEach(proveedor => {
                let index = documentoProveedoresModificado.indexOf(proveedor);
                documentoProveedoresModificado.splice(index, 1);
                // if(proveedor['ESTADO'] == 'NUEVA MARCA'){
                //     documentoFinal.forEach((principal, indexF) => {
                //         if(proveedor[camposPrincipal[1]] == principal[camposPrincipal[1]] &&
                //             proveedor[camposPrincipal[2]] == principal[camposPrincipal[2]] &&
                //             proveedor['ESTADO'] == principal['ESTADO']){
                //             console.log(principal);
                //             documentoFinal.splice(indexF, 1);
                //         }
                //     })
                // }
            });
            documentoSobrantes.forEach(proveedor => {
                let index = documentoProveedoresModificado.indexOf(proveedor);
                documentoProveedoresModificado.splice(index, 1);
            });
            
            documentoProveedoresModificado.forEach(proveedor => {
                proveedor['ESTADO'] = 'NUEVO';
                documentoFinal.push(proveedor);
            });
            documentoFinal = this.ordenarArray(documentoFinal, camposPrincipal[1]);
            return {docFinal: documentoFinal, docSobrantes: documentoSobrantes};
        }
         
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
            if(porcentaje >= 98){
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
        let resultado = false;
        let indexItem = array.indexOf(itemValidar);
        
        if(indexItem == -1){
            resultado = true;
        }
        return resultado; 
    }

    validarDuplicadosEstado(array, itemValidar, campos){
        let resultado = false;
        let contador = 0;
        array.forEach(item => {
            if(item[campos[0]] == itemValidar[campos[0]] &&
               item[campos[1]] == itemValidar[campos[1]] &&
                item[campos[2]] == itemValidar[campos[2]]){
                   
                   contador++;
           }
        });
        
        if(contador == 0){
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
       
        documentoFinal.forEach(proveedor => {
            let index = documentoProveedor.indexOf(proveedor);
            documentoProveedor.splice(index, 1);
        });
        
        return documentoProveedor;
    }



}





 




export default Documento;