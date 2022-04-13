

---------------------------------
--Autor modificacion:JCastiblanco
--Fecha: 2020-06-16
--Modficacion: Se agrupa por conceptos para sumar la Cantidad Recibida, para mitigar error reportado por desarrollo
----------------------------------

CREATE   VIEW [dbo].[VwDonacionesDonantes]
as

SELECT 
Prov.id as IdDonante,
Prov.Proveedor as Donante,
DonRec.Llamado as Donacion,
DonRec.FechaMovimiento as FechaRecepcion,
DonRec.Producto,
sum([CantidadRecibida]) as CantidadRecibida,
DonRec.Sucursal as Receptor
from  [dbo].[DonacionRecepcion] DonRec
inner join [dbo].[DonacionProveedor] Prov
on Prov.id=DonRec.IdProveedor and DonRec.IdProveedor=Prov.id
--inner join [dbo].[VwDonacionesEntidadesBeneficiariasListado] donl
--on donl.[EntidadBeneficiaria]=DonDis.Sucursal
--where DonRec.llamado='DONACIÓN 443/2020'
 --and DonRec.producto='TAPA BOCA  SIN FILTRO RESPIRADOR MOD. N95 UNIDAD'
group by Prov.id,Prov.Proveedor,DonRec.Llamado,DonRec.FechaMovimiento ,DonRec.Producto,DonRec.Sucursal
