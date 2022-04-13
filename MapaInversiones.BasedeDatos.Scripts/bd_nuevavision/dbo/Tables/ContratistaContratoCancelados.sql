CREATE TABLE [dbo].[ContratistaContratoCancelados] (
    [OCID]              VARCHAR (30)  NOT NULL,
    [AwardId]           VARCHAR (250) NOT NULL,
    [Estado]            VARCHAR (30)  NULL,
    [Valor]             BIGINT        NULL,
    [MonedaValor]       VARCHAR (5)   NULL,
    [Proveedor]         VARCHAR (250) NULL,
    [CodigoProveedor]   VARCHAR (40)  NOT NULL,
    [FechaModificacion] DATETIME      NULL,
    [esCovid]           INT           NULL
);

