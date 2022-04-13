-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el presupuesto por periodo de tiempo para el departamento seleccionado
-- =============================================
CREATE PROCEDURE [dbo].[sp_PresupuestoPorFuenteFinanciacionPorDepartamento]
	@Periodos varchar(MAX),
	@IdDepartamento varchar(10)
AS
BEGIN
	SET NOCOUNT ON;

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

   	SELECT PER.Periodo AS Periodo,F.NombreTipoRecurso,CONVERT(DECIMAL(18,0),SUM(P.ValorMonto)) AS ValorMonto
	FROM dbo.Presupuesto P
	INNER JOIN dbo.Fuente F ON (P.IdTipoRecurso = F.IdTipoRecurso AND P.IdTipoEntidad = F.IdTipoEntidad AND P.IdEntidad = F.IdEntidad),
	#Periodos PER
	WHERE PER.Periodo BETWEEN DATEPART(YEAR,P.InicioVigencia) AND DATEPART(YEAR,P.FinVigencia) 
	AND P.IdMunicipio IN( SELECT TOP 1 EnteTerritorial.IdMunicipio FROM EnteTerritorial(nolock) WHERE EnteTerritorial.IdDepartamento = @IdDepartamento AND EnteTerritorial.Tipo = 'DEPARTAMENTO')
	--AND P.IdDepartamento = @IdDepartamento --No consolidadas sino especificas para Depto 
	GROUP BY PER.Periodo, F.NombreTipoRecurso
END




