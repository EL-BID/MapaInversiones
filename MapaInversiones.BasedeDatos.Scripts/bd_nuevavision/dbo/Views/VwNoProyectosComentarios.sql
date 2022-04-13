CREATE VIEW [dbo].[VwNoProyectosComentarios] AS
SELECT 
	A.IdProyecto,
	NombreProyecto,
	SUM(ConteoComentarios) AS Comentarios 
FROM (
	SELECT DISTINCT 
		[IdProyecto]
		,R.[Idpregunta]
		,count(ComentarioRespuesta) AS ConteoComentarios
	FROM [dbo].[RespuestaCuestionario] R
	GROUP BY R.[Idpregunta]
	,R.[IdOpcionRespuesta]
	,[IdProyecto]
) A	
INNER JOIN dbo.Proyecto P
ON A.IdProyecto = P.IdProyecto
GROUP BY 
	A.IdProyecto,
	NombreProyecto	
