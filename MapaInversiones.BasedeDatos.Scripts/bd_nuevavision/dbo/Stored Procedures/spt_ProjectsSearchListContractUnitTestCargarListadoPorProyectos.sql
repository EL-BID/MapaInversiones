
CREATE procedure [dbo].[spt_ProjectsSearchListContractUnitTestCargarListadoPorProyectos]
(
		@p_IdEstado int, --Es el estado del proyecto.
		@p_annio int, --Es el Annio
		@p_sector int ---Es el Id del sector
)
as
SELECT Proyecto.NombreProyecto,Proyecto.VlrTotalProyectoFuenteRegalias,e.NombreEstado
FROM            Proyecto INNER JOIN
                         HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto INNER JOIN
                         Estado e ON HistoriaEstado.IdEstado = e.IdEstado INNER JOIN
                         Sector ON Proyecto.IdSector = Sector.IdSector INNER JOIN
                         ProyectoXEntidadTerritorial ON Proyecto.IdProyecto = ProyectoXEntidadTerritorial.IdProyecto INNER JOIN
                         EnteTerritorial ON ProyectoXEntidadTerritorial.IdDepartamento = EnteTerritorial.IdDepartamento AND 
                         ProyectoXEntidadTerritorial.IdMunicipio = EnteTerritorial.IdMunicipio
    where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
						AND e.IdEstado=@p_IdEstado 
						AND (@p_annio BETWEEN YEAR(Proyecto.FechaInicioProyecto) AND YEAR(Proyecto.FechaFinProyecto))
						AND Sector.IdSector=@p_sector



