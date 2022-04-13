CREATE PROCEDURE [dbo].[sp_presupuestoPorTipoDeRecurso] 
(@periodosList varchar(50) )
AS
BEGIN
SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO #Periodos EXEC sp_GetPeriodosTable @periodosList

SELECT temp.NombreTipoRecurso, CONVERT(DECIMAL(18,0),temp.valorMonto) as valorMonto , CAST(valorMonto*100.0/SUM(valorMonto) OVER() AS NUMERIC(20,8)) AS porcentaje 
FROM(
SELECT UPPER( f.NombreTipoRecurso ) AS NombreTipoRecurso, 
SUM(p.ValorMonto) AS valorMonto
FROM Fuente f 
	JOIN Presupuesto p
		ON f.IdTipoRecurso = p.IdTipoRecurso
		AND f.IdTipoEntidad = p.IdTipoEntidad
		AND f.IdEntidad = p.IdEntidad
WHERE YEAR(p.InicioVigencia) <= ANY
		(SELECT periodo FROM #periodos WHERE periodo<=YEAR(p.FinVigencia)) AND 
	YEAR(p.FinVigencia)>= ANY
		(SELECT periodo FROM #periodos WHERE periodo>=YEAR(p.InicioVigencia))
GROUP BY f.NombreTipoRecurso) AS temp
END



