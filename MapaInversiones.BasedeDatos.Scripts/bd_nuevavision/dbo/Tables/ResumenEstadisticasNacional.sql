CREATE TABLE [dbo].[ResumenEstadisticasNacional] (
    [id]                INT            IDENTITY (1, 1) NOT NULL,
    [RutaIcono]         VARCHAR (MAX)  NOT NULL,
    [ConsultaSQL]       VARCHAR (MAX)  NOT NULL,
    [Descripcion]       VARCHAR (1000) NOT NULL,
    [SeccionAplicativo] VARCHAR (250)  NOT NULL,
    CONSTRAINT [PK_ResumenEstadisticasNacional] PRIMARY KEY CLUSTERED ([id] ASC) WITH (FILLFACTOR = 80)
);

