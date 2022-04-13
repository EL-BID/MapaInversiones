CREATE TABLE [dbo].[CampoOProyectoFiscalizacion] (
    [IdCampoOProyecto]        NVARCHAR (50) NOT NULL,
    [IdTipoCampoOProyecto]    NVARCHAR (50) NOT NULL,
    [NombreCampoOProyecto]    VARCHAR (250) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    CONSTRAINT [PK_CampoOProyectoFiscalizacion] PRIMARY KEY CLUSTERED ([IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_CampoOProyectoFiscalizacion_TipoCampoOProyecto] FOREIGN KEY ([IdTipoCampoOProyecto]) REFERENCES [dbo].[TipoCampoOProyecto] ([IdTipoCampoOProyecto])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CampoOProyectoFiscalizacion_6_1131151075__K3]
    ON [dbo].[CampoOProyectoFiscalizacion]([NombreCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CampoOProyectoFiscalizacion_6_1291151645__K2_K1_K3]
    ON [dbo].[CampoOProyectoFiscalizacion]([IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC, [NombreCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CampoOProyectoFiscalizacion_6_1291151645__K2_K1]
    ON [dbo].[CampoOProyectoFiscalizacion]([IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_1131151075_3_1]
    ON [dbo].[CampoOProyectoFiscalizacion]([NombreCampoOProyecto], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_1291151645_3_2_1]
    ON [dbo].[CampoOProyectoFiscalizacion]([NombreCampoOProyecto], [IdTipoCampoOProyecto], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_1291151645_5_2_1]
    ON [dbo].[CampoOProyectoFiscalizacion]([ConsecutivoCarga], [IdTipoCampoOProyecto], [IdCampoOProyecto]);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Titulo Minero o Pozo Petrolifero', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'CampoOProyectoFiscalizacion', @level2type = N'COLUMN', @level2name = N'IdTipoCampoOProyecto';

