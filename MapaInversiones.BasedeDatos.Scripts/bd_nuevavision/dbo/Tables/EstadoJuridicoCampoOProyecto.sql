CREATE TABLE [dbo].[EstadoJuridicoCampoOProyecto] (
    [IdCampoOProyecto]                   NVARCHAR (50) NOT NULL,
    [IdTipoCampoOProyecto]               NVARCHAR (50) NOT NULL,
    [IdEstadoJuridicoCampoOProyecto]     VARCHAR (5)   NOT NULL,
    [NombreEstadoJuridicoCampoOProyecto] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_EstadoJuridicoCampoOProyecto] PRIMARY KEY CLUSTERED ([IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdEstadoJuridicoCampoOProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_EstadoJuridicoCampoOProyecto_CampoOProyectoFiscalizacion] FOREIGN KEY ([IdCampoOProyecto], [IdTipoCampoOProyecto]) REFERENCES [dbo].[CampoOProyectoFiscalizacion] ([IdCampoOProyecto], [IdTipoCampoOProyecto])
);

