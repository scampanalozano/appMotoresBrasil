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
        
        let documentoModificados = []
        let documentoNuevos = []
        let documentoModificadosProveedor = []
        let documentoSobrantes = []
        documentoPrincipal.forEach(principal => {
            documentoProveedor.forEach(proveedor => {
                if (principal[camposPrincipal[0]] === proveedor[camposProveedor[0]]){
                    if (proveedor[camposProveedor[3]] >= 5){// stock 
                        if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                            if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                principal = proveedor;
                                if(tipo === 1){
                                    principal = this.modificarItem(principal, proveedor, camposPrincipal);
                                    principal['ESTADO'] = 'MODIFICADO';
                                }
                                documentoModificadosProveedor.push(proveedor);
                            }
                        }else {
                            proveedor['ESTADO'] = 'NUEVO';
                            documentoNuevos.push(proveedor);
                            documentoModificadosProveedor.push(proveedor);
                        }
                    }
                } else {
                    if(this.validacionDescripcion(principal[camposPrincipal[1]], proveedor[camposProveedor[1]])){
                        if (proveedor[camposProveedor[3]] >= 5){// stock 
                            if(principal[camposPrincipal[2]] === proveedor[camposProveedor[2]]){// compracion de marca
                                if(proveedor[camposProveedor[4]] < principal[camposPrincipal[4]]){// comparacion del precio
                                    principal = proveedor;
                                    principal['ESTADO'] = 'MODIFICADO';
                                    documentoModificadosProveedor.push(proveedor);
                                }
                            }else {
                                proveedor['ESTADO'] = 'NUEVO';
                                documentoNuevos.push(proveedor);
                                documentoModificadosProveedor.push(proveedor);
                            }
                        }
                    }
                }
            });
            documentoModificados.push(principal);
        });
        let documentoFinal = documentoModificados.concat(documentoNuevos);
        if(tipo === 2){
            documentoFinal = this.eliminarDuplicados(documentoFinal, camposPrincipal[0]);
            return documentoFinal; 
        } 
        if(tipo == 1){
            console.log(documentoModificadosProveedor);
            documentoModificadosProveedor.forEach(proveedor => {
                let index = documentoProveedor.indexOf(proveedor);
                documentoProveedor.splice(index, 1);
            });
            console.log(documentoProveedor);
            return {docFinal: documentoFinal, docProveedor: documentoProveedor}; 

        }
    }
    
    validacionDescripcion = (descripcionPrincipal, descripcionProveedor) => {
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

    modificarItem(principal, proveedor, camposPrincipal){
        let item = {};
        camposPrincipal.forEach((campo, index) => {
            if(index == 1 || index == 4 || index == 5){
                item[campo] = proveedor[campo];
            }else{
                item[campo] = principal[campo];
            }
        });
        return item;
    }
           
    eliminarDuplicados(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in originalArray) {
           lookupObject[originalArray[i][prop]] = originalArray[i];
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
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
        //console.log(contador, camposPrincipal.length);
        if(contador == camposPrincipal.length){
            validacion = true;
        }
        return validacion;
    }





}





 




export default Documento;