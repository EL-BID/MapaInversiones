CREATE TABLE [dbo].[HistoriaEstado] (
    [idHistoriaEstado]        INT          IDENTITY (1, 1) NOT NULL,
    [IdProyecto]              INT          NOT NULL,
    [IdEstado]                INT          NOT NULL,
    [FechaRegistro]           DATETIME     NOT NULL,
    [ActualSiNo]              BIT          NOT NULL,
    [IdFase]                  INT          NOT NULL,
    [IdEtapa]                 INT          NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [Modificadopor]           VARCHAR (30) NOT NULL,
    CONSTRAINT [PK_HistoriaEstado_1] PRIMARY KEY CLUSTERED ([idHistoriaEstado] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_HistoriaEstado_Fase] FOREIGN KEY ([IdFase]) REFERENCES [dbo].[Fase] ([IdFase]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_HistoriaEstadoXEstado] FOREIGN KEY ([IdEstado]) REFERENCES [dbo].[Estado] ([IdEstado]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_HistoriaEstadoXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_HistoriaEstado_19_1582628681__K4]
    ON [dbo].[HistoriaEstado]([FechaRegistro] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_HistoriaEstado_19_1582628681__K5_K3_K2]
    ON [dbo].[HistoriaEstado]([ActualSiNo] ASC, [IdEstado] ASC, [IdProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_HistoriaEstado_25_1582628681__K5_K2_K1_K3]
    ON [dbo].[HistoriaEstado]([ActualSiNo] ASC, [IdProyecto] ASC, [idHistoriaEstado] ASC, [IdEstado] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_HistoriaEstado_12_1013578649__K2_K5_K1_3_4_6_7_8_9_10_1771]
    ON [dbo].[HistoriaEstado]([IdProyecto] ASC, [ActualSiNo] ASC, [idHistoriaEstado] ASC)
    INCLUDE([IdEstado], [FechaRegistro], [IdFase], [IdEtapa], [FechaUltimaModificacion], [ConsecutivoCarga], [Modificadopor]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_1582628681_1_3]
    ON [dbo].[HistoriaEstado]([idHistoriaEstado], [IdEstado]);


GO
CREATE STATISTICS [_dta_stat_1582628681_2_1]
    ON [dbo].[HistoriaEstado]([IdProyecto], [idHistoriaEstado]);


GO
CREATE STATISTICS [_dta_stat_1582628681_2_5]
    ON [dbo].[HistoriaEstado]([IdProyecto], [ActualSiNo]);


GO
CREATE STATISTICS [_dta_stat_1582628681_5_1_2]
    ON [dbo].[HistoriaEstado]([ActualSiNo], [idHistoriaEstado], [IdProyecto]);


GO
CREATE STATISTICS [_dta_stat_1013578649_2_3]
    ON [dbo].[HistoriaEstado]([IdProyecto], [IdEstado]);

