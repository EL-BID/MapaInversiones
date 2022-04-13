CREATE TABLE [stpPsgr].[PROYECTO_ACTIVIDAD] (
    [idProyectoActividad]     INT           IDENTITY (1, 1) NOT NULL,
    [idUnidadResponsable]     INT           NULL,
    [idEntidadPresupuestaria] INT           NULL,
    [codProyecto]             INT           NULL,
    [nombre]                  VARCHAR (255) NULL,
    [nombreCorto]             VARCHAR (255) NULL,
    [descripcion]             VARCHAR (255) NULL,
    [año]                     INT           NULL,
    [diagnostico]             VARCHAR (255) NULL,
    [resultadoEsperado]       VARCHAR (255) NULL,
    [fechaCreacion]           DATETIME      NULL,
    [fechaModificacion]       DATETIME      NULL,
    [usuarioResponsable]      VARCHAR (255) NULL,
    CONSTRAINT [PK_PROYECTO_ACTIVIDAD] PRIMARY KEY CLUSTERED ([idProyectoActividad] ASC),
    CONSTRAINT [FK_PROYECTO_FK_SUBPRO_ESTRUCTU] FOREIGN KEY ([idEntidadPresupuestaria]) REFERENCES [stpPsgr].[ESTRUCTURA_PRESUPUESTARIA] ([idEstructuraPresupuestaria]),
    CONSTRAINT [FK_PROYECTO_FK_UNIDAD_UNIDAD_R] FOREIGN KEY ([idUnidadResponsable]) REFERENCES [stpPsgr].[UNIDAD_RESPONSABLE] ([idUnidadResponsable])
);

