-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFiscalizacionPorMunicipioPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@IdCampoOMina AS NVARCHAR(50),
@periodosList varchar(300),
@CuadradoVisualIntersectar geography,
@IdTipoFiscalizacion AS INT
AS
BEGIN

select  ente.IdMunicipio AS IdEntidad
, ente.NombreMunicipio AS NombreEntidad
,'/Fiscalizacion/FichaFiscalizacion?periodosFiscalizacion='+ @periodosList + '&municipio=' + ente.IdMunicipio AS Url
, ISNULL(prod.AñoLiquidado, 2012) AS AñoFiscalizacion 
, COUNT(DISTINCT prod.IdFiscalizacionSurrogada) AS Fiscalizaciones

FROM EnteTerritorial(nolock) ente 
LEFT JOIN Fiscalizacion(nolock) prod ON prod.IdMunicipio = ente.IdMunicipio
LEFT JOIN CabeceraMunicipio (nolock) cab ON prod.IdMunicipio = cab.CodigoDane
	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND (prod.IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (prod.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina = '' OR @IdCampoOMina IS NULL OR prod.IdCampoOProyecto IS NULL )
			AND ( CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' , @periodosList + ',') > 0 OR prod.AñoLiquidado IS NULL )
			AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL) 			
			AND ( (IdTipoActividad IS NULL AND @IdTipoFiscalizacion = 0) OR (IdTipoActividad IS NOT NULL AND @IdTipoFiscalizacion = 1) OR (@IdTipoFiscalizacion IS NULL)  OR (@IdTipoFiscalizacion = -1)OR (prod.AñoLiquidado IS NULL))
			AND  ente.IdDepartamento <> '0'	
			AND ente.NombreDepartamento <> 'N/A'				
			
GROUP BY 
  ente.IdMunicipio 
, ente.NombreMunicipio
, ISNULL(prod.AñoLiquidado, 2012)

ORDER BY ente.NombreMunicipio 
, ISNULL(prod.AñoLiquidado, 2012)

END


