-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Enero de 2014
-- Description:	Obtiene la informacion para la grafica de fiscalizaciones por tipo de recurso
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerFiscalizacionPorTipoRecursoPorDepartamento]
	@Periodos VARCHAR(max)
AS
BEGIN

 CREATE  TABLE #Periodos (  
	  Periodo INT  
	 );   

	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos 

	SELECT UPPER(TRN.NombreTipoDeRecurso) TipoRecurso,	E.NombreDepartamento Departamento,
	CASE WHEN F.IdTipoActividad IS NOT NULL THEN 'FISCALIZADOS'
		ELSE 'NO_FISCALIZADOS'
	END AS Tipo
	, COUNT(DISTINCT C.IdCampoOProyecto) Campos
	FROM Fiscalizacion F 
	INNER JOIN  TipoDeRecursoNatural TRN ON F.IdTipoRecursoNatural = TRN.IdTipoRecursoNatural
	INNER JOIN CampoOProyectoFiscalizacion C ON F.IdCampoOProyecto = C.IdCampoOProyecto
	INNER JOIN EnteTerritorial E ON (F.IdDepartamento = E.IdDepartamento AND F.IdMunicipio = E.IdMunicipio)	
	INNER JOIN #Periodos P ON F.AñoLiquidado = P.Periodo
	GROUP BY TRN.NombreTipoDeRecurso
	, E.NombreDepartamento		
	, CASE WHEN F.IdTipoActividad IS NOT NULL THEN 'FISCALIZADOS'
		ELSE 'NO_FISCALIZADOS'
	END  



	
END


