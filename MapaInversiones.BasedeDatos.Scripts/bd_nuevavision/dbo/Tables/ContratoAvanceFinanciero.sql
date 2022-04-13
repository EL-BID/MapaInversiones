CREATE TABLE [dbo].[ContratoAvanceFinanciero] (
    [codigo_BPIN]           VARCHAR (50)  NULL,
    [CodigoContrato]        VARCHAR (50)  NULL,
    [FechaAvanceFinanciero] DATETIME2 (7) NULL,
    [NombreContratista]     VARCHAR (50)  NULL,
    [CodigoContratista]     VARCHAR (50)  NULL,
    [FechaFactura]          DATETIME2 (7) NULL,
    [MonedaFactura]         VARCHAR (10)  NULL,
    [SistemaPago]           VARCHAR (20)  NULL,
    [FechaSolicitudFactura] DATETIME2 (7) NULL,
    [codigoFinanciero]      VARCHAR (20)  NULL,
    [idAvanceFinanciero]    VARCHAR (100) NULL,
    [MonedaValorPagado]     VARCHAR (10)  NULL,
    [NombrePagador]         VARCHAR (250) NULL,
    [CodigoPagador]         VARCHAR (25)  NULL,
    [NumeroFactura]         VARCHAR (60)  NULL,
    [TipoDocumento]         VARCHAR (60)  NULL,
    [ValorFactura]          BIGINT        NULL,
    [ValorPagado]           BIGINT        NULL
);

