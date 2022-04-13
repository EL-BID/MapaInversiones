CREATE TABLE [dbo].[TipoDeRecursoNatural] (
    [IdTipoRecursoNatural] VARCHAR (1)  NOT NULL,
    [NombreTipoDeRecurso]  VARCHAR (50) NULL,
    [ConsecutivoCarga]     INT          NOT NULL,
    CONSTRAINT [PK_TipoDeRecursoNatural] PRIMARY KEY CLUSTERED ([IdTipoRecursoNatural] ASC) WITH (FILLFACTOR = 80)
);

