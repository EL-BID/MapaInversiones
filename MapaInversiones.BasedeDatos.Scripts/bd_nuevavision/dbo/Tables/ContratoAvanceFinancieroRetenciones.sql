CREATE TABLE [dbo].[ContratoAvanceFinancieroRetenciones] (
    [codigo_BPIN]        VARCHAR (50)  NULL,
    [codigoContrato]     VARCHAR (50)  NULL,
    [NumeroFactura]      VARCHAR (60)  NULL,
    [NombreRetencion]    VARCHAR (10)  NULL,
    [IdRetencion]        INT           NULL,
    [TipoRetencion]      VARCHAR (10)  NULL,
    [ValorRetencion]     BIGINT        NULL,
    [MonedaRetencion]    VARCHAR (10)  NULL,
    [idAvanceFinanciero] VARCHAR (250) NULL
);

