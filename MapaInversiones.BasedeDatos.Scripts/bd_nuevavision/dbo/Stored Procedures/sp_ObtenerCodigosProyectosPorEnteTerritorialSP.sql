
---- =============================================
---- Author:		<Carlos Mahecha>
---- Create date: <Agosto 03 de 2013>
---- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
---- =============================================
--CREATE PROCEDURE [dbo].[ObtenerMunicipiosPorFiltrosGeograficos]
--@IdRegion AS VARCHAR(10),
--@IdDpto AS VARCHAR(10),
--@IdMunicipio AS VARCHAR(10),
--@CuadradoVisualIntersectar geography
--AS
--BEGIN	


--select  ente.IdMunicipio AS IdEntidad,
--ente.NombreMunicipio AS NombreEntidad

--FROM EnteTerritorial(nolock) ente 
--	LEFT JOIN CabeceraMunicipio (nolock) cab ON ente.IdMunicipio = cab.CodigoDane
--	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
--			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
--			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)		
--			AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL)	
--			AND  ente.IdMunicipio <> '0'	
--			AND ente.NombreMunicipio <> 'N/A'
--			AND Tipo <> 'DEPARTAMENTO'
--	ORDER BY ente.IdMunicipio

--	--SELECT CAST((2012) AS INT) AS PeriodoPresupuestado	
--	--, CAST('01' AS VARCHAR(10)) AS IdRegion
--	--, CAST('Test' AS VARCHAR(200)) AS NombreRegion
-- --   , CONVERT(decimal(30,2),100 ) AS ValorPresupuesto


--END
--GO


-- =============================================
-- Author:		John Rodriguez 
-- Create date: 16/07/2013
-- Description:	store Procedure que devuelve los codigos de proyecto segun filtros realizados por ente
--				territorial
--@Filtro	  : Parametro que contiene los filtros que se desean ejecutar en la consulta.
-- =============================================
create PROCEDURE [dbo].[sp_ObtenerCodigosProyectosPorEnteTerritorialSP]
	@filtro as varchar (2000)
AS
BEGIN
	declare @query as varchar(max)
	select @query = 'SELECT   distinct Proyecto.IdProyecto,Proyecto.CodigoBPIN,Proyecto.NombreProyecto
					FROM     Proyecto INNER JOIN
						 ProyectoXEntidadTerritorial ON Proyecto.IdProyecto = ProyectoXEntidadTerritorial.IdProyecto INNER JOIN
                         EnteTerritorial ON ProyectoXEntidadTerritorial.IdDepartamento = EnteTerritorial.IdDepartamento AND 
                         ProyectoXEntidadTerritorial.IdMunicipio = EnteTerritorial.IdMunicipio  '

	select @query = @query + @filtro +' order by Proyecto.IdProyecto'

	execute (@query)
END



