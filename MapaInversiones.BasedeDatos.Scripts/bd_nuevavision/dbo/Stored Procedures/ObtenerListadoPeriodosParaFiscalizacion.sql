-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 24 de 2013>
-- Description:	<Procedimiento para Obtener el listado de periodos para Recursos>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoPeriodosParaFiscalizacion]	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

		CREATE TABLE #TbPeriodosRecursos(
		 value INT,
		 name INT
	   )
	 

	 DECLARE @añoAgregar INT
	DECLARE @añoFinal INT

	SET @añoAgregar = 2012
	SET @añoFinal = DATEPART(YEAR, GETDATE()) ;--Hasta año actual


	WHILE (@añoAgregar <= @añoFinal)
	BEGIN
	  INSERT INTO #TbPeriodosRecursos SELECT @añoAgregar,  @añoAgregar
	  SET @añoAgregar = @añoAgregar + 1
	END

	SELECT * FROM #TbPeriodosRecursos

	DROP TABLE #TbPeriodosRecursos

	--SELECT DISTINCT FechasPpto.value,
	--FechasPpto.name
	--FROM
	--(
	--	SELECT DISTINCT 
	--	DATEPART ( year , Presupuesto.[InicioVigencia])as value,
	--	DATEPART ( year , Presupuesto.[InicioVigencia])as  name
	--	FROM Presupuesto(nolock)
	--	WHERE DATEPART ( year , Presupuesto.[InicioVigencia]) >= 2012
	--	UNION
	--	SELECT DISTINCT 
	--	DATEPART ( year , Presupuesto.FinVigencia)as value,
	--	DATEPART ( year , Presupuesto.FinVigencia)as  name
	--	FROM Presupuesto(nolock)
	--	WHERE DATEPART ( year , Presupuesto.FinVigencia) >= 2012
	--) AS FechasPpto


END


