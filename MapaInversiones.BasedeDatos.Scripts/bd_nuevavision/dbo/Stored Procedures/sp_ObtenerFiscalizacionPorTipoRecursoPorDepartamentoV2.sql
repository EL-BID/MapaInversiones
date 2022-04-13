-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Enero de 2014
-- Description:	Obtiene la informacion para la grafica de fiscalizaciones por tipo de recurso
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerFiscalizacionPorTipoRecursoPorDepartamentoV2]
	@AñoLiquidado INT
	, @IdTipoRecurso AS VARCHAR(10)
AS
BEGIN



	SELECT ente.NombreDepartamento AS NombreEntidad
, TotalCamposMinas
, TotalFiscalizaciones
, CONVERT(NUMERIC(18,1), (CONVERT(NUMERIC(18,0),TotalFiscalizaciones)/TotalCamposMinas)*100 ) AS Porcentaje 
FROM 
	(
		SELECT IdDepartamento,NombreDepartamento FROM EnteTerritorial WHERE Tipo = 'DEPARTAMENTO' AND  IdDepartamento <> '0' AND NombreDepartamento <> 'N/A'
	) ente
	LEFT JOIN 
	(
		SELECT IdDepartamento, 
			COUNT(DISTINCT IdCampoOProyecto) AS TotalCamposMinas FROM Fiscalizacion 
		WHERE AñoLiquidado = @AñoLiquidado
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL )
		GROUP BY [IdDepartamento]
	) CamposTotales ON CamposTotales.IdDepartamento = ente.IdDepartamento 
	LEFT JOIN 
	(
		SELECT IdDepartamento, 
			COUNT(DISTINCT IdCampoOProyecto) AS TotalFiscalizaciones FROM Fiscalizacion 
		WHERE AñoLiquidado = @AñoLiquidado
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL ) 
			AND IdTipoActividad IS NOT NULL 
		GROUP BY [IdDepartamento]
	) CamposFiscalizados ON CamposFiscalizados.IdDepartamento = CamposTotales.IdDepartamento

	ORDER BY ente.NombreDepartamento



	
END


