CREATE TABLE [stpPsgr].[RESULTADO_INMEDIATO] (
    [idResultadoInmediato] INT           IDENTITY (1, 1) NOT NULL,
    [idIndicador]          INT           NULL,
    [idActividadObra]      INT           NULL,
    [nombre]               VARCHAR (255) NULL,
    [descripcion]          VARCHAR (255) NULL,
    [fechaCreacion]        DATETIME      NULL,
    [fechaActualizacion]   DATETIME      NULL,
    [usuarioResponasble]   VARCHAR (255) NULL,
    CONSTRAINT [PK_RESULTADO_INMEDIATO] PRIMARY KEY CLUSTERED ([idResultadoInmediato] ASC),
    CONSTRAINT [FK_RESULTAD_FK_INDICA_INDICADO] FOREIGN KEY ([idIndicador]) REFERENCES [stpPsgr].[INDICADOR] ([idIndicador]),
    CONSTRAINT [FK_RESULTAD_FK_RESULT_ACTIVIDA] FOREIGN KEY ([idActividadObra]) REFERENCES [stpPsgr].[ACTIVIDAD_OBRA] ([idActividadObra])
);

