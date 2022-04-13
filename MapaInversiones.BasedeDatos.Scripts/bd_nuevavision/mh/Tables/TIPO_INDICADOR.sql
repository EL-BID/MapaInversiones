CREATE TABLE [mh].[TIPO_INDICADOR] (
    [idTipoIndicador]    INT           IDENTITY (1, 1) NOT NULL,
    [nombre]             VARCHAR (255) NULL,
    [descripcion]        VARCHAR (255) NULL,
    [fechaCreacion]      DATETIME      NULL,
    [fechaActualizacion] DATETIME      NULL,
    [usuarioResponasble] VARCHAR (255) NULL,
    CONSTRAINT [PK_TIPO_INDICADOR] PRIMARY KEY CLUSTERED ([idTipoIndicador] ASC)
);

