-- =============================================
-- Author:		<Carol Naranjo>
-- Create date: <Julio 10 de 2013>
-- Description:	<Procedimiento para Obtener el valor liquidado por tipo de recurso>
-- =============================================
CREATE PROCEDURE [dbo].[GetDataGraficaLiquidadoPorTipoRecurso]
@periodosList varchar(300)

AS
BEGIN	

SET @periodosList = @periodosList + ','	
SELECT       UPPER(  RecursoNatural.NombreTipoRecursoNatural) AS NombreTipoRecursoNatural , 
				CONVERT(decimal(18,0),sum(isnull(Liquidacion.ValorLiquidado,0))) as Liquidado
FROM            Liquidacion(nolock) INNER JOIN
				RecursoNatural ON Liquidacion.IdRecursoNatural = RecursoNatural.IdRecursoNatural AND 
				Liquidacion.IdTipoRecursoNatural = RecursoNatural.IdTipoRecursoNatural
				WHERE 	 CHARINDEX( CONVERT(varchar(4), Liquidacion.AñoLiquidado) + ',' , @periodosList) > 0
				 --AND ( Liquidacion.IdTipoContraprestacion = 1 ) --Regalias
				group by NombreTipoRecursoNatural

END



