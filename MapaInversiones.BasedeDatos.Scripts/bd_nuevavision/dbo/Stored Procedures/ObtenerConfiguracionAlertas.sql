-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Sept 02 de 2013>
-- Description:	<Procedimiento para Obtener la configuracion de alertas del sistema>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerConfiguracionAlertas]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT * FROM Alertas(nolock)
END




