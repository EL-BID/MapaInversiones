----------------------
--Fecha: 2020-05-22
--Autor: Jcastiblanco
--Descripción:  Elimina Awards Cancelados
-----------------------
create procedure EliminarAwardsCancelados
as 
begin
--------------------
--elimina Contratos cancelados
--------------------------
SELECT   [AwardId]
into #awardIdeliminar
  FROM [dbo].[ContratistaContrato]
  where [Estado]='Cancelado'

delete from Contratos where awardID in (select awardID from #awardIdeliminar)
delete from Procesos where awardID in (select awardID from #awardIdeliminar)
delete FROM [dbo].[ContratistaContrato] where awardID in (select awardID from #awardIdeliminar)
end