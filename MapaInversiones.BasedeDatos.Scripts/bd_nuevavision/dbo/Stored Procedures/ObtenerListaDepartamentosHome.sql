
CREATE PROCEDURE [dbo].[ObtenerListaDepartamentosHome]
AS
BEGIN

	SELECT TOP 10 e.IdDepartamento,e.NombreDepartamento,sum(p.VlrTotalProyectoFuenteRegalias)*1000 VlrTotalProyectoFuenteRegalias, sum(p.VlrTotalProyectoTodasLasFuentes)*1000 VlrTotalProyectoTodasLasFuentes,COUNT(p.IdProyecto) projectNumber, isnull(iet.UrlImagePequenia,'') UrlImagePequenia
	from 
	EnteTerritorial e left join ProyectoXEntidadTerritorial pet
	on e.IdDepartamento=pet.IdDepartamento left join Proyecto p
	on p.IdProyecto=pet.IdProyecto left join [dbo].[VwGaleriaEntidadesTerritorialesDepartamentos] iet
	on e.IdDepartamento = iet.IdDepartamento
	where e.Tipo='DEPARTAMENTO'
	group by e.IdDepartamento,e.NombreDepartamento,iet.UrlImagePequenia
	ORDER BY projectNumber DESC

END
