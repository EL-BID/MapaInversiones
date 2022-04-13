CREATE TABLE [dbo].[ProgramaMetasFinancieras] (
    [FechaMeta]               DATETIME      NOT NULL,
    [idPrograma]              INT           NOT NULL,
    [CodigoProducto]          INT           NOT NULL,
    [NombreProducto]          VARCHAR (100) NULL,
    [CodigoObjeto]            INT           NOT NULL,
    [NombreObjeto]            VARCHAR (80)  NULL,
    [Fuente]                  INT           NOT NULL,
    [Financiador]             INT           NOT NULL,
    [CodigoDepartamento]      INT           NOT NULL,
    [Meta]                    NUMERIC (15)  NULL,
    [Avance]                  NUMERIC (15)  NULL,
    [FechaUltimaModificacion] DATETIME      NULL,
    [codigosnip]              VARCHAR (60)  NULL,
    CONSTRAINT [PK_ProgramaMetasFinancieras] PRIMARY KEY CLUSTERED ([FechaMeta] ASC, [idPrograma] ASC, [CodigoProducto] ASC, [CodigoObjeto] ASC, [Fuente] ASC, [Financiador] ASC, [CodigoDepartamento] ASC),
    CONSTRAINT [FK_ProgramaMetasFinancieras_Programa] FOREIGN KEY ([idPrograma]) REFERENCES [dbo].[Programa] ([Id])
);

