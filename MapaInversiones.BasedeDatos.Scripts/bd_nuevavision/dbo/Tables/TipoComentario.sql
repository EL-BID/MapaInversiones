CREATE TABLE [dbo].[TipoComentario] (
    [Id]             INT           IDENTITY (1, 1) NOT NULL,
    [TipoComentario] VARCHAR (100) NOT NULL,
    [Estado]         BIT           NULL,
    CONSTRAINT [PK_TipoComentario] PRIMARY KEY CLUSTERED ([Id] ASC)
);

