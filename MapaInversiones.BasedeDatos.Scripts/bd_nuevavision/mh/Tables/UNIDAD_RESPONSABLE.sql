CREATE TABLE [mh].[UNIDAD_RESPONSABLE] (
    [idUnidadResponsable] INT           IDENTITY (1, 1) NOT NULL,
    [idUnidadJerarquica]  INT           NULL,
    [nombre]              VARCHAR (255) NULL,
    [nombreCorto]         VARCHAR (255) NULL,
    [descripcion]         VARCHAR (255) NULL,
    [año]                 INT           NULL,
    [fechaCreacion]       DATETIME      NULL,
    [fechaActualizacion]  DATETIME      NULL,
    [usuarioResponasble]  VARCHAR (255) NULL,
    CONSTRAINT [PK_UNIDAD_RESPONSABLE] PRIMARY KEY CLUSTERED ([idUnidadResponsable] ASC),
    CONSTRAINT [FK_UNIDAD_R_FK_UNIDAD_UNIDAD_J] FOREIGN KEY ([idUnidadJerarquica]) REFERENCES [mh].[UNIDAD_JERARQUICA] ([idUnidadJerarquica])
);

