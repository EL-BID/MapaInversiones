CREATE TABLE [dbo].[Tiempo] (
    [IdFecha]        INT           NOT NULL,
    [Fecha]          DATETIME      NOT NULL,
    [Anio]           INT           NOT NULL,
    [MesNro]         INT           NOT NULL,
    [Dia]            INT           NOT NULL,
    [AnioMesNro]     INT           NOT NULL,
    [AnioMes]        NVARCHAR (7)  NOT NULL,
    [Semestre]       NVARCHAR (10) NOT NULL,
    [MesNombre]      NVARCHAR (10) NOT NULL,
    [MesNombreCorto] NVARCHAR (3)  NOT NULL,
    [Trimestre]      INT           NOT NULL,
    CONSTRAINT [PK_Tiempo] PRIMARY KEY CLUSTERED ([IdFecha] ASC)
);

