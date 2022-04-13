
-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 28/08/2015
-- Description:	Obtiene el ID de un proyecto a partir de un 
-- exec [ObtenerIdProyectoPorBpin] '2012000020015'
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerIdProyectoPorBpin]
	@BPIN VARCHAR(max)
AS
BEGIN
	
	DECLARE @IdProyecto INT

	 SELECT Top 1  @IdProyecto= [IdProyecto] FROM [dbo].[DatosAdicionalesAprobacion] WHERE [CodigoBPIN] = @BPIN

	 IF @IdProyecto > 0
		 BEGIN
			SELECT @IdProyecto as ReturnValue
		 END
	 ELSE
		BEGIN
			SELECT -1 as ReturnValue
		 END

END
