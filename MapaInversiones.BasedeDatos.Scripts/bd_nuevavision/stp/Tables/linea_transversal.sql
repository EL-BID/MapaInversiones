CREATE TABLE [stp].[linea_transversal] (
    [id]                  INT           NULL,
    [nombre]              VARCHAR (MAX) NULL,
    [descripcion]         VARCHAR (MAX) NULL,
    [version]             INT           NULL,
    [anho]                INT           NULL,
    [borrado]             VARCHAR (5)   NULL,
    [fecha_actualizacion] DATETIME2 (6) NULL,
    [fecha_insercion]     DATETIME2 (6) NULL,
    [usuario_responsable] VARCHAR (MAX) NULL,
    [plan_id]             INT           NULL
);

