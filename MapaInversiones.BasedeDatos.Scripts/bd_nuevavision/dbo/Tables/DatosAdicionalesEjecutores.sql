CREATE TABLE [dbo].[DatosAdicionalesEjecutores] (
    [IdProyecto]              INT            NOT NULL,
    [CodigoBPIN]              VARCHAR (500)  NULL,
    [NitEjecutor]             NVARCHAR (15)  NOT NULL,
    [NombreEjecutor]          NVARCHAR (300) NULL,
    [NitInterventor]          NVARCHAR (15)  NULL,
    [NombreInterventor]       NVARCHAR (300) NULL,
    [FechaUltimaModificacion] DATETIME       NULL,
    [ConsecutivoCarga]        INT            NULL,
    CONSTRAINT [PK_Vista_Ejecutores] PRIMARY KEY CLUSTERED ([IdProyecto] ASC, [NitEjecutor] ASC) WITH (FILLFACTOR = 80)
);

