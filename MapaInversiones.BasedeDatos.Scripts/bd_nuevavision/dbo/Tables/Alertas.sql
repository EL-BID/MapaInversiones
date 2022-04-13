CREATE TABLE [dbo].[Alertas] (
    [NombreAlerta] VARCHAR (75) NOT NULL,
    [Habilitada]   BIT          CONSTRAINT [DF_Table_1_Habilitada] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Alertas] PRIMARY KEY CLUSTERED ([NombreAlerta] ASC) WITH (FILLFACTOR = 80)
);

