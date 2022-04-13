
create   VIEW [dbo].[VwDonacionesConsolidadas]
as
SELECT isnull(ROW_NUMBER() OVER(
       ORDER BY  dr.id),0) AS RowNum, 
	   dr.TotalDonantes
	   ,dd.TotalBeneficiarios
	   ,dr.TotalDonaciones
FROM 
(select 1 as id, count(distinct DonRec.[IdProveedor]) as TotalDonantes,
		count(distinct DonRec.Llamado) as TotalDonaciones
 from [dbo].[DonacionRecepcion] DonRec ) as  dr
 inner join 
(select 1 as id, count(distinct DonDis.Sucursal) as TotalBeneficiarios
 from [dbo].[DonacionDistribucion] DonDis) as dd
 on dr.id=dd.id

