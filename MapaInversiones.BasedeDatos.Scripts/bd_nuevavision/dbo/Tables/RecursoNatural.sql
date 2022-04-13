CREATE TABLE [dbo].[RecursoNatural] (
    [IdRecursoNatural]         VARCHAR (10)  NOT NULL,
    [IdTipoRecursoNatural]     VARCHAR (1)   NOT NULL,
    [NombreRecursoNatural]     VARCHAR (250) NOT NULL,
    [NombreTipoRecursoNatural] VARCHAR (250) NOT NULL,
    [FechaUltimaModificacion]  DATETIME      NOT NULL,
    [ConsecutivoCarga]         INT           NOT NULL,
    CONSTRAINT [PK_RecursoNatural_1] PRIMARY KEY CLUSTERED ([IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_RecursoNatural_TipoDeRecursoNatural] FOREIGN KEY ([IdTipoRecursoNatural]) REFERENCES [dbo].[TipoDeRecursoNatural] ([IdTipoRecursoNatural])
);

