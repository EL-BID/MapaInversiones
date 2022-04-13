





CREATE VIEW [dbo].[VwComponentesActividades]
AS
SELECT DISTINCT proy.IdProyecto, 
				producto.IdProducto as IdComponente,
				producto.UnidadProducto as CodigoComponente,
				producto.NombreProducto as Componente,
				IdActividad as IdActividad,
				CodigoActividad as CodigoActividad,
				DescripcionActividad as Actividades

				
				FROM   dbo.Proyecto AS proy WITH (nolock) INNER JOIN
				[dbo].[ObjetivoEspecifico] objetivo
				on objetivo.IdProyecto=proy.IdProyecto
				inner join [dbo].Producto producto
				on producto.IdObjetivoEspecifico=objetivo.IdObjetivoEspecifico
				inner join [dbo].[Actividad] Actividades
				on Actividades.IdProducto=producto.IdProducto
				INNER JOIN
                         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
WHERE            (he.ActualSiNo = 1) AND (he.IdEstado = 1 or he.IdEstado=2 or he.IdEstado=3 OR he.IdEstado=4 )






