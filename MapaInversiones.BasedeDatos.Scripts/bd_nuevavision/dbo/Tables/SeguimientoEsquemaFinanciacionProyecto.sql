CREATE TABLE [dbo].[SeguimientoEsquemaFinanciacionProyecto] (
    [idSeguimientoEsquemaFinanciacion] INT             IDENTITY (1, 1) NOT NULL,
    [ValorReportado]                   DECIMAL (18, 2) NULL,
    [PresupuestoVigente]               DECIMAL (18, 2) NOT NULL,
    [PresupuestoObligado]              DECIMAL (18, 2) NOT NULL,
    [PresupuestoPagado]                DECIMAL (18, 2) NOT NULL,
    [Anio]                             INT             NOT NULL,
    [FechaInicioReporte]               DATETIME        NOT NULL,
    [FechaFinalReporte]                DATETIME        NOT NULL,
    [IdTipoRecurso]                    INT             NOT NULL,
    [IdTipoEntidad]                    INT             NOT NULL,
    [IdEntidad]                        VARCHAR (30)    NOT NULL,
    [idProyecto]                       INT             NOT NULL,
    [FechaUltimaModificacion]          DATETIME        NOT NULL,
    [ConsecutivoCarga]                 INT             NOT NULL,
    [ModificadoPor]                    VARCHAR (50)    NOT NULL,
    CONSTRAINT [PK_SeguimientoEsquemaFinanciacionProyecto] PRIMARY KEY CLUSTERED ([idSeguimientoEsquemaFinanciacion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_SeguimientoEsquemaFinanciacionProyecto_Fuente] FOREIGN KEY ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) REFERENCES [dbo].[Fuente] ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_SeguimientoEsquemaFinanciacionProyecto_Proyecto] FOREIGN KEY ([idProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);

