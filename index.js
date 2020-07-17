// Reglas semanticas
var signos = new RegExp ("^,$|^:$"); 
var simbolos = new RegExp ("^{$|^}$");
var reservadas = new RegExp ("^and$|^or$|^join$|^left$|^inner$|^right$|^outer$"); 
var tablas = new RegExp ("^[A-Z][a-z]*_*[0-9]*[a-z]*$");
var comparaciones = new RegExp ("^<=?$|^>=?$|^=$|^<>$");
var valores = new RegExp ("^[0-9]+$|^'[a-z]+'$|^\"[a-z]+\"$|^\"[0-3]?[0-9]-[0-1]?[1-9]-20[0-3][0-9]\"$|^'[0-3]?[0-9]-[0-1]?[1-9]-20[0-3][0-9]'$");
var variables_cadena = new RegExp ("^Tablas$|^Campos_muestra$|^Condiciones$|^On$|^Where$|^Order_by$|^Campo[0-9]+$|^Condicion_tabla[0-9]+$|^Tabla[0-9]+|^CondicionOn[0-9]+$|^Condicion_order$|^Campos$|^Condicion_operador$"); 
var columnas = new RegExp ("^[a-z]+_*[0-9]*[a-z]*$|^[a-z]+_?[A-Z]?[a-z]+[.][A-Z][a-z]+_?[a-z]+$|^[*]$|^[*][.][A-Z][a-z]+_?[a-z]+$|^[a-z]+_?[A-Z]?[a-z]+?$");
var errores = new RegExp(">>+|=+>+|<<+=+|><|<<+|==+")//|{}|&&&+|^[&]$|^[!]$|^\"$|^'$|#|[$]|[%]|[?]|[¡]|^=$|[+]|;|[°]|[|]|[\[]|\]|¬|^_$|-|[~]|¨|`|\\\\|\\\^|@|^\"+$|^'+$|[)]+\"+|,,+|[)][)]+|[(][(]+|{{+|}}+|''+")//
var errores_Letra = new RegExp ("[a-z]+[-]+|[a-z]+[(]+")//|[a-z]+_?[/]+|[a-z]+_?{+}+|[a-z]+_?[)]+|[a-z]+_?{$}+|[a-z]+_?%+|[a-z]+_?[-]+|[a-z]+_?=+|[a-z]+_?<+|[a-z]+_?>+|[a-z]+_?&+|^[1-9]+[a-z]+_?|^[)]+[a-z]+|^[(]+[a-z]+|^[{]+[a-z]+|^[}]+[a-z]+")//|^\"+[a-z]+[0-9]*$|^[a-z]+\"+|^>+[a-z]+|[a-z]+,+|[a-z]+[.]+")
var errores_Num = new RegExp ("[0-9]+_?|0-9]+_?[(]+|[0-9]+_?[/]+")//|[0-9]+_?{+}+|[0-9]+_?[)]+|[0-9]+_?{$}+|[0-9]+_?%+|[0-9]+_?[-]+|[0-9]+_?=+|[0-9]+_?<+|[0-9]+_?>+|[0-9]+_?&+|^[)]+[0-9]+|^[(]+[0-9]+|^[{]+[0-9]+|^[}]+[0-9]+|^\"+[0-9]+[a-z]*$|[0-9]+_+$|^[0-9]+\"+$")//|[0-9]+_+[0-9]+|<+[0-9]+|>+[0-9]+|[0-9]+!+")
var baseDatos = 'Pet'
var tablasBaseDatos = ['Ventas', 'Producto']

// Auxiliares para sacar pila
var camposHelp =  new RegExp ("^Campos$|^Campo[0-9]+$")
var condicionHep = new RegExp ("^[a-z]+_?[A-Z]?[a-z]+[.]?[A-Z]?[a-z]+_?[a-z]+$")
var condicionTablaHelp = new RegExp ("^Condicion_tabla[0-9]+$")

// Variables ocultar tabla
var valor = true
var valor1 = true
var valor2 = false
var valor3 = false
var valor4 = false
var valor5 = false

