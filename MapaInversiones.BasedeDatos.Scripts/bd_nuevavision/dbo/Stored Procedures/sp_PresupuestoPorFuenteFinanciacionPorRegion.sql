-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el presupuesto por periodo de tiempo para la region seleccionada
-- =============================================
CREATE PROCEDURE [dbo].[sp_PresupuestoPorFuenteFinanciacionPorRegion]
	@Periodos varchar(MAX),
	@IdRegion varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

   	SELECT PER.Periodo AS Periodo, F.NombreTipoRecurso,CONVERT(DECIMAL(18,0),SUM(P.ValorMonto)) AS ValorMonto
	FROM dbo.Presupuesto P
	INNER JOIN dbo.Fuente F ON (P.IdTipoRecurso = F.IdTipoRecurso AND P.IdTipoEntidad = F.IdTipoEntidad AND P.IdEntidad = F.IdEntidad)
	INNER JOIN dbo.EnteTerritorial ET ON (ET.IdMunicipio = P.IdMunicipio AND ET.IdDepartamento = P.IdDepartamento),
	#Periodos PER
	WHERE PER.Periodo BETWEEN DATEPART(YEAR,P.InicioVigencia) AND DATEPART(YEAR,P.FinVigencia) 
	AND ET.IdRegion = @IdRegion
	GROUP BY PER.Periodo, F.NombreTipoRecurso
END




