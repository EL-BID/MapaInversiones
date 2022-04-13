CREATE TABLE [dbo].[UnidadMedida] (
    [IdUnidadMedida]     NVARCHAR (20) NOT NULL,
    [NombreUnidadMedida] VARCHAR (250) NOT NULL,
    [ConsecutivoCarga]   INT           NOT NULL,
    CONSTRAINT [PK_UnidadMedida] PRIMARY KEY CLUSTERED ([IdUnidadMedida] ASC) WITH (FILLFACTOR = 80)
);

