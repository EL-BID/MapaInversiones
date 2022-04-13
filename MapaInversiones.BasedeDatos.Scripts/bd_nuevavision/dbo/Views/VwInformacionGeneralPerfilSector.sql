











create VIEW [dbo].[VwInformacionGeneralPerfilSector]
AS
SELECT  
proy.IdSector,
proy.NombreSector,
avg(proy.VlrTotalProyectoTodasLasFuentes) as ValorPromedioProyecto
,count(proy.IdProyecto) AS NumeroProyectos
,AVG(ProyectoDuracion.DuracionProyecto) as DuracionPromedioProyectos
--sum(AVG(proy.VlrTotalProyectoTodasLasFuentes)) over (PARTITION BY px.IdDepartamento,px.IdMunicipio), --/sum(count(proy.IdProyecto))  over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as CostoPromedioProyecto,
--sum(AVG(DuracionProyecto))  over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as Duracion,--)/count(proy.IdProyecto) over (PARTITION BY px.IdDepartamento,px.IdMunicipio)
--sum(count(proy.IdProyecto)) over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as NumeroProyectos

 --  FROM dbo.Proyecto AS proy WITH (nolock) 
FROM [VwProyectosAprobadosInv] AS proy WITH (nolock) 
INNER JOIN
(Select proy.IdProyecto,[dbo].[duration] (proy.FechaInicioProyecto,proy.FechaFinProyecto) as DuracionProyecto 
FROM dbo.Proyecto AS proy)ProyectoDuracion
on ProyectoDuracion.IdProyecto=proy.IdProyecto

group by proy.IdSector,
proy.NombreSector
--order by IdEstado
		




