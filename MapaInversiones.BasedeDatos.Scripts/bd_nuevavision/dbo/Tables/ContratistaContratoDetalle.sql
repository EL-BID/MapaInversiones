CREATE TABLE [dbo].[ContratistaContratoDetalle] (
    [OCID]          VARCHAR (30)  NOT NULL,
    [AwardId]       VARCHAR (250) NOT NULL,
    [ItemId]        VARCHAR (50)  NOT NULL,
    [Descripcion]   VARCHAR (250) NULL,
    [DescripcionId] VARCHAR (50)  NULL,
    [Cantidad]      BIGINT        NULL,
    [UnidadNombre]  VARCHAR (50)  NULL,
    [UnidadId]      VARCHAR (50)  NULL,
    [UnidadValor]   BIGINT        NULL,
    [UnidadMoneda]  VARCHAR (5)   NULL
);

