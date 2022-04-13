-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[EncabezadoContratosRP]
	-- Add the parameters for the stored procedure here
	@TOTALREGISTROS INT OUTPUT,
	@VALORCONTRATOS BIGINT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  @TOTALREGISTROS = COUNT (*)
	FROM [Vw_InformacionProcesoConYSinCodigoContratacion] w
			WHERE COVID19 > 0

   SELECT  @VALORCONTRATOS = SUM( ValorContrato)
	FROM [Vw_InformacionProcesoConYSinCodigoContratacion] w
	 
			WHERE COVID19 > 0
		
END




