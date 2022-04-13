CREATE VIEW [dbo].[ProyectoOrganismoFinanciador]
AS
SELECT DISTINCT cast(fuente.IdEntidad as int)  as IdOrganismoFinanciador,
				fuente.NombreEntidad as OrganismoFinanciador,
				proy.IdProyecto
				FROM   dbo.Proyecto AS proy WITH (nolock) LEFT JOIN
				[dbo].[SeguimientoEsquemaFinanciacionProyecto] SeguimientoFinanciacionProyecto
				on SeguimientoFinanciacionProyecto.idProyecto=proy.IdProyecto
				LEFT JOIN [dbo].Fuente fuente
				on fuente.IdTipoEntidad=SeguimientoFinanciacionProyecto.IdTipoEntidad
				and fuente.IdTipoRecurso=SeguimientoFinanciacionProyecto.IdTipoRecurso
				and fuente.IdEntidad=SeguimientoFinanciacionProyecto.IdEntidad


