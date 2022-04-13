CREATE TABLE [dbo].[ProduccionANH] (
    [IdProduccion]            INT             NOT NULL,
    [ProducccionFiscalizada]  DECIMAL (18)    NULL,
    [VolumenRegalia]          DECIMAL (20, 8) NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    CONSTRAINT [PK_ProduccionANH] PRIMARY KEY CLUSTERED ([IdProduccion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_ProduccionANH_Produccion] FOREIGN KEY ([IdProduccion]) REFERENCES [dbo].[Produccion] ([IdProduccion])
);

