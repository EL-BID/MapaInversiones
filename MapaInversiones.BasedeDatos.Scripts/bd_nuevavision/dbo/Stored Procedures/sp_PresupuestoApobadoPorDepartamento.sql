CREATE PROCEDURE [dbo].[sp_PresupuestoApobadoPorDepartamento] 
(@periodosList varchar(50) )
AS
BEGIN
SET NOCOUNT ON;

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO #Periodos EXEC sp_GetPeriodosTable @periodosList

SELECT AB.NombreDepartamento, CONVERT(DECIMAL(18,0),temp.valorAprobado) as valorAprobado, CAST(valorAprobado*100.0/SUM(valorAprobado) OVER() AS NUMERIC(20,2)) AS porcentaje
FROM(
	SELECT f.NombreDepartamento, SUM(f.valorAprobado) AS valorAprobado 
	FROM(
SELECT DISTINCT p.IdProyecto,es.ValorAprobado, es.FechaInicioVigencia,f.NombreTipoRecurso, e.NombreDepartamento
		FROM VwProyectosAprobados (nolock)  p
		JOIN EsquemaFinanciacionProyecto es ON es.IdProyecto = p.IdProyecto
		JOIN Fuente f ON f.IdTipoRecurso = es.IdTipoRecurso AND f.IdTipoEntidad = es.IdTipoEntidad AND f.IdEntidad = es.IdEntidad
		JOIN EnteTerritorial e ON e.IdDepartamento = es.IdDepartamento
		WHERE 		
		f.EsFuenteRegalias = 1
		AND f.IdTipoRecurso = 4 --'Fondo de ciencia, tecnología e innovación'
		AND YEAR(es.FechaInicioVigencia) IN (SELECT periodo FROM  #Periodos)
		AND e.Tipo = 'DEPARTAMENTO'
		) AS f
GROUP BY f.NombreDepartamento) AS temp
RIGHT JOIN 
(SELECT DISTINCT NombreDepartamento FROM EnteTerritorial WHERE NombreDepartamento <> 'N/A'  ) AS AB
	ON AB.NombreDepartamento = temp.NombreDepartamento
ORDER BY AB.NombreDepartamento;

END




