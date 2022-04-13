-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 23 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el dinero ejecutado por periodo de tiempo para el departamento seleccionado
-- =============================================
CREATE PROCEDURE [dbo].[sp_EjecutadoPorFuenteFinanciacionPorDepartamentoOLd]
	@Periodos varchar(MAX),
	@IdDepartamento varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
		CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

	SELECT PER.Periodo Periodo,F.IdTipoRecurso, F.NombreTipoRecurso, CONVERT(DECIMAL(18,0),SUM(SEFP.ValorReportado)) ValorMonto
	FROM dbo.SeguimientoEsquemaFinanciacionProyecto SEFP
	INNER JOIN dbo.Fuente F ON (SEFP.IdTipoRecurso = F.IdTipoRecurso AND SEFP.IdTipoEntidad = F.IdTipoEntidad AND SEFP.IdEntidad = F.IdEntidad)
    INNER JOIN dbo.HistoriaEstado HE ON HE.IdProyecto = SEFP.IdProyecto 
	INNER JOIN dbo.Estado E ON E.IdEstado = HE.IdEstado,
	#Periodos PER
	WHERE (E.NombreEstado LIKE '%APROBADO%' OR E.NombreEstado LIKE '%EJECUCI%' OR E.NombreEstado LIKE '%EJECUTADO%' )AND
    HE.ActualSiNo = 1 
	--AND SEFP.IdDepartamento = @IdDepartamento 
	AND SEFP.IdMunicipio IN( SELECT TOP 1 EnteTerritorial.IdMunicipio FROM EnteTerritorial(nolock) WHERE EnteTerritorial.IdDepartamento = @IdDepartamento AND EnteTerritorial.Tipo = 'DEPARTAMENTO')
	AND PER.Periodo BETWEEN DATEPART(YEAR,SEFP.FechaInicioReporte) AND DATEPART(YEAR,SEFP.FechaFinalReporte)
	GROUP BY PER.Periodo,F.IdTipoRecurso, F.NombreTipoRecurso

END



