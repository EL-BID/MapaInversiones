CREATE TABLE [dbo].[Periodicidad] (
    [IdPeriodicidad]   NVARCHAR (5)  NOT NULL,
    [NombrePeriocidad] VARCHAR (250) NOT NULL,
    [ConsecutivoCarga] INT           NOT NULL,
    CONSTRAINT [PK_Periodicidad] PRIMARY KEY CLUSTERED ([IdPeriodicidad] ASC) WITH (FILLFACTOR = 80)
);

