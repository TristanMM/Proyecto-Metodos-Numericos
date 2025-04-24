valores = [0,1]
funcionEscrita = "x**3 - x*5 + 1";
iT=-1;
error=3;





function resolverOperacion(rango, funcion, iteracion, margenError){
    
    //declarar el Xi y el Xi-1 (para evitar problemas de syntaxis se escribe como Xi1 en lugar de Xi-1)
    Xi = rango[1]; 
    Xi1 = rango[0];

   if (iteracion > 0 ) {
    for (let i = 1; i < iteracion; i++) {
        // resolver la funcion para Xi
        expresionXi =cambiarValor(funcion,"x",`(${Xi})`);

        FXi=  eval(expresionXi);

        // resolver la funcion para Xi1
        expresionXi1 = cambiarValor(funcion,"x",`(${Xi1})`);
        FXi1= eval(expresionXi1);

        NuevaXi= Xi - (FXi*(Xi1-Xi))/(FXi1-FXi);

        console.log("iteracion :"+ i +",  xi = "+ Xi + " FXi = " + FXi + ", " + "xi1 = "+ Xi1 + " FXi1 = " + FXi1+" nuevaXi = "+NuevaXi);
        Xi1 = Xi;
        Xi = NuevaXi;
      }

            
   }else if(margenError >= 0){
     
        while ( ErrorValor <= margenError ){
            // resolver la funcion para Xi
            expresionXi =cambiarValor(funcion,"x",`(${Xi})`);

            FXi=  eval(expresionXi);

            // resolver la funcion para Xi1
            expresionXi1 = cambiarValor(funcion,"x",`(${Xi1})`);
            FXi1= eval(expresionXi1);

            NuevaXi= Xi - (FXi*(Xi1-Xi))/(FXi1-FXi);

            console.log("iteracion :"+ i +",  xi = "+ Xi + " FXi = " + FXi + ", " + "xi1 = "+ Xi1 + " FXi1 = " + FXi1+" nuevaXi = "+NuevaXi);
            Xi1 = Xi;
            Xi = NuevaXi;
            ErrorValor= valorAbsoluto((Xi-Xi1)/Xi) * 100;
            
            console.log(ErrorValor);
        }
      
   }

    

}

function cambiarValor(entrada,valorA,valorB){
    return salida = entrada.replaceAll(valorA,valorB);
}
function valorAbsoluto(x) {
    if (x < 0) {
      return -x;
    } else {
      return x;
    }
  }

resolverOperacion(valores,funcionEscrita,iT,3);





