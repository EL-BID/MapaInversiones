CREATE TABLE [consulta].[Presupuesto_Indicadores_MinHacienda] (
    [AnioPresupuesto]          INT             NULL,
    [CodigoIndicador]          INT             NULL,
    [NombreIndicador]          VARCHAR (1000)  NULL,
    [DescripcionIndicador]     VARCHAR (1000)  NULL,
    [IND_FRECUEN]              VARCHAR (30)    NULL,
    [IND_ANIOBASE]             NUMERIC (4)     NULL,
    [IND_FUENTE]               VARCHAR (1000)  NULL,
    [IND_NUMERADOR]            NUMERIC (22, 2) NULL,
    [IND_DENOMINADOR]          NUMERIC (22, 2) NULL,
    [IND_SUPUESTOS]            VARCHAR (1000)  NULL,
    [IND_METCALCULO]           VARCHAR (1000)  NULL,
    [UN_MEDIDA_ANIO_BASE]      VARCHAR (1000)  NULL,
    [DescripcionPoblTotal]     VARCHAR (1000)  NULL,
    [UnidadMedidaTotal]        VARCHAR (1000)  NULL,
    [TotalMetaHombres]         NUMERIC (22, 2) NULL,
    [TotalMetaMujeres]         NUMERIC (22, 2) NULL,
    [DescripcionPoblPotencial] VARCHAR (1000)  NULL,
    [CodigoDepartamento]       INT             NULL,
    [CodigoDistrito]           INT             NULL,
    [IdNegocioProyecto]        VARCHAR (19)    NULL,
    [CodNivelEntidad]          VARCHAR (7)     NULL,
    [IND_PORCMETA]             FLOAT (53)      NULL,
    [IND_PAVANCEUNITARIO]      FLOAT (53)      NULL,
    [TIPO_INDICADOR]           VARCHAR (60)    NULL
);


GO
CREATE CLUSTERED COLUMNSTORE INDEX [ClusterIndexIndicadorMinHac]
    ON [consulta].[Presupuesto_Indicadores_MinHacienda];

