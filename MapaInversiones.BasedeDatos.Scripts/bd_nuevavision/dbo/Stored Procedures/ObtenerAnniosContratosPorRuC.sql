-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAnniosContratosPorRuC]
	-- Add the parameters for the stored procedure here
@RUC VARCHAR(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  ANIOINICIOCONTRATO 
	FROM  vwContratosPerfilContratistaSinProgramaXAnio  WHERE numerodocumento = @RUC
	ORDER BY 1
END
