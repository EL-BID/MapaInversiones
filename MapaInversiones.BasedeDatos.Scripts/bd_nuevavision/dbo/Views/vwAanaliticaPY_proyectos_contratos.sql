





--CONTRATOS 

CREATE   view [dbo].[vwAanaliticaPY_proyectos_contratos] 

   as
-- Proyectos por Contratos
SELECT distinct



--[ProyectosXContratos]
PxC.[CodigoSNIP], -- es igual a [IdProyecto]
PxC.[CodigoProceso],
PxC.[CodigoContrato],
PxC.[Estado],

--Contrato
Con.[awardID],
Con.[EstadoContrato],
Con.[TipoContrato],
Con.[DocumentoNombre],
Con.[ValorContrato], --valor de contrato
Con.[MonedaContrato],
Con.[FechaFirmaContrato], --fecha de firma de contrato
Con.[DuracionContrato],
Con.[codigo_BPIN],
Con.[FechaUltimaActualizacion],
Con.[RegistroActivo],

--[ContratosEjecucionFinanciera]
ConEjecFin.[TipoPrograma],
ConEjecFin.[ObjetoGasto],
ConEjecFin.[SubPrograma],

--ConEjecFin.[FuenteFinanciamiento], --fuente financiamiento es misma fuentes que idtipo recurso de seguimientoesquemafinanciacionproyecto ej recursos propios recursos prestados  -- viene de estructura entidades
--NombreFF as NombreFuenteFinanciamiento,

ConEjecFin.[CodigoEntidad],
ConEjecFin.[CodigoPrograma],
ConEjecFin.[CodigoProyecto],
ConEjecFin.[CodigoDepartamento],
ConEjecFin.[CodigoNivel],
ConEjecFin.[AnioContrato],

--ConEjecFin.[CodigoFinanciador], 
--codigofinanciador organismo financiador es identidad en seguimientoesquemafinanciacionproyecto ej BID etc -- viene de estructura entidades
-- NombreOF  as NombreOrganismoFinanciador, --nombre

ConEjecFin.[IdProceso],
ConEjecFin.[FechaFinalizacionContrato],
ConEjecFin.[FechaInicioContrato],
ConEjecFin.[MontoAUtilizar] as MontoAUtilizarOK, --verdadero valor del contrato una vez el proceso ha sido adjudicado
ConEjecFin.[CodigoFinanciero],
ConEjecFin.[FechaModificacion],
--ConEjecFin.[RegistroActivo],


-- [PISGR_PY_COVID19].[dbo].[Facturacion_X_Contrato]

FxC.[Fecha_Transaccion],
FxC.[Nombre_Beneficiario],
FxC.[Codigo_Beneficiario],
FxC.[Fecha_Factura],
FxC.[Valor_Factura],
FxC.[Moneda_Factura],
FxC.[Sistema_Transaccion],
FxC.[Fecha_Solicitud_Pago],
FxC.[Codigo_Financiero],
FxC.[Valor_Desembolsado], --importante
FxC.[Moneda_Desembolsado],
FxC.[Nombre_Pagador],
FxC.[Id_Pagador],
FxC.[Valor_Impuesto_Iva],
FxC.[Valor_Impuesto_Renta],
FxC.[Valor_Cuota_Multa],
FxC.[Valor_Impuesto_Retencion],
FxC.[Valor_Cuota_ISC],
FxC.[Valor_Cuota_Reparo],
FxC.[Valor_impuesto_Retencion2]

FROM [dbo].[ProyectosXContratos] PxC

left join [dbo].[Contratos] Con on PxC.CodigoContrato = Con.CodigoContrato

left join [dbo].[ContratosEjecucionFinanciera] ConEjecFin on PxC.CodigoContrato = ConEjecFin.CodigoContrato

left join [dbo].[Facturacion_X_Contrato] FxC on PxC.CodigoContrato = FxC.IdContracto

--left join (select max(NombreOF) NombreOF,max(NombreFF)NombreFF ,CodigoOrganismoFinanciador,CodigoFuenteFinanciamiento
--			from  [dbo].EstructuraEntidades	
--			where nombreof <> 'SIN INFORMACION' group by CodigoOrganismoFinanciador,CodigoFuenteFinanciamiento  ) as k
--			on k.CodigoOrganismoFinanciador = ConEjecFin.[CodigoFinanciador]
--			and ConEjecFin.FuenteFinanciamiento=k.CodigoFuenteFinanciamiento
