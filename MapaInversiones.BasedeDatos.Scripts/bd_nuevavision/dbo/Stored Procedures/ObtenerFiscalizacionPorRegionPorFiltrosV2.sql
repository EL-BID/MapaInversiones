-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFiscalizacionPorRegionPorFiltrosV2]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@IdCampoOMina AS NVARCHAR(50),
@AñoLiquidado INT,
@CuadradoVisualIntersectar geography,
@IdTipoFiscalizacion AS INT,
@IdTipoRecurso AS VARCHAR(10),
@IdEtapaCampoMina AS INT
AS
BEGIN

SELECT	
	ente.IdRegion AS IdEntidad
, ente.NombreRegion AS NombreEntidad
,'/Fiscalizacion/FichaFiscalizacion?periodosFiscalizacion='+ CAST(@AñoLiquidado AS VARCHAR(4)) + '&region=' + ente.IdRegion + '&tipoRecursoNaturalFiscalizacion=' + @IdTipoRecurso  + '&etapaCampo=' + CONVERT(VARCHAR(5), ISNULL(@IdEtapaCampoMina,-1))  AS Url
, SUM(TotalCamposMinas) AS TotalCamposMinas
, SUM(TotalFiscalizaciones) AS TotalFiscalizaciones
, CONVERT(NUMERIC(18,1), (CONVERT(NUMERIC(18,0),SUM(TotalFiscalizaciones))/SUM(TotalCamposMinas))*100 ) AS Porcentaje 

FROM 
	(
		SELECT IdRegion, IdDepartamento, IdMunicipio, NombreRegion FROM EnteTerritorial WHERE Tipo = 'MUNICIPIO' AND  IdDepartamento <> '0' AND NombreDepartamento <> 'N/A'
	) ente
	LEFT JOIN 
	(
		SELECT IdMunicipio, 
			COUNT(DISTINCT IdCampoOProyecto) AS TotalCamposMinas FROM Fiscalizacion 
		WHERE AñoLiquidado = @AñoLiquidado
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1' )
		GROUP BY IdMunicipio
	) CamposTotales ON CamposTotales.IdMunicipio = ente.IdMunicipio 
	LEFT JOIN 
	(
		SELECT IdMunicipio, 
			COUNT(DISTINCT IdCampoOProyecto) AS TotalFiscalizaciones FROM Fiscalizacion 
		WHERE AñoLiquidado = @AñoLiquidado 
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1')
			AND IdTipoActividad IS NOT NULL 
		GROUP BY IdMunicipio
	) CamposFiscalizados ON CamposFiscalizados.IdMunicipio = CamposTotales.IdMunicipio
	LEFT JOIN CabeceraMunicipio (nolock) cab ON ente.IdMunicipio = cab.CodigoDane
WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
	AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
	AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)	
	AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL)	
	AND  ente.IdDepartamento <> '0'	
GROUP BY ente.IdRegion 
, ente.NombreRegion
ORDER BY 	ente.NombreRegion	

END


