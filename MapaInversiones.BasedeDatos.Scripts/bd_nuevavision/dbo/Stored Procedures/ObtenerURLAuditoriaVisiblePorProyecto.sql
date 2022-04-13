-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Sept 02 de 2013>
-- Description:	<Procedimiento para Obtener la configuracion de alertas del sistema>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerURLAuditoriaVisiblePorProyecto]	
	@IdProyecto INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @IdBPIN VARCHAR(200)
	DECLARE @PrefijoURL AS VARCHAR(900)

	SET @PrefijoURL = 'http://drforms.dnp.gov.co/reports/rwservlet?gesprepficad001&'

	SELECT TOP 1 @IdBPIN = CodigoBPIN  FROM proyecto  (nolock) WHERE IdProyecto = @IdProyecto

	SELECT  @PrefijoURL + @IdBPIN AS URLAuditoria 
	
END
