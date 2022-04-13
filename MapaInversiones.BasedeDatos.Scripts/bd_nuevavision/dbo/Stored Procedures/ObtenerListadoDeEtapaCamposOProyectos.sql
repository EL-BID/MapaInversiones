-- =============================================
-- Author:		Lina Ochoa, Wveimar Lopez
-- Create date: 28 abril 2014
-- Description:	Consulta las etapas por campo o proyecto
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeEtapaCamposOProyectos]
AS
BEGIN

	SET NOCOUNT ON;
	SELECT DISTINCT E.IdEtapaCampoOProyecto, 
	E.NombreEtapaCampoOProyecto, E.IdTipoCampoOProyecto
	FROM EtapaCampoOProyecto E
END


