-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 20 de Enero de 2014
-- Description:	Obtiene la informacion de los recursos de la ficha de fiscalizacion.
-- =============================================
CREATE PROCEDURE [dbo].[sp_ObtenerRecursosFiscalizacionPorRegion]
	@IdRegion varchar(10)
	, @IdTipoRecurso AS VARCHAR(10)
	, @IdCampoOMina AS NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT DISTINCT R.IdRecursoNatural, R.NombreRecursoNatural, T.IdTipoRecursoNatural, T.NombreTipoDeRecurso
	FROM Fiscalizacion F
	INNER JOIN RecursoNaturalFiscalizacion R ON F.IdRecursoNatural = R.IdRecursoNatural	
	INNER JOIN TipoDeRecursoNatural T  ON T.IdTipoRecursoNatural = F.IdTipoRecursoNatural	
	INNER JOIN EnteTerritorial ET ON ET.IdMunicipio = F.IdMunicipio AND ET.IdDepartamento = F.IdDepartamento
	WHERE ET.IdRegion = @IdRegion 	
		AND ( F.IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1')
		AND ( F.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina IS NULL )
		 	
END


