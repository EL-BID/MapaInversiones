-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el monto distribuido por mes para la region seleccionada.
-- =============================================
CREATE PROCEDURE [dbo].[sp_DistribucionPorFuenteFinanciacionPorRegion]
	@Periodos varchar(MAX),
	@IdRegion varchar(10)
AS
BEGIN
    
	SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos
	
	SELECT D.AñoDistribucion,F.NombreTipoRecurso, D.MesDistribucion, CONVERT(DECIMAL(18,0),SUM(D.Monto)) AS ValorMonto
	FROM dbo.Distribucion D 
	INNER JOIN dbo.Fuente F ON (D.IdTipoRecurso = F.IdTipoRecurso AND D.IdTipoEntidad = F.IdTipoEntidad AND D.IdEntidad = F.IdEntidad)
	INNER JOIN dbo.EnteTerritorial ET ON (ET.IdMunicipio = D.IdMunicipio AND ET.IdDepartamento = D.IdDepartamento)
	WHERE  ET.IdRegion = @IdRegion
	AND D.AñoDistribucion IN(SELECT periodo FROM #Periodos)
	GROUP BY D.AñoDistribucion,F.NombreTipoRecurso, D.MesDistribucion
END




