CREATE TABLE [dbo].[EsquemaFinanciacionProyecto] (
    [IdEsquemaFinanciacion]   INT             IDENTITY (1, 1) NOT NULL,
    [IdProyecto]              INT             NOT NULL,
    [ValorAprobado]           DECIMAL (18, 2) NOT NULL,
    [IdTipoRecurso]           INT             NOT NULL,
    [IdTipoEntidad]           INT             NOT NULL,
    [IdEntidad]               VARCHAR (30)    NOT NULL,
    [FechaInicioVigencia]     DATETIME        NOT NULL,
    [FechaFinalVigencia]      DATETIME        NOT NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    [Modificadopor]           VARCHAR (30)    NOT NULL,
    [IdDepartamento]          VARCHAR (10)    NULL,
    [IdMunicipio]             VARCHAR (10)    NULL,
    [IdEtapa]                 INT             NOT NULL,
    CONSTRAINT [Pk_EsquemaFinanciacionProyecto_IdEsquemaFinanciacion] PRIMARY KEY CLUSTERED ([IdEsquemaFinanciacion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_EsquemaFinanciacionProyecto_Etapa] FOREIGN KEY ([IdEtapa]) REFERENCES [dbo].[Etapa] ([IdEtapa]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_EsquemaFinanciacionProyecto_Fuente] FOREIGN KEY ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) REFERENCES [dbo].[Fuente] ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_EsquemaFinanciacionProyectoXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [ix_procesos_EsquemaFinanciacionProyecto]
    ON [dbo].[EsquemaFinanciacionProyecto]([IdProyecto] ASC);

