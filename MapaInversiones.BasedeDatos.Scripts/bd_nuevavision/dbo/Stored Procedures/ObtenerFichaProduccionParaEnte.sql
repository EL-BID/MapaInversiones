-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 14 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFichaProduccionParaEnte]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@Periodo AS INT
AS
BEGIN

	SELECT 
	UPPER(tipoRecurso.NombreTipoDeRecurso) AS NombreTipoDeRecurso
	, recurso.IdRecursoNatural AS IdRecurso
	, recurso.NombreRecursoNatural
	, campo.IdCampoOProyecto AS IdCampo
	, campo.NombreCampoOProyecto
	, CONVERT(decimal(18,0), SUM(prod.Produccion)) AS Cantidad
	, unidad.NombreUnidadMedida
	, CONVERT(decimal(18,0), SUM(liq.ValorLiquidado)) AS ValorRegalia	
	FROM Produccion(nolock) prod
	INNER JOIN RecursoNatural(nolock) recurso ON prod.IdRecursoNatural = recurso.IdRecursoNatural AND prod.IdTipoRecursoNatural = recurso.IdTipoRecursoNatural
	INNER JOIN Liquidacion(nolock) liq ON prod.AñoLiquidado = liq.AñoLiquidado AND prod.PeriodoLiquidado = liq.PeriodoLiquidado
									AND prod.IdMunicipio = liq.IdMunicipio AND prod.IdCampoOProyecto = liq.IdCampoOProyecto AND prod.IdTipoCampoOProyecto = liq.IdTipoCampoOProyecto
									AND prod.IdRecursoNatural = liq.IdRecursoNatural
									AND prod.IdTipoDeContraprestacion = liq.IdTipoContraprestacion 
									--AND prod.IdTipoDeContraprestacion = 1 --Regalias
	INNER JOIN TipoDeRecursoNatural(nolock) tipoRecurso ON recurso.IdTipoRecursoNatural = tipoRecurso.IdTipoRecursoNatural
	INNER JOIN UnidadMedida(nolock) unidad ON unidad.IdUnidadMedida = prod.IdUnidadMedida
	INNER JOIN CampoOProyecto(nolock) campo ON prod.IdCampoOProyecto = campo.IdCampoOProyecto AND  prod.IdTipoCampoOProyecto = campo.IdTipoCampoOProyecto
	INNER JOIN EnteTerritorial(nolock) ente ON prod.IdMunicipio = ente.IdMunicipio
	WHERE prod.AñoLiquidado = @Periodo 
		AND(ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
		AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
		AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
	GROUP BY tipoRecurso.NombreTipoDeRecurso
	,  recurso.IdRecursoNatural
	, recurso.NombreRecursoNatural
	, campo.IdCampoOProyecto
	, campo.NombreCampoOProyecto	
	, unidad.NombreUnidadMedida

END



