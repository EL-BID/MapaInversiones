
-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeRecursosNaturalesFiscalizacion]						
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	RecursoNaturalFiscalizacion.IdRecursoNatural as value, 
	UPPER(RecursoNaturalFiscalizacion.NombreRecursoNatural) as name
	, RecursoNaturalFiscalizacion.IdTipoRecursoNatural AS IdTipoRecursoNatural
		FROM RecursoNaturalFiscalizacion(nolock)
    ORDER BY UPPER(RecursoNaturalFiscalizacion.NombreRecursoNatural)
END


