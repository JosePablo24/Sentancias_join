import mysql.connector 
mydb = mysql.connector.connect( 
   host= "localhost", 
   user= "tu usuario",
   passwd= "tu contraseña",
   database= "tu_bbdd"
 )
 mycursor = mydb.cursor()
 sql =  "SELECT \
   *.Producto,id_producto.Ventas,id,nombre.Producto \
   FROM Producto \
   inner JOIN Ventas ON clientes.fav = producto.id" 
mycursor.execute(sql) 
myresult = mycursor.fetchall() 
for x in myresult:
    print(x)