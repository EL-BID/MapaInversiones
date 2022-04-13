CREATE TABLE [dbo].[ObjetivoEspecifico] (
    [IdObjetivoEspecifico]     INT           NOT NULL,
    [IdProyecto]               INT           NOT NULL,
    [NombreObjetivoEspecifico] VARCHAR (MAX) NOT NULL,
    [FechaUltimaModificacion]  DATETIME      NOT NULL,
    [ConsecutivoCarga]         INT           NOT NULL,
    [Modificadopor]            VARCHAR (30)  NOT NULL,
    CONSTRAINT [PK_ObjetivoEspecifico] PRIMARY KEY CLUSTERED ([IdObjetivoEspecifico] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_ObjetivoEspecificoXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_ObjetivoEspecifico_7_1678629023__K2_K1]
    ON [dbo].[ObjetivoEspecifico]([IdProyecto] ASC, [IdObjetivoEspecifico] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_ObjetivoEspecifico_7_1678629023__K2_K1_3]
    ON [dbo].[ObjetivoEspecifico]([IdProyecto] ASC, [IdObjetivoEspecifico] ASC)
    INCLUDE([NombreObjetivoEspecifico]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_1678629023_1_2]
    ON [dbo].[ObjetivoEspecifico]([IdObjetivoEspecifico], [IdProyecto]);

