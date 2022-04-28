[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EL-BID_MapaInversiones&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EL-BID_MapaInversiones)
![analytics image (flat)](https://raw.githubusercontent.com/vitr/google-analytics-beacon/master/static/badge-flat.gif)
![analytics](https://www.google-analytics.com/collect?v=1&cid=555&t=pageview&ec=repo&ea=open&dp=/MapaInversiones/readme&dt=&tid=UA-4677001-16)

# MapaInversiones
---
Los objetivos principales de la plataforma son:

**a.** Proporcionar a las entidades de gobierno participantes la capacidad de interconectarse, intercambiar información en tiempo real, y suministrar dicha información para consumo de otras entidades y del público en general a través de ambientes con niveles de seguridad apropiados.

**b.**	Brindar herramientas de visualización tales como mapas interactivos con información georreferenciada, herramientas de analítica de datos e inteligencia de negocios para publicar información al público en general.

#### Conceptos basicos

**Actor:**	                    Representa los distintos actores que pueden participar de la ejecución de un proyecto.

**Ente territorial:**	        Representa el listado de entes territoriales. Pueden ser regiones, departamentos o municipios.

**Esquema de financiación:**	Representa cómo se financia un proyecto a través de diferentes fuentes de financiación.

**Estado:**                   Representa el listado de estados posibles de un proyecto.

**Etapa:**                   Representa el listado de posibles etapas de un proyecto.

**Fase:**                   Representa el listado de fases en las cuales se puede llegar a encontrar un proyecto.

**Foto:**                   Representa las distintas fotos que se pueden adjuntar a un proyecto.

**Fuente:**                   Representa el Listado de posibles fuentes de financiación con las cuales se puede financiar un proyecto.

**Georreferenciación:**	        Representa los puntos espaciales sobre el que se ejecuta cada proyecto.

**Historia estado:**	        Representa los estados por los cuales ha pasado un proyecto incluyendo el estado actual del mismo.

**Meta indicador producto:**	Representa las metas que deben cumplir los productos. Se hace por medio de indicadores.

**Objetivo específico:**	    Representa los objetivos específicos que tiene un proyecto .

**Producto:**               Representa los productos que se estarán generado para cumplir con cada objetivo específico.

**Proyecto:**               Representa la información básica de los proyectos.

**Rol:**                       Representa el listado de roles que puede tener un actor dentro de la ejecución de los proyectos.

**Sector:**	                    Representa el listado de sectores bajo los que se ejecutan los proyectos. Eg. Educación, vías, salud.

**Seguimiento esquema de financiación:** Representa el seguimiento que se le hace al esquema de financiación de los proyectos.

**Seguimiento indicador producto:**	      Representa el seguimiento que se le hace a los indicadores que indican la culminación de los productos acordados serán entregados en los proyectos.



## Guía de usuario
---
Explica los pasos básicos sobre cómo usar la herramienta digital. Es una buena sección para mostrar capturas de pantalla o gifs que ayuden a entender la herramienta digital.
 	
## Guía de instalación
---

#### Bases de Datos
Esta herramienta tiene su base de datos creada en Microsoft SQL Server 2019, para facilitar su despliegue, se ha creado una solucion llamada bd_nuevavision que se encuentra en la carpeta https://github.com/EL-BID/MapaInversiones/tree/main/MapaInversiones.BasedeDatos.Scripts, al compilarla y publicarla se pueden realizar lopasos necesarios para la conexión al servidro, creacion de la base de datos, y creacion de todas las tablas necesarias. Para mayor detalle puede consultar el manual que se encuentra en https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Instalaci%C3%B3n%20proyecto%20de%20base%20de%20datos.pdf

Una vez creada la base de datos con sus tablas y datos, es necesario cambiar la configuración de la conexion en los archivos appsettings.json que se encuentran en https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/App_Data/Sites/Default/appsettings.json y https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/appsettings.json.

Para el manejo de datos se utiliza LINQ2DB, por lo cual, en caso de ser necesario realizar algun ajuste en la programación, tambies es necesario ajustar la cadena de conexion en el archivo https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Infrastructura/DataModels/PISGR_Context.tt

#### Primeros pasos
1. Configure la conexión del tipo de publicación que desea realizar (Web deploy, FTP, file system, etc).
2. Configure el perfil de publicación, teniendo en cuenta los siguientes parametros:

    2.1. Configuración (Debug o Release - Any CPU)
    
    2.2. Target framework 3.1
    
    2.3. Seleccione el tipo de despliegue que quiere realizar. Existen dos opciones:
        a. Framework-dependent deployment (El framework de .Net Core debe estar preinstalado).
        b. Self-contained deployment (Contiene los binarios de .Net Core).
    2.4. Target runtime: Seleccione el runtime del servidor donde instalará la plataforma (Windows, linux, MacOS)
3. Realice la compilación y publicación de la solución.

#### Instalación en IIS

4. Instale o verifique que el framework de .Net Core 3.1 este instalado en el servidor que hospedará la aplicación (https://dotnet.microsoft.com/en-us/download/dotnet/3.1).
5. Como esta es una plataforma web el runtime requerido es ASP.NET Core Runtime 3.1.24
6. Se recomienda instalar el Windows Hosting Bundle que contiene el runtime y el ASP.NET Core Module.
7. Instale o verifique el componente SQLClrTypes de 64 bits (x64\SQLSysClrTypes.msi,https://www.microsoft.com/en-us/download/details.aspx?id=55992) 
8. Para el correcto funcionamiento de la aplicación, se requiere crear un sitio web, no funciona como aplicación virtual.
9. Crear un sitio web definiendo los parametros:
    9.1. Puerto (Ej: 80, 81, 443)
    9.2. Protocolo (HTTP o HTTPS)
    9.3. Certificado de seguridad (Opcional)
    9.4. Ruta de archivos (La carpeta raíz donde se encuentra la app)
10. Revise las cadenas de conexión a base de datos.
11. Inicie o reinicie el sitio web.


#### Dependencias
- Microsoft Windows Server 2019 Datacenter o superior
- Microsoft SQL server 2019 estándar edition SP2 o superior: Motor de bases de datos relacionales.
- SQL Server Integration Services: Herramienta ETL (Extraction, Transformation, Loading) que nos permitirá captar datos de fuentes heterogéneas, convertirlos a datos compatibles con nuestras reglas de negocio e incorporarlos a nuestras bases de datos (Incluido en la licencia de SQL server estándar).
- Internet information server (IIS): Servidor de aplicaciones web, se requiere la versión 10 o superior.
- .NET core 3.1 es una actualización en contexto de .NET Framework 4. Este aplica las optimizaciones realizadas por el proveedor sobre el CLR (Common language runtime)
- Bing maps Api. Suscripción a Bing maps account (Bing Maps Key valida): Api de servicios geoespaciales para la implementación de soluciones con georreferenciación.
- Microsoft Visual Studio 2019 o superior: IDE de desarrollo.
- Orchard Core framework 1.0: Web content management (WCM) Que permite la administración de contenido en la plataforma ademas de ofrecer un marco de aplicación para crear aplicaciones modulares en ASP.NET Core. (https://github.com/OrchardCMS/OrchardCore)
- Apache Solr 8.0.0: Motor de búsqueda e indexación de contenidos (https://solr.apache.org/)
- Linq2DB: Es una biblioteca de acceso a bases de datos LINQ más rápida que ofrece una capa simple, liviana, rápida y segura entre sus objetos POCO y su base de datos.(https://github.com/linq2db/linq2db)

## Autor/es
---
Nombra a el/los autor/es original/es. Consulta con ellos antes de publicar un email o un nombre personal. Una manera muy común es dirigirlos a sus cuentas de redes sociales.

### Licencia 
---
Licencia BID [LICENSE](https://github.com/EL-BID/MapaInversiones/blob/main/License.md)

## Limitación de responsabilidades

El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.
