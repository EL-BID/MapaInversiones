CREATE TABLE [dbo].[Adendas_X_Contrato] (
    [codigo_BPIN]   VARCHAR (50)  NULL,
    [Id_Contrato]   VARCHAR (50)  NULL,
    [Fecha_Adenda]  DATETIME2 (7) NULL,
    [Descripcion]   VARCHAR (150) NULL,
    [Id_Adenda]     VARCHAR (50)  NULL,
    [Valor_Adenda]  BIGINT        NULL,
    [Moneda_Adenda] VARCHAR (10)  NULL
);

