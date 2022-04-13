CREATE TABLE [dbo].[EstadoComentario] (
    [Id]               INT           IDENTITY (1, 1) NOT NULL,
    [EstadoComentario] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_EstadoComentario] PRIMARY KEY CLUSTERED ([Id] ASC)
);

