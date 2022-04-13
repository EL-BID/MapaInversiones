-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 20 de Enero de 2014
-- Description:	Obtiene la informacion de los recursos de la ficha de fiscalizacion.
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerRecursosFiscalizacionPorGeografia]
	@IdRegion AS VARCHAR(10),
	@IdDpto AS VARCHAR(10),
	@IdMunicipio AS VARCHAR(10)
	, @IdTipoRecurso AS VARCHAR(10)
	, @IdCampoOMina AS NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT DISTINCT F.AñoLiquidado, R.IdRecursoNatural, R.NombreRecursoNatural, T.IdTipoRecursoNatural, T.NombreTipoDeRecurso
	FROM Fiscalizacion F
	INNER JOIN RecursoNaturalFiscalizacion R ON F.IdRecursoNatural = R.IdRecursoNatural	
	INNER JOIN TipoDeRecursoNatural T  ON T.IdTipoRecursoNatural = F.IdTipoRecursoNatural
	INNER JOIN EnteTerritorial (nolock) ente ON ente.IdMunicipio = F.IdMunicipio
	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)	
			--AND ( F.IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1' )
			--AND ( F.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina IS NULL )		
	GROUP BY   F.AñoLiquidado, R.IdRecursoNatural, R.NombreRecursoNatural, T.IdTipoRecursoNatural, T.NombreTipoDeRecurso
	ORDER BY F.AñoLiquidado,  T.IdTipoRecursoNatural, R.NombreRecursoNatural

		
	 	
END


