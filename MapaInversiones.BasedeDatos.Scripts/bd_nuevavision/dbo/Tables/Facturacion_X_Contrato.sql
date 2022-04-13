CREATE TABLE [dbo].[Facturacion_X_Contrato] (
    [Codigo_Bpin]               VARCHAR (50)  NULL,
    [IdContracto]               VARCHAR (30)  NULL,
    [Fecha_Transaccion]         DATETIME2 (7) NULL,
    [Nombre_Beneficiario]       VARCHAR (200) NULL,
    [Codigo_Beneficiario]       VARCHAR (50)  NULL,
    [Fecha_Factura]             DATETIME2 (7) NULL,
    [Valor_Factura]             BIGINT        NULL,
    [Moneda_Factura]            VARCHAR (5)   NULL,
    [Sistema_Transaccion]       VARCHAR (20)  NULL,
    [Fecha_Solicitud_Pago]      DATETIME2 (7) NULL,
    [Codigo_Financiero]         VARCHAR (50)  NULL,
    [Valor_Desembolsado]        BIGINT        NULL,
    [Moneda_Desembolsado]       VARCHAR (5)   NULL,
    [Nombre_Pagador]            VARCHAR (200) NULL,
    [Id_Pagador]                VARCHAR (50)  NULL,
    [Valor_Impuesto_Iva]        BIGINT        NULL,
    [Valor_Impuesto_Renta]      BIGINT        NULL,
    [Valor_Cuota_Multa]         BIGINT        NULL,
    [Valor_Impuesto_Retencion]  BIGINT        NULL,
    [Valor_Cuota_ISC]           BIGINT        NULL,
    [Valor_Cuota_Reparo]        BIGINT        NULL,
    [Valor_impuesto_Retencion2] BIGINT        NULL
);


GO
CREATE NONCLUSTERED INDEX [ix_facturacion_x_contrato]
    ON [dbo].[Facturacion_X_Contrato]([IdContracto] ASC);

