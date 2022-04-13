-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 27/08/2015
-- Description:	Verifica si un codigo BPIN existe o no en la BD
-- exec [VerificarCodigoBPIN] '2012000020015'
-- =============================================
CREATE PROCEDURE [dbo].[VerificarCodigoBPIN]
	@BPIN VARCHAR(max)
AS
BEGIN
	
	DECLARE @COUNT INT

	 SELECT @COUNT= count([CodigoBPIN]) FROM [dbo].[DatosAdicionalesAprobacion] WHERE [CodigoBPIN] = @BPIN

	 IF @COUNT > 0
		 BEGIN
			SELECT 1 as ReturnValue
		 END
	 ELSE
		BEGIN
			SELECT -1 as ReturnValue
		 END

END
