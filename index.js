var signos = new RegExp ("^,$|^:$"); 
var simblos = new RegExp ("^{$|^}$");
var reservadas = new RegExp ("^and$|^or$|^join$|^left$|^inner$|^right$|^outer$"); 
var tablas = new RegExp ("^[A-Z][a-z]*_*[0-9]*[a-z]*$");
var comparaciones = new RegExp ("^<=?$|^>=?$|^=$|^<>$");
var valores = new RegExp ("^[0-9]+$|^'[a-z]+'$|^\"[a-z]+\"$|^\"[0-3]?[0-9]-[0-1]?[1-9]-20[0-3][0-9]\"$|^'[0-3]?[0-9]-[0-1]?[1-9]-20[0-3][0-9]'$");
var variables_cadena = new RegExp ("^Tablas$|^Campos_muestra$|^Condiciones$|^On$|^Where$|^Order_by$|^Campo[0-9]+$|^Condicion_tabla[0-9]+$|^Tabla[0-9]+|^CondicionOn[0-9]+$|^Condicion_order$|^Campos$|^Condicion_operador$"); 
var columnas = new RegExp ("^[a-z]+_*[0-9]*[a-z]*$|^[a-z]+_?[A-Z]?[a-z]+[.][A-Z][a-z]+_?[a-z]+$|^[*]$|^[*][.][A-Z][a-z]+_?[a-z]+$|^[a-z]+_?[A-Z]?[a-z]+?$");
var valor = false
var valor1 = true
var errores = new RegExp(">>+|=+>+|<<+=+|><|<<+|==+")//|{}|&&&+|^[&]$|^[!]$|^\"$|^'$|#|[$]|[%]|[?]|[¡]|^=$|[+]|;|[°]|[|]|[\[]|\]|¬|^_$|-|[~]|¨|`|\\\\|\\\^|@|^\"+$|^'+$|[)]+\"+|,,+|[)][)]+|[(][(]+|{{+|}}+|''+")//
var errores_Letra = new RegExp ("[a-z]+[-]+|[a-z]+[(]+")//|[a-z]+_?[/]+|[a-z]+_?{+}+|[a-z]+_?[)]+|[a-z]+_?{$}+|[a-z]+_?%+|[a-z]+_?[-]+|[a-z]+_?=+|[a-z]+_?<+|[a-z]+_?>+|[a-z]+_?&+|^[1-9]+[a-z]+_?|^[)]+[a-z]+|^[(]+[a-z]+|^[{]+[a-z]+|^[}]+[a-z]+")//|^\"+[a-z]+[0-9]*$|^[a-z]+\"+|^>+[a-z]+|[a-z]+,+|[a-z]+[.]+")
var errores_Num = new RegExp ("[0-9]+_?|0-9]+_?[(]+|[0-9]+_?[/]+")//|[0-9]+_?{+}+|[0-9]+_?[)]+|[0-9]+_?{$}+|[0-9]+_?%+|[0-9]+_?[-]+|[0-9]+_?=+|[0-9]+_?<+|[0-9]+_?>+|[0-9]+_?&+|^[)]+[0-9]+|^[(]+[0-9]+|^[{]+[0-9]+|^[}]+[0-9]+|^\"+[0-9]+[a-z]*$|[0-9]+_+$|^[0-9]+\"+$")//|[0-9]+_+[0-9]+|<+[0-9]+|>+[0-9]+|[0-9]+!+")

