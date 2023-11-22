[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EL-BID_MapaInversiones&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EL-BID_MapaInversiones)

# MapaInversiones
---
Los objetivos principales de la plataforma son:

**a.** Proporcionar a las entidades de gobierno participantes la capacidad de interconectarse, intercambiar información en tiempo real, y suministrar dicha información para consumo de otras entidades y del público en general a través de ambientes con niveles de seguridad apropiados.

**b.**	Brindar herramientas de visualización tales como mapas interactivos con información georreferenciada, herramientas de analítica de datos e inteligencia de negocios para publicar información al público en general.

#### Conceptos básicos

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

**Sector:**	                    Representa el listado de sectores bajo los que se ejecutan los proyectos. Ejemplo. Educación, vías, salud.

**Seguimiento esquema de financiación:** Representa el seguimiento que se le hace al esquema de financiación de los proyectos.

**Seguimiento indicador producto:**	      Representa el seguimiento que se le hace a los indicadores que indican la culminación de los productos acordados serán entregados en los proyectos.



## Guía de usuario
---

#### Usuario
Cuando el usuario ingresa a la página inicial o índex de MapaInversiones, y observar un encabezado que se compone de una parte superior que contiene los enlaces a secciones como, “Acerca de” del sitio, marco legal, centro de ayuda y contáctenos. A continuación, se encuentra con los logos del sitio.
En el menú de la parte superior podrá acceder a secciones como, inversión pública, presupuesto, instituciones, participación ciudadana, contratación pública, la posibilidad de ir a una sección donde se pueden descargar los archivos de datos abiertos, y un glosario.

Lo siguiente en pantalla es un buscador configurado en un servidor Apache Solr y que indexa la diferente información que ofrece el sitio web.

![buscador](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/buscador.jpg "buscador")

También encontrará la sección de banner y anuncios, la cual sirve mostrar imágenes, para resaltar los aspectos principales del sitio, y redirigir la navegación de los usuarios a tópicos específicos, como en el caso de la siguiente imagen, a las del ciclo presupuestario, a descargar una ley, y a revisar las diferentes fuentes de financiación.

![carrusel](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/carrusel.jpg "carrusel")

La siguiente sección presenta un enlace a una de las principales y primeras características que se desarrollaron de la Plataforma, el cual es el Mapa de Inversión Publica. Además de esta sección, también es posible ir al mapa por el menú de la parte superior, mencionado con anterioridad.

![enlace mapa de inversión](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/enlacemapa.jpg "enlace mapa de inversión")

Una vez se ingrese al enlace, como se ve en la siguiente imagen, Mapa de Inversión presenta en la parte izquierda un filtro por diferentes características, estas sirven para ir reduciendo la cantidad de elementos mostrados en el mismo.

![mapa de inversión](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/mapa.jpg "mapa de inversión")

Los siguientes elementos con los que el usuario puede interactuar, son las fichas resumen. Las primeras de estas muestran algunas preguntas con su respuesta, relacionadas con los presupuestos ciudadanos, y un botón que envía a la sección correspondiente. 

![fichas presupuesto ciudadano](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/fichapresupuestociudadano.jpg "fichas presupuesto ciudadano")

Después el usuario encontrara otras fichas con el presupuesto ejecutado por institución, junto con el enlace para ir a la sección de Presupuestos por Instituciones.

![fichas presupuesto por institucion](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/presupuestointitucion.jpg "fichas presupuesto por institución")

La ultimas fichas resumen son las correspondientes a los contratos, en el caso del país de ejemplo la fuente de datos proviene de dos fuentes diferentes.

![contratos](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/contratos.jpg "contratos")

La siguiente sección de la página principal muestra una sección dividida. En la parte de la izquierda aparece un listado de noticias, las cuales se configuran desde el administrador de contenido, en estas secciones pueden ver las 4 noticias más recientes, ver una imagen, el titulo y un pequeño resumen o subtitulo, junto con la fecha publicación, en la parte del título de noticias redirige a la sección completa de noticias, donde se pueden ver todas las que han sido publicadas.

En la parte izquierda se encuentra “sigue la conversación”, en donde se encuentra un widget de Twitter para ver los últimos mensajes publicados por la entidad en esa red social.

![noticias](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/noticias.jpg "noticias")

Mas adelante el usuario encontrara la sección que envía a formato de contacto que sirve para enviar una opinión correo configurado en la aplicación.

![contacto](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/contacto.jpg "contacto")

