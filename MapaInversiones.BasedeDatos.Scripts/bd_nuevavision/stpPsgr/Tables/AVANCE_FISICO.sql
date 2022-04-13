CREATE TABLE [stpPsgr].[AVANCE_FISICO] (
    [idAvanceFisico]     INT            IDENTITY (1, 1) NOT NULL,
    [idActividadObra]    INT            NULL,
    [idIndicador]        INT            NULL,
    [año]                INT            NULL,
    [mes]                INT            NULL,
    [meta]               NUMERIC (3, 1) NULL,
    [avance]             NUMERIC (3, 1) NULL,
    [fechaCreacion]      DATETIME       NULL,
    [fechaActualizacion] DATETIME       NULL,
    [usuarioResponasble] VARCHAR (255)  NULL,
    CONSTRAINT [PK_AVANCE_FISICO] PRIMARY KEY CLUSTERED ([idAvanceFisico] ASC),
    CONSTRAINT [FK_AVANCE_F_FK_ACTIVI_ACTIVIDA] FOREIGN KEY ([idActividadObra]) REFERENCES [stpPsgr].[ACTIVIDAD_OBRA] ([idActividadObra]),
    CONSTRAINT [FK_AVANCE_F_FK_INDICA_INDICADO] FOREIGN KEY ([idIndicador]) REFERENCES [stpPsgr].[INDICADOR] ([idIndicador])
);

