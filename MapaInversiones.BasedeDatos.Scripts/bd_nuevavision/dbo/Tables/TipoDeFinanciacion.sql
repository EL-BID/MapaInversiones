CREATE TABLE [dbo].[TipoDeFinanciacion] (
    [IdTipoFinanciacion] INT           NOT NULL,
    [TipoFinanciacion]   VARCHAR (500) NOT NULL,
    CONSTRAINT [PK_TipoDeFinanciacion] PRIMARY KEY CLUSTERED ([IdTipoFinanciacion] ASC) WITH (FILLFACTOR = 80)
);

