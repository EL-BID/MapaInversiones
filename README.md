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

#### Usuario
Cuando el usuario ingresa a la página inicial o índex de MapaInversiones, y observar un encabezado que se compone de una parte superior que contiene los enlaces a secciones como el “Acerca de” del sitio, el marco legal y un centro de ayuda. A continuación, se encuentra con los logos del sitio, junto con un enlace a trasmisiones en vivo, que es una sección donde el país agrega el acceso a diferentes trasmisiones de interés que realice. Lo siguiente es un buscador configurado en un servidor Apache Solr y que indexa la diferente información que ofrece el sitio web.

![buscador](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/manual1.jpg "buscador")

En los menús de la parte superior podrá acceder a seccione como planeación, presupuesto y la posibilidad de ir a una sección donde se pueden descargar los archivos de datos abiertos.
También encontrará la sección de banner y anuncios, la cual sirve para resaltar los aspectos principales del sitio y redirigir la navegación de los usuarios a tópicos específicos, como la planificación, plan de desarrollo o presupuesto, que a su vez se encuentran dentro del menú superior.

![carrusel](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/manual2.jpg "carrusel")

Otro elemento con el que podrá interactuar, es un resumen con los gastos de las entidades, mostrando las 4 entidades cuyo porcentaje de ejecución esta entre los cuatro primeros. Debajo se encuentra un botón para ver todas las entidades, al presionarlo lleva a al buscador, mostrando los resultados específicos de todas las entidades que se encuentren indexadas.

![entidades](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/manual3.jpg "entidades")

La siguiente sección de la página principal muestra una sección dividida. En la parte de la izquierda aparece un listado de noticias, las cuales se configuran desde el administrador de contenido, en estas secciones pueden ver las 4 noticias más recientes, ver una imagen, el titulo y un pequeño resumen o subtitulo, junto con la fecha publicación, en la parte del título de noticias redirige a la sección completa de noticias, donde se pueden ver todas las que han sido publicadas.

En la parte izquierda se encuentra “sigue la conversación”, en donde se encuentra un widget de Twitter para ver los últimos mensajes publicados por la entidad en esa red social.

![noticias](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/Manual4.jpg "noticias")

Mas adelante el usuario encontrara dos secciones, la primera que muestra el enlace que lo envía a la sección de “Centro de ayuda”, allí puede encontrar tres secciones, una de preguntas frecuentes, otra con un glosario de términos relacionados, y por último a un formato de contacto que sirve para enviar una opinión correo configurado en la aplicación
La siguiente sección es un menú de pie de página, mostrando nuevamente las diferentes secciones de la aplicación. Adicional, al final existe otro apartado que muestra los diferentes logos de las entidades participantes.

![pie de pagina](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/Manual5.jpg "pie de pagina")

#### Administrador
En la aplicación existe un usuario creado en el gestor de contenido Orchard que es el encargado de la administración del sitio, por la opción de /admin, es posible administrar los contenidos como el de ayuda, es decir, categorías, preguntas frecuentes, glosario y el formulario de contáctenos.

![administrador](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/Manual6.jpg "administrador")

Adicional a esto también es posible subir los enlaces a los elementos de datos abiertos de inversión y proyectos, además de crear, editar y publicar las noticias y otros componentes importantes, como los banners, anuncios y menú.
Otro elemento importante que puede configurar el administrador y hacer más eficiente en tiempo y esfuerzo el cambio de los textos asociados a las gráficas y otros textos como notas, es el contenido “Etiqueta”, que es llamado dentro de los perfiles y donde se puede tener un título y un texto HTML.

#### Manual
Para una descripcion mas detallada de cada uno de los elementos que pueden econtrar los usuarios de la aplicacion, por favor revisar el  [Manual de Usuarios](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Manual%20usuarios%20MapaInversiones.pdf).
 	
## Guía de instalación
---

