-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Agosto 03 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerMunicipiosPorFiltrosGeograficos]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@CuadradoVisualIntersectar geography
AS
BEGIN	


select  ente.IdMunicipio AS IdEntidad,
ente.NombreMunicipio AS NombreEntidad

FROM EnteTerritorial(nolock) ente 
	LEFT JOIN CabeceraMunicipio (nolock) cab ON ente.IdMunicipio = cab.CodigoDane
	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)		
			AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL)	
			AND  ente.IdMunicipio <> '0'	
			AND ente.NombreMunicipio <> 'N/A'
			AND Tipo <> 'DEPARTAMENTO'
	ORDER BY ente.IdMunicipio

	--SELECT CAST((2012) AS INT) AS PeriodoPresupuestado	
	--, CAST('01' AS VARCHAR(10)) AS IdRegion
	--, CAST('Test' AS VARCHAR(200)) AS NombreRegion
 --   , CONVERT(decimal(30,2),100 ) AS ValorPresupuesto


END




