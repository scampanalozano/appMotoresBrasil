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
                                documentoModificadosProveedor.push(proveedor);
                            }
                        }else {
                            if(tipo == 1){
                                proveedor['ESTADO'] = 'NUEVO';
                                documentoNuevos.push(proveedor);
                                documentoModificadosProveedor.push(proveedor);
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
                                    principal['ESTADO'] = 'MODIFICADO';
                                    documentoModificadosProveedor.push(proveedor);
                                }
                            }else {
                                if(tipo == 1){
                                    proveedor['ESTADO'] = 'NUEVO';
                                    documentoNuevos.push(proveedor);
                                    documentoModificadosProveedor.push(proveedor);
                                }
                            }
                        }
                    }else{
                        if(tipo == 1){
                            if(!documentoNuevos.includes(proveedor)){
                                documentoNuevos.push(proveedor);
                            }
                            if(!documentoModificadosProveedor.includes(proveedor)){
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
            documentoFinal = this.eliminarDuplicados(documentoFinal, camposPrincipal);
            return documentoFinal; 
        } 
        if(tipo == 1){
            console.log(documentoModificadosProveedor);
            documentoModificadosProveedor.forEach(proveedor => {
                let index = documentoProveedor.indexOf(proveedor);
                documentoProveedor.splice(index, 1);
            });
            documentoFinal = this.eliminarDuplicados(documentoFinal, camposPrincipal);
            documentoFinal = this.ordenarArray(documentoFinal, camposPrincipal[1]);
            documentoProveedor = this.ordenarArray(documentoProveedor, camposProveedor[1]);

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
            if(index == 4 || index == 5){
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

        originalArray = this.ordenarArray(originalArray, prop[0]);
        var elementoInit = originalArray[0];

        for(var i in originalArray) {
            if(i > 0){
                if(elementoInit[prop[0]] == originalArray[i][prop[0]] && elementoInit[prop[1]] == originalArray[i][prop[1]] && elementoInit[prop[2]] == originalArray[i][prop[2]]){
                    elementoInit = originalArray[i];
                }else{
                    lookupObject[originalArray[i][prop[0]]] = originalArray[i];
                }
            }else{
                lookupObject[originalArray[i][prop[0]]] = originalArray[i];
            }

        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
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





}





 




export default Documento;