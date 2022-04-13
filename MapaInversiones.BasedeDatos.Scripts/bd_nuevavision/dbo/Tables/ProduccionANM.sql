CREATE TABLE [dbo].[ProduccionANM] (
    [IdProduccion]             INT           NOT NULL,
    [IdTipoDeContraprestacion] INT           NOT NULL,
    [NombreDeContraprestacion] VARCHAR (250) NOT NULL,
    [FechaUltimaModificacion]  DATETIME      NOT NULL,
    [ConsecutivoCarga]         INT           NOT NULL,
    CONSTRAINT [PK_ProduccionANM] PRIMARY KEY CLUSTERED ([IdProduccion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_ProduccionANM_Produccion] FOREIGN KEY ([IdProduccion]) REFERENCES [dbo].[Produccion] ([IdProduccion])
);