La siguiente sección es un menú de pie de página, mostrando nuevamente las diferentes secciones de la aplicación. Adicional, al final existe otro apartado que muestra los diferentes logos de las entidades participantes.

![pie de pagina](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/pie.jpg "pie de página")

#### Administrador
En la aplicación existe un usuario creado en el gestor de contenido Orchard que es el encargado de la administración del sitio, por la opción de /admin, es posible administrar los contenidos como el de ayuda, es decir, categorías, preguntas frecuentes, glosario y el formulario de contáctenos.

![administrador](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/media/admin.jpg "administrador")

Adicional a esto también es posible subir los enlaces a los elementos de datos abiertos de inversión y proyectos, además de crear, editar y publicar las noticias y otros componentes importantes, como los banners, anuncios y menú.
Otro elemento importante que puede configurar el administrador y hacer más eficiente en tiempo y esfuerzo el cambio de los textos asociados a las gráficas y otros textos como notas, es el contenido “Etiqueta”, que es llamado dentro de los perfiles y donde se puede tener un título y un texto HTML.

#### Manual
Para una descripción más detallada de cada uno de los elementos que pueden encontrar los usuarios de la aplicación, por favor revisar el  [Manual de Usuarios](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Manual%20usuarios%20MapaInversiones.pdf).
 	
## Guía de instalación
---

#### Bases de Datos
Esta herramienta tiene su base de datos creada en Microsoft SQL Server 2019, para facilitar su despliegue, se puede descargar la base datos llamada [MapaInversionesC4D](https://drive.google.com/file/d/1hrtEo49edL5iGPirOYZfegb9qqyooXgQ/view?usp=sharing), al publicarla se pueden realizar los pasos necesarios para la conexión al servidor, creación de la base de datos, y creación de todas las tablas necesarias. Para mayor detalle puede consultar el [Manual de Instalación de Base de Datos](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Manuales/Despliegue de la base de datos ofuscados.pdf).

Una vez creada la base de datos con sus tablas y datos, es necesario cambiar la configuración de la conexión en los archivos appsettings.json que se encuentran en [App_Data/Sites/Default/appsettings.json](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/App_Data/Sites/Default/appsettings.json) y [MapaInversiones.Web/appsettings.json](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Web/appsettings.json).

Para el manejo de datos se utiliza LINQ2DB, por lo cual, en caso de ser necesario realizar algún ajuste en la programación, también es necesario ajustar la cadena de conexión en el archivo [PISGR_Context.tt](https://github.com/EL-BID/MapaInversiones/blob/main/MapaInversiones.Infrastructura/DataModels/PISGR_Context.tt).

#### Primeros pasos
1. Configure la conexión del tipo de publicación que desea realizar (Web deploy, FTP, file system, etc).
2. Configure el perfil de publicación, teniendo en cuenta los siguientes parametros:

    2.1. Configuración (Debug o Release - Any CPU)
    
    2.2. Target framework 3.1
    
    2.3. Seleccione el tipo de despliegue que quiere realizar. Existen dos opciones:
   	Framework-dependent deployment (El framework de .Net Core debe estar preinstalado).
   	Self-contained deployment (Contiene los binarios de .Net Core).
    2.4. Target runtime: Seleccione el runtime del servidor donde instalará la plataforma (Windows, linux, MacOS)
3. Realice la compilación y publicación de la solución.

#### Instalación en IIS

4. Instale o verifique que el framework de .Net Core 3.1 este instalado en el servidor que hospedará la aplicación (https://dotnet.microsoft.com/en-us/download/dotnet/3.1).
5. Como esta es una plataforma web el runtime requerido es ASP.NET Core Runtime 3.1.24
6. Se recomienda instalar el Windows Hosting Bundle que contiene el runtime y el ASP.NET Core Module.
7. Instale o verifique el componente SQLClrTypes de 64 bits (x64\SQLSysClrTypes.msi,https://www.microsoft.com/en-us/download/details.aspx?id=55992) 
8. Para el correcto funcionamiento de la aplicación, se requiere crear un sitio web, no funciona como aplicación virtual.
9. Crear un sitio web definiendo los parametros:
   	Puerto (Ej: 80, 81, 443)
   	Protocolo (HTTP o HTTPS)
   	Certificado de seguridad (Opcional)
   	Ruta de archivos (La carpeta raíz donde se encuentra la app)
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
- [Álvaro González Hernández](mailto:alvarogh_22@hotmail.com  "Álvaro González Hernández")
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
