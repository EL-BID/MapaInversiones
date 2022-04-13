-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 31 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene la informacion de los giros del municipio seleccionado
-- =============================================
CREATE PROCEDURE [dbo].[sp_GiroPorFuenteFinaciacionPorMunicipio]
	@Periodos varchar(MAX),
	@IdMunicipio varchar(10)
AS
BEGIN
	SET NOCOUNT ON;	
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

	SELECT DATEPART(YEAR,G.FechaDeGiro) Periodo,F.NombreTipoRecurso, DATEPART(MONTH,G.FechaDeGiro) Mes, CONVERT(DECIMAL(18,0),SUM(G.Monto)) ValorMonto
	FROM dbo.Giro G
	INNER JOIN dbo.Fuente F ON (G.IdTipoRecurso = F.IdTipoRecurso AND G.IdTipoEntidad = F.IdTipoEntidad AND G.IdEntidad = F.IdEntidad)
	WHERE DATEPART(YEAR,G.FechaDeGiro) IN(SELECT periodo FROM #Periodos)  AND
	G.IdMunicipio = @IdMunicipio
	GROUP By DATEPART(YEAR,G.FechaDeGiro), F.NombreTipoRecurso, DATEPART(MONTH,G.FechaDeGiro)
END




