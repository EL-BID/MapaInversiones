CREATE VIEW dbo.[VwDatosAbiertosProyectosInversion]
AS
SELECT proy.CodigoBPIN AS CodigoSNIP, Est.NombreEstado AS Estado, proy.IdSector, sec.NombreSector, proy.FechaInicioProyecto, proy.FechaFinProyecto, EntidadEjecutora.NombreEntidad AS EjecutorPrimario, proy.NombreProyecto, proy.VlrTotalProyectoTodasLasFuentes AS CostoEstimadoProyecto, proy.PorcentajeAvanceFinanciero AS AvanceFinanciero, proy.PorcentajeAvanceFisico AS AvanceFisico, ISNULL(EntidadEjecutora.IdEntidad, 12001) AS IdEntidadEjecutora, 
         ISNULL(EntidadEjecutora.NombreEntidad, 'PRESIDENCIA DE LA REPÚBLICA') AS EntidadEjecutora, dbo.duration(proy.FechaInicioProyecto, proy.FechaFinProyecto) AS DuracionProyecto, (CASE WHEN proy.NombreOCAD = 'NA' THEN 'NACIONAL' WHEN proy.NombreOCAD = 'DE' THEN 'DEPARTAMENTAL' WHEN proy.NombreOCAD = 'MU' THEN 'MUNICIPAL' ELSE 'NACIONAL' END) AS TipoProyecto, { fn CONCAT('[', 
         { fn CONCAT(FORMAT(informeAvanceFisico.FechaInicioReporte, 'dd-MM-yyyy', 'en-US'), { fn CONCAT(' - ', { fn CONCAT(FORMAT(informeAvanceFisico.FechaFinReporte, 'dd-MM-yyyy', 'en-US'), { fn CONCAT('] --- ', ISNULL(informeAvanceFisico.Descripcion, 'No hay informe relacionado')) }) }) }) }) } AS InformeAvance, pxe.IdDepartamento AS IdDepartamentoLocalizacion, dbo.Departamento.NombreDepartamento AS DepartamentoLocalizacion, 
         pxe.IdMunicipio AS IdMunicipioLocalizacion, dbo.Municipio.NombreMunicipio AS NombreMunicipioLocalizacion, dbo.FuenteDeLosRecursos.FechaActualizacionFuente AS FechaCargueArchivo, { fn CONCAT(dbo.FuenteDeLosRecursos.Descripcion, ' - Ministerio de Hacienda') } AS FuenteDatos
FROM  dbo.Proyecto AS proy INNER JOIN
         dbo.Sector AS sec ON proy.IdSector = sec.IdSector INNER JOIN
         dbo.ProyectoXEntidadTerritorial AS pxe ON proy.IdProyecto = pxe.IdProyecto INNER JOIN
         dbo.Departamento ON pxe.IdDepartamento = dbo.Departamento.IdDepartamento INNER JOIN
         dbo.Municipio ON pxe.IdMunicipio = dbo.Municipio.IdMunicipio INNER JOIN
         dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto INNER JOIN
         dbo.Estado AS Est ON Est.IdEstado = he.IdEstado INNER JOIN
         dbo.InformeAvanceFisicoProyecto AS informeAvanceFisico ON proy.IdProyecto = informeAvanceFisico.IdProyecto LEFT OUTER JOIN
         dbo.VwEntidadEjecutora AS EntidadEjecutora ON proy.IdProyecto = EntidadEjecutora.IdProyecto CROSS JOIN
         dbo.FuenteDeLosRecursos
WHERE (dbo.FuenteDeLosRecursos.IdFuente = 1) AND (he.ActualSiNo = 1) AND (he.IdEstado = 1 OR
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
         Configuration = "(H (1[75] 4) )"
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
               Bottom = 627
               Right = 673
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "sec"
            Begin Extent = 
               Top = 1401
               Left = 850
               Bottom = 1747
               Right = 1315
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "pxe"
            Begin Extent = 
               Top = 3
               Left = 854
               Bottom = 312
               Right = 1319
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Departamento"
            Begin Extent = 
               Top = 4
               Left = 1411
               Bottom = 313
               Right = 1876
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Municipio"
            Begin Extent = 
               Top = 331
               Left = 1411
               Bottom = 640
               Right = 1943
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "he"
            Begin Extent = 
               Top = 681
               Left = 845
               Bottom = 990
               Right = 1310
            End
            DisplayFlags = 280
            TopColumn = 2
         End
         Begin Table = "Est"
            Begin Extent = 
               Top = 738
               Left = 1408
               Bottom = 1047
               Right = 1873
            End
            DisplayFlags = 280', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosInversion';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'
            TopColumn = 1
         End
         Begin Table = "informeAvanceFisico"
            Begin Extent = 
               Top = 1042
               Left = 846
               Bottom = 1351
               Right = 1311
            End
            DisplayFlags = 280
            TopColumn = 1
         End
         Begin Table = "EntidadEjecutora"
            Begin Extent = 
               Top = 344
               Left = 847
               Bottom = 653
               Right = 1188
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "FuenteDeLosRecursos"
            Begin Extent = 
               Top = 707
               Left = 144
               Bottom = 1016
               Right = 617
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
      Begin ColumnWidths = 23
         Width = 284
         Width = 600
         Width = 1170
         Width = 924
         Width = 1890
         Width = 1662
         Width = 1980
         Width = 2052
         Width = 1542
         Width = 1158
         Width = 1656
         Width = 1638
         Width = 1632
         Width = 1560
         Width = 1548
         Width = 3516
         Width = 1602
         Width = 1194
         Width = 1950
         Width = 3570
         Width = 2142
         Width = 3858
         Width = 600
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 2760
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
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosInversion';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwDatosAbiertosProyectosInversion';

