-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 20 de Enero de 2014
-- Description:	Obtiene la informacion del encabezado de la ficha de fiscalizacion.
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerResumenFiscalizacionPorRegion] 
	@IdRegion varchar(10)
	, @IdTipoRecurso AS VARCHAR(10)
	, @IdCampoOMina AS NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	SELECT añoliquidado Periodo, 		
	CASE WHEN IdTipoActividad IS NULL THEN 'NoFiscalizados' ELSE 'Fiscalizados' END Tipo,
	COUNT(DISTINCT F.IdCampoOProyecto) Total
	FROM CampoOProyectoFiscalizacion C
	INNER JOIN Fiscalizacion F ON C.IdCampoOProyecto = F.IdCampoOProyecto AND C.IdTipoCampoOProyecto = F.IdTipoCampoOProyecto	
	INNER JOIN EnteTerritorial ET ON F.IdMunicipio = ET.IdMunicipio AND F.IdDepartamento = ET.IdDepartamento	
	WHERE ET.IdRegion = @IdRegion 
		--AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1')
		--AND ( F.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina IS NULL )
	GROUP BY
	añoliquidado,
	CASE WHEN IdTipoActividad IS NULL THEN 'NoFiscalizados'
	ELSE 'Fiscalizados'
	END

	ORDER BY añoliquidado
		
	
END


