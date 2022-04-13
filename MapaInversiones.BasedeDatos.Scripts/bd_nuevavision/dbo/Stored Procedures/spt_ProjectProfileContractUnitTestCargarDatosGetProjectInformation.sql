
CREATE procedure [dbo].[spt_ProjectProfileContractUnitTestCargarDatosGetProjectInformation]
(
    @IdProyecto INT
)
as 

select distinct  proy.IdProyecto,  s.NombreSector, proy.FechaInicioProyecto, proy.FechaFinProyecto, proy.CodigoBPIN, proy.VlrTotalProyectoFuenteRegalias,PROY.NombreProyecto, e.NombreEstado
from Proyecto as proy
join ProyectoXEntidadTerritorial as px
on proy.IdProyecto = px.IdProyecto
join EnteTerritorial ente 
on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
join HistoriaEstado he 
on he.IdProyecto = proy.IdProyecto
join Estado e
on e.IdEstado = he.IdEstado
join Sector s on s.IdSector = proy.IdSector
-- Incluir el estado (si se desea)
where e.NombreEstado like ('%APROBADO%')
and proy.IdProyecto = @IdProyecto







