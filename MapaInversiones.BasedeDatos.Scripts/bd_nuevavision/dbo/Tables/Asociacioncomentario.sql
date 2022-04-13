CREATE TABLE [dbo].[Asociacioncomentario] (
    [IdAsociacion]   INT           IDENTITY (1, 1) NOT NULL,
    [TipoAsociacion] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Asociacioncomentario] PRIMARY KEY CLUSTERED ([IdAsociacion] ASC)
);

