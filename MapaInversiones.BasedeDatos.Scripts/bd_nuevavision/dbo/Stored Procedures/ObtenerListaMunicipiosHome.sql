
CREATE PROCEDURE [dbo].[ObtenerListaMunicipiosHome]
AS
BEGIN

	SELECT top 10 e.IdMunicipio, e.NombreMunicipio, sum(p.VlrTotalProyectoFuenteRegalias)*1000 VlrTotalProyectoFuenteRegalias, sum(p.VlrTotalProyectoTodasLasFuentes)*1000 VlrTotalProyectoTodasLasFuentes,COUNT(p.IdProyecto) projectNumber, isnull(iet.UrlImagePequenia,'') UrlImagePequenia
	from 
	EnteTerritorial e left join ProyectoXEntidadTerritorial pet
	on e.IdMunicipio=pet.IdMunicipio left join Proyecto p
	on p.IdProyecto=pet.IdProyecto left join [dbo].[VwGaleriaEntidadesTerritorialesMunicipios] iet
	on e.IdMunicipio = iet.IdMunicipio
	where e.Tipo='MUNICIPIO' --and iet.UrlImagePequenia is not null
	group by e.IdMunicipio, e.NombreMunicipio,e.NombreDepartamento,iet.UrlImagePequenia
	ORDER BY projectNumber DESC

END
