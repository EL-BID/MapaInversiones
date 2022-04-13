CREATE TABLE [stpPsgr].[UNIDAD_JERARQUICA] (
    [idUnidadJerarquica]      INT           IDENTITY (1, 1) NOT NULL,
    [idEntidadPresupuestaria] INT           NULL,
    [codUnidadJerarquica]     INT           NULL,
    [nombre]                  VARCHAR (255) NULL,
    [descripcion]             VARCHAR (255) NULL,
    [año]                     INT           NULL,
    [fechaCreacion]           DATETIME      NULL,
    [fechaActualizacion]      DATETIME      NULL,
    [usuarioResponasble]      VARCHAR (255) NULL,
    CONSTRAINT [PK_UNIDAD_JERARQUICA] PRIMARY KEY CLUSTERED ([idUnidadJerarquica] ASC),
    CONSTRAINT [FK_UNIDAD_J_FK_ENTIDA_ESTRUCTU] FOREIGN KEY ([idEntidadPresupuestaria]) REFERENCES [stpPsgr].[ESTRUCTURA_PRESUPUESTARIA] ([idEstructuraPresupuestaria])
);

