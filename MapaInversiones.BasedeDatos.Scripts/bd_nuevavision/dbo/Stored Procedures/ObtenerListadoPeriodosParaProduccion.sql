-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 24 de 2013>
-- Description:	<Procedimiento para Obtener el listado de periodos para Recursos>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoPeriodosParaProduccion]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

		CREATE TABLE #TbPeriodosRecursos(
		 value INT,
		 name INT
	   )
	 

	 DECLARE @añoAgregar INT
	DECLARE @añoFinal INT

	SET @añoAgregar = 2012
	SET @añoFinal = DATEPART(YEAR, GETDATE()) ;--Hasta año actual mas 2


	WHILE (@añoAgregar <= @añoFinal)
	BEGIN
	  INSERT INTO #TbPeriodosRecursos SELECT @añoAgregar,  @añoAgregar
	  SET @añoAgregar = @añoAgregar + 1
	END

	SELECT * FROM #TbPeriodosRecursos

	DROP TABLE #TbPeriodosRecursos


END



