-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 15 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerDetalleCampoFichaProduccionParaEnte]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@IdCampoOMina AS NVARCHAR(50),
@Periodo AS INT
AS
BEGIN

	
	CREATE  TABLE #Meses (
		Mes INT,
		Nombre VARCHAR(50)
	);	
	INSERT INTO  #Meses SELECT 1,'Enero'
	INSERT INTO  #Meses SELECT 2,'Febrero'
	INSERT INTO  #Meses SELECT 3,'Marzo'
	INSERT INTO  #Meses SELECT 4,'Abril'
	INSERT INTO  #Meses SELECT 5,'Mayo'
	INSERT INTO  #Meses SELECT 6,'Junio'
	INSERT INTO  #Meses SELECT 7,'Julio'
	INSERT INTO  #Meses SELECT 8,'Agosto'
	INSERT INTO  #Meses SELECT 9,'Septiembre'
	INSERT INTO  #Meses SELECT 10,'Octubre'
	INSERT INTO  #Meses SELECT 11,'Noviembre'
	INSERT INTO  #Meses SELECT 12,'Diciembre'


	SELECT #Meses.Nombre,
	CONVERT(DECIMAL(18,0), SUM( ISNULL(prod.Produccion, 0))) AS Cantidad
	,CONVERT(DECIMAL(18,0), SUM( ISNULL(liq.ValorLiquidado, 0))) AS Liquidado
	FROM #Meses
		INNER JOIN Produccion(nolock) prod 
		INNER JOIN Liquidacion(nolock) liq ON prod.AñoLiquidado = liq.AñoLiquidado AND prod.PeriodoLiquidado = liq.PeriodoLiquidado
									AND prod.IdMunicipio = liq.IdMunicipio AND prod.IdCampoOProyecto = liq.IdCampoOProyecto AND prod.IdTipoCampoOProyecto = liq.IdTipoCampoOProyecto
									AND prod.IdRecursoNatural = liq.IdRecursoNatural
									AND prod.IdTipoDeContraprestacion = liq.IdTipoContraprestacion 
									--AND prod.IdTipoDeContraprestacion = 1 --Regalias
		  ON #Meses.Mes = prod.PeriodoLiquidado AND  (prod.IdCampoOProyecto = @IdCampoOMina OR  prod.IdCampoOProyecto is null)
				AND (prod.AñoLiquidado = @Periodo OR prod.AñoLiquidado is null)
				AND (prod.IdRecursoNatural = @IdRecurso OR prod.IdRecursoNatural is null)
		WHERE (prod.IdDepartamento = @IdDpto OR prod.IdDepartamento IS NULL OR @IdDpto = '' OR @IdDpto IS NULL )
		AND (prod.IdMunicipio = @IdMunicipio OR prod.IdMunicipio IS NULL OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
		AND ((prod.IdDepartamento IN (SELECT DISTINCT IdDepartamento FROM EnteTerritorial(nolock) WHERE IdRegion = @IdRegion) OR @IdRegion = '' OR @IdRegion IS NULL OR prod.IdDepartamento IS NULL))
	GROUP BY #Meses.Mes, #Meses.Nombre
	ORDER BY #Meses.Mes

	DROP TABLE #Meses

	--SELECT '' AS  Nombre,
	--CONVERT(DECIMAL(18,0), SUM( ISNULL(14, 0))) AS Cantidad
	--,CONVERT(DECIMAL(18,0), SUM( ISNULL(14, 0))) AS Liquidado



END




