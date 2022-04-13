












CREATE VIEW [dbo].[VwEstadoProyectosDeptoInv]
AS
Select distinct
ProyectosDistintos.IdDepartamento,
ProyectosDistintos.IdEstado,
Est.NombreEstado,
dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdDepartamento order by  ProyectosDistintos.IdProyecto) 
+ dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdDepartamento order by ProyectosDistintos.IdProyecto desc) 
- 1 as NumeroProyectos,
sum(ProyectosDistintos.Total) over (PARTITION BY ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdDepartamento) ValorProyectos

 from (
SELECT distinct proyEntidad.IdDepartamento,he.IdEstado,proy1.IdProyecto,proy1.VlrTotalProyectoTodasLasFuentes as Total
  FROM [dbo].[ProyectoXEntidadTerritorial] proyEntidad 
  INNER JOIN
dbo.proyecto AS proy1
ON proyEntidad.IdProyecto = proy1.IdProyecto
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy1.IdProyecto)ProyectosDistintos
inner join dbo.Estado Est
on Est.IdEstado=ProyectosDistintos.IdEstado





