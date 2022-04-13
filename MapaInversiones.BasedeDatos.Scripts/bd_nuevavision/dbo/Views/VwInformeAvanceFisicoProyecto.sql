






CREATE VIEW [dbo].[VwInformeAvanceFisicoProyecto]
AS
SELECT DISTINCT proy.IdProyecto, 
				FechaInicioReporte as FechaInicioInforme,
				FechaFinReporte as FechaFinInforme,
				isnull(Descripcion,'No hay informe relacionado') as Descripcion

				
				FROM   dbo.Proyecto AS proy WITH (nolock) INNER JOIN
				[dbo].InformeAvanceFisicoProyecto informeAvanceFisico
				on informeAvanceFisico.idProyecto=proy.IdProyecto
				INNER JOIN
                         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
WHERE            (he.ActualSiNo = 1) AND (he.IdEstado = 1 or he.IdEstado=2 or he.IdEstado=3 OR he.IdEstado=4 )