#### Bases de Datos
Esta herramienta tiene su base de datos creada en Microsoft SQL Server 2019, para facilitar su despliegue, se ha creado una solucion llamada bd_nuevavision que se encuentra en la carpeta [MapaInversiones.BasedeDatos.Scripts](https://github.com/EL-BID/MapaInversiones/tree/main/MapaInversiones.BasedeDatos.Scripts), al compilarla y publicarla se pueden realizar lopasos necesarios para la conexión al servidro, creacion de la base de datos, y creacion de todas las tablas necesarias. Para mayor detalle puede consultar el [Manual de Instalación de Base de Datos](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Instalaci%C3%B3n%20proyecto%20de%20base%20de%20datos.pdf).

Una vez creada la base de datos con sus tablas y datos, es necesario cambiar la configuración de la conexion en los archivos appsettings.json que se encuentran en [App_Data/Sites/Default/appsettings.json](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/App_Data/Sites/Default/appsettings.json) y [MapaInversiones.Web/appsettings.json](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/appsettings.json).

Para el manejo de datos se utiliza LINQ2DB, por lo cual, en caso de ser necesario realizar algun ajuste en la programación, tambies es necesario ajustar la cadena de conexion en el archivo [PISGR_Context.tt](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Infrastructura/DataModels/PISGR_Context.tt).

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
- Apache Solr 8.0.0: Motor de búsqueda e in:
:dexación de contenidos (https://solr.apache.org/)
- Linq2DB: Es una biblioteca de acceso a bases de datos LINQ más rápida que ofrece una capa simple, liviana, rápida y segura entre sus objetos POCO y su base de datos.(https://github.com/linq2db/linq2db)

## Autor/es:

---
- [Juan Cruz Vieyra](https://www.linkedin.com/in/juan-cruz-vieyra-345b253/ "Juan Cruz Vieyra")
- [Sebastian del Hoyo](https://www.linkedin.com/in/sebastiandelhoyo/ "Sebastian del Hoyo")
- [José Niño](https://www.linkedin.com/in/jose-ni%C3%B1o-a2a8a731/ "José Niño")
- [Liliana Cañas Baquero](https://www.linkedin.com/in/liliana-ca%C3%B1as-baquero-977056137/ "Liliana Cañas Baquero")
- [Diego Hernan Perez Jaramillo](mailto:diperez@uniandes.edu.co  "Diego Hernan Perez Jaramillo")
- [Wilson Muñoz Camelo](https://www.linkedin.com/in/wilson-mu%C3%B1oz-camelo-24b11324/ "Wilson Muñoz Camelo")
- [David Olaciregui](https://www.linkedin.com/in/david-olaciregui-35196015/ "David Olaciregui")
- [Anyela Milena Chavarro Muñoz ](https://www.linkedin.com/in/anyela-milena-chavarro-mu%C3%B1oz-0a79a524/ "Anyela Milena Chavarro Muñoz ")
- [Julian Alberto Castiblanco Palacios](mailto:juliancastiblancop@gmail.com "Julian Alberto Castiblanco Palacios")
- [Vladimiro Bellini](https://www.linkedin.com/in/vladimirobellini/ "Vladimiro Bellini")
- [Andrés Felipe Villamizar Vecino](mailto:villamizarvecino@hotmail.com "Andrés Felipe Villamizar Vecino")
- [Diana Villamizar](https://www.linkedin.com/in/diana-villamizar-4737762a/ "Diana Villamizar")
- [William García](mailto:williamlgr2006@gmail.com "William García")
- [Enrique José Oyaga Arias](mailto:enriqueoyaga@gmail.com "Enrique José Oyaga Arias")
- [Luis Mendez](https://www.linkedin.com/in/luisefe80/ "Luis Mendez")

## Licencia 
---
Licencia BID [LICENSE](https://github.com/EL-BID/MapaInversiones/blob/main/License.md)

## Limitación de responsabilidades

El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.