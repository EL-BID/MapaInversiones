






CREATE VIEW [dbo].[VwSubsidioPytyvoBeneficiariosMedicamentos]
AS
select	ISNULL(ROW_NUMBER() OVER(order by hombres.totalHombres),0) as ID, 
		count(distinct med.[Cédula identidad]) as totalBeneficiarios, 
		count(med.[Cédula identidad]) as totalSubsidiosEntregados, 
		sum(med.[Monto de Compra]) as totalSubsidios, 
		hombres.totalHombres, 
		mujeres.totalMujeres, 
		otros.totalOtros, 
		count(distinct med.Farmacia) as totalFarmacias
from	[dbo].[SubsidioPytyvoBeneficiariosMedicamentos] as med 
		CROSS JOIN
		(select count(distinct gen.[Cédula identidad]) as totalHombres
		from	[dbo].[SubsidioPytyvoBeneficiariosMedicamentos] as gen
		where gen.Sexo = 'M') as hombres
		CROSS JOIN
		(select count(distinct gen.[Cédula identidad]) as totalMujeres
		from	[dbo].[SubsidioPytyvoBeneficiariosMedicamentos] as gen
		where gen.Sexo = 'F') as mujeres
		CROSS JOIN
		(select count(distinct gen.[Cédula identidad]) as totalOtros
		from	[dbo].[SubsidioPytyvoBeneficiariosMedicamentos] as gen
		where gen.Sexo != 'F' and gen.Sexo != 'M') as otros
group by	
		hombres.totalHombres, 
		mujeres.totalMujeres, 
		otros.totalOtros

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
         Begin Table = "SubsidioBeneficiariosPytyvoMedicamentos"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 225
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "SubsidiosCons"
            Begin Extent = 
               Top = 149
               Left = 39
               Bottom = 279
               Right = 263
            End
            DisplayFlags = 280
            TopColumn = 2
         End
         Begin Table = "prog"
            Begin Extent = 
               Top = 150
               Left = 312
               Bottom = 280
               Right = 542
            End
            DisplayFlags = 280
            TopColumn = 7
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
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
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwSubsidioPytyvoBeneficiariosMedicamentos';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 1, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'VwSubsidioPytyvoBeneficiariosMedicamentos';

