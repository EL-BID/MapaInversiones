
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[LLenarBusqueda] 
	as begin
 Truncate table [dbo].[Busqueda]

 INSERT INTO  [dbo].[Busqueda]
 Select * from (  Select distinct 'PROYECTO' as Categoria,convert(varchar(10),pY.IdProyecto) as Id,py.NombreProyecto+' '+isnull(fuente.Fuentes,' -*- SIN INFORMACION')+'|'+CodigoSNIP as Nombre
  
 from [dbo].[VwProyectosAprobadosInv] PY
 left join (
  SELECT DISTINCT F2.IdProyecto,
    ' -*- '+SUBSTRING(
        (
            SELECT distinct CONCAT(F1.[OrganismoFinanciador],', ')  AS [text()]
            FROM [dbo].[VwFuenteFinanciacion] F1
            WHERE  F2.IdProyecto=F1.IdProyecto
            ORDER BY  CONCAT(F1.[OrganismoFinanciador],', ') 
            FOR XML PATH ('') 
        ), 1, 1000) [Fuentes]
FROM [dbo].[VwFuenteFinanciacion] F2) fuente
on fuente.IdProyecto=PY.IdProyecto
 union all
      Select distinct 'MUNICIPIO' as Categoria, convert(varchar(10),IdMunicipio) as Id,NombreMunicipio as Nombre from [dbo].[EnteTerritorial]  
	  WHERE NombreMunicipio NOT LIKE '%PROYECTO DEPARTAMENTAL' AND  NombreMunicipio NOT LIKE 'N/A' AND NombreMunicipio!='NACIONALES'
 UNION ALL
   Select distinct 'DEPARTAMENTO' as Categoria, convert(varchar(10),IdDepartamento) as Id,NombreDepartamento as Nombre from [dbo].[EnteTerritorial] 
   WHERE
  NombreDepartamento NOT LIKE 'N/A' AND NombreDepartamento!='PROYECTOS NACIONALES'
UNION ALL 
  Select distinct 'SECTOR' as Categoria, convert(varchar(10),[IdSector]) as Id,[NombreSector] as Nombre from [dbo].[Sector] 
 
 UNION ALL 
SELECT DISTINCT  'CONTRATISTA' as Categoria, convert(varchar(20),c.[numerodocumento]) as Id,([numerodocumento]++'|'+ SUBSTRING(LTRIM(RTRIM([Contratista]))+' '+isnull(T.DescripcionItems,' -*- SIN INFORMACION'),0,950)) as Nombre 
	 FROM  [dbo].[VwContratosPerfilContratista] c
 left join (SELECT DISTINCT 
	  C.[CodigoProveedor],
	 ' -*- '+SUBSTRING(
			(
			SELECT distinct CONCAT(CD1.[Descripcion],', ')  AS [text()]
            FROM [dbo].[ContratistaContratoDetalle] CD1
			inner join [dbo].[ContratistaContrato] C1
			on CD1.AwardId=C1.awardID and CD1.[OCID]=C1.[OCID]
            WHERE  C.[CodigoProveedor]=C1.[CodigoProveedor]
            ORDER BY  CONCAT(CD1.[Descripcion],', ') 
            FOR XML PATH ('') 
        ), 1, 1000) DescripcionItems
FROM [dbo].[ContratistaContrato] C
inner join [dbo].[ContratistaContratoDetalle] CD
on CD.AwardId=C.awardID and CD.[OCID]=C.[OCID]
 )T
 on T.CodigoProveedor=C.[numerodocumento]
  WHERE c.COVID19=0
union all
SELECT DISTINCT  'CONTRATO' as Categoria, convert(varchar(20),w.[CodigoContrato]) as Id,(w.[CodigoContrato]++'|'+ SUBSTRING(LTRIM(RTRIM(  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(replace(REPLACE(replace(cpcp.DescripcionProceso,',',''),'$',''),'"',''),'”',''),'“',''),'-',''), CHAR(13), ''), CHAR(10), ''))+' '+isnull(T.DescripcionItems,' -*- SIN INFORMACION')),0,950)) as Nombre 
 	FROM vwContratosPerfilContratistaInformacionContratacion w
  inner join vwContratosPerfilContratosProceso cpcp
 on w.IdProceso=cpcp.IdProceso and w.codigocontrato=cpcp.codigocontrato 
	
 left join (SELECT DISTINCT 
	  C.CodigoContrato,
	 ' -*- '+SUBSTRING(
        (
            SELECT distinct CONCAT(CD1.[Descripcion],', ')  AS [text()]
            FROM [dbo].[ContratistaContratoDetalle] CD1
			inner join [dbo].[Contratos] C1
			ON CD1.AwardId=C1.awardID
            WHERE  C.CodigoContrato=c1.CodigoContrato
            ORDER BY  CONCAT(CD1.[Descripcion],', ') 
            FOR XML PATH ('') 
        ), 1, 1000) DescripcionItems
FROM [dbo].[ContratistaContratoDetalle] CD
inner join [dbo].[Contratos] C
on CD.AwardId=C.awardID)T
on T.CodigoContrato=w.CodigoContrato
 WHERE w.COVID19=0				

   )Busqueda

END





