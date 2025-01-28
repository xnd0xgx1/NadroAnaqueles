
# Anaqueles inteligentes

2024-11

## Tabla de Contenido

- [Anaqueles inteligente](#Anaqueles-inteligentes)
  - [Tabla de Contenido](#tabla-de-contenido)
  - [Equipo](#equipo)
  - [Descripción del problema u oportunidad](#descripción-del-problema-u-oportunidad)
  - [Descripción de la solución](#descripción-de-la-solución)
    - [Lienzo de Producto](#lienzo-de-producto)
    - [Comunicado de Prensa](#comunicado-de-prensa)
    - [Cinco preguntas centradas en el cliente](#cinco-preguntas-centradas-en-el-cliente)
    - [Preguntas Frecuentes (FAQ)](#preguntas-frecuentes-faq)
  - [Proceso](#proceso)
  - [Storyboard](#storyboard)
  - [SIPOC Diagram](#sipoc-diagram)
    - [Inputs (Entradas)](#inputs-entradas)
    - [Process (Proceso)](#process-proceso)
    - [Outputs (Salidas)](#outputs-salidas)
  - [Arquitectura de la solución](#arquitectura-de-la-solución)
  - [Backend](#backend)
  - [Infraestructura](#infraestructura)
  - [Costos](#costos)
  - [Conjunto de Datos](#conjunto-de-datos)
  - [CRISP-DM / Well Architected Machine Learning Lens Componentes](#crisp-dm--well-architected-machine-learning-lens-componentes)
    - [Adquisición y entendimiento de datos](#adquisición-y-entendimiento-de-datos)
    - [Preparación de datos (ETLs a la nube)](#preparación-de-datos-etls-a-la-nube)
    - [Preprocesamiento de datos](#preprocesamiento-de-datos)
    - [Analítica](#analítica)
    - [Inteligencia Artificial](#inteligencia-artificial)
  - [Estructura del Repo](#estructura-del-repo)
  - [Manual de Uso](#manual-de-uso)
  - [Referencias](#referencias)

## Equipo

|Nombre|Correo
|-|-
|Enrique Hernadez Nava|<enrique_nava@nadro.com.mx>
|Javier Castillo Millán|<javier_castillo@nadro.com.mx>
|Nestor Ramirez Miranda|<Nestor_ramirez@nadro.com.mx>

## Descripción del problema u oportunidad

NADRO se encuentra en una fase de actualización tecnológica, con el objetivo de optimizar su proceso de inspección de vehículos mediante la implementación de una solución basada en Inteligencia Artificial (IA). Esta solución permitirá automatizar la detección de daños, como golpes y raspones, a partir de imágenes capturadas de los vehículos.

La empresa necesita una herramienta que no solo automatice el proceso de inspección, sino que también ofrezca un alto grado de precisión en la identificación de daños. Además, la solución debe ser escalable, permitiendo su uso en múltiples unidades de la flota, y tener la capacidad de integrarse fácilmente con los sistemas existentes de la empresa, garantizando una adopción sin fricciones y el uso eficiente de los recursos tecnológicos actuales. Esta mejora representa una oportunidad para incrementar la eficiencia operativa y reducir errores humanos en la inspección visual de vehículos.

1. **Ineficiencia Operativa**: La inspección manual de vehículos es más lenta y susceptible a errores humanos, lo que podría incrementar los tiempos de procesamiento y revisión de los vehiculos.

2. **Costos Operativos Elevado**: La falta de automatización obligará a NADRO a depender de personal para llevar a cabo las inspecciones, lo que implica mayores costos en mano de obra. Además, la repetición de inspecciones debido a errores humanos podría elevar aún más estos costos.

3. **Escalabilidad Limitada**:  A medida que NADRO expanda sus operaciones, el método manual de inspección se volverá aún menos viable, obstaculizando el crecimiento y la capacidad de manejar un mayor volumen de vehículos sin aumentar considerablemente el personal.

La problemática descrita impacta de manera significativa en la detección oportuna de los daños que puedan tener los vehiculos, afectando el matenimiento y sostenibilidad de los mismos.

## Descripción de la solución

![Damage Detection](Imagen_logo.png)

 Se diseñó una solución que permite el análisis por medio de dos modelos de AI que se consumen por medio de un end point disponibilizados por HTTPS en una Azure Function, almacenando los logs de interacción en un Storage Account .

La arquitectura diseñada tiene  los siguientes focos principales: 

1.	**Integración con OpenAI GPT4o**: Se priorizará la integración con OpenAI GPT herramienta con la cual se disponibilidad las imágenes en formato URL codificadas en base64, con los cual se implementa un prompt de instrucciones que permita el análisis de la imagen dada.
2.	**Modelo de Custom Vision**: Se entrena un modelo de Custom Vision de Azure que permite la clasificación de imágenes con los tags previamente entrenado para que permita detectar si la imagen dada tiene o no daños y que parte del vehículo es.
3.	**Azure Function como herramienta de consumo** : Se desarrolla una Azure Function la cual integra dos funciones que  dispinibiliza los modelos de Open AI y Custom Vision.
4.	**Almacenamiento de logs de interacción**: Todas las interacciones que se realicen por medio del endpoint  se almacenaran en un archivo plano en el Storage Account donde se podrá llevar un control de manera independiente para cada modelo.


      **custom-vision-model** : almacenamiento de logs de consumo del modelo de detección de daños entrenado en Custom Vision

      **openai-model**: almacenamiento de logs de consumo del modelo GPT4o para detección de daños en vehículos.


### Lienzo de Producto

El lienzo de producto es una herramienta visual que describe los elementos clave de un producto, incluyendo su propuesta de valor, necesidades, metas del negocio entre otros.

![Canvas](Diagrama1.png)

### Comunicado de Prensa

El comunicado de prensa describe de manera clara y concisa el producto final desde la perspectiva del cliente, destacando sus beneficios y características clave.

[Comunicado de prensa.](press_release.md)

### Cinco preguntas centradas en el cliente

Este documento responde a cinco preguntas esenciales que ayudan a enfocar el desarrollo en las necesidades del cliente, proporcionando una comprensión profunda de sus expectativas y cómo el producto las cumple.

[Cinco preguntas centradas en el cliente.](5_questions.md)

### Preguntas Frecuentes (FAQ)

La sección de preguntas frecuentes aborda las inquietudes comunes que pueden surgir entre los usuarios, ofreciendo respuestas detalladas y claras para asegurar una comprensión completa del producto y sus beneficios.

[Preguntas Frecuentes (FAQ).](faq.md)

## Proceso

El siguiente proceso describe el flujo del sistema Vehicle Damage Detection:

![Proceso](Diagrama_Proceso.png)

## Storyboard

A continuación se muestra un storyboard que describe el flujo de interacción entre las solicitudes y la solución:

![Storyboard](Story.png)

1. **Solicitud:**
   - **Escena**: Se requiere el análisis de una imagen de un vehículo.
   - **Acción**: Se Consume el endpoint HTTPS enviando una imagen.

2. **Analisis:**
   - **Escena**: Análisis de la imagen con AI Generativa y cognitiva.
   - **Acción**: Los modelos preentrenados codifican la imagen,  la clasifican y la analizan.

3. **Almacenamiento de interacción:**
   - **Escena**: Se almacena la interacción con los modelos.
   - **Acción**: Se almacenan los logs de la interacción en el Storage Account.

4. **Respuesta:**
   - **Escena**: Se requiere el análisis de la imagen enviada.
   - **Acción**: El API REST devuelve la detección de los daños del vehículo.


## SIPOC Diagram

### Inputs (Entradas)

- **Imagen Vehiculo**: Imagen tomada de un vehiculo de transporte de NADRO con o sin daños

### Process (Proceso)

1. **Solicitud de análisis**: Se realiza un envió de una imagen del vehículo que se desea analizar por medio del endpoint 
2. **consumo de Function**: Se utiliza el servicio de Azure Function para direccionar la imagen a los modelos
3. **Analítica de la imagen**: Se utiliza el modelo de Azure Custom Vision o Azure Open AI GPT4o para realizar el analisis del vehículo en la imagen
4. **Resultado Análisis**: Se genera el análisis del daño del vehículo en la imagen, la vista del vehículo y el tipo de daño en el caso de Azure Open AI
5. **Almacenamiento de Logs**: Se almacenan los logs de la interacción con el modelo que tiene la información del análisis

### Outputs (Salidas)

- **Análisis Modelo Custom Vision**: Devuelve la probabilidad de la clasificación de la imagen, la vista de la imagen y si tiene daño o no.
- **Análisis Modelo Azure Open AI**: Retorna si la imagen es de un vehículo, la vista del vehículo, el tipo de daño que se vea en la imagen y el porcentaje de daño.


## Arquitectura de la solución

![Arquitectura](Arquitectura.png)

El diagrama anterior ilustra el ecosistema de herramientas y servicios esenciales que serán necesarios para la implementación de una arquitectura basada en la Nube de Azure. En este entorno, se destaca la integración de servicios clave como Azure Function para la disponibilización de los modelos, Azure Storage para el almacenamiento eficiente de datos, OpenAI para aprovechar capacidades avanzadas en procesamiento de lenguaje natural y Azure Custom Vision servicio cognitivo que permite el entrenamiento de análisis de imágenes. Este conjunto de herramientas y servicios proporciona una base sólida para la creación y evolución exitosa de los modelos de detección de daños en vehículos, asegurando la eficiencia y la adaptabilidad.

**Staging Area**

**Data lake storage (dlsidataeastusnprd)**: Azure Data Lake Storage como solución de lago de datos, proporciona una opción rentable y altamente escalable para el análisis de macrodatos. Combina un sistema de archivos de alto rendimiento con una escala masiva y economía, siendo ideal para almacenar datos provenientes de interacciones, datos procesados por herramientas de ETL, y resultados de modelos de inteligencia artificial. Este almacenamiento será crucial para almacenar las interacciones con los diferentes modelos disponibles en la Azure Function.

**Availability**

**Azure Functions (functappeastusnprd)**: Azure Functions es un servicio en la nube disponible a petición que ofrece infraestructura y recursos necesarios para ejecutar aplicaciones. Se actualiza continuamente y se adapta a la demanda, siendo esencial en el proceso de disponibilización de los modelos por medio de funciones HTTPS. 

**Modeling**

**Azure open AI (oaiaceleratoraieastusnprd)**: API REST a potentes modelos de lenguaje de OpenAI, incluyendo GPT-4o y GPT-3.5-Turbo. Estos modelos, versátiles y eficaces, se pueden adaptar fácilmente a tareas específicas como generación de contenido, resumen, búsqueda semántica y traducción de lenguaje natural a código. La disponibilidad a través de API REST, SDK de Python y Azure OpenAI Studio proporciona flexibilidad en el uso de este servicio para enriquecer el procesamiento de lenguaje.

**Azure custom vision (cognitiveeastusnprd)**: es un servicio de reconocimiento de imágenes que permite compilar, implementar y mejorar sus propios modelos de identificadores de imágenes. Los identificadores de imágenes aplican etiquetas a las imágenes en función de sus características visuales. Cada etiqueta representa una clasificación u objeto. Custom Vision permite especificar sus propias etiquetas y entrenar modelos personalizados para detectarlos.


## Backend

El backend de la solución está compuesto por una serie de servicios de Azure Microsoft que reciben la imagen y consume dos modelos que permiten la clasificación y analisis de una imagen.

El backend consta de los siguientes componentes:

1. **Azure Functions**: Actúa como punto de entrada para las solicitudes de los usuarios. Recibe la imagen y los dirige a la funciion del correspondiente modelo para su procesamiento.

2. **Azure open AI**: Servicio encargado de disponibilizar el modelo GPT4o para el consumo y analisis de la imagen

3. **Custom Vision**: Servicio que permite el entrenamiento de un modelo de clasificación de imagenes y disponibilizarlo para el consumo

## Infraestructura

La infraestructura de la solución utiliza servicios en la nube de Microsoft Azure para garantizar la escalabilidad, disponibilidad y seguridad del sistema. Los servicios de Azure proporcionan una plataforma robusta y confiable para alojar la aplicación y gestionar los datos de forma eficiente.

## Costos

Los costos asociados con la implementación de la solución SANDIA incluyen:

1. **Costos de infraestructura**: Los costos de los servicios de Microsoft Azure utilizados para alojar la aplicación y gestionar los datos. Estos costos pueden variar según el uso y la demanda de los servicios.
2. **Costos de desarrollo**: Los costos asociados con el desarrollo y mantenimiento de la aplicación, incluyendo el diseño, la implementación y las pruebas.
3. **Costos de personal**: Los costos de contratar y capacitar al personal necesario para operar y mantener la solución.
4. **Costos de integración**: Los costos de integrar la solución con otros sistemas y servicios existentes en la organización.
5. **Costos de formación**: Los costos de formar al personal en el uso de la solución y en las mejores prácticas de operación.

## Conjunto de Datos

Para alimentar el sistema de Vehicle Damage Detection, se deberá contar con los siguientes datos

1. **Imagenes de Entrenamiento Modelo Custom Vision:**
   Se requiere de un conjunto de imágenes en formato .jpeg para el entrenamiento del modelo de clasificación las cuales se agrupan en los siguiente tags:
   - Frontal con daño: vehículos con daño en la parte frontal
   - Frontal sin daño: vehículos sin daños en la parte frontal
   - Trasero con daño: vehículos con daño en la parte trasera
   - Trasero sin daño: vehículos sin daño en la parte trasera
   - Lateral con daño :vehículos con daño lateral
   - Lateral sin daño: vehículos sin daño lateral
   - No es un vehiculo: imágenes de diferentes vehículos que no deberían entrar dentro del análisis


2. **Imagen a analizar:**
   - Imagen del vehiculo a analizar en formato .jpeg o .png.



## CRISP-DM / Well Architected Machine Learning Lens Componentes

### Adquisición y entendimiento de datos

n/a

### Preparación de datos (ETLs a la nube)

n/a

### Preprocesamiento de datos

n/a

### Analítica

n/a

### Inteligencia Artificial

La solución Vehicle Damage Detection utiliza inteligencia artificial para analizar la imagen del vehiculo que se requiere analizar y generar una respuesta con el analisis de los daños del vehiculo de la imagen

Vehicle Damage Detection usa un modelo de IA generativa (LLM) preentrenado, en este caso es CHATGPT 4o.

## Estructura del Repo

```plaintext
.
├── 5_questions.md
├── README.md
├── canvas.docx
├── faq.md
├── img
│   ├── arch.png
│   ├── canvas.png
│   ├── process.png
│   ├── sandia.png
│   ├── sandia2.png
│   └── storyboard.png
├── press_release.md
└── storyboard.pptx

1 directory, 12 files
```

## Manual de Uso

Para utilizar el sistema Vehicle Damage Detection, siga los pasos indicados en el manual de uso:

 [Manual de Uso](manual.pdf)

## Referencias

- [Amazon Web Services](https://aws.amazon.com/)