// var letra = /[a-z]/
// var res = /{l}{res}/
function principal() {
    document.getElementById('tablita').innerHTML = '';
    var info_textarea= document.getElementById("exampleFormControlTextarea1").value;    
    var sin_saltos=info_textarea.replace("\n","");
    var otro = sin_saltos.replace("\n","")
    var cadena = otro.split(" ");
    const stack = new Stack();
    var noTerminales = ['function', '(', ')', 'var', ':', 'a...z', 'integer', 'real','boolean', 'string', ';', '$'] 
    var Terminales = ['S','Tipo_Join','Resto_Join','Campos_Mostrar','Ops','Mas','columna','Complemento','Restos_Varios','Tablas_Join','Tabla','Mas_datos','Apartado_Condicion','Tablas_ cruza', 'Ons', 'Mas_datas','Campos_where', 'Opciones', 'Contenido','Simbolos','Resto_Digito','Comparadores','Mas_Where','Operadores','Campo_order','Letra','Digito']
    var reglas = [
      ['Tipo_Join','LETRA','RETOL'],
      ['PARAMETROS',')','PARAMLIST','('],
      ['PARAMLIST','var','VARIABLE','LIST'],
      ['VARIABLE','NOMBRE',':','TIPO'],
      ['RETOL','LETRA','RETOL'],
      ['LETRA','a...z'],
      ['TIPO',['boolean','string','real','integer']],
      ['LIST',';','VARIABLE','LIST']]
    var signo = [];  var simbolo = []; var reservada = [];  var tabla = [];  var comparacion = [];  var valor = []; var var_cadena = []; var columna = []; var error =[]    
    console.log(cadena);    
    var pos = []
    var n = 0
    hay_error = false
    if(info_textarea != ''){
        if(cadena[0] == 'inner'|| cadena[0] == 'left' || cadena[0] == 'right' || cadena[0] ==' outer'){
            console.log('la entrada es valida')
                stack.push('$')
                stack.push('Resto_Join')
                stack.push('join')
                stack.push('Tipo_Join')
                stack.print()
        }else{
            hay_error = true
            alert('Se intrudujo una cadena pero esta no es valida')
        }
        cadena.forEach(element => {
            if(element == "\n" || element == ""){
                pos.push(n)                
            }                            
            if(cadena[n] != "\n" ){
                if(errores.test(element)){
                    error.push(element)                    
                }else{
                    if(hay_error == false){
                        if (reservadas.test(element)) {
                            reservada.push(element)
                        }else
                        
                        if (variables_cadena.test(element)) {                        
                            var_cadena.push(element)
                        }else
    
                        if (tablas.test(element)) {
                            if (variables_cadena.test(element) != true) {
                                tabla.push(element)
                            }
                        }else
    
                        if (columnas.test(element)) {
                            if (reservadas.test(element) != true) {
                                columna.push(element)
                            }
                        }else
    
                        if (valores.test(element)) {
                            valor.push(element)
                        }else
    
                        if (simblos.test(element)) {
                            simbolo.push(element)
                        } else
                        
                        if (signos.test(element)) {
                            signo.push(element)
                        }else
    
                        if (comparaciones.test(element)) {
                            comparacion.push(element)
                        }else
                        
                        {
                            if (cadena[n] != "") {
                                error.push(element)                            
                            }                        
                        }
                    }                    
                }
            }
            n += 1
        });
        console.log(pos);
    }else{
        alert('Introduce una entrada valida')
    }
    impresionTabla(reservada,tabla, signo, var_cadena, simbolo, valor, error, columna, comparacion)
}

function pilaActualizar(datas, rules, stack, cadena) {
    rules.forEach(element => {
      if (element[0] == datas) {    
        //console.log('Quitamos →→ ', stack.pop());
        stack.pop()
        if (cadena != ')') {        
          for (let i = element.length - 1; i >= 1; i--) {
            //console.log('Se agrega → ',stack.push(element[i]))
            stack.push(element[i])
          }        
        }      
      }
    });
    stack.print()
  }

