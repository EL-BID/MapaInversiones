CREATE VIEW [dbo].[CatalogoOrganismoFinanciador]
AS
SELECT DISTINCT fuente.IdEntidad as IdOrganismoFinanciador,
				fuente.NombreEntidad as OrganismoFinanciador
				FROM   dbo.Proyecto AS proy WITH (nolock) INNER JOIN
				[dbo].[SeguimientoEsquemaFinanciacionProyecto] SeguimientoFinanciacionProyecto
				on SeguimientoFinanciacionProyecto.idProyecto=proy.IdProyecto
				inner join [dbo].Fuente fuente
				on fuente.IdTipoEntidad=SeguimientoFinanciacionProyecto.IdTipoEntidad
				and fuente.IdTipoRecurso=SeguimientoFinanciacionProyecto.IdTipoRecurso
				and fuente.IdEntidad=SeguimientoFinanciacionProyecto.IdEntidad


