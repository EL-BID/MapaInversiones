-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeTiposDeFiscalizacion]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT '0' AS value, 'No fiscalizados' AS name
		UNION  
	SELECT '1' AS value, 'Fiscalizados' AS name

END


