

-------------------------
--Autor Modificacion: Julián Castiblanco
--Fecha: 2020-06-16
--Modificación: Se cambia agrupación para tomar la sumatoria de CantidadRecibida
--------------------------
CREATE   VIEW [dbo].[VwDonacionesEntidadesBeneficiarias]
as

SELECT 
donl.IdBeneficiario AS  IdBeneficiario,
DonDis.Sucursal as EntidadBeneficiaria,
DonDis.Producto,
sum(dondis.Cantidad) as CantidadRecibida,
Prov.id as IdDonante,
Prov.Proveedor as Donante,
DonDis.Llamado as Donacion,
DonDis.[FechaHora]  as FechaEntrega
from [dbo].[DonacionDistribucion] DonDis
inner join [dbo].[DonacionProveedor] Prov
on Prov.id=DonDis.IdProveedor and Dondis.IdProveedor=Prov.id
inner join [dbo].[VwDonacionesEntidadesBeneficiariasListado] donl
on donl.[EntidadBeneficiaria]=DonDis.Sucursal
group by donl.IdBeneficiario,DonDis.Sucursal,DonDis.Producto,DonDis.Llamado,DonDis.[FechaHora],Prov.id,
Prov.Proveedor
