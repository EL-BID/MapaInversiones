CREATE TABLE [minhac].[ObjetoGasto] (
    [ANIOPRESUP]        INT          NULL,
    [CodigoObjetoGasto] INT          NULL,
    [NombreObjetoGasto] VARCHAR (80) NULL,
    [NombreAbreviado]   VARCHAR (20) NULL,
    [Imputable]         VARCHAR (1)  NULL,
    [OBJ_FCHING]        DATETIME     NULL,
    [OBJ_USRING]        VARCHAR (8)  NULL,
    [OBJ_FCHACT]        DATETIME     NULL,
    [OBJ_USRACT]        VARCHAR (8)  NULL,
    [NVL_CODIGO]        NUMERIC (2)  NULL
);

