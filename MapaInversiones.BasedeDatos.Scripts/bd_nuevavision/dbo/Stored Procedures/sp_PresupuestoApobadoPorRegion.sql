CREATE PROCEDURE [dbo].[sp_PresupuestoApobadoPorRegion] 
(@periodosList varchar(50) )
AS
BEGIN
SET NOCOUNT ON;
       CREATE  TABLE #Periodos (
             Periodo INT
       );     
       INSERT INTO #Periodos EXEC sp_GetPeriodosTable @periodosList


SELECT temp.NombreRegion, CONVERT(DECIMAL(18,0),temp.valorAprobado) as valorAprobado, CAST(valorAprobado*100.0/SUM(valorAprobado) OVER() AS NUMERIC(20,2)) AS porcentaje
FROM(
       SELECT f.NombreRegion, SUM(f.valorAprobado) AS valorAprobado 
       FROM(
       SELECT DISTINCT p.IdProyecto, es.ValorAprobado, es.FechaInicioVigencia,f.NombreTipoRecurso, e.NombreRegion
       FROM VwProyectosAprobados (nolock)  p
		JOIN EsquemaFinanciacionProyecto es ON es.IdProyecto = p.IdProyecto
		JOIN Fuente f ON f.IdTipoRecurso = es.IdTipoRecurso AND f.IdTipoEntidad = es.IdTipoEntidad AND f.IdEntidad = es.IdEntidad
		JOIN EnteTerritorial e ON e.IdDepartamento = es.IdDepartamento
       WHERE 
	   --CMC: Remover la logica de fondos pues al parecer el requerimiento fue erroneo
	   --(f.IdTipoRecurso IN(SELECT f.IdTipoRecurso FROM Fuente f WHERE IdTipoRecurso = 2 -- 'Fondo  de compensación regional'
				--	OR IdTipoRecurso = 3 -- 'Fondo  de desarrollo regional'
    --   ))
			f.EsFuenteRegalias = 1
             AND YEAR(es.FechaInicioVigencia) IN (SELECT periodo FROM  #Periodos)
             AND e.Tipo = 'DEPARTAMENTO'
            ) AS f
GROUP BY f.NombreRegion) AS temp;
END



