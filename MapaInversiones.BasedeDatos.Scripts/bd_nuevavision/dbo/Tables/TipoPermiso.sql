CREATE TABLE [dbo].[TipoPermiso] (
    [IdTipoPermiso] INT           IDENTITY (1, 1) NOT NULL,
    [NombrePermiso] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_TipoPermiso] PRIMARY KEY CLUSTERED ([IdTipoPermiso] ASC) WITH (FILLFACTOR = 80)
);

