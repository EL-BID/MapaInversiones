CREATE TABLE [stp].[Indicadores_Excel] (
    [id]                        INT           IDENTITY (1, 1) NOT NULL,
    [cod_eje_estrategico]       INT           NULL,
    [cod_objt_estrategico]      INT           NULL,
    [cod_objt_especifico]       INT           NULL,
    [id_objt_especifico]        INT           NULL,
    [Indicador]                 VARCHAR (255) NULL,
    [Unidad/Escala de medición] VARCHAR (255) NULL,
    [año]                       FLOAT (53)    NULL,
    [Valor]                     FLOAT (53)    NULL,
    [Meta 2023]                 FLOAT (53)    NULL,
    [Meta 2030]                 FLOAT (53)    NULL
);

