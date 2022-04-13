CREATE VIEW dbo.VwDatosAbiertosProyectosEjecuciónPresupuestaria
AS
SELECT proy.CodigoBPIN AS CodigoSNIP, SeguimientoFinanciacionProyecto.IdTipoEntidad AS IdOrganismoFinanciador, dbo.Fuente.NombreEntidad AS OrganismoFinanciador, SeguimientoFinanciacionProyecto.IdTipoRecurso AS IdFuenteFinanciacion, dbo.Fuente.NombreTipoRecurso AS FuenteFinanciacion, SeguimientoFinanciacionProyecto.Anio AS Vigencia, SeguimientoFinanciacionProyecto.PresupuestoVigente AS Presupuestado, 
         SeguimientoFinanciacionProyecto.PresupuestoPagado AS Ejecutado, dbo.FuenteDeLosRecursos.FechaActualizacionFuente AS FechaCargueArchivo, { fn CONCAT(dbo.FuenteDeLosRecursos.Descripcion, ' - Ministerio de Hacienda') } AS FuenteDatos
FROM  dbo.Proyecto AS proy INNER JOIN
         dbo.SeguimientoEsquemaFinanciacionProyecto AS SeguimientoFinanciacionProyecto ON proy.IdProyecto = SeguimientoFinanciacionProyecto.idProyecto INNER JOIN
         dbo.Fuente ON SeguimientoFinanciacionProyecto.IdTipoRecurso = dbo.Fuente.IdTipoRecurso AND SeguimientoFinanciacionProyecto.IdTipoEntidad = dbo.Fuente.IdTipoEntidad AND SeguimientoFinanciacionProyecto.IdEntidad = dbo.Fuente.IdEntidad INNER JOIN
         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto CROSS JOIN
         dbo.FuenteDeLosRecursos
WHERE (he.ActualSiNo = 1) AND (he.IdEstado = 1 OR
         he.IdEstado = 2 OR
         he.IdEstado = 3 OR
         he.IdEstado = 4)

GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "proy"
            Begin Extent = 
               Top = 15
               Left = 96
               Bottom = 324
               Right = 673
            End
            DisplayFlags = 280
            TopColumn = 6
         End
         Begin Table = "SeguimientoFinanciacionProyecto"
            Begin Extent = 
               Top = 20
               Left = 802
               Bottom = 329
               Right = 1409
            End
            DisplayFlags = 280
            TopColumn = 9
         End
         Begin Table = "Fuente"
            Begin Extent = 
               Top = 22
               Left = 1591
               Bottom = 331
               Right = 2056
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "FuenteDeLosRecursos"
            Begin Extent = 
               Top = 391
               Left = 99
               Bottom = 700
               Right = 572
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "he"
            Begin Extent = 
               Top = 386
               Left = 813
               Bottom = 695
               Right = 1278
            End
            DisplayFlags = 280
            TopColumn = 1
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 10
         Width = 284
         Width = 1122
         Width = 1014
         Width = 1674
         Width = 990
         Width = 2472
         Width = 858
         Width = 1980
         Width = 2670
         Width = 1530
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosEjecuciónPresupuestaria';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosEjecuciónPresupuestaria';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosEjecuciónPresupuestaria';

