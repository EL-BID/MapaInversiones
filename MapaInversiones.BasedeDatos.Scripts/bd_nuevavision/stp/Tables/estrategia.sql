CREATE TABLE [stp].[estrategia] (
    [id]                   INT           NULL,
    [nombre]               VARCHAR (MAX) NULL,
    [descripcion]          VARCHAR (MAX) NULL,
    [version]              INT           NULL,
    [anho]                 INT           NULL,
    [borrado]              VARCHAR (5)   NULL,
    [fecha_actualizacion]  DATETIME2 (6) NULL,
    [fecha_insercion]      DATETIME2 (6) NULL,
    [usuario_responsable]  VARCHAR (MAX) NULL,
    [numero_fila]          INT           NULL,
    [eje_estrategico_id]   INT           NULL,
    [linea_transversal_id] INT           NULL,
    [plan]                 INT           NULL,
    [id_aud]               INT           NULL
);

