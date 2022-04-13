 CREATE PROCEDURE [dbo].[sp_girosPorRegion] (@periodosList varchar(50))
 AS
 BEGIN
 SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList

SELECT e.NombreRegion, CONVERT(DECIMAL(18,0),SUM(g.Monto)) AS valorGiro
		FROM EnteTerritorial e 
			JOIN Giro g
			ON g.IdDepartamento = e.IdDepartamento 
			AND g.IdMunicipio = e.IdMunicipio 
			JOIN Fuente f
			ON f.IdTipoRecurso = g.IdTipoRecurso
			AND f.IdTipoEntidad = g.IdTipoEntidad
			AND f.IdEntidad = g.IdEntidad			
		WHERE g.AñoFiscal IN(SELECT periodo FROM #Periodos)
		AND f.EsFuenteRegalias = 1
		--CMC: Remover la logica de fondos pues al parecer el requerimiento fue erroneo
		--AND f.IdTipoRecurso IN(SELECT DISTINCT f.IdTipoRecurso FROM Fuente f 
		--	WHERE f.IdTipoRecurso = 2 -- 'Fondo  de compensación regional'
		--			OR f.IdTipoRecurso = 3 -- 'Fondo  de desarrollo regional'
		--	)
		GROUP BY e.NombreRegion
END;



