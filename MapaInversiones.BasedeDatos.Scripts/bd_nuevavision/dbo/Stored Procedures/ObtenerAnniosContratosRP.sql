-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAnniosContratosRP] 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT DISTINCT YEAR(CAST(ISNULL(FechaFirmaContrato, FechaPublicacion) AS DATETIME)) AS ANIOINICIOCONTRATO 
	FROM  vwContratosPerfilContratistaInformacionContratacion
	WHERE COVID19 in (1,2)
	ORDER BY 1

	
END
