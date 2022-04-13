CREATE TABLE [dbo].[CampoOProyecto] (
    [IdCampoOProyecto]        NVARCHAR (50) NOT NULL,
    [IdTipoCampoOProyecto]    NVARCHAR (50) NOT NULL,
    [NombreCampoOProyecto]    VARCHAR (250) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    CONSTRAINT [PK_CampoOProyecto] PRIMARY KEY CLUSTERED ([IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_CampoOProyecto_TipoCampoOProyecto] FOREIGN KEY ([IdTipoCampoOProyecto]) REFERENCES [dbo].[TipoCampoOProyecto] ([IdTipoCampoOProyecto])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CampoOProyecto_6_34099162__K3_K1]
    ON [dbo].[CampoOProyecto]([NombreCampoOProyecto] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Titulo Minero o Pozo Petrolifero', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'CampoOProyecto', @level2type = N'COLUMN', @level2name = N'IdTipoCampoOProyecto';

