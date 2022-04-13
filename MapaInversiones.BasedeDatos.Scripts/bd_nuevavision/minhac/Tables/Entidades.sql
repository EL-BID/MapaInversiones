CREATE TABLE [minhac].[Entidades] (
    [ANIOPRESUP]    INT            NOT NULL,
    [CodigoNivel]   NUMERIC (2)    NOT NULL,
    [CodigoEntidad] NUMERIC (3)    NOT NULL,
    [NOMBRE]        VARCHAR (60)   NOT NULL,
    [NOMABR]        VARCHAR (20)   NOT NULL,
    [SIGLA]         VARCHAR (10)   NULL,
    [RUC]           VARCHAR (11)   NOT NULL,
    [FCHING]        DATE           NOT NULL,
    [USRING]        VARCHAR (8)    NOT NULL,
    [FCHACT]        DATE           NOT NULL,
    [USRACT]        VARCHAR (8)    NOT NULL,
    [BASE]          VARCHAR (1000) NULL,
    [MISION]        VARCHAR (1000) NULL,
    [POLITICA]      VARCHAR (1000) NULL,
    [OBJETIVO]      VARCHAR (1000) NULL,
    [DIAGNOSTICO]   VARCHAR (1000) NULL,
    [SECUENCIA]     NUMERIC (6)    NULL,
    [NRO_CDP]       NUMERIC (9)    NULL,
    [DIRECCION]     VARCHAR (100)  NULL,
    [TELEFONO]      VARCHAR (10)   NULL,
    [URL]           VARCHAR (60)   NULL
);

