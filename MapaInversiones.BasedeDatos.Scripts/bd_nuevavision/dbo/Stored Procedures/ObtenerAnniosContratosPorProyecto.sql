-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAnniosContratosPorProyecto]
	-- Add the parameters for the stored procedure here
@IDPROYECTO int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT DISTINCT YEAR(isnull(FechaFirmaContrato,FechaPublicacion)) AS ANIOINICIOCONTRATO 
	FROM vwContratosPerfilContratistaInformacionContratacion c
	WHERE IDPROYECTO = @IDPROYECTO AND Id_Programa <> 9999
		ORDER BY 1
END
