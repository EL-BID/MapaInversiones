-- =============================================
-- Author:		<Carol Naranjo>
-- Create date: <Julio 08 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[GetDataGraficaProduccionPorRecurso]
@periodosList varchar(300)

AS
BEGIN	

SET @periodosList = @periodosList + ','	
SELECT UPPER(RecursoNatural.NombreRecursoNatural) AS NombreRecursoNatural
		, CONVERT(decimal(18,0), SUM(ISNULL(prod.Produccion,0))) AS Cantidad	
		, UnidadMedida.NombreUnidadMedida
	FROM   Produccion(nolock) prod
		   INNER JOIN RecursoNatural ON prod.IdRecursoNatural = RecursoNatural.IdRecursoNatural AND prod.IdTipoRecursoNatural = RecursoNatural.IdTipoRecursoNatural 
		   INNER JOIN UnidadMedida ON prod.IdUnidadMedida = UnidadMedida.IdUnidadMedida
WHERE 	 CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' , @periodosList) > 0
 --AND ( prod.IdTipoDeContraprestacion = 1 ) --Regalias
GROUP BY  RecursoNatural.NombreRecursoNatural
, UnidadMedida.NombreUnidadMedida

ORDER BY RecursoNatural.NombreRecursoNatural

END



