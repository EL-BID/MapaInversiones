
CREATE procedure [dbo].[spt_DataConsolidatedContractCargarDatosContratoResourcesPerRegion]
( 
 @Annio int
)
as
SELECT EnteTerritorial.NombreRegion,SUM(Proyecto.VlrTotalProyectoFuenteRegalias)
FROM Proyecto INNER JOIN
                         HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto INNER JOIN
                         Estado ON HistoriaEstado.IdEstado = Estado.IdEstado INNER JOIN
                         Sector ON Proyecto.IdSector = Sector.IdSector INNER JOIN
                         ProyectoXEntidadTerritorial ON Proyecto.IdProyecto = ProyectoXEntidadTerritorial.IdProyecto 
						 INNER JOIN
                         EnteTerritorial ON ProyectoXEntidadTerritorial.IdDepartamento = EnteTerritorial.IdDepartamento 
						 AND 
                         ProyectoXEntidadTerritorial.IdMunicipio = EnteTerritorial.IdMunicipio
	     where  (Estado.NombreEstado like ('%APROBADO%') OR Estado.NombreEstado like ('%EJECUCI%') OR Estado.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
GROUP BY EnteTerritorial.NombreRegion


--exec spt_DataConsolidatedContractCargarDatosContratoResourcesPerRegion 2012



