

CREATE VIEW [dbo].[VwInformacionGeneralPerfilLocalizacionDeptoCovid]
AS
SELECT  
CASE WHEN cast(px.IdDepartamento as int) % 2=0 then '1' else '8' end as IdPrograma,
px.IdDepartamento,
sum(proy.VlrTotalProyectoTodasLasFuentes) as TotalContratos,
avg(proy.VlrTotalProyectoTodasLasFuentes) as ValorEjecutado,
count(distinct proy.IdProyecto) AS NumeroProyectos
FROM dbo.Proyecto AS proy WITH (nolock) 
INNER JOIN
(Select distinct proy.IdProyecto,[dbo].[duration] (proy.FechaInicioProyecto,proy.FechaFinProyecto) as DuracionProyecto 
FROM dbo.Proyecto AS proy)ProyectoDuracion
on ProyectoDuracion.IdProyecto=proy.IdProyecto
INNER JOIN
dbo.ProyectoXEntidadTerritorial AS px 
ON proy.IdProyecto = px.IdProyecto
inner join dbo.EnteTerritorial E
ON E.IdDepartamento=PX.IdDepartamento AND E.IdMunicipio=PX.IdMunicipio
WHERE E.Tipo!='DEPARTAMENTO'
group by px.IdDepartamento--,px.IdMunicipio

