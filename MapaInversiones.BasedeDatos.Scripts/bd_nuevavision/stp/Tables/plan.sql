CREATE TABLE [stp].[plan] (
    [id]                  INT           NULL,
    [nombre]              VARCHAR (MAX) NULL,
    [descripcion]         VARCHAR (MAX) NULL,
    [version]             INT           NULL,
    [anho]                INT           NULL,
    [borrado]             VARCHAR (5)   NULL,
    [fecha_actualizacion] DATETIME2 (6) NULL,
    [fecha_insercion]     DATETIME2 (6) NULL,
    [usuario_responsable] VARCHAR (MAX) NULL,
    [detalle]             VARCHAR (50)  NULL,
    [entidad_responsable] INT           NULL,
    [fecha_inicio]        DATETIME2 (6) NULL,
    [fecha_fin]           DATETIME2 (6) NULL
);

