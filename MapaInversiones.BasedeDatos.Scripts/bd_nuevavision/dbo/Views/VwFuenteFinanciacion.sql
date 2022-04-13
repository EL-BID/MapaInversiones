
CREATE VIEW [dbo].[VwFuenteFinanciacion]
AS
SELECT DISTINCT ROW_NUMBER() OVER( ORDER BY proy.IdProyecto ) AS id,
proy.IdProyecto, 
				fuente.IdEntidad as IdOrganismoFinanciador,
				fuente.NombreEntidad as OrganismoFinanciador,
				fuente.IdTipoRecurso as IdFuenteFinanciacion,
				fuente.NombreTipoRecurso as FuenteFinanciacion,
				[Anio] as Vigencia,
				[PresupuestoVigente]
			  ,[PresupuestoObligado]
				 ,[PresupuestoPagado]

				
				FROM   dbo.Proyecto AS proy WITH (nolock) INNER JOIN
				[dbo].[SeguimientoEsquemaFinanciacionProyecto] SeguimientoFinanciacionProyecto
				on SeguimientoFinanciacionProyecto.idProyecto=proy.IdProyecto
				inner join [dbo].Fuente fuente
				on fuente.IdTipoEntidad=SeguimientoFinanciacionProyecto.IdTipoEntidad
				and fuente.IdTipoRecurso=SeguimientoFinanciacionProyecto.IdTipoRecurso
				and fuente.IdEntidad=SeguimientoFinanciacionProyecto.IdEntidad
				INNER JOIN
                         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
WHERE            (he.ActualSiNo = 1) AND (he.IdEstado = 1 or he.IdEstado=2 or he.IdEstado=3 OR he.IdEstado=4 )


