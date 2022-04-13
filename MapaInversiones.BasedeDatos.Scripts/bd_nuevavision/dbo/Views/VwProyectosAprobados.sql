



CREATE VIEW [dbo].[VwProyectosAprobados]
AS
SELECT DISTINCT proy.IdProyecto, proy.FechaInicioProyecto, proy.FechaFinProyecto, proy.NombreProyecto, proy.VlrTotalProyectoFuenteRegalias, proy.VlrTotalProyectoTodasLasFuentes, proy.IdSector
FROM            dbo.Proyecto AS proy WITH (nolock) INNER JOIN
                       --  dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto INNER JOIN
                         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
WHERE            (he.ActualSiNo = 1) AND (he.IdEstado = 1 or he.IdEstado=2 or he.IdEstado=3 OR he.IdEstado=4 )






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
               Top = 7
               Left = 48
               Bottom = 170
               Right = 364
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "px"
            Begin Extent = 
               Top = 7
               Left = 412
               Bottom = 170
               Right = 676
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ente"
            Begin Extent = 
               Top = 7
               Left = 724
               Bottom = 170
               Right = 1022
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "he"
            Begin Extent = 
               Top = 7
               Left = 1070
               Bottom = 170
               Right = 1334
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "e"
            Begin Extent = 
               Top = 175
               Left = 48
               Bottom = 338
               Right = 312
            End
            DisplayFlags = 280
            TopColumn = 0
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
         Width = 1200
         Width = 1200
         Width = 1200
         Width = 24384
         Width = 1200
         Width = 1200
         Width = 1200
         Width = 1200
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1176
       ', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwProyectosAprobados';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'  Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1356
         SortOrder = 1416
         GroupBy = 1350
         Filter = 1356
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwProyectosAprobados';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwProyectosAprobados';

