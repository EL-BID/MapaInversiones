CREATE TABLE [dbo].[Opciones] (
    [Variable] VARCHAR (150)  NOT NULL,
    [Valor]    NVARCHAR (150) NOT NULL,
    CONSTRAINT [PK_Opciones] PRIMARY KEY CLUSTERED ([Variable] ASC) WITH (FILLFACTOR = 80)
);

