-- =============================================
-- Author:		Wveimar López, Lina Ochoa
-- Create date: 30 abril 2014
-- Description:	SP para gráficas Fiscalización por Tipo de Recurso
-- =============================================

CREATE PROCEDURE [dbo].[ObtenerFiscalizacionPorTipoRecurso]
@Periodo INT,
@IdTipoRecurso VARCHAR(5)
AS
BEGIN

	--SET NOCOUNT ON

	--DECLARE @TotalCampos int

	-- CREATE  TABLE #Periodos (  
	--  Periodo INT  
	-- );   

	--INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos 

	--SELECT @TotalCampos = COUNT(DISTINCT CPF.IdCampoOProyecto)
	--FROM CampoOProyectoFiscalizacion CPF
	--INNER JOIN Fiscalizacion F ON CPF.IdCampoOProyecto = F.IdCampoOProyecto
	--WHERE F.IdTipoRecursoNatural = @IdTipoRecurso

	--SELECT 'FISCALIZADOS' as Tipo, 100 as Campos
	 
	SELECT
	CASE WHEN F.IdTipoActividad IS NOT NULL THEN 'FISCALIZADOS'
		ELSE 'NO_FISCALIZADOS'
	END AS Tipo
	, COUNT(DISTINCT C.IdCampoOProyecto) AS Campos
	--, @TotalCampos as TotalCampos
	FROM Fiscalizacion F 
	INNER JOIN  TipoDeRecursoNatural TRN ON F.IdTipoRecursoNatural = @IdTipoRecurso
	INNER JOIN CampoOProyectoFiscalizacion C ON F.IdCampoOProyecto = C.IdCampoOProyecto
	WHERE F.AñoLiquidado = @Periodo
	GROUP BY 
		CASE WHEN F.IdTipoActividad IS NOT NULL THEN 'FISCALIZADOS'
		ELSE 'NO_FISCALIZADOS'
	END  
END


