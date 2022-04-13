-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 31 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene la informacion de las regalias liquidadas para la region seleccionada
-- =============================================
CREATE PROCEDURE [dbo].[sp_RegaliasLiquidadasPorRegion]
	@Periodos varchar(MAX),
	@IdRegion varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos

    SELECT L.AñoLiquidado Periodo, L.PeriodoLiquidado Mes, CONVERT(DECIMAL(18,0),SUM(L.ValorLiquidado)) ValorLiquidado
	FROM dbo.Liquidacion L	
	INNER JOIN dbo.EnteTerritorial ET ON (L.IdDepartamento = ET.IdDepartamento AND L.IdMunicipio = ET.IdMunicipio)
	WHERE ET.IdRegion = @IdRegion AND
	L.AñoLiquidado IN(SELECT periodo FROM #Periodos)
	--AND L.IdTipoContraprestacion = 1 --Regalias
	GROUP By  L.AñoLiquidado, L.PeriodoLiquidado
		
END



