-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeCamposOProyectosFiscalizacion]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT  DISTINCT TOP 2
	CampoOProyectoFiscalizacion.IdCampoOProyecto as value, 
	CampoOProyectoFiscalizacion.NombreCampoOProyecto as name
	, CASE WHEN CampoOProyectoFiscalizacion.IdTipoCampoOProyecto = '1' THEN 'M'
		ELSE 'H'
	END AS  TipoRecurso	
		FROM CampoOProyectoFiscalizacion(nolock)
	ORDER BY CampoOProyectoFiscalizacion.NombreCampoOProyecto
END


