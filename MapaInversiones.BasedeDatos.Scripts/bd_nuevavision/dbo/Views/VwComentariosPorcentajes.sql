















CREATE VIEW [dbo].[VwComentariosPorcentajes]
AS


SELECT DISTINCT proy.IdProyecto,

P.[IdPregunta]
	  ,P.TextoPregunta
      ,O.[IdOpcionRespuestas] AS [IdOpcionRespuesta]
	  ,O.EtiquetaOpcion
	  ,O.Orden,

	isnull(ConteoRespuesta,0) as ConteoRespuesta, 
	--,isnull(sum(TotalRespuesta),0) as TotalRespuesta, 
	isnull(MAX(TotalRespuesta)  over (PARTITION BY P.[Idpregunta],proy.IdProyecto),0)  AS TotalRespuesta
	,cast((isnull((isnull(ConteoRespuesta,0)*100.00/nullif(TotalRespuesta,0)),0)) AS  decimal(10,2)) as PorcentajeRespuesta
FROM            dbo.Proyecto AS proy WITH (nolock) 
--INNER JOIN  dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto 
INNER JOIN
                       dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
					   inner join [dbo].[Estado] e
					   on e.IdEstado=he.IdEstado
					   inner join [dbo].[EstadoHomologado] eh
					   on eh.IdEstadoProyecto=e.IdEstado
					   inner join [dbo].[PreguntaCuestionario] P
					   on p.IdEstado=eh.IdEstado
					    inner  join [dbo].[OpcionRespuestas] O
						ON  P.IdPregunta=O.Idpregunta
						left join (SELECT DISTINCT 
							[IdProyecto],
							R.[Idpregunta]
							  ,P.TextoPregunta
							  ,R.[IdOpcionRespuesta]
							  ,O.EtiquetaOpcion
							  ,o.Orden
							  , count(IdRespuesta)  over (PARTITION BY R.[IdOpcionRespuesta],[IdProyecto])  AS ConteoRespuesta
							  , count (IdRespuesta)  over (PARTITION BY R.[Idpregunta],[IdProyecto])  AS TotalRespuesta
							  , 0 as PorcentajeRespuesta
							  FROM [dbo].[RespuestaCuestionario] R
						  inner join [dbo].[OpcionRespuestas] O
						  ON O.IdOpcionRespuestas=R.IdOpcionRespuesta AND O.IdPregunta=R.Idpregunta
						  inner join [dbo].[PreguntaCuestionario] P
						  ON P.IdPregunta=R.Idpregunta
							GROUP BY R.[Idpregunta]
							  ,P.TextoPregunta
							  ,R.[IdOpcionRespuesta]
							  ,O.EtiquetaOpcion
							  ,o.Orden
							  ,  [IdProyecto],IdRespuesta
								--  ORDER BY P.[Idpregunta],O.[IdOpcionRespuestas]
								  )ConteoComentarios
						on ConteoComentarios.IdProyecto=proy.IdProyecto and ConteoComentarios.IdPregunta=P.IdPregunta
						AND ConteoComentarios.[IdOpcionRespuesta]=O.IdOpcionRespuestas
					--	WHERE proy.IdProyecto=1299
						group by proy.IdProyecto,

P.[IdPregunta]
	  ,P.TextoPregunta
      ,O.[IdOpcionRespuestas]
	  ,O.EtiquetaOpcion
	  ,O.Orden,ConteoRespuesta,TotalRespuesta
					-- ORDER BY proy.IdProyecto,P.[Idpregunta],O.[IdOpcionRespuestas]
						 





