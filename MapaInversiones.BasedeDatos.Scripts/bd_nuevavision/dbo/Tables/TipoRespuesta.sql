CREATE TABLE [dbo].[TipoRespuesta] (
    [Id]            INT          IDENTITY (1, 1) NOT NULL,
    [TipoRespuesta] VARCHAR (50) NULL,
    CONSTRAINT [PK_TipoRespuesta] PRIMARY KEY CLUSTERED ([Id] ASC)
);

