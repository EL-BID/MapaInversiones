-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPinesFiscalizacionPorMunicipioPorFiltrosV2]
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

DECLARE @NombreCampoMina AS VARCHAR(250)

	IF @IdCampoOMina <> ''
	BEGIN
		SELECT @NombreCampoMina = NombreCampoOProyecto FROM  CampoOProyectoFiscalizacion(nolock) WHERE IdCampoOProyecto = @IdCampoOMina
	END

	SELECT * FROM
	(
	
 SELECT  ente.IdMunicipio AS IdEntidad,
	CASE WHEN @IdCampoOMina <> '' THEN @NombreCampoMina + ' (' + ente.NombreMunicipio + ')'
		ELSE ente.NombreMunicipio
	END AS  NombreEntidad,
	cab.Latitud  AS Latitud,
	cab.LONGITUD AS Longitud,
	CASE WHEN @IdCampoOMina <> '' THEN '/Fiscalizacion/FichaFiscalizacion/?periodosFiscalizacion='+ CAST(@AñoLiquidado AS VARCHAR(4)) + '&municipio=' + ente.IdMunicipio + '&tipoRecursoNaturalFiscalizacion=' +  ISNULL(@IdTipoRecurso,'-1')  + '&campoProyectoFiscalizacion=' + @IdCampoOMina  + '&etapaCampo=' + CONVERT(VARCHAR(5), ISNULL(@IdEtapaCampoMina,-1)) + '&tipoFiscalizacion=' + CONVERT(VARCHAR(5), ISNULL(@IdTipoFiscalizacion,-1)) + '&recursoNaturalFiscalizacion=' + ISNULL(@IdRecurso,'-1')  
		ELSE'/Fiscalizacion/FichaFiscalizacion/?periodosFiscalizacion='+ CAST(@AñoLiquidado AS VARCHAR(4)) + '&municipio=' + ente.IdMunicipio + '&tipoRecursoNaturalFiscalizacion=' + ISNULL(@IdTipoRecurso,'-1')  + '&etapaCampo=' + CONVERT(VARCHAR(5), ISNULL(@IdEtapaCampoMina,-1)) + '&tipoFiscalizacion=' + CONVERT(VARCHAR(5), ISNULL(@IdTipoFiscalizacion,-1)) + '&recursoNaturalFiscalizacion=' + ISNULL(@IdRecurso,'-1')  
	END AS Url	
	, TotalCamposMinas
	,CASE WHEN @IdTipoFiscalizacion = 0 THEN TotalCamposMinas- TotalFiscalizaciones
		ELSE TotalFiscalizaciones
	END AS TotalFiscalizaciones
	, CONVERT(NUMERIC(18,1), (CONVERT(NUMERIC(18,0),TotalFiscalizaciones)/TotalCamposMinas)*100 ) AS Porcentaje 

FROM 
	(
		SELECT IdRegion, IdDepartamento, IdMunicipio, NombreMunicipio FROM EnteTerritorial WHERE Tipo = 'MUNICIPIO' AND  IdDepartamento <> '0' AND NombreDepartamento <> 'N/A'
	) ente
	LEFT JOIN 
	(
		SELECT IdMunicipio, 
			COUNT(DISTINCT Fiscalizacion.IdCampoOProyecto) AS TotalCamposMinas 
			FROM Fiscalizacion(nolock) 
			LEFT JOIN EtapaCampoOProyecto(nolock) Etapa ON Etapa.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND Etapa.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto
		WHERE AñoLiquidado = @AñoLiquidado
		AND (IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (Fiscalizacion.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina = '' OR @IdCampoOMina IS NULL )
			AND (Etapa.IdEtapaCampoOProyecto = @IdEtapaCampoMina OR @IdEtapaCampoMina = '' OR @IdEtapaCampoMina IS NULL )
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1' )
		GROUP BY IdMunicipio
	) CamposTotales ON CamposTotales.IdMunicipio = ente.IdMunicipio 
	INNER JOIN 
	(
		SELECT IdMunicipio, 		
			COUNT(DISTINCT Fiscalizacion.IdCampoOProyecto) AS TotalFiscalizaciones 
			FROM Fiscalizacion(nolock) 
			LEFT JOIN EtapaCampoOProyecto(nolock) Etapa ON Etapa.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND Etapa.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto 
		WHERE AñoLiquidado = @AñoLiquidado 
			AND IdTipoActividad IS NOT NULL 
			AND (IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (Fiscalizacion.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina = '' OR @IdCampoOMina IS NULL )
			AND (Etapa.IdEtapaCampoOProyecto = @IdEtapaCampoMina OR @IdEtapaCampoMina = '' OR @IdEtapaCampoMina IS NULL )
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1'  )
		GROUP BY IdMunicipio
	) CamposFiscalizados ON CamposFiscalizados.IdMunicipio = CamposTotales.IdMunicipio
	LEFT JOIN CabeceraMunicipio (nolock) cab ON ente.IdMunicipio = cab.CodigoDane
WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
	AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
	AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)	
	AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL)	
	) AS LstTotal
	WHERE (@IdTipoFiscalizacion <> 0 OR  (@IdTipoFiscalizacion = 0 AND TotalCamposMinas - TotalFiscalizaciones <> 0))
	AND TotalCamposMinas IS NOT NULL
	ORDER BY LstTotal.NombreEntidad

END


