CREATE TABLE [dbo].[Tipologias] (
    [IdTipologia] INT           IDENTITY (1, 1) NOT NULL,
    [Tipologia]   VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Tipologias] PRIMARY KEY CLUSTERED ([IdTipologia] ASC)
);

