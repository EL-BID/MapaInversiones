-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerValorSubsidioPorDepartamento] 
	-- Add the parameters for the stored procedure here
@IdSubsidio AS VARCHAR(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	  select NombreDepartamento, sum(ValorSubsidio) ValorSubsidio, sum(CantidadSubsidio) CantidadSubsidio  
	  FROM [VwSubsidiosxLocalizacion]
	  where IdSubsidio = @IdSubsidio
	  group by NombreDepartamento 
END
