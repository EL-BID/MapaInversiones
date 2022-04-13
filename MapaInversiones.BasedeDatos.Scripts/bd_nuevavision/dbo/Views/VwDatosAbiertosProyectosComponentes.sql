CREATE VIEW dbo.VwDatosAbiertosProyectosComponentes
AS
SELECT proy.CodigoBPIN AS CodigoSNIP, producto.UnidadProducto AS codigoComponente, producto.NombreProducto AS descripcionComponente, Actividades.CodigoActividad AS codigoActividad, Actividades.DescripcionActividad AS descripcionActividad, dbo.FuenteDeLosRecursos.FechaActualizacionFuente AS FechaCargueArchivo, { fn CONCAT(dbo.FuenteDeLosRecursos.Descripcion, ' - Ministerio de Hacienda') } AS FuenteDatos
FROM  dbo.Proyecto AS proy WITH (nolock) INNER JOIN
         dbo.ObjetivoEspecifico AS objetivo ON objetivo.IdProyecto = proy.IdProyecto INNER JOIN
         dbo.Producto AS producto ON producto.IdObjetivoEspecifico = objetivo.IdObjetivoEspecifico INNER JOIN
         dbo.Actividad AS Actividades ON Actividades.IdProducto = producto.IdProducto INNER JOIN
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
            TopColumn = 0
         End
         Begin Table = "FuenteDeLosRecursos"
            Begin Extent = 
               Top = 368
               Left = 100
               Bottom = 677
               Right = 573
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "objetivo"
            Begin Extent = 
               Top = 6
               Left = 864
               Bottom = 315
               Right = 1349
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "producto"
            Begin Extent = 
               Top = 12
               Left = 1471
               Bottom = 321
               Right = 1936
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Actividades"
            Begin Extent = 
               Top = 11
               Left = 2006
               Bottom = 320
               Right = 2471
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "he"
            Begin Extent = 
               Top = 365
               Left = 866
               Bottom = 674
               Right = 1331
            End
            DisplayFlags = 280
            TopColumn = 2
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1332
         Wid', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosComponentes';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'th = 1260
         Width = 2688
         Width = 1530
         Width = 3000
         Width = 2370
         Width = 3768
         Width = 600
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 2940
         Alias = 2760
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
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosComponentes';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosComponentes';

