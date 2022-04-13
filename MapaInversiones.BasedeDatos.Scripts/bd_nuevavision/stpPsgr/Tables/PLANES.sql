CREATE TABLE [stpPsgr].[PLANES] (
    [idPlan]             INT           IDENTITY (1, 1) NOT NULL,
    [idPadre]            INT           NULL,
    [idPadre2]           INT           NULL,
    [alturaNivel]        INT           NULL,
    [idIndicador]        INT           NULL,
    [codigoEstructura]   INT           NULL,
    [nombre]             VARCHAR (255) NULL,
    [descripcion]        VARCHAR (255) NULL,
    [detalle]            VARCHAR (255) NULL,
    [año]                INT           NULL,
    [fechaInicio]        DATETIME      NULL,
    [fechaFin]           DATETIME      NULL,
    [fechaCreacion]      DATETIME      NULL,
    [fechaActualizacion] DATETIME      NULL,
    [usuarioResponasble] VARCHAR (255) NULL,
    CONSTRAINT [PK_PLANES] PRIMARY KEY CLUSTERED ([idPlan] ASC),
    CONSTRAINT [FK_INDICADOR_PLANES] FOREIGN KEY ([idIndicador]) REFERENCES [stpPsgr].[INDICADOR] ([idIndicador]),
    CONSTRAINT [FK_PLANES_ALTURA] FOREIGN KEY ([alturaNivel]) REFERENCES [stpPsgr].[ALTURA_NIVEL_PLANES] ([idAlturaNivelPlanes]),
    CONSTRAINT [FK_PLANES_PADRE] FOREIGN KEY ([idPadre]) REFERENCES [stpPsgr].[PLANES] ([idPlan]),
    CONSTRAINT [FK_PLANES_PADRE2] FOREIGN KEY ([idPadre2]) REFERENCES [stpPsgr].[PLANES] ([idPlan])
);

