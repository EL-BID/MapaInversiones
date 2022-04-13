
-- =============================================
-- Author:		Carlos Mahecha C
-- Create date: 19 de Mayo de 2015
-- Description:	Procedimiento almacenado que obtiene los rendimientos financieros de directas para una región
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerRendimientosDirectasPorMunicipio]
	@periodosList varchar(75),
	@IdMunicipio varchar(10)
AS
BEGIN
	SET NOCOUNT ON;


   SELECT P.AñoVigencia AS Periodo
	, 'RENDIMIENTOS FINANCIEROS DIRECTAS'  AS  NombreTipoRecurso
	,CONVERT(DECIMAL(18,0),SUM(P.Valor)) AS ValorMonto
	FROM RendimientosFinancieros P
	WHERE CHARINDEX( CONVERT(varchar(4),p.AñoVigencia) + ',' , @periodosList + ',') > 0
	AND P.IdMunicipio = @IdMunicipio
	GROUP BY P.AñoVigencia
END






