CREATE TABLE [stpPsgr].[ORGANISMO_FINANCIADOR] (
    [idOrganismoFinanciador] INT           IDENTITY (1, 1) NOT NULL,
    [nombre]                 VARCHAR (255) NULL,
    [descripcion]            VARCHAR (255) NULL,
    [año]                    INT           NULL,
    [fechaCreacion]          DATETIME      NULL,
    [fechaModificacion]      DATETIME      NULL,
    [usuarioResponsable]     VARCHAR (255) NULL,
    CONSTRAINT [PK_ORGANISMO_FINANCIADOR] PRIMARY KEY CLUSTERED ([idOrganismoFinanciador] ASC)
);

