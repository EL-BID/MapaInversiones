CREATE TABLE [stpPsgr].[CATALOGO_BENEFICIARIO] (
    [idCatalogoBeneficiario]     INT           IDENTITY (1, 1) NOT NULL,
    [idActividadObra]            INT           NULL,
    [idObjetoGasto]              INT           NULL,
    [idTipoCatalogoBeneficiario] INT           NULL,
    [nombre]                     VARCHAR (255) NULL,
    [descripcion]                VARCHAR (255) NULL,
    [fechaCreacion]              DATETIME      NULL,
    [fechaActualizacion]         DATETIME      NULL,
    [usuarioResponasble]         VARCHAR (255) NULL,
    CONSTRAINT [PK_CATALOGO_BENEFICIARIO] PRIMARY KEY CLUSTERED ([idCatalogoBeneficiario] ASC),
    CONSTRAINT [FK_CATALOGO_FK_ACTIVI_ACTIVIDA] FOREIGN KEY ([idActividadObra]) REFERENCES [stpPsgr].[ACTIVIDAD_OBRA] ([idActividadObra]),
    CONSTRAINT [FK_CATALOGO_FK_OBJETO_OBJETO_G] FOREIGN KEY ([idObjetoGasto]) REFERENCES [stpPsgr].[OBJETO_GASTO] ([idObjetoGasto]),
    CONSTRAINT [FK_CATALOGO_FK_TIPO_C_TIPO_CAT] FOREIGN KEY ([idTipoCatalogoBeneficiario]) REFERENCES [stpPsgr].[TIPO_CATALOGO_BENEFICIARIO] ([idTipoCatalogoBeneficiario])
);

