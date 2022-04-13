﻿-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el dinero ejecutado por periodo de tiempo para el municipio seleccionado
-- =============================================
CREATE PROCEDURE [dbo].[sp_EjecutadoPorFuenteFinanciacionPorMunicipio]
	@Periodos varchar(MAX),
	@IdMunicipio varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
		CREATE  TABLE #Periodos (
		Periodo INT 
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

	SELECT PER.Periodo Periodo,F.IdTipoRecurso, F.NombreTipoRecurso, CONVERT(DECIMAL(18,0),SUM(SEFP.ValorReportado)) ValorMonto
	FROM VwProyectosAprobados (nolock) as proy
	INNER JOIN SeguimientoEsquemaFinanciacionProyecto SEFP ON SEFP.idProyecto = proy.IdProyecto
	INNER JOIN Fuente F ON (SEFP.IdTipoRecurso = F.IdTipoRecurso AND SEFP.IdTipoEntidad = F.IdTipoEntidad AND SEFP.IdEntidad = F.IdEntidad)   
	, #Periodos PER
	WHERE PER.Periodo BETWEEN DATEPART(YEAR,SEFP.FechaInicioReporte) AND DATEPART(YEAR,SEFP.FechaFinalReporte)
	AND SEFP.IdMunicipio = @IdMunicipio	
	GROUP BY PER.Periodo,F.IdTipoRecurso, F.NombreTipoRecurso


	

END