function impresionTabla(reservada,tabla, signo, var_cadena, simbolo, valor, error, columna, comparacion) {
    var fila="<tr> <td>" + 'Palabras reservadas' + "</td> <td>"+'and, or, join, left, inner, right, outer' +"</td> <td style='background-color: greenyellow;' >"+ ''+"</td> <td>" +reservada+"</td> </tr>";
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
    
    var fila="<tr> <td>" + 'Tabla' + "</td> <td>"+'Productos, Ventas' +"</td> <td style='background-color: orange;' >"+ ''+"</td> <td>" +tabla+"</td> </tr>";
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
    
    var fila="<tr> <td>" + 'Comparación' + "</td> <td>"+'<=, >= , <>, =' +"</td> <td style='background-color: orange;' >"+ ''+"</td> <td>" +comparacion+"</td> </tr>";
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
    
    var fila="<tr> <td>" + 'Signos' + "</td> <td>"+': ,' +"</td> <td style='background-color: aquamarine;' >"+ ''+"</td> <td>" +signo+"</td> </tr>";        
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
    
    var fila="<tr> <td>" + 'Variable cadena' + "</td> <td>"+'Tabla, Campos_muestra, condiciones, On, Where, Order_by, Campo1, Tabla1, Condicion_on1, Condicion_tabla1' +"</td> <td style='background-color: teal;' >"+ ''+"</td> <td>" +var_cadena+"</td> </tr>";        
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
    
    var fila="<tr> <td>" + 'Simbolos' + "</td> <td>"+'{, } '+"</td> <td style='background-color: olive;' >"+ ''+"</td> <td>" +simbolo+"</td> </tr>";
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);

    var fila="<tr> <td>" + 'Valor' + "</td> <td>"+'12347, ‘12-12-2020’, “hola”, ‘hola’ ' +"</td> <td style='background-color: purple;' >"+ ''+"</td> <td>" +valor+"</td> </tr>";        
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);    

    var fila="<tr> <td>" + 'Columna' + "</td> <td>"+'nombre_Producto,Id.Producto , *.Poductos' +"</td> <td style='background-color: purple;' >"+ ''+"</td> <td>" +columna+"</td> </tr>";        
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);    
    
    var fila="<tr> <td>" + 'Errores' + "</td> <td>"+'Todo Aquello que no este en la gramática o este fuera de los que se contempló'+"</td> <td style='background-color: red;' >"+ ''+"</td> <td>" + error +"</td> </tr>";        
    var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita").appendChild(btn);
}

function impresionTablaPila(mensaje, data, que_es, numero) {
    if(mensaje == 'pila'){    
        var fila="<tr> <td>" + numero + 1 + "</td> <td>"+ mensaje +"</td><td>"+ data +"</td> <td>" + '' +"</td> </tr>";
        var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
    }else{
        if(que_es == 'reservada'){
            var fila="<tr> <td>" + numero + 1 + "</td> <td>"+ mensaje +"</td><td>"+ data +"</td> <td style='background-color: greenyellow;' >" + '' +"</td> </tr>";
            var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
        }        
    }       
}

function limpiar() {    
    document.getElementById('tablita').innerHTML = '';
    document.getElementById("exampleFormControlTextarea1").value = "";    
}

function mostrar_tabla() {    
    var uno = document.getElementById('mostrar');
    valor?uno.innerText = "Ocultar tabla Tokens":uno.innerText = "Mostrar tabla Tokens";
    valor=!valor
    if (valor == false) {        
        div = document.getElementById('datos_tabla');
        div.style.display = '';
        div1 = document.getElementById('titulo_tokens');
        div1.style.display = '';
    }
    if (valor == true) {        
        div = document.getElementById('datos_tabla');
        div.style.display = 'none';
        div1 = document.getElementById('titulo_tokens');
        div1.style.display = 'none';
    }
}

function mostrar_tabla1() {    
    var uno1 = document.getElementById('mostrar1');
    valor1?uno1.innerText = "Ocultar tabla Pila":uno1.innerText = "Mostrar tabla Pila";
    valor1=!valor1
    if (valor1 == false) {        
        div = document.getElementById('datos_pila');
        div1 = document.getElementById('titulo_pila');
        div.style.display = '';
        div1.style.display = '';
    }
    if (valor1 == true) {        
        div = document.getElementById('datos_pila');
        div1 = document.getElementById('titulo_pila');
        div.style.display = 'none';
        div1.style.display = 'none';
    }
}


class Stack {
    constructor() {
      this.stack = [];
    }
    
    push(element) {
      this.stack.push(element);
      return this.stack;
    }
    
    pop() {
      return this.stack.pop();
    }
    
    peek() {
      return this.stack[this.stack.length - 1];
    }
    
    size() {
      return this.stack.length;
    }
  
    print() {
      console.log(this.stack);
    }
}  