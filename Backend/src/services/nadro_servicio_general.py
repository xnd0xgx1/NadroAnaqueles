import logging
import requests
import json

def preparar_filtros_por_codigo_producto(data):
    codigo_productos = [
        item["codigo_producto"]
        for img in data["output_imagenes"]
        for item in img["detalle_materiales"]
        if item["codigo_producto"] != "nan"
    ]
    filtro_de_productos = " or ".join(f"APIMAT eq '{codigo}'" for codigo in sorted(set(codigo_productos)))
    resultado = f"APICEN eq '3030' and ({filtro_de_productos})"
    return resultado

def obtenerExistencia(filtros: str):
    logging.info(f"[obtenerExistencia] - Request: {filtros}")
    try:
        headers = {
            "api-key": "720500c2b3ef446bba3bb6ff170ef807",
            "Content-Type": "application/json"
        }
        url = f"https://api.nadro.mx/prod/servicios/general/ZP2P_OD_EXIS_CEN_MAT_EAN_SRV/HeaderSet?$filter={filtros}&$format=json&sap-client=500"

        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        logging.info(f"[obtenerExistencia] - Response: {data}")
        return data["d"]["results"]
    except requests.exceptions.HTTPError as errh:
        logging.error(f"Error HTTP: {errh}")
        return []
    except requests.exceptions.ConnectionError as errc:
        logging.error(f"Error de conexión: {errc}")
        return []
    except requests.exceptions.Timeout as errt:
        logging.error(f"Error de timeout: {errt}")
        return []
    except requests.exceptions.RequestException as err:
        logging.error(f"Error general: {err}")
        return []

def hidratar_existencia(data):
    data = json.loads(data)
    filtros = preparar_filtros_por_codigo_producto(data)
    existencias = obtenerExistencia(filtros)
    if len(existencias) == 0:
        return data
    
    existencias_por_producto = [
        {"codigo_producto": item["APIMAT"], "existencia": item["APIDISP"]}
        for item in existencias
    ]

    existencias_por_producto_dict = {ref['codigo_producto']: ref['existencia'] for ref in existencias_por_producto}
    
    for img in data["output_imagenes"]:
        for item in img["detalle_materiales"]:
            codigo_original = item["codigo_producto"].strip()
            codigo_completo = codigo_original.zfill(18)
            item["existencia"] = existencias_por_producto_dict.get(codigo_completo, "Desconocida")
    return json.dumps(data)