CREATE TABLE [stpPsgr].[OBJETO_GASTO] (
    [idObjetoGasto]      INT             IDENTITY (1, 1) NOT NULL,
    [nombre]             VARCHAR (255)   NULL,
    [nombreCorto]        VARCHAR (255)   NULL,
    [descripcion]        VARCHAR (255)   NULL,
    [año]                INT             NULL,
    [gasto]              NUMERIC (15, 2) NULL,
    [es_imputable]       SMALLINT        NULL,
    [fechaCreacion]      DATETIME        NULL,
    [fechaActualizacion] DATETIME        NULL,
    [usuarioResponasble] VARCHAR (255)   NULL,
    CONSTRAINT [PK_OBJETO_GASTO] PRIMARY KEY CLUSTERED ([idObjetoGasto] ASC)
);

