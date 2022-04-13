
-- =============================================
-- Author:		Carlos Mahecha C
-- Create date: 19 de Mayo de 2015
-- Description:	Procedimiento almacenado que obtiene los rendimientos financieros de directas para una región
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerRendimientosDirectasPorRegion]
	@periodosList varchar(75),
	@IdRegion varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	

   	SELECT P.AñoVigencia AS Periodo
	, 'RENDIMIENTOS FINANCIEROS DIRECTAS'  AS  NombreTipoRecurso
	,CONVERT(DECIMAL(18,0),SUM(P.Valor)) AS ValorMonto
	FROM RendimientosFinancieros P
	INNER JOIN dbo.EnteTerritorial ET ON (ET.IdMunicipio = P.IdMunicipio AND ET.IdDepartamento = P.IdDepartamento )
	WHERE CHARINDEX( CONVERT(varchar(4),p.AñoVigencia) + ',' , @periodosList + ',') > 0
		AND ET.IdRegion = @IdRegion		
	GROUP BY P.AñoVigencia
END





