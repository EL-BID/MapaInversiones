
-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 29 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeTiposRecursosNaturales]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT 
	IdTipoRecursoNatural as value, 
	UPPER(NombreTipoDeRecurso) as name
		FROM TipoDeRecursoNatural (nolock)
    ORDER BY UPPER(NombreTipoDeRecurso)
END