const principal = async () => {
    document.getElementById('tablita').innerHTML = '';
    document.getElementById('tablita1').innerHTML = '';
    var info_textarea= document.getElementById("exampleFormControlTextarea1").value;
    var sin_saltos=info_textarea.replace("\n","");
    var otro = sin_saltos.replace("\n","")
    var cadena = otro.split(" ");
    const stack = new Stack();        
    var numero = 0
    $('#Imprimir')[0].disabled = true;
    $('#Limpiar')[0].disabled = true;
    var noTerminales = ['function', '(', ')', 'var', ':', 'a...z', 'integer', 'real','boolean', 'string', ';', '$'] 
    var Terminales = ['S','Tipo_Join','Resto_Join','Campos_Mostrar','Ops','Mas','Columna','Complemento','Restos_Varios','Tablas_Join','TablaO','Mas_datos','Apartado_Condicion','Tablas_Cruza', 'Ons', 'Mas_datas','Campos_where', 'Opciones', 'Contenido','Simbolos','Resto_Digito','Comparadores','Mas_Where','Operadores','Campo_order','Letra','Digito','Cols']
    var reglas = [
      ['Tipo_Join',['left','right','inner','outer']],
      ['Resto_Join','Campos_muestra','}', 'Campos_Mostrar','{',',','Tablas','}', 'Tablas_Join', '{',',', 'Condiciones', '}', 'Apartado_Condicion', '{'],
      ['Campos_Mostrar','Ops', ':', 'Columna', 'Mas'],
      ['Mas','Ops',':','Columna','Mas'],
      ['Ops',  [['Campos'], ['Campo','Digito','Resto_Digito']]],
      ['Columna',[['Letra', 'Restos_Varios', 'Complemento'], ['*','Complemento']]],
      ['Complemento','.','A...Z','Letra','Restos_Varios'],
      ['Restos_Varios',[['Letra','Restos_Varios'], ['Digito', 'Restos_Varios'], ['_','Restos_Varios']]],
      ['Tablas_Join','Tabla','Digito', ':' ,'TablaO','Mas_datos'],
      ['TablaO','A...Z','Letra','Restos_Varios'],
      ['Mas_datos','Tabla','Digito',':', 'TablaO','Mas_datos'],
      ['Apartado_Condicion','On', '{', 'Tablas_Cruza','}',',' ,'Where', '{', 'Campos_where', '}', ',', 'Order_by', '{', 'Campo_order', '}'],
      ['Tablas_Cruza','CondicionOn' ,'Digito', ':' ,'Ons','Mas_datas'],
      ['Ons','Letra','Restos_Varios','Complemento'],
      ['Mas_datas', 'CondicionOn','Digito',':','Ons','Mas_datas'],
      ['Campos_where','Condicion_tabla', 'Digito','Resto_Digito',':' ,'Cols','Comparadores','Opciones','Mas_Where'],
      ['Opciones',[['Letra','Restos_Varios','Complemento'],['Simbolos','Contenido','Simbolos'],['Digito','Resto_Digito']]],
      ['Contenido', [['Letra','Restos_Varios'], ['Digito','Resto_Digito','-','Digito','Resto_Digito','-','Digito','Resto_Digito']]],
      ['Simbolos',["'",'“']],
      ['Resto_Digito','Digito', 'Resto_Digito'],
      ['Comparadores',['<=', '>=','<>','=']],
      ['Mas_Where','Condicion_operador' ,':', 'Operadores','Campos_where'],
      ['Operadores',['and', 'or']],
      ['Campo_order','Condicion_order', ':','Letras','Restos_Varios','Complemento'],
      ['Letra','a...z'],
      ['Digito', '0...9'],
      ['Cols', 'Letras', 'Restos_Varios', 'Complemento']
    ]      
    var signo = [];  var simbolo = []; var reservada = [];  var tabla = [];  var comparacion = [];  var valor = []; var var_cadena = []; var columna = []; var error =[]    
    console.log(cadena);    
    var pos = []
    var n = 0
    var contador = 0
    m = 1
    f = 1
    k = 1
    z = 0
    var pasa_campos = false; var pasa_dos_puntos = false; var pasa_columna = false ;
    var son_campos = false; var es_campo = false; var termina = false; var pasa_coma = false;
    var pasa_tabla = false; var pasa_corchete_ini = false; var pasa_dos_puntos1 = false; var pasa_evalTablas = false
    var pasa_condiciones = false;
    var pasa_on = false; var pasa_condicionOn = false; var pasa_dos_puntos2 = false; var pasa_columna1 = false
    var pasa_where = false; var pasa_condicionwhere = false; var pasa_dos_puntos3 = false; var pasa_columna2 = false; var pasa_valores = false; var pasa_condicionOpe = false; var pasa_dos_puntos4 = false; var pasa_operadores = false
    var pasa_order = false; var pasa_condicionOrder = false; var pasa_dos_puntos5 = false; var pasa_columna3 = false; var al_fin = false
    hay_error = false; var termina_fin = false

    arreglo_joins = []
    arreglo_columnas = []
    arreglo_tablas = []    
    arreglo_condicionOn = []
    arreglo_where = []
    arreglo_orderBy = []
    div = document.getElementById('invalido');
    div1 = document.getElementById('valido');
    if(info_textarea != ''){
        if(cadena[0] == 'inner'|| cadena[0] == 'left' || cadena[0] == 'right' || cadena[0] ==' outer'){
            console.log('la entrada es valida')
                stack.push('$')
                stack.push('Resto_Join')
                stack.push('join')
                stack.push('Tipo_Join')
                
                impresionTablaPila('pila', stack, 0 , numero)
                datos = ''
        }else{
            hay_error = true
            alert('Se intrudujo una cadena pero esta no es valida')
        }
        cadena.forEach(element => {
            if(element == "\n" || element == ""){
                pos.push(n)
                if(hay_error == false){
                    z += 1
                }
            }
            if(cadena[n] != "\n" ){
                if(errores.test(element)){
                    error.push(element)                    
                }else{
                    if(hay_error == false){                        
                        z += 1
                        numero += 1
                        if(termina == false){
                            Terminales.forEach(datas => {
                                if (stack.peek() == datas){
                                //console.log('actualzar pila');
                                pilaActualizar(datas, reglas, stack,cadena[contador], numero)
                                }                            
                            });
                        }                        
                        console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                        //impresionTablaPila('Extraemos', stack, 'Extraemos' , numero, '', stack.peek())
                        if (reservadas.test(element)) {
                            reservada.push(element)
                            if(numero == 1 && (element == "inner" || element == "right" || element == "outer" || element == "left")){                                
                                stack.pop()
                                arreglo_joins.push(element)
                            }
                            if(numero == 2 && element == 'join'){                                
                                stack.pop()
                                arreglo_joins.push(element)
                            }
                            if(pasa_operadores = true &&(element == 'and' || element == 'or')){
                                stack.pop()
                                arreglo_where.push(element)
                                if(condicionTablaHelp.test(cadena[contador + 2] || condicionTablaHelp.test(cadena[contador + 1]))){
                                    pasa_condicionwhere = true
                                }else{
                                    hay_error = true
                                }                                
                            }                            
                        }else                        
                        if (variables_cadena.test(element)) {
                            var_cadena.push(element)
                            if(element == 'Campos_muestra' && numero == 3){                            
                                stack.pop()
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(camposHelp.test(element) && pasa_campos == true){                                
                                stack.pop()                                                                              
                                pasa_campos = false
                                //console.log(element, " ←→ ",cadena[contador+ 1], " ←→ ", contador);                                
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos = true
                                }else{
                                    console.log('no es igual');
                                    hay_error = true
                                }
                            }
                            if(element == 'Tablas' && pasa_tabla == true){
                                pasa_tabla = false
                                stack.pop()
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini = true
                                }else{
                                    hay_error = true
                                }

                            }
                            if((element == 'Tabla1'|| element == 'Tabla2')&& pasa_tablas == true){
                                stack.pop()
                                stack.pop()
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos1 = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_condiciones == true && element == 'Condiciones'){
                                stack.pop()
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_on == true && element == 'On'){
                                stack.pop()
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_condicionOn == true && (element == 'CondicionOn1' || element == 'CondicionOn2')){
                                stack.pop()
                                stack.pop()
                                pasa_condicionOn = false
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos2 = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_where == true && element == 'Where'){
                                stack.pop()
                                pasa_where = false
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_condicionwhere == true && condicionTablaHelp.test(element)){
                                stack.pop()
                                stack.pop()
                                stack.pop()
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos3 = true
                                }else{
                                    hay_error = true
                                }                                
                            }
                            if(pasa_condicionOpe == true && element == 'Condicion_operador'){
                                stack.pop()
                                pasa_condicionOpe = false                                
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos4 = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_order == true && element == 'Order_by'){
                                stack.pop()
                                pasa_order = false                                
                                if(cadena[contador + 1] == '{'){
                                    pasa_corchete_ini = true
                                }else{
                                    hay_error = true
                                }                                                                
                            }
                            if(pasa_condicionOrder == true && element == 'Condicion_order'){
                                stack.pop()
                                pasa_condicionOrder = false
                                if(cadena[contador + 1] == ':'){
                                    pasa_dos_puntos5 = true
                                }else{
                                    hay_error = true
                                }
                            }
                        }else    
                        if (tablas.test(element)) {
                            if (variables_cadena.test(element) != true) {
                                tabla.push(element)
                                if(pasa_evalTablas == true){
                                    arreglo_tablas.push(element)
                                    stack.pop()
                                    stack.pop()
                                    stack.pop()
                                    pasa_evalTablas = false
                                    if(cadena[contador + 2] == 'Tabla2'){
                                        pasa_tablas = true
                                        f += 1
                                    }else{
                                        if(cadena[contador + 1] == '}' && f == 2){
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            termina = true
                                            f = 1
                                        }else{
                                            hay_error = true
                                        }
                                    }                                    
                                }
                            }
                        }else    
                        if (columnas.test(element)) {
                            if (reservadas.test(element) != true) {
                                columna.push(element)
                                if(pasa_columna == true){                                    
                                    stack.pop()
                                    arreglo_columnas.push(element)
                                    pasa_columna = false
                                    if(cadena[contador + 1] == '}'){
                                        console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                        stack.pop()
                                        termina = true
                                    }else{
                                        if(camposHelp.test(cadena[contador +  2] || camposHelp.test(cadena[contador + 1]))){
                                            console.log('pasa campos, campoN');
                                            
                                            pasa_campos = true
                                        }else{
                                            hay_error = true
                                        }
                                    }
                                }                                
                                if(pasa_columna1 == true){
                                    arreglo_condicionOn.push(element)
                                    stack.pop()
                                    stack.pop()
                                    stack.pop()
                                    pasa_columna1 = false
                                    if(cadena[contador + 2] == 'CondicionOn2'){                                        
                                        pasa_condicionOn = true
                                        f += 1
                                    }else{                                        
                                        if(cadena[contador + 1] == '}' && f == 2){
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            termina = true                                            
                                        }else{                                                                                        
                                            hay_error = true                                            
                                        }                                        
                                    }                                    
                                }
                                if(pasa_columna2){
                                    stack.pop()
                                    stack.pop()
                                    stack.pop()
                                    arreglo_where.push(element)
                                    pasa_columna2 = false
                                    if(comparaciones.test(cadena[contador + 1])){
                                        pasa_comparaciones = true
                                    }else{
                                        hay_error = true
                                    }                                    
                                }
                                if(pasa_columna3 == true){
                                    stack.pop()
                                    stack.pop()
                                    stack.pop()
                                    arreglo_orderBy.push(element)
                                    if(cadena[contador + 1] == '}'){
                                        console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                        stack.pop()
                                        termina_fin = true
                                    }else{
                                        hay_error = true
                                    }                                    
                                }
                                if(pasa_valores == true){
                                    stack.pop()
                                    pasa_valores = false
                                    arreglo_where.push(element)
                                    if(cadena[contador + 2] == 'Condicion_operador'){
                                        pasa_condicionOpe = true
                                    }else{
                                        if(cadena[contador + 1] == '}'){
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            termina = true
                                        }else{
                                            hay_error = true
                                        }                                    
                                    }                                
                                }
                            }                            
                        }else    
                        if (valores.test(element)) {
                            valor.push(element)
                            if(pasa_valores == true){
                                stack.pop()
                                arreglo_where.push(element)
                                pasa_valores = false
                                if(cadena[contador + 2] == 'Condicion_operador'){
                                    pasa_condicionOpe = true
                                }else{
                                    if(cadena[contador + 1] == '}'){
                                        console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                        stack.pop()
                                        termina = true
                                    }else{
                                        hay_error = true
                                    }                                    
                                }                                
                            }
                        }else    
                        if (simbolos.test(element)) {
                            simbolo.push(element)
                            if(element == '{' && pasa_corchete_ini == true){                                
                                stack.pop()                                                                
                                pasa_corchete_ini == false
                                if(m == 1){                                    
                                    if(camposHelp.test(cadena[contador + 1])){
                                        pasa_campos = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(m == 2){
                                    if(cadena[contador + 2] == 'Tabla1'){                                        
                                        pasa_tablas = true
                                    }else{                                        
                                        hay_error = true
                                    }
                                }
                                if(m == 3){
                                    if(cadena[contador + 2] == 'On'){
                                        pasa_on = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(m == 4){
                                    if(cadena[contador + 2] == 'CondicionOn1'){
                                        pasa_condicionOn = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(m == 5){
                                    if(cadena[contador + 2] == 'Condicion_tabla1'){
                                        pasa_condicionwhere = true
                                    }else{
                                        if(cadena[contador + 1] == '}' || cadena[contador + 2] =='}'){
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            termina = true
                                        }else{
                                            hay_error = true
                                        }
                                    }
                                }
                                if(m == 6){
                                    if(cadena[contador + 2] == 'Condicion_order'){
                                        pasa_condicionOrder = true
                                    }else{
                                        console.log(cadena[contador + 1]);
                                        if(cadena[contador + 1] == '}'){
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            console.log(numero,".- Se extrae → ", stack.peek() ,' - Variables → ', element)
                                            stack.pop()
                                            termina = true
                                        }else{
                                            hay_error = true
                                        }
                                    }
                                }
                                m += 1
                            }
                            if(element == '}' && termina == true){
                                stack.pop()
                                termina = false                                
                                if(cadena[contador + 1] == ',' || cadena[contador + 2] == ','){
                                    pasa_coma = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(element == '}' && termina_fin == true){
                                stack.pop()
                                termina_fin = false                                
                            }
                        } else                        
                        if (signos.test(element)) {
                            signo.push(element)                            
                            if(pasa_dos_puntos == true && element == ':'){
                                stack.pop()                                
                                pasa_dos_puntos = false
                                if(columnas.test(cadena[contador + 1])){
                                    pasa_columna = true
                                }else{
                                    hay_error = true
                                }
                            }
                            if(pasa_dos_puntos1 == true && element == ':'){
                                stack.pop()
                                pasa_dos_puntos1 = false
                                if(tablas.test(cadena[contador + 1])){
                                    pasa_evalTablas = true
                                }else{
                                    hay_error = true
                                }

                            }
                            if(pasa_dos_puntos2 == true && element == ':'){
                                stack.pop()
                                pasa_dos_puntos2 = false                                
                                if (condicionHep.test(cadena[contador + 1])) {                                
                                    pasa_columna1 = true
                                }else{                                                                        
                                    hay_error = true
                                }
                            }
                            if(pasa_dos_puntos3 == true && element == ':'){
                                stack.pop()
                                pasa_dos_puntos3 = false                                
                                if (columnas.test(cadena[contador + 1])) {                                
                                    pasa_columna2 = true
                                }else{                                                                        
                                    hay_error = true
                                }
                            }
                            if(pasa_dos_puntos4 == true && element == ':'){
                                stack.pop()
                                pasa_dos_puntos4 = false                                
                                if (cadena[contador + 1] == 'and' || cadena[contador + 1] == 'or') {
                                    pasa_operadores = true
                                }else{                                                                        
                                    hay_error = true
                                }
                            }
                            if(pasa_dos_puntos5 == true && element == ':'){
                                stack.pop()
                                pasa_dos_puntos5 = false
                                if (columnas.test(cadena[contador + 2])||columnas.test(cadena[contador + 1])) {
                                    pasa_columna3 = true                                    
                                }else{                                                                        
                                    hay_error = true
                                }
                            }
                            if(pasa_coma == true && element ==','){
                                stack.pop()
                                pasa_coma = false
                                if(k == 1){
                                    if(cadena[contador + 2] == 'Tablas' || cadena[contador + 1] == 'Tablas'){
                                        pasa_tabla = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(k == 2){
                                    if(cadena[contador + 2] == 'Condiciones' || cadena[contador + 1] == 'Condiciones'){
                                        pasa_condiciones = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(k == 3){                                    
                                    if(cadena[contador + 2] == 'Where' || cadena[contador + 1] == 'Where'){
                                        pasa_where = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                if(k == 4){
                                    if(cadena[contador + 2] == 'Order_by' || cadena[contador + 1] == 'Order_by'){
                                        pasa_order = true
                                    }else{
                                        hay_error = true
                                    }
                                }
                                k += 1                                
                            }
                        }else                        
                        if (comparaciones.test(element)) {
                            comparacion.push(element)
                            if(pasa_comparaciones == true){
                                stack.pop()
                                arreglo_where.push(element)
                                pasa_comparaciones = false
                                console.log(condicionHep.test(cadena[contador + 1]), " : ", cadena[contador + 1]);                                
                                if(valores.test(cadena[contador + 1]) || columnas.test(cadena[contador + 1])){                                    
                                    pasa_valores = true
                                }else{
                                    console.log('entre mal');
                                    hay_error = true
                                }
                            }
                        }else{                                                        
                            hay_error = true
                            if (cadena[n] != "") {
                                console.log('Hubo algun caracter erroneo');
                                error.push(element)
                            }                        
                        }                                                
                        impresionTablaPila('pila', stack, 0 , numero)
                    }
                }
            }
            contador += 1
            n += 1
        });                
        if(stack.peek() == '$'){
            if (valor2 == false) {                        
                div1.style.display = '';
            }
            impresionSentenciaSQL(arreglo_columnas,arreglo_joins, arreglo_tablas, arreglo_condicionOn,arreglo_where,arreglo_orderBy)
        }else if(hay_error == true){
            console.log('error →', z  , ' ', cadena[z ]);
            stack.push('¡ERROR!')
            var uno = document.getElementById('invalido');
            valor2?uno.innerText = "En algun punto ha sido erronea la cadenas":uno.innerText = "Se encotro un error en la cadena → " + cadena[z] ;
            if (valor2 == false) {        
                div = document.getElementById('invalido');
                div.style.display = '';
            }
        }
        console.log(numero, " Se quedo pila →", stack.print());
        impresionTablaPila('pila', stack, 0 , numero)                
    }else{
        var uno = document.getElementById('invalido');
        valor2?uno.innerText = "En algun punto ha sido erronea la cadenas":uno.innerText = "Mete alguna cadena valida";
        if (valor2 == false) {
            div.style.display = '';            
        }
    }
    impresionTabla(reservada,tabla, signo, var_cadena, simbolo, valor, error, columna, comparacion)    
    await delay(7000);
    div.style.display = 'none';
    div1.style.display = 'none';
    $('#Imprimir')[0].disabled = false;
    $('#Limpiar')[0].disabled = false;        

}

function pilaActualizar(datas, rules, stack, cadena, numero) {    
    rules.forEach(element => {
        if (element[0] == datas) {
            console.log(numero," Se Quita → ", stack.peek() ,' - Variables → ', datas)
            //impresionTablaPila('Quitamos', stack, 'Quitamos' , numero, '', stack.peek())
            stack.pop()
            if (cadena != '}') {
                console.log(numero," Se Agrega → ", element.slice(1,element.length) ,' - Variables → ', datas)
                //impresionTablaPila('Agregamos', stack, 'Agregamos' , numero, 'normal', element.slice(1, element.length))
                for (let i = element.length - 1; i >= 1; i--) {
                //console.log('Se agrega → ',stack.push(element[i]))
                stack.push(element[i])
                }        
            }      
        }
      });   
    impresionTablaPila('pila', stack, 0 , numero)
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

function impresionTablaPila(mensaje, stack, que_es, numero,opcion, dato) {
    if(mensaje == 'pila'){
        var fila="<tr> <td>" + numero + "</td> <td>"+ mensaje +"</td><td>"+ stack.print() +"</td> <td>" + '' +"</td> </tr>";
        var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
    }else{
        if(que_es == 'Quitamos'){
            var fila="<tr> <td>" + numero + "</td> <td>"+ mensaje +"</td><td>"+ dato +"</td> <td style='background-color: red;' >" + '' +"</td> </tr>";
            var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
        }
        if(que_es == 'Agregamos'){
            if(opcion == 'arreglo'){
                var fila="<tr> <td>" + numero + "</td> <td>"+ mensaje +"</td><td>"+ dato +"</td> <td style='background-color: greenyellow;' >" + '' +"</td> </tr>";
                var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
            }
            if(opcion == 'normal'){
                var fila="<tr> <td>" + numero + "</td> <td>"+ mensaje +"</td><td>"+ dato +"</td> <td style='background-color: greenyellow;' >" + '' +"</td> </tr>";
                var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
            }
        }
        if(que_es == 'Extraemos'){
                var fila="<tr> <td>" + numero + "</td> <td>"+ mensaje +"</td><td>"+ dato +"</td> <td style='background-color: orange;' >" + '' +"</td> </tr>";
                var btn = document.createElement("TR"); btn.innerHTML=fila; document.getElementById("tablita1").appendChild(btn);
        }
    }       
}

function limpiar() {    
    document.getElementById('tablita').innerHTML = '';
    document.getElementById('tablita1').innerHTML = '';
    document.getElementById("exampleFormControlTextarea1").value = "";    
}
var baseTablas = new RegExp("^[A-Z]?[a-z]+[0-9]*_?[a-z]*[0-9]*$")
const basedeDatos = async () => {
    var info_input= document.getElementById("base").value;
    var uno = document.getElementById('advertencia');
    var dos = document.getElementById('base');
    var tres = document.getElementById("nombreBaseDatos");
    var cuatro = document.getElementById("nombreTablas");
    var cinco = document.getElementById("BaseCompleta")
    var seis = document.getElementById("title")
    if(info_input != ''){
        if (baseTablas.test(info_input)) {
            $('#boton')[0].disabled = true;
            $('#base')[0].disabled = true;
            dos.className = 'form-control is-valid'
            uno.className= 'valid-feedback'
            valor4?uno.innerText = "Introduce una base de datos":uno.innerText = "Nombre de la base de datos valida" ;
            baseDatos = info_input                        
            await delay(5000);
            tres.style.display = 'none'
            cuatro.style.display = ''
            seis.innerText = baseDatos
            cinco.style.display = ''            
        }else{
            
            valor4?uno.innerText = "Introduce una base de datos":uno.innerText = "No se aceptan errores como: " + info_input;
            await delay(3000);
            valor4?uno.innerText = "Introduce una base de datos":uno.innerText = "Introduce una Base de Datos correctamente";
            
        }
    }
}

const tablasBase= async () => {
    var info_input= document.getElementById("tabla").value;
    var uno = document.getElementById('advertencia1');
    var dos = document.getElementById('tabla');
    if(info_input != ''){
        if (baseTablas.test(info_input) && tablasBaseDatos.includes(info_input) == false) {
            $('#boton1')[0].disabled = true;
            $('#tabla')[0].disabled = true;
            var dato = info_input
            var btn =  document.createElement("li"); btn.innerHTML = dato; document.getElementById("tablasN").appendChild(btn)            
            dos.className = 'form-control is-valid'
            uno.className= 'valid-feedback'
            valor5?uno.innerText = "Introduce una Tabla":uno.innerText = " El nombre de la tabla es valido" ;
            tablasBaseDatos.push(info_input)            
            await delay(2000);
            dos.className = 'form-control is-invalid'
            uno.className= 'invalid-feedback'
            valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce una Tabla" ;
            document.getElementById("tabla").value = "";
            $('#boton1')[0].disabled = false;
            $('#tabla')[0].disabled = false;
        }else{
            if(tablasBaseDatos.includes(info_input)){
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "La tabla → " + info_input +" no se puede repetir, favor de meter otra tabla";
                await delay(3000);
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce una Tabla correctamente";
            }else{
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "No se aceptan errores como: " + info_input;
                await delay(3000);
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce una Tabla correctamente";
            }                        
        }
    }
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

const delay = ms => new Promise(res => setTimeout(res, ms));

const mostrarpantalla = async () => {
    console.log(tablasBaseDatos);
    document.getElementById('tablasNo1').innerHTML = '';    
    if(tablasBaseDatos.length >= 2 && baseDatos != ''){        
        var elemento = document.getElementById("card");
        elemento.style.display = 'none';
        var elemento = document.getElementById("formu");
        elemento.style.display = 'block';   
        var seis = document.getElementById("titleba")
        seis.innerText = baseDatos        
        m = 1
        tablasBaseDatos.sort()
        tablasBaseDatos.forEach(element => {
                var dato = element                
                    var btn =  document.createElement("li"); btn.innerHTML = dato; document.getElementById("tablasNo1").appendChild(btn);                
            });
    }
    else{
        var uno = document.getElementById('invalidoTablaBaseDatos');
        div = document.getElementById('invalidoTablaBaseDatos');
        if (valor2 == false) {
            if(tablasBaseDatos.length == 0 && baseDatos == ''){
                valor2?uno.innerText = "introduce":uno.innerText = "Introduce alguna Base de datos y algunas Tablas";
            }else{

                if(tablasBaseDatos.length == 0){
                    valor2?uno.innerText = "introduce":uno.innerText = "Introduce algunas Tablas";
                }
                if(tablasBaseDatos.length == 1){
                    valor2?uno.innerText = "introduce":uno.innerText = "Introduce mas de una Tabla";
                }
                if(baseDatos == ''){
                    valor2?uno.innerText = "introduce":uno.innerText = "Introduce una base de datos";
                }
            }            
            div.style.display = '';
        }
        await delay(5000);
        div.style.display = 'none';
    }
}

function agregaryeliminar() {
    console.log(tablasBaseDatos);
    document.getElementById('tablasN').innerHTML = '';
    var elemento = document.getElementById("card");
    elemento.style.display = 'block';
    var elemento = document.getElementById("formu");
    elemento.style.display = 'none';   
    var tres = document.getElementById("nombreBaseDatos");
    var cuatro = document.getElementById("nombreTablas");
    var cinco = document.getElementById("BaseCompleta")
    var seis = document.getElementById("boton2")
    var uno = document.getElementById('advertencia1');
    valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce o Elimina una Tabla" ;
    tres.style.display = 'none'
    cuatro.style.display = 'block'
    cinco.style.display = 'block'
    seis.style.display = 'block'
    tablasBaseDatos.sort()
    tablasBaseDatos.forEach(element => {
        var dato = element
        var btn =  document.createElement("li"); btn.innerHTML = dato; document.getElementById("tablasN").appendChild(btn);
    });           
}

var punto = new RegExp("[.]")
var numero = new RegExp("^[0-9]+$")
const impresionSentenciaSQL = async (arreglo_columnas,arreglo_joins, arreglo_tablas, arreglo_condicionOn,arreglo_where,arreglo_orderBy) => {
    console.log('Select',arreglo_columnas, 'From',arreglo_tablas[0],arreglo_joins,arreglo_tablas[1],'On',arreglo_condicionOn[0],'=',arreglo_condicionOn[1],'where',arreglo_where,'Order by',arreglo_orderBy);    
    var where = ''
    var uno = document.getElementById('advertenciaSQL');
    arreglo_where.forEach(element => {
        where += element + ' '
    });
    
    var errores = []
    var errors = 0    
    console.log('←←←←←←←←←← Columnas →→→→→→→→→→');
    arreglo_columnas.forEach(element => {
        var hay_error = false
        if (hay_error == false) {
            if (punto.test(element)) {
                var hay_punto = false
                var tabla = ''
                for (let i = 0; i < element.length; i++) {
                    if(hay_punto == true){
                        tabla += element[i]
                    }
                    if (hay_punto == false) {
                        if(element[i] == '.'){
                            hay_punto = true
                        }
                    }
                }
                if(tablasBaseDatos.includes(tabla) == false){
                    errores.push(tabla)
                    hay_error == true
                    errors += 1
                }else{
                    if(tabla == arreglo_tablas[0] || tabla == arreglo_tablas[1]){
                        console.log(element);
                    }else{
                        errores.push(tabla)
                        hay_error == true
                        errors += 1
                    }
                }
            }else{
                console.log(element);
            }
        }
    });
    console.log('←←←←←←←←←← Tablas →→→→→→→→→→');
    arreglo_tablas.forEach(element => {        
        var hay_error = false
        if(hay_error == false){
            if(tablasBaseDatos.includes(element) == false){
                hay_error = true
                errors += 1
                errores.push(element)
            }else{
                console.log(element);
            }
        }
    });
    console.log('←←←←←←←←←← Condiciones On →→→→→→→→→→');
    var tab = []
    arreglo_condicionOn.forEach(element => {
        var hay_error = false
        if (hay_error == false) {
            if (punto.test(element)) {
                var hay_punto = false
                var tabla = ''
                for (let i = 0; i < element.length; i++) {
                    if(hay_punto == true){
                        tabla += element[i]
                    }
                    if (hay_punto == false) {
                        if(element[i] == '.'){
                            hay_punto = true
                        }
                    }
                }
                if(tablasBaseDatos.includes(tabla) == false){
                    errores.push(tabla)
                    hay_error == true
                    errors += 1
                }else{
                    console.log(element);
                    tab.push(tabla)
                }
            }
        }        
    });
    console.log(tab);
    if (tab[0] == arreglo_tablas[0] && tab[1] == arreglo_tablas[1]) {
        console.log('estan en la misma posicion');
    }else{
        errors += 1
        console.log('no estan en la misma posicion');
    }    
    console.log('←←←←←←←←←← Condiciones where →→→→→→→→→→');
    var variable = false
    var comparacion = false
    var valoresN = false
    var opderador = false
    con = 0
    arreglo_where.forEach(element => {
        var hay_error = false
        if (hay_error == false) {
            if(opderador == true){
                opderador = false
                console.log('operador →', element);                
            }
            if(valoresN == true){
                valoresN = false                
                if(arreglo_where[con - 1] == '<>' || arreglo_where[con - 1] == '='){
                    console.log('valor →', element);
                }else{
                    if(numero.test(element)){
                        console.log('valor →', element);
                    }else{
                        errores.push(element)
                        hay_error == true
                        errors += 1
                    }
                }
                opderador = true
            }        
            if(comparacion == true) {
                comparacion = false
                console.log('comparacion → ', element);
                valoresN = true
            }            
            if(columnas.test(element) && valoresN == false){
                if(element == 'and' || element == 'or'){                    
                }else{
                    if (punto.test(element)) {
                        var hay_punto = false
                        var tabla = ''
                        for (let i = 0; i < element.length; i++) {
                            if(hay_punto == true){
                                tabla += element[i]
                            }
                            if (hay_punto == false) {
                                if(element[i] == '.'){
                                    hay_punto = true
                                }
                            }
                        }
                        if(tablasBaseDatos.includes(tabla) == false){
                            errores.push(tabla)
                            hay_error == true
                            errors += 1
                        }else{
                            if(tabla == arreglo_tablas[0] || tabla == arreglo_tablas[1]){
                                console.log(element);
                            }else{
                                errores.push(tabla)
                                hay_error == true
                                errors += 1
                            }
                        }
                    }else{
                        console.log(element);
                    }                    
                    comparacion = true
                }

            }
            con += 1
        }        
    });

    console.log('←←←←←←←←←← Condiciones Order by →→→→→→→→→→');    
    arreglo_orderBy.forEach(element => {
        var hay_error = false
        if (hay_error == false) {
            if (punto.test(element)) {
                var hay_punto = false
                var tabla = ''
                for (let i = 0; i < element.length; i++) {
                    if(hay_punto == true){
                        tabla += element[i]
                    }
                    if (hay_punto == false) {
                        if(element[i] == '.'){
                            hay_punto = true
                        }
                    }
                }
                if(tablasBaseDatos.includes(tabla) == false){
                    errores.push(tabla)
                    hay_error == true
                    errors += 1
                }else{
                    console.log(element);
                }
            }
        }        
    });
    console.log('←←←←←←←←←← Fin →→→→→→→→→→');
    var tres = document.getElementById('advertenciaSQL');
    var dos = document.getElementById('sentenciaSQL');
    if(arreglo_where.length > 0 && arreglo_orderBy.length > 0){
        document.getElementById("sentenciaSQL").value = 'Select ' + arreglo_columnas + ' From ' + arreglo_tablas[0] + ' ' + arreglo_joins[0] + ' join ' + arreglo_tablas[1] + ' On ' + arreglo_condicionOn[0] + ' = ' + arreglo_condicionOn[1] + ' Where ' + where + ' Order by ' + arreglo_orderBy;
    }else{
        if (arreglo_where.length == 0) {
            document.getElementById("sentenciaSQL").value = 'Select ' + arreglo_columnas + ' From ' + arreglo_tablas[0] + ' ' + arreglo_joins[0] + ' join ' + arreglo_tablas[1] + ' On ' + arreglo_condicionOn[0] + ' = ' + arreglo_condicionOn[1] +  ' Order by ' + arreglo_orderBy;
        }
        if (arreglo_orderBy.length == 0) {
            document.getElementById("sentenciaSQL").value = 'Select ' + arreglo_columnas + ' From ' + arreglo_tablas[0] + ' ' + arreglo_joins[0] + ' join ' + arreglo_tablas[1] + ' On ' + arreglo_condicionOn[0] + ' = ' + arreglo_condicionOn[1] + ' Where ' + where;
        }
        if(arreglo_where.length == 0 && arreglo_orderBy.length == 0){
            document.getElementById("sentenciaSQL").value = 'Select ' + arreglo_columnas + ' From ' + arreglo_tablas[0] + ' ' + arreglo_joins[0] + ' join ' + arreglo_tablas[1] + ' On ' + arreglo_condicionOn[0] + ' = ' + arreglo_condicionOn[1] 
        }
    }
    if(errors >= 1){
        tres.className = 'invalid-feedback' 
        dos.className =  'form-control is-invalid'
        console.log('Hay errores en tu sentencia →', errores);        
        valor5?uno.innerText = "Esperando sentencia Join":uno.innerText = "Tienes errores en algunas Tablas  →" + errores;
    }else{        
        tres.className = 'valid-feedback' 
        dos.className =  'form-control is-valid'
        valor5?uno.innerText = "Esperando sentencia Join":uno.innerText = "La sentencia es correcta";
        console.log('La sentencia se puede imprimir ');
        createFile = []
        createFile.push('import mysql.connector \n\n')
        createFile.push('mydb = mysql.connector.connect( \n\n')
        createFile.push('   host= "localhost", \n')
        createFile.push('   user= "tu usuario",\n')
        createFile.push('   passwd= "tu contraseña",\n')
        createFile.push('   database= "tu_bbdd"\n')
        createFile.push(' )\n\n')

        createFile.push('mycursor = mydb.cursor()\n\n')

        createFile.push('sql =  "SELECT ' + '\n')
        createFile.push(arreglo_columnas + '\n')    
        createFile.push('   FROM ' + arreglo_tablas[0] + '\n')
        createFile.push('   ' + String.prototype.toUpperCase(arreglo_joins[0]) +' JOIN ' + arreglo_tablas[1] + ' ON clientes.fav = producto.id \n')
        if(arreglo_where.length > 0 && arreglo_orderBy.length > 0){
            createFile.push(' WHERE ' + where + ' ORDER BY ' + arreglo_orderBy + '\n');
        }else{
            if (arreglo_where.length == 0) {
                createFile.push(' ORDER BY ' + arreglo_orderBy + '\n');
            }
            if (arreglo_orderBy.length == 0) {
                createFile.push(' WHERE ' + where + '\n');
            }
            if(arreglo_where.length == 0 && arreglo_orderBy.length == 0){                
            }
        }
        createFile.push('" \n\n')
        createFile.push('mycursor.execute(sql) \n\n')
        createFile.push('myresult = mycursor.fetchall() \n\n')
        createFile.push('for x in myresult: \n\n')
        createFile.push('    print(x)\n\n')        
        $('#staticBackdrop').modal({
            keyboard: false
          })
        var cuatro = document.getElementById('butDescarga');
        cuatro.style.display = ''
        var cuatro = document.getElementById('descargaTitle');
        valor5?cuatro.innerText = "El programa te genero un archivo de python con el titulo":cuatro.innerText = "El programa te genero un archivo de python con el titulo → " + arreglo_tablas[0]+arreglo_tablas[1]+'.py'  ;
    }
    //descargarArchivo(generarTexto(createFile), arreglo_tablas[0]+arreglo_tablas[1]+'.py');
}

const eliminarTablasBase = async () => {
    var info_input= document.getElementById("tabla").value;
    var uno = document.getElementById('advertencia1');
    var dos = document.getElementById('tabla');
    if(info_input != ''){
        if (baseTablas.test(info_input) && tablasBaseDatos.includes(info_input)) {
            $('#boton1')[0].disabled = true;
            $('#tabla')[0].disabled = true;
            $('#boton2')[0].disabled = true;
            var index = tablasBaseDatos.indexOf(info_input)
            if (index > -1) {
                tablasBaseDatos.splice(index, 1);
             }
            document.getElementById('tablasN').innerHTML = '';
            tablasBaseDatos.sort()
            tablasBaseDatos.forEach(element => {
                var dato = element
                var btn =  document.createElement("li"); btn.innerHTML = dato; document.getElementById("tablasN").appendChild(btn);
            });
            
            dos.className = 'form-control is-valid'
            uno.className= 'valid-feedback'
            valor5?uno.innerText = "Introduce una Tabla":uno.innerText = " Eliminado correctamente" ;
            
            await delay(2000);
            dos.className = 'form-control is-invalid'
            uno.className= 'invalid-feedback'
            valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce o Elimina una Tabla" ;
            document.getElementById("tabla").value = "";
            $('#boton1')[0].disabled = false;
            $('#tabla')[0].disabled = false;
            $('#boton2')[0].disabled = false;
        }else{
            if(tablasBaseDatos.includes(info_input) == false  && baseTablas.test(info_input)) {
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "La tabla → " + info_input +" no existe, favor de meter otra tabla";
                await delay(3000);
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce o Elimina una Tabla" ;
            }else{
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "No se aceptan errores como: " + info_input;
                await delay(3000);
                valor5?uno.innerText = "Introduce una Tabla":uno.innerText = "Introduce o Elimina una Tabla" ;
            }                        
        }
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
      return this.stack
    }
}

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);
};

//Genera un objeto Blob con los datos en un archivo TXT
function generarTexto(createFile) {
        
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(createFile, {
        type: 'text/plain'
    });
};

function descargarpy() {
    descargarArchivo(generarTexto(createFile), arreglo_tablas[0]+arreglo_tablas[1]+'.py');
}

function cargarCadena() {
    document.getElementById("exampleFormControlTextarea1").value = "inner join \nCampos_muestra { \nCampos : *.Producto \n Campo1 : id_producto.Ventas \n Campo2 : id \n Campo3 : nombre.Producto } , \n Tablas { \n Tabla1 : Producto \n Tabla2 : Ventas } , \n Condiciones { \n On { \n CondicionOn1 : id.Producto \n CondicionOn2 : id_Productos.Ventas } , \n Where { \n Condicion_tabla1 : id.Producto = 'hola' \n Condicion_operador : and \n Condicion_tabla2 : fecha = '12-12-2020' } , \n Order_by { \n Condicion_order : id.Producto } } ";
}