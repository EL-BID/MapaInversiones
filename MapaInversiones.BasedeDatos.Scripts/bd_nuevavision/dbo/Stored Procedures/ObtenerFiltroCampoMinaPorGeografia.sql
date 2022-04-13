-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFiltroCampoMinaPorGeografia]	
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	campo.IdCampoOProyecto as value, 
	campo.NombreCampoOProyecto as name
		FROM Produccion(nolock) prod
		INNER JOIN EnteTerritorial(nolock) ente ON prod.IdDepartamento = ente.IdDepartamento AND prod.IdMunicipio = ente.IdMunicipio
		INNER JOIN CampoOProyecto(nolock) campo ON prod.IdCampoOProyecto = campo.IdCampoOProyecto 
		WHERE (ente.IdRegion = @IdRegion OR @IdRegion = '')
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '')
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = '')
		ORDER BY campo.NombreCampoOProyecto
END



