
CREATE view [dbo].[vwProduccionLiquidacion]
as
SELECT-- distinct 
prod.AñoLiquidado      
, prod.PeriodoLiquidado 
, ente.NombreRegion
, ente.NombreDepartamento
, ente.NombreMunicipio
, ente.CodigoDANE
, UPPER(tipoRecurso.NombreTipoDeRecurso) AS NombreTipoDeRecurso
, recurso.NombreRecursoNatural
, campo.IdCampoOProyecto AS IdCampo
, campo.NombreCampoOProyecto
, format( CONVERT(decimal(18,0), SUM(prod.Produccion)), 'N') AS Cantidad
, unidad.NombreUnidadMedida
, format( CONVERT(decimal(18,0), SUM(liq.ValorLiquidado)), 'C') AS ValorRegalia  
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
WHERE prod.AñoLiquidado <= year(getdate())
--AND(ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
--AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
--AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
GROUP BY prod.AñoLiquidado
, prod.PeriodoLiquidado
, ente.NombreRegion
, ente.NombreDepartamento
, ente.NombreMunicipio
, ente.CodigoDANE
, tipoRecurso.NombreTipoDeRecurso
, recurso.NombreRecursoNatural
, campo.IdCampoOProyecto
, campo.NombreCampoOProyecto      
, unidad.NombreUnidadMedida
--ORDER BY      
--ente.NombreRegion
--, ente.NombreDepartamento
--, ente.NombreMunicipio
--, ente.CodigoDANE
--, NombreTipoDeRecurso


--select AñoLiquidado
-- PeriodoLiquidado
--, NombreRegion
--, NombreDepartamento
--, NombreMunicipio
--, CodigoDANE
--, NombreTipoDeRecurso
--, NombreRecursoNatural
--, IdCampo
--, NombreCampoOProyecto
--, Cantidad
--, NombreUnidadMedida
--, ValorRegalia
--from dbo.vwProduccionLiquidacion


