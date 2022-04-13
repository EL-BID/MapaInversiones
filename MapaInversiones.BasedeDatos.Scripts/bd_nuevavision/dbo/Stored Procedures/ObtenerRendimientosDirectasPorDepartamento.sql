
-- =============================================
-- Author:		Carlos Mahecha C
-- Create date: 19 de Mayo de 2015
-- Description:	Procedimiento almacenado que obtiene los rendimientos financieros de directas para una región

CREATE PROCEDURE [dbo].[ObtenerRendimientosDirectasPorDepartamento]
	@periodosList varchar(75),
	@IdDepartamento varchar(10)
AS
BEGIN
	SET NOCOUNT ON;


  	SELECT P.AñoVigencia AS Periodo
	, 'RENDIMIENTOS FINANCIEROS DIRECTAS'  AS  NombreTipoRecurso
	,CONVERT(DECIMAL(18,0),SUM(P.Valor)) AS ValorMonto
	FROM RendimientosFinancieros P
	INNER JOIN dbo.EnteTerritorial ET ON (ET.IdMunicipio = P.IdMunicipio AND ET.IdDepartamento = P.IdDepartamento )
	WHERE CHARINDEX( CONVERT(varchar(4),p.AñoVigencia) + ',' , @periodosList + ',') > 0
	AND P.IdMunicipio IN( SELECT TOP 1 EnteTerritorial.IdMunicipio FROM EnteTerritorial(nolock) WHERE EnteTerritorial.IdDepartamento = @IdDepartamento AND EnteTerritorial.Tipo = 'DEPARTAMENTO')
	--AND P.IdDepartamento = @IdDepartamento --No consolidadas sino especificas para Depto 
	GROUP BY P.AñoVigencia
END



/****** Object:  StoredProcedure [dbo].[ObtenerRendimientosDirectasPorMunicipio]    Script Date: 7/22/2015 10:05:38 AM ******/
SET ANSI_NULLS ON
