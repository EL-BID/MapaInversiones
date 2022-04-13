CREATE TABLE [dbo].[GeneroUsuario] (
    [IdGeneroUsuario] INT          IDENTITY (1, 1) NOT NULL,
    [NombreGenero]    VARCHAR (50) NOT NULL,
    [FechaCreacion]   DATETIME     NULL,
    CONSTRAINT [PK_GeneroUsuario] PRIMARY KEY CLUSTERED ([IdGeneroUsuario] ASC) WITH (FILLFACTOR = 80)
);

