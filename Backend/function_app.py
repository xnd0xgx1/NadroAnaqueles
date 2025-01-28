import azure.functions as func
import logging
import requests
import tempfile
import os
from azure.storage.blob import BlobServiceClient,generate_blob_sas,BlobSasPermissions
import json
from datetime import datetime, timedelta
import pyodbc
from dotenv import load_dotenv
load_dotenv()

server = os.getenv("SERVER")
database = os.getenv("DATABASE")
username = os.getenv("USRDB")
password = os.getenv("PASSWORD")
driver = os.getenv("DRIVER")
storageaccount = os.getenv("STORAGEACCOUNT")
source_container_name = os.getenv("SOURCE_CONTAINER_NAME")
credential = os.getenv("CREDENTIAL")



blob_service_client = BlobServiceClient(
        account_url=f"https://{storageaccount}.blob.core.windows.net",
        credential=credential
)

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
@app.route(route="Login")
def Login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Obtener `codigoDeEmpleado` y `codigoDeAcceso` del cuerpo de la solicitud
        req_body = req.get_json()
        codigo_de_empleado = req_body.get('codigoDeEmpleado')
        codigo_de_acceso = req_body.get('codigoDeAcceso')
        
        if not codigo_de_empleado or not codigo_de_acceso:
            return func.HttpResponse(
                "Faltan parámetros en la solicitud.",
                status_code=400
            )

        # Configuración de los headers y el body para la API de autenticación externa
        headers = {"x-api-version": "1.0"}
        body = {
            "codigoDeEmpleado": codigo_de_empleado,
            "codigoDeAcceso": codigo_de_acceso
        }

        # Realizar la solicitud POST a la API externa
        response = requests.post(
            'http://qa.nadro-net.com/sfa_dataminingServices/api/autenticacion',
            headers=headers,
            data=body
        )

        # Comprobar el estado de la respuesta
        if response.status_code == 200:
            return func.HttpResponse("Autenticación exitosa.", status_code=200)
        else:
            return func.HttpResponse("Credenciales inválidas.", status_code=401)
    
    except Exception as e:
        logging.error(f"Error en la autenticación: {e}")
        return func.HttpResponse("Error en el servidor.", status_code=500)
    
@app.route(route="uploadimages")
def uploadimages(req: func.HttpRequest) -> func.HttpResponse:
    print("Procesando")
    try:
        # Validar si hay archivos en la solicitud
        files = req.files.getlist('files')
        if not files:
            return func.HttpResponse("No file part in the request", status_code=400)

        # Obtener el campo 'mostrador' desde el formulario
        mostrador = req.form.get('mostrador')
        if not mostrador:
            return func.HttpResponse("No 'mostrador' field in the request", status_code=400)

        uploaded_files_info = []
        # Obtener la fecha y hora actual
        current_datetime = datetime.utcnow()
        year = current_datetime.strftime("%Y")
        month = current_datetime.strftime("%m")
        day = current_datetime.strftime("%d")
        time_stamp = current_datetime.strftime("%H%M%S")

        with tempfile.TemporaryDirectory() as temp_dir:
            for file in files:
                # Extraer nombre y extensión del archivo
                filename, file_extension = os.path.splitext(file.filename)

                # Construir el nuevo nombre del archivo con el formato especificado
                formatted_filename = f"{mostrador}/{year}/{month}/{day}/{filename}_{time_stamp}{file_extension}"
                # file_path = os.path.join(temp_dir, formatted_filename)
                logging.warning(formatted_filename)
                file_path = os.path.join(temp_dir, file.filename)
                file.save(file_path)
                # Guardar el archivo temporalmente
                # file.save(file_path)

                # Crear el cliente del blob con el path especificado
                blob_client = blob_service_client.get_blob_client(container=source_container_name, blob=formatted_filename)

                # Subir el archivo al Blob Storage
                with open(file_path, "rb") as data:
                    blob_client.upload_blob(data, overwrite=True)

                # Generar la URL pública o con SAS token para el archivo
                sas_token = generate_blob_sas(
                    account_name=blob_service_client.account_name,
                    container_name=source_container_name,
                    blob_name=formatted_filename,
                    account_key=blob_service_client.credential.account_key,
                    permission=BlobSasPermissions(read=True),
                    expiry=datetime.utcnow() + timedelta(hours=1)  # URL válida por 1 hora
                )
                file_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{source_container_name}/{formatted_filename}?{sas_token}"

                # Agregar la información del archivo subido a la respuesta
                uploaded_files_info.append({
                    "message": "File uploaded successfully",
                    "url": file_url,
                    "filename": file.filename,
                    "path":  source_container_name +  "/" +  formatted_filename
                })

        # Devolver la respuesta en formato JSON
        return func.HttpResponse(json.dumps(uploaded_files_info), status_code=200, mimetype="application/json")
    
    except Exception as e:
        return func.HttpResponse(json.dumps({"error": str(e)}), status_code=500, mimetype="application/json")


