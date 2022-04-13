 CREATE PROCEDURE [dbo].[sp_girosPorDepartamento] (@periodosList varchar(50))
 AS
 BEGIN
 SET NOCOUNT ON;
 
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO #Periodos EXEC sp_GetPeriodosTable @periodosList

SELECT e.NombreDepartamento, CONVERT(DECIMAL(18,0),SUM(g.Monto)) AS valorGiro
		FROM EnteTerritorial e 
			JOIN Giro g
			ON g.IdDepartamento = e.IdDepartamento 
			AND g.IdMunicipio = e.IdMunicipio 
			JOIN Fuente f
			ON f.IdTipoRecurso = g.IdTipoRecurso
			AND f.IdTipoEntidad = g.IdTipoEntidad
			AND f.IdEntidad = g.IdEntidad			
		WHERE 
			g.AñoFiscal IN(SELECT periodo FROM #Periodos)
			AND f.IdTipoRecurso = 4 --'Fondo de ciencia, tecnología e innovación'
			AND f.EsFuenteRegalias = 1			
		GROUP BY e.NombreDepartamento
END;



