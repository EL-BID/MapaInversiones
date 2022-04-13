CREATE TABLE [dbo].[Indicadores] (
    [Anio]                    INT             NOT NULL,
    [IdPrograma]              INT             NOT NULL,
    [CodigoIndicador]         INT             NOT NULL,
    [NombreIndicador]         VARCHAR (1000)  NULL,
    [AnioBaseIndicador]       NUMERIC (4)     NULL,
    [MetaIndicador]           NUMERIC (22, 2) NULL,
    [AvanceIndicador]         NUMERIC (22, 2) NULL,
    [DenominadorIndicador]    NUMERIC (22, 2) NULL,
    [PorcentajeMeta]          NUMERIC (22, 2) NULL,
    [PorcentajeAvance]        NUMERIC (22, 2) NULL,
    [TipoIndicador]           VARCHAR (50)    NULL,
    [TamanoIndicador]         VARCHAR (50)    NULL,
    [Tipo2Indicador]          VARCHAR (50)    NULL,
    [FecuenciaIndicador]      VARCHAR (50)    NULL,
    [CodigoBPIN]              VARCHAR (30)    NULL,
    [FechaUltimaModificacion] DATETIME        NULL,
    CONSTRAINT [PK_Indicadores] PRIMARY KEY CLUSTERED ([Anio] ASC, [IdPrograma] ASC, [CodigoIndicador] ASC)
);

