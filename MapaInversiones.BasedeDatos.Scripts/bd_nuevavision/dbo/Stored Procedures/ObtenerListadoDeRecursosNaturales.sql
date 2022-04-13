
-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeRecursosNaturales]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	RecursoNatural.IdRecursoNatural as value, 
	UPPER(RecursoNatural.NombreRecursoNatural) as name
		FROM RecursoNatural(nolock)
    ORDER BY UPPER(RecursoNatural.NombreRecursoNatural)
END



