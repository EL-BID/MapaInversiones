CREATE TABLE [mh].[TIPO_CATALOGO_BENEFICIARIO] (
    [idTipoCatalogoBeneficiario] INT           IDENTITY (1, 1) NOT NULL,
    [nombre]                     VARCHAR (255) NULL,
    [descripcion]                VARCHAR (255) NULL,
    [fechaCreacion]              DATETIME      NULL,
    [fechaActualizacion]         DATETIME      NULL,
    [usuarioResponasble]         VARCHAR (255) NULL,
    CONSTRAINT [PK_TIPO_CATALOGO_BENEFICIARIO] PRIMARY KEY CLUSTERED ([idTipoCatalogoBeneficiario] ASC)
);

