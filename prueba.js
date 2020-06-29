else{
  //  console.log(op1.test(element))
  //checa las palabras reservadas
  if(reservadas.test(element)){
      iden.push(element)
  }else if(tablas .test(element)){  //Checa las variables
      if(reservadas.test(element) != true ){
          vari.push(element)
      }
  }else if(valores.test(element)){    //checa los valores 
      valor.push(element)
  }else if(comparacion.test(element)){    //Checa la comparacion
          compa.push(element)
  }else if(signos.test(element)){//checa los signos
          signo.push(element)
  }else if(simblos.test(element)){//checa simbolos
      simbo.push(element)
  }else{
      error.push(element)
  }
}

var columna = new RegExp ("")
var variables_Cadena = new RegExp("")

inner join 
Campos_muestra { 
  Campos : *.Producto 
  Campo1 : id_producto.Ventas ,  
  Campo2 : id , 
  Campo3 : nombre.Producto 
  } ,  
 Tablas { 
  Tabla1 : Productos ,  
  Tabla2 : Ventas 
  } ,  
 Condiciones { 
    On { 
      Condicion_on1 : id.Producto 
      Condicion_on2 : id_Productos.Ventas 
    } ,  
    Where { 
      Condicion_tabla1 : id 
      Condicion_tabla2 : id_Producto 
    } ,  
    Order_by { 
      Condicion_order : id.Productos 
      } 
  } 

  inner join Campos_muestra { Campos : *.Producto Campo1 : id_producto.Ventas ,    Campo2 : id , Campo3 : nombre.Producto } ,  Tablas { Tabla1 : Productos ,  Tabla2 : Ventas } , Condiciones { On { Condicion_on1 : id.Producto Condicion_on2 : id_Productos.Ventas } ,  Where { Condicion_tabla1 : id Condicion_tabla2 : id_Producto  } ,  Order_by { Condicion_order : id.Productos } }
  