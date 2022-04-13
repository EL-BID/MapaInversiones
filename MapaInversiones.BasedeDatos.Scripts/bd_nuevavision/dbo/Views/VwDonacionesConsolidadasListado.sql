

create   VIEW [dbo].[VwDonacionesConsolidadasListado]
as


SELECT 
DonDis.[IdProveedor] as IdListadoDonateBeneficiario,
Prov.Proveedor as ListadoDonanteBeneficiario,
'DONANTE' as TipoLista,
count(distinct DonRec.Sucursal) as TotalBeneficiariosDonates,
count(distinct DonDis.Llamado) as TotalDonaciones,
count(distinct DonDis.Producto) as TotalProductos

FROM [dbo].[DonacionDistribucion] DonDis
inner join [dbo].[DonacionRecepcion] DonRec
on DonDis.Llamado=DonRec.Llamado  
inner join [dbo].[DonacionProveedor] Prov
  on DonDis.IdProveedor=Prov.id
  group by  DonDis.[IdProveedor],Prov.Proveedor
  union
SELECT 
donl.IdBeneficiario AS  IdListadoDonateBeneficiario,
DonRec.Sucursal as ListadoDonanteBeneficiario,
'BENEFICIARIO' as TipoLista,
count(distinct DonRec.[IdProveedor]) as TotalBeneficiariosDonates,
count(distinct DonRec.Llamado) as TotalDonaciones,
count(distinct DonRec.Producto) as TotalProductos

from [dbo].[DonacionDistribucion] DonRec
INNER JOIN [VwDonacionesEntidadesBeneficiariasListado] donl
on donl.EntidadBeneficiaria=DonRec.Sucursal
group by DonRec.Sucursal,donl.IdBeneficiario
  
