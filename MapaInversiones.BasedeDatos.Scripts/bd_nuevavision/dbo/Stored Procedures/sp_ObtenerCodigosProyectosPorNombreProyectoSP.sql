-- =============================================
-- Author:		John Rodriguez 
-- Create date: 17/07/2013
-- Description:	store Procedure que devuelve los codigos de proyecto segun filtros realizados por nombre
--				de proyecto
--@Filtro	  : Parametro que contiene los filtros que se desean ejecutar en la consulta.
-- =============================================
CREATE  PROCEDURE [dbo].[sp_ObtenerCodigosProyectosPorNombreProyectoSP]
	@filtro as varchar (2000)
AS
BEGIN
	declare @query as varchar(max)
	select @query = 'SELECT   distinct IdProyecto,CodigoBPIN,NombreProyecto
					FROM     Proyecto   '

	select @query = @query + @filtro +' order by IdProyecto'

	execute (@query)
END



