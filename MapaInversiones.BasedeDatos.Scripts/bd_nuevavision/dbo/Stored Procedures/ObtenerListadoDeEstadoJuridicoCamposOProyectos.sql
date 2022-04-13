-- =============================================
-- Author:		Lina Ochoa, Wveimar Lopez
-- Create date: 28 abril 2014
-- Description:	Consulta los estados jurídicos por campo o proyecto
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeEstadoJuridicoCamposOProyectos] 
AS
BEGIN

	SET NOCOUNT ON;
	SELECT E.IdEstadoJuridicoCampoOProyecto, 
	E.NombreEstadoJuridicoCampoOProyecto, E.IdTipoCampoOProyecto
	FROM EstadoJuridicoCampoOProyecto E

END


