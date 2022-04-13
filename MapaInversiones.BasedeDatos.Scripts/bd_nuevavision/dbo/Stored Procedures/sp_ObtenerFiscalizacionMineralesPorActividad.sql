-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Enero de 2014
-- Description:	Obtiene la informacion para la grafica de fiscalizaciones de minerales por actividad
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerFiscalizacionMineralesPorActividad]
	@Periodos VARCHAR(max)
AS
BEGIN

	 CREATE  TABLE #Periodos (  
	  Periodo INT  
	 );   

	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos 

	SELECT DISTINCT TA.Nombre Actividad, COUNT(*) Fiscalizacion 
	FROM Fiscalizacion F
	INNER JOIN TipoActividadFiscalizacion TA ON F.IdTipoActividad = TA.Id
	INNER JOIN TipoDeRecursoNatural TRN ON TRN.IdTipoRecursoNatural = F.IdTipoRecursoNatural
	INNER JOIN #Periodos P ON F.AñoLiquidado = P.Periodo
	WHERE TRN.IdTipoRecursoNatural = 'M'
	GROUP BY TA.Nombre 
	 
	
END


