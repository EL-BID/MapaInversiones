CREATE TABLE [stpPsgr].[META_INDICADOR] (
    [idMetaIndicador]    INT             IDENTITY (1, 1) NOT NULL,
    [idIndicador]        INT             NULL,
    [codMeta]            INT             NULL,
    [cantidad]           NUMERIC (15, 2) NULL,
    [fechaVencimiento]   DATETIME        NULL,
    [ano]                INT             NULL,
    [fechaCreacion]      DATETIME        NULL,
    [fechaActualizacion] DATETIME        NULL,
    [usuarioResponasble] VARCHAR (255)   NULL,
    CONSTRAINT [PK_META] PRIMARY KEY CLUSTERED ([idMetaIndicador] ASC),
    CONSTRAINT [FK_INDICADOR_META] FOREIGN KEY ([idIndicador]) REFERENCES [stpPsgr].[INDICADOR] ([idIndicador])
);

