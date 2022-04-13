CREATE TABLE [dbo].[InformeAvanceFisicoProyecto] (
    [IdInformeAvanceFisico]   INT            IDENTITY (1, 1) NOT NULL,
    [IdProyecto]              INT            NOT NULL,
    [FechaInicioReporte]      DATETIME       NOT NULL,
    [FechaFinReporte]         DATETIME       NOT NULL,
    [Descripcion]             VARCHAR (4000) NULL,
    [FechaUltimaModificacion] DATETIME       NOT NULL,
    [ConsecutivoCarga]        INT            NOT NULL,
    [Modificadopor]           VARCHAR (30)   NOT NULL,
    CONSTRAINT [Pk_InformeAvanceFisicoProyecto_IdInformeAvanceFisico] PRIMARY KEY CLUSTERED ([IdInformeAvanceFisico] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_InformeAvanceFisicoProyectoXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);

