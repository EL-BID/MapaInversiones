-- =============================================
-- Author:		<Carol Naranjo>
-- Create date: <Julio 10 de 2013>
-- Description:	<Procedimiento para Obtener el valor liquidado por tipo de recurso>
-- =============================================
CREATE PROCEDURE [dbo].[GetDataGraficaLiquidadoPorDepartamento]
@periodosList varchar(300)

AS
BEGIN	

SET @periodosList = @periodosList + ','	

SELECT        EnteTerritorial.NombreDepartamento,
		CONVERT(decimal(18,0), sum(isnull(Liquidacion.ValorLiquidado,0))) as Liquidado
FROM            EnteTerritorial(nolock) 
				LEFT JOIN Liquidacion(nolock) ON EnteTerritorial.IdDepartamento = Liquidacion.IdDepartamento AND EnteTerritorial.IdMunicipio = Liquidacion.IdMunicipio
						 WHERE( CHARINDEX( CONVERT(varchar(4), Liquidacion.AñoLiquidado) + ',' , @periodosList) > 0 OR Liquidacion.AñoLiquidado IS NULL) 
						 AND
						  NombreDepartamento <> 'N/A'
						 AND ( Liquidacion.IdTipoContraprestacion = 1  OR Liquidacion.IdTipoContraprestacion IS NULL) --Regalias
						 group by NombreDepartamento
ORDER BY NombreDepartamento

END



