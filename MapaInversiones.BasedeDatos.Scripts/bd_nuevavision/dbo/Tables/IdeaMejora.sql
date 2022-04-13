CREATE TABLE [dbo].[IdeaMejora] (
    [IdeaMejoraID] INT            IDENTITY (1, 1) NOT NULL,
    [Nombre]       NVARCHAR (400) NOT NULL,
    [Email]        NVARCHAR (200) NOT NULL,
    [Fecha]        DATETIME       NOT NULL,
    [Categoria]    NVARCHAR (50)  NOT NULL,
    [Descripcion]  NTEXT          NOT NULL,
    PRIMARY KEY CLUSTERED ([IdeaMejoraID] ASC)
);

