



--select *  from [dbo].[VwContratosPerfilContratista] where COVID19 in (1,2)
--------------------------
--Autor Modificación: Julián Castiblanco
--Fecha:2020-04-22
--Descripcion cambio: modificaicon idPrograma para llave negocio y campo covid
--------------------------
CREATE    VIEW [dbo].[VwContratosPerfilContratistaSinPrograma] AS  
SELECT
0 as COVID19,
	Contratista,
	[tipodocumento], --RUC
	[numerodocumento],
	SUM(MontoContratadoTotal) AS ValorTotalContratos,
	COUNT(distinct(codigocontrato)) AS NumContratos,
	COUNT(distinct(numerolicitacion)) AS NumProcesos
FROM
( 

--select * FROM [PISGR_PY_COVID19].[dbo].[Vw_InformacionProcesoConYSinCodigoContratacion] as p

SELECT DISTINCT
	P.anio as AnioInicioContrato,
	P.anio as AnioFinContrato,
	P.Contratista, 
	p.[tipodocumento], --RUC
	p.[numerodocumento],
	ValorContrato AS MontoContratadoTotal, --[valorcontratado]
	p.CodigoContrato AS codigocontrato,
	p.CodigoProceso AS numerolicitacion,
	p.COVID19
FROM [PISGR_PY_COVID19].[dbo].[Vw_InformacionProcesoConYSinCodigoContratacion] as p
where ValorContrato is not null

) Contratos
GROUP BY 
	Contratista,
	[tipodocumento], 
	[numerodocumento]


