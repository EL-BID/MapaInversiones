CREATE TABLE [stpPsgr].[INDICADOR] (
    [idIndicador]             INT           IDENTITY (1, 1) NOT NULL,
    [idTipoIndicador]         INT           NULL,
    [idFuenteOrigen]          INT           NULL,
    [idEntidadPresupuestaria] INT           NULL,
    [codIndicador]            INT           NULL,
    [nombre]                  VARCHAR (255) NULL,
    [descripcion]             VARCHAR (255) NULL,
    [año]                     INT           NULL,
    [frecuenciaMeses]         INT           NULL,
    [observaciones]           VARCHAR (255) NULL,
    [metodoDeCalculo]         VARCHAR (255) NULL,
    [evaluacionHeci]          VARCHAR (255) NULL,
    [fechaCreacion]           DATETIME      NULL,
    [fechaModificacion]       DATETIME      NULL,
    [usuarioResponsable]      VARCHAR (255) NULL,
    CONSTRAINT [PK_INDICADOR] PRIMARY KEY CLUSTERED ([idIndicador] ASC),
    CONSTRAINT [FK_INDICADO_FK_ENTIDA_ESTRUCTU] FOREIGN KEY ([idEntidadPresupuestaria]) REFERENCES [stpPsgr].[ESTRUCTURA_PRESUPUESTARIA] ([idEstructuraPresupuestaria]),
    CONSTRAINT [FK_INDICADO_FK_FUENTE_FUENTE_O] FOREIGN KEY ([idFuenteOrigen]) REFERENCES [stpPsgr].[FUENTE_ORIGEN] ([idFuenteOrigen]),
    CONSTRAINT [FK_INDICADO_FK_TIPO_I_TIPO_IND] FOREIGN KEY ([idTipoIndicador]) REFERENCES [stpPsgr].[TIPO_INDICADOR] ([idTipoIndicador])
);

