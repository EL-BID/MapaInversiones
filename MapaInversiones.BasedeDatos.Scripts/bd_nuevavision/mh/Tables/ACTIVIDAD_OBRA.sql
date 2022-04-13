CREATE TABLE [mh].[ACTIVIDAD_OBRA] (
    [idActividadObra]     INT           IDENTITY (1, 1) NOT NULL,
    [idProyectoActividad] INT           NULL,
    [idFuenteOrigen]      INT           NULL,
    [codActividad]        INT           NULL,
    [nombre]              VARCHAR (255) NULL,
    [descripcion]         VARCHAR (255) NULL,
    [año]                 INT           NULL,
    [categoria]           VARCHAR (255) NULL,
    [version]             INT           NULL,
    [fechaCreacion]       DATETIME      NULL,
    [fechaModificacion]   DATETIME      NULL,
    [usuarioResponsable]  VARCHAR (255) NULL,
    CONSTRAINT [PK_ACTIVIDAD_OBRA] PRIMARY KEY CLUSTERED ([idActividadObra] ASC),
    CONSTRAINT [FK_ACTIVIDA_FK_FUENTE_FUENTE_O] FOREIGN KEY ([idFuenteOrigen]) REFERENCES [mh].[FUENTE_ORIGEN] ([idFuenteOrigen]),
    CONSTRAINT [FK_ACTIVIDA_FK_PROYEC_PROYECTO] FOREIGN KEY ([idProyectoActividad]) REFERENCES [mh].[PROYECTO_ACTIVIDAD] ([idProyectoActividad])
);

