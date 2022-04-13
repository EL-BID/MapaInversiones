-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAnniosContratos] 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT DISTINCT YEAR(CAST(ISNULL(Anio, '1/1/1900') AS DATETIME)) AS ANIOINICIOCONTRATO 
	FROM  vwContratosPerfilContratosProceso
	ORDER BY 1
END
