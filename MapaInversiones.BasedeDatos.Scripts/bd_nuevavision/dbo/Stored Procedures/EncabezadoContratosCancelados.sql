
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[EncabezadoContratosCancelados]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT [Estado]
      ,[valor]
      ,[NroContratos]
	 FROM [PISGR_PY_COVID19].[dbo].[VwContratosPerfilContratosCancelados]
		
END




