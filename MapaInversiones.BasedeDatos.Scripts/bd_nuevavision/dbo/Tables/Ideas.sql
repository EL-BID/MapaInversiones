CREATE TABLE [dbo].[Ideas] (
    [IdIdea]           INT           IDENTITY (1, 1) NOT NULL,
    [fechaCreacion]    DATETIME      NOT NULL,
    [titulo]           VARCHAR (MAX) NULL,
    [descripcioncorta] VARCHAR (MAX) NULL,
    [descripcion]      VARCHAR (MAX) NULL,
    [urlimagen]        VARCHAR (MAX) NULL,
    CONSTRAINT [PK_Idea] PRIMARY KEY CLUSTERED ([IdIdea] ASC)
);

