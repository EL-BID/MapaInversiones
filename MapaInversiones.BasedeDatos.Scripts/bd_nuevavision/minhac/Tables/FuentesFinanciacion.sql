CREATE TABLE [minhac].[FuentesFinanciacion] (
    [ANIOPRESUP]            INT          NULL,
    [CodigoClasifFuncional] INT          NOT NULL,
    [FuenteFinanciacion]    VARCHAR (60) NULL,
    [FuenteNomAbreviado]    VARCHAR (20) NULL,
    [FuenteSigla]           VARCHAR (10) NULL,
    [FuenteImputable]       VARCHAR (1)  NULL,
    [FuenteProcede]         VARCHAR (1)  NULL,
    [FUE_FCHING]            DATETIME     NULL,
    [FUE_USRING]            VARCHAR (8)  NULL,
    [FUE_FCHACT]            DATETIME     NULL,
    [FUE_USRACT]            VARCHAR (8)  NULL
);

