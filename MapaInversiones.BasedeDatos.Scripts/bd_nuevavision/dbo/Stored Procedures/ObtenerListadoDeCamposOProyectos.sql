-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeCamposOProyectos]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	CampoOProyecto.IdCampoOProyecto as value, 
	CampoOProyecto.NombreCampoOProyecto as name
		FROM CampoOProyecto(nolock)
	ORDER BY CampoOProyecto.NombreCampoOProyecto
END



