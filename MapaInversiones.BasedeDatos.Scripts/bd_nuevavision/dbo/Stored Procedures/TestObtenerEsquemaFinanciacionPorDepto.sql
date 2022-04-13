
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
--TestObtenerResumenConsolidadoNacional 2012,2013
-- =============================================
CREATE PROCEDURE [dbo].[TestObtenerEsquemaFinanciacionPorDepto] 	
	@CodDepto  INT
AS
BEGIN


SELECT IdProyecto,IdTipoRecurso from EsquemaFinanciacionProyecto where idDepartamento=@CodDepto

END



