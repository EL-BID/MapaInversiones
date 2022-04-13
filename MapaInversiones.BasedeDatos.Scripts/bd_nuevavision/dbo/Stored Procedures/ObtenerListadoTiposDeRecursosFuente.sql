-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 23 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoTiposDeRecursosFuente]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	fuente.IdTipoRecurso as value, 
	UPPER(fuente.NombreTipoRecurso) as name
		FROM Fuente(nolock)
	WHERE Fuente.EsFuenteRegalias = 1
	ORDER BY UPPER(fuente.NombreTipoRecurso)
END



