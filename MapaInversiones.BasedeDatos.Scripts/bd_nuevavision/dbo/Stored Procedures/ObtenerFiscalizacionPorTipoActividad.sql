-- =============================================
-- Author:		Wveimar López, Lina Ochoa
-- Create date: 30 abril 2014
-- Description:	SP para gráficas Fiscalización por Tipo de Recurso
-- =============================================

CREATE PROCEDURE [dbo].[ObtenerFiscalizacionPorTipoActividad]
@Periodo INT,
@IdTipoRecurso VARCHAR(5)
AS
BEGIN

	DECLARE @TotalCampos int

	SELECT @TotalCampos = COUNT(DISTINCT IdCampoOProyecto)
		FROM Fiscalizacion
		WHERE AñoLiquidado = @Periodo 
		AND IdTipoRecursoNatural = @IdTipoRecurso

	SELECT TAF.Nombre AS TipoActividad
	, COUNT(DISTINCT F.IdCampoOProyecto) AS Campos
	--, CASE WHEN @IdTipoRecurso = 'H' THEN
	--		COUNT(DISTINCT F.IdCampoOProyecto + F.IdRecursoNatural + ISNULL(F.IdFiscalizacionNegocio, '--') + ISNULL(F.IdTipoActividad, '--') + ISNULL(F.Observaciones, '--') ) 
	--	ELSE
	--		COUNT(DISTINCT F.IdCampoOProyecto)
	--	END AS Campos
	, @TotalCampos AS Total
	, TAF.Id 
	FROM Fiscalizacion F 
	INNER JOIN TipoActividadFiscalizacion TAF ON F.IdTipoActividad = TAF.Id
	WHERE F.AñoLiquidado = @Periodo 
		AND F.IdTipoRecursoNatural = @IdTipoRecurso
		AND F.IdTipoActividad IS NOT NULL
	GROUP BY TAF.Nombre, TAF.Id 
	ORDER BY TAF.Id 
 END