@app.route(route="Model")
def Model(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Obtener `codigoDeEmpleado` y `codigoDeAcceso` del cuerpo de la solicitud
        req_body = req.get_json()
        rutas = req_body.get('rutas')
        mostrador = req_body.get('mostrador_id')
        user_id = req_body.get('user_id')
        
        if not rutas or not mostrador:
            return func.HttpResponse(
                "Faltan parámetros en la solicitud.",
                status_code=400
            )

        # Configuración de los headers y el body para la API de autenticación externa
        headers = {
            'Content-Type': 'application/json'
            }
        
        body = json.dumps({
            "rutas": rutas,
            "mostrador_id": mostrador,
            "user_id":user_id
            })

        # Realizar la solicitud POST a la API externa
        response = requests.post(
            'https://func-anaqueles-inteligentes.azurewebsites.net/api/Orchestrator?code=FgsuhSOWHeZR3UFY7RdjeQ9_kUOS_ehbmDIqahZ8nJgZAzFuIbzMmw%3D%3D',
            headers=headers,
            data=body
        )

        logging.warning(response)
        # Comprobar el estado de la respuesta
        if response.status_code == 202:
            return func.HttpResponse(response.text, status_code=200)
        else:
            return func.HttpResponse("Error al consultar el modelo", status_code=500)
    
    except Exception as e:
        logging.error(f"Error en la autenticación: {e}")
        return func.HttpResponse("Error en el servidor.", status_code=500)
    
@app.route(route="Status")
def Status(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Obtener `codigoDeEmpleado` y `codigoDeAcceso` del cuerpo de la solicitud
        req_body = req.get_json()
        url = req_body.get('url')
        
        if not url:
            return func.HttpResponse(
                "Faltan parámetros en la solicitud.",
                status_code=400
            )

    

        # Realizar la solicitud POST a la API externa
        response = requests.get(
            url
        )
        logging.warning(response)
        logging.warning(response.text)
        logging.warning(response.status_code)
        # Comprobar el estado de la respuesta
        if response.status_code == 202 or response.status_code == 200:
            response_json = response.json()
            output = response_json.get("output")
            # Validar si `ruta_img_anaquel` existe y no es "Error"
            if output and "output_imagenes" in output:
                ruta_img_anaquel = output["output_imagenes"][0].get("ruta_img_anaquel")
                
                if ruta_img_anaquel and ruta_img_anaquel != "Error":
                    for item in output["output_imagenes"]:
                        ruta_img_anaquel = item.get("ruta_img_anaquel")
                        
                        if ruta_img_anaquel and ruta_img_anaquel != "Error":
                            # Extraer la parte de la ruta sin el nombre del contenedor
                            blob_name = "/".join(ruta_img_anaquel.split("/")[1:])

                            # Generar la URL con token SAS para la ruta en el Storage Account
                            sas_token = generate_blob_sas(
                                account_name=blob_service_client.account_name,
                                container_name=source_container_name,
                                blob_name=blob_name,
                                account_key=blob_service_client.credential.account_key,
                                permission=BlobSasPermissions(read=True),
                                expiry=datetime.utcnow() + timedelta(hours=1)  # URL válida por 1 hora
                            )
                            url_con_sas = f"https://{blob_service_client.account_name}.blob.core.windows.net/{source_container_name}/{blob_name}?{sas_token}"

                            # Añadir la URL generada al campo `path` del item
                            item["path"] = url_con_sas

                # Devolver la respuesta completa con los cambios en `output_imagenes`
                return func.HttpResponse(json.dumps(response_json), status_code=200, mimetype="application/json")
            return func.HttpResponse(json.dumps(response_json), status_code=200)
        else:
            return func.HttpResponse("Error", status_code=500)
    
    except Exception as e:
        logging.error(f"Error en la autenticación: {e}")
        return func.HttpResponse("Error en el servidor.", status_code=500)
    

@app.route(route="Historial")
def Historial(req: func.HttpRequest) -> func.HttpResponse:
    # Obtiene los parámetros opcionales de la solicitud
    mes = req.params.get('mes')  # Cambiamos a mes
    anio = req.params.get('anio')  # Cambiamos a año
    mostrador = req.params.get('mostrador')
    pinvenadro = req.params.get('pinvenadro')
    user = req.params.get('user') 


    

    
    
    try:
        conn = pyodbc.connect(f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}")
        cursor = conn.cursor()
        
        # Construcción de la consulta con filtros opcionales
        query = "SELECT * FROM [dbo].[Analisis]"
        conditions = []
        params = []
        conditions.append("Usernadro = ?")
        params.append(int(user))
       # Filtra por mes y año
        if mes and anio:
            conditions.append("MONTH([Fecha]) = ?")
            conditions.append("YEAR([Fecha]) = ?")
            try:
                params.append(int(mes))  # Asegúrate de que 'mes' sea un entero
                params.append(int(anio))  # Asegúrate de que 'anio' sea un entero
            except ValueError:
                return func.HttpResponse("Mes y año deben ser números enteros.", status_code=400)
        
        
        if mostrador:
            conditions.append("[Mostrador] = ?")
            params.append(mostrador)
        
        if pinvenadro:
            conditions.append("[PInvenadro] = ?")
            params.append(pinvenadro)
        
        # Agrega las condiciones a la consulta si existen filtros
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        # Ejecuta la consulta
        logging.warning(query)
        logging.warning(params)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Procesa los resultados en formato JSON
        results = []
        for row in rows:
            results.append({
                "id": row.id,
                "Fecha": row.Fecha.strftime("%Y-%m-%d %H:%M:%S"),
                "Mostrador": row.Mostrador,
                "Nombre_Mostrador": row.Nombre_Mostrador,
                "PInvenadro": row.PInvenadro,
                "Direccion": row.Direccion,
                "Resultados": row.Resultados,
                "Status": row.Status
            })
        
        # Cierra la conexión
        cursor.close()
        conn.close()
        
        # Devuelve los resultados como JSON
        return func.HttpResponse(json.dumps(results), mimetype="application/json", status_code=200)
    
    except Exception as e:
        return func.HttpResponse(f"Error en la conexión a la base de datos: {str(e)}", status_code=500)
    
@app.route(route="InsertarRegistro", methods=["POST"])
def InsertarRegistro(req: func.HttpRequest) -> func.HttpResponse:
    # Intenta parsear el cuerpo de la solicitud como JSON
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Por favor, proporcione datos válidos en formato JSON.", status_code=400)
    
    # Obtiene los parámetros necesarios del cuerpo de la solicitud
    fecha = datetime.now()
    mostrador = req_body.get('Mostrador')
    nombre_mostrador = req_body.get('Nombre_Mostrador')
    pinvenadro = req_body.get('PInvenadro')
    direccion = req_body.get('Direccion')
    resultados = req_body.get('Resultados')
    completitud = req_body.get('Completitud') 
    ventas = req_body.get('Ventas')  
    user = req_body.get('User') 

    try:
        # Conexión a la base de datos
        conn = pyodbc.connect(f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}")
        cursor = conn.cursor()

        # Construcción de la consulta de inserción
        query = """
        INSERT INTO [dbo].[Analisis] ([Fecha], [Mostrador], [Nombre_Mostrador], [PInvenadro], [Direccion], [Resultados], [Completitud], [Ventas], [Usernadro])
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        # Ejecuta la consulta de inserción
        cursor.execute(query, (fecha, mostrador, nombre_mostrador, pinvenadro, direccion, resultados, completitud, ventas, user))
        conn.commit()  # Confirma la transacción

        
        cursor.execute(f"SELECT TOP 1 id FROM [dbo].[Analisis] WHERE Mostrador = {mostrador} ORDER BY id DESC")  # Suponiendo que 'id' es la columna clave primaria
        id_insertado = cursor.fetchone()[0]
        logging.warning(id_insertado)
        # Cierra la conexión a la base de datos
        cursor.close()
        conn.close()
        resultadosjson = json.loads(resultados)
        logging.warning(resultadosjson["lista_niveles"])
        # Prepara el cuerpo para la solicitud HTTP
        body = {
            "id_analisis": id_insertado,
            "mostrador": mostrador,
            "list_niveles": resultadosjson['lista_niveles'],  # Lista de niveles
            "list_promedio_nivel": resultadosjson['lista_promedio_niveles'],  # Promedio de niveles
            "list_nombres_img": resultadosjson['lista_nombres_img']  # Nombres de imagen
        }

        # URL del endpoint al que se hace la solicitud
        endpoint_url = "https://func-anaqueles-inteligentes.azurewebsites.net/api/BuildImageHttpTrigger?code=FgsuhSOWHeZR3UFY7RdjeQ9_kUOS_ehbmDIqahZ8nJgZAzFuIbzMmw%3D%3D"


        logging.warning("Payload ")
        logging.warning(body)
        # Hacer la solicitud POST
        response = requests.post(endpoint_url, json=body)


        # Verifica si la solicitud fue exitosa
        if response.status_code == 200:
            return func.HttpResponse("Registro insertado y solicitud enviada correctamente.", status_code=201)
        else:
            return func.HttpResponse(f"Error en la solicitud al endpoint: {response}", status_code=500)
    except Exception as e:
        return func.HttpResponse(f"Error en la conexión a la base de datos: {str(e)}", status_code=500)
 
@app.route(route="Estadisticas")
def Estadisticas(req: func.HttpRequest) -> func.HttpResponse:
    # Obtiene los parámetros opcionales de la solicitud
    mes = req.params.get('mes')  # Cambiamos a mes
    anio = req.params.get('anio')  # Cambiamos a año
    user = req.params.get('user')
    try:
        conn = pyodbc.connect(f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}")
        cursor = conn.cursor()
        
        # Construcción de la consulta con filtros opcionales
        query = "SELECT * FROM [dbo].[Analisis]"
        conditions = []
        params = []
        conditions.append("Usernadro = ?")
        params.append(int(user))
       # Filtra por mes y año
        if mes and anio:
            conditions.append("MONTH([Fecha]) = ?")
            conditions.append("YEAR([Fecha]) = ?")
            try:
                params.append(int(mes))  # Asegúrate de que 'mes' sea un entero
                params.append(int(anio))  # Asegúrate de que 'anio' sea un entero
            except ValueError:
                return func.HttpResponse("Mes y año deben ser números enteros.", status_code=400)
        
        # Agrega las condiciones a la consulta si existen filtros
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        # Ejecuta la consulta
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Procesa los resultados en formato JSON
        results = []
        total_completitud = 0
        total_ventas_invenadro = 0
        total_pinvenadro = 0
        num_registros = len(rows)
        for row in rows:
            results.append({
                "id": row.id,
                "Fecha": row.Fecha.strftime("%Y-%m-%d %H:%M:%S"),
                "Mostrador": row.Mostrador,
                "Nombre_Mostrador": row.Nombre_Mostrador,
                "PInvenadro": row.PInvenadro,
                "Direccion": row.Direccion,
                "Resultados": row.Resultados,
                "Status": row.Status
            })
             # Sumar los valores necesarios para los promedios
            total_completitud += row.Completitud # Asegúrate de que 'completitud' es el campo correcto
            total_ventas_invenadro += row.Ventas  # Asegúrate de que 'ventas_invenadro' es el campo correcto
            total_pinvenadro += row.PInvenadro
         # Calcular promedios
        promedio_completitud = total_completitud / num_registros if num_registros > 0 else 0
        promedio_ventas_invenadro = total_ventas_invenadro / num_registros if num_registros > 0 else 0
        promedio_pinvenadro = total_pinvenadro / num_registros if num_registros > 0 else 0

        
        # Cierra la conexión
        cursor.close()
        conn.close()
        
        response_data = {
            "Resultados": results,
            "Numero_de_registros": num_registros,
            "Promedio_de_completitud": promedio_completitud,
            "Promedio_de_Ventas_Invenadro": promedio_ventas_invenadro,
            "Promedio_de_PInvenadro": promedio_pinvenadro
        }

        # Devuelve los resultados como JSON
        return func.HttpResponse(json.dumps(response_data), mimetype="application/json", status_code=200)
    except Exception as e:
        return func.HttpResponse(f"Error en la conexión a la base de datos: {str(e)}", status_code=500)
    
@app.route(route="DataAnalisis")
def DataObjeto(req: func.HttpRequest) -> func.HttpResponse:
    # Obtiene los parámetros opcionales de la solicitud
    id = req.params.get('id')  # Cambiamos a mes

    try:
        conn = pyodbc.connect(f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}")
        cursor = conn.cursor()
        
        # Construcción de la consulta con filtros opcionales
        query = "SELECT * FROM [dbo].[Analisis]"
        conditions = []
        params = []
        conditions.append("id = ?")
        params.append(int(id))
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        # Ejecuta la consulta
        logging.warning(query)
        logging.warning(params)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Procesa los resultados en formato JSON
        results = []
        for row in rows:
            results.append({
                "id": row.id,
                "Fecha": row.Fecha.strftime("%Y-%m-%d %H:%M:%S"),
                "Mostrador": row.Mostrador,
                "Nombre_Mostrador": row.Nombre_Mostrador,
                "PInvenadro": row.PInvenadro,
                "Direccion": row.Direccion,
                "Resultados": row.Resultados,
                "Status": row.Status
            })
        
        # Cierra la conexión
        cursor.close()
        conn.close()
        
        # Devuelve los resultados como JSON
        return func.HttpResponse(json.dumps(results), mimetype="application/json", status_code=200)
    
    except Exception as e:
        return func.HttpResponse(f"Error en la conexión a la base de datos: {str(e)}", status_code=500)
    

@app.route(route="DeleteAnalisis", methods=["DELETE"])
def DeleteObjeto(req: func.HttpRequest) -> func.HttpResponse:
    # Obtiene el parámetro obligatorio 'id' de la solicitud
    id = req.params.get('id')
    
    if not id:
        return func.HttpResponse("El parámetro 'id' es obligatorio.", status_code=400)
    
    try:
        # Conexión a la base de datos
        conn = pyodbc.connect(f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}")
        cursor = conn.cursor()

        # Consulta de eliminación
        query = "DELETE FROM [dbo].[Analisis] WHERE id = ?"
        params = [int(id)]

        # Ejecuta la consulta
        cursor.execute(query, params)
        conn.commit()  # Asegura que los cambios se guarden en la base de datos
        
        # Cierra la conexión
        cursor.close()
        conn.close()
        
        # Devuelve una respuesta de éxito
        return func.HttpResponse(f"El ítem con id {id} ha sido eliminado exitosamente.", status_code=200)
    
    except Exception as e:
        return func.HttpResponse(f"Error al intentar eliminar el ítem: {str(e)}", status_code=500)
