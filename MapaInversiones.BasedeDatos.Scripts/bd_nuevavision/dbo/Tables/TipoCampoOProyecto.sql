CREATE TABLE [dbo].[TipoCampoOProyecto] (
    [IdTipoCampoOProyecto]     NVARCHAR (50) NOT NULL,
    [NombreTipoCampoOProyecto] VARCHAR (250) NOT NULL,
    [FechaUltimaModificacion]  DATETIME      NOT NULL,
    [ConsecutivoCarga]         INT           NOT NULL,
    CONSTRAINT [PK_TipoCampoOProyecto] PRIMARY KEY CLUSTERED ([IdTipoCampoOProyecto] ASC) WITH (FILLFACTOR = 80)
);

