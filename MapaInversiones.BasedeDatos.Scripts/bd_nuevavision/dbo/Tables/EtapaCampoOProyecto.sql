CREATE TABLE [dbo].[EtapaCampoOProyecto] (
    [IdCampoOProyecto]          NVARCHAR (50) NOT NULL,
    [IdTipoCampoOProyecto]      NVARCHAR (50) NOT NULL,
    [IdEtapaCampoOProyecto]     INT           NOT NULL,
    [NombreEtapaCampoOProyecto] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_EtapaCampoOProyecto] PRIMARY KEY CLUSTERED ([IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdEtapaCampoOProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_EtapaCampoOProyecto_CampoOProyectoFiscalizacion] FOREIGN KEY ([IdCampoOProyecto], [IdTipoCampoOProyecto]) REFERENCES [dbo].[CampoOProyectoFiscalizacion] ([IdCampoOProyecto], [IdTipoCampoOProyecto]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EtapaCampoOProyecto_5_967674495__K1_K2_K3]
    ON [dbo].[EtapaCampoOProyecto]([IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdEtapaCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EtapaCampoOProyecto_5_967674495__K3_K1_K2]
    ON [dbo].[EtapaCampoOProyecto]([IdEtapaCampoOProyecto] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_967674495_3_4_2]
    ON [dbo].[EtapaCampoOProyecto]([IdEtapaCampoOProyecto], [NombreEtapaCampoOProyecto], [IdTipoCampoOProyecto]);

