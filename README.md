[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EL-BID_MapaInversiones&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EL-BID_MapaInversiones)
![analytics image (flat)](https://raw.githubusercontent.com/vitr/google-analytics-beacon/master/static/badge-flat.gif)
![analytics](https://www.google-analytics.com/collect?v=1&cid=555&t=pageview&ec=repo&ea=open&dp=/MapaInversiones/readme&dt=&tid=UA-4677001-16)

# MapaInversiones
---
Esto es un archivo README. Debe contener la documentación de soporte uso de la herramienta digital. Las siguientes secciones son las secciones recomendadas que debes poner incluir en cualquier herramienta digital. Puedes descargar este archivo para que te sirva como plantilla.

Asegúrate de empezar este archivo con una breve descripción sobre las funcionalidades y contexto de la herramienta digital. Sé conciso y al grano.

## Guía de usuario
---
Explica los pasos básicos sobre cómo usar la herramienta digital. Es una buena sección para mostrar capturas de pantalla o gifs que ayuden a entender la herramienta digital.
 	
## Guía de instalación
---
Esta herramienta tiene su base de datos creada en Microsoft SQL Server 2019, para facilitar su despliegue, se ha creado una solucion llamada bd_nuevavision que se encuentra en la carpeta https://github.com/EL-BID/MapaInversiones/tree/main/MapaInversiones.BasedeDatos.Scripts, al compilarla y publicarla se pueden realizar lopasos necesarios para la conexión al servidro, creacion de la base de datos, y creacion de todas las tablas necesarias. Para mayor detalle puede consultar el manual que se encuentra en https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Instalaci%C3%B3n%20proyecto%20de%20base%20de%20datos.pdf

Una vez creada la base de datos con sus tablas y datos, es necesario cambiar la configuración de la conexion en los archivos appsettings.json que se encuentran en https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/App_Data/Sites/Default/appsettings.json y https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/appsettings.json.

Para el manejo de datos se utiliza LINQ2DB, por lo cual, en caso de ser necesario realizar algun ajuste en la programación, tambies es necesario ajustar la cadena de conexion en el archivo https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Infrastructura/DataModels/PISGR_Context.tt

### Dependencias
- Windows Server 2019 Datacenter o superior
- Microsoft SQL Server 2019
- IIS 8 o superior
- Microsoft Visual Studio Community 2015 o superior
- Orchard Core
- Apache Solr
- Linq2DB



## Código de conducta 
---
El código de conducta establece las normas sociales, reglas y responsabilidades que los individuos y organizaciones deben seguir al interactuar de alguna manera con la herramienta digital o su comunidad. Es una buena práctica para crear un ambiente de respeto e inclusión en las contribuciones al proyecto. 

La plataforma Github premia y ayuda a los repositorios dispongan de este archivo. Al crear CODE_OF_CONDUCT.md puedes empezar desde una plantilla sugerida por ellos. Puedes leer más sobre cómo crear un archivo de Código de Conducta (aquí)[https://help.github.com/articles/adding-a-code-of-conduct-to-your-project/]

## Autor/es
---
Nombra a el/los autor/es original/es. Consulta con ellos antes de publicar un email o un nombre personal. Una manera muy común es dirigirlos a sus cuentas de redes sociales.

## Información adicional
---
Esta es la sección que permite agregar más información de contexto al proyecto como alguna web de relevancia, proyectos similares o que hayan usado la misma tecnología.

### Licencia 
---
Licencia BID [LICENSE](https://github.com/EL-BID/MapaInversiones/Licencia.md)

## Limitación de responsabilidades

El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.
