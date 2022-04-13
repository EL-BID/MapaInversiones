-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
--TestObtenerResumenConsolidadoNacional 2012,2013
-- =============================================
CREATE PROCEDURE [dbo].[TestObtenerResumenConsolidadoNacional] 	
	@AñoInicial  INT,
	@AñoFinal  INT 
AS
BEGIN


SELECT 
  SUM (lstAprobados.VlrTotalProyectoFuenteRegalias) AS Aprobado, 
SUM (lstAprobados.VlrTotalProyectoTodasLasFuentes) AS aprobadoTotal, 
COUNT(lstAprobados.IdProyecto) AS NumProyectos
FROM ( select distinct proy.*
from Proyecto as proy join ProyectoXEntidadTerritorial as px
on proy.IdProyecto = px.IdProyecto
join EnteTerritorial ente 
on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
join HistoriaEstado he 
on he.IdProyecto = proy.IdProyecto
join Estado e
on e.IdEstado = he.IdEstado
where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
AND ActualSiNo = 1) as  lstAprobados


END



