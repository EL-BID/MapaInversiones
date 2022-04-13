CREATE TABLE [stp].[indicador] (
    [id]                INT            NULL,
    [nombre]            NVARCHAR (MAX) NULL,
    [descripcion]       NVARCHAR (MAX) NULL,
    [tipo_indicador_id] INT            NULL,
    [frecuencia_meses]  INT            NULL,
    [observaciones]     NVARCHAR (MAX) NULL,
    [objetivo_id]       INT            NULL,
    [anho]              INT            NULL,
    [version]           INT            NULL,
    [nivel]             INT            NULL,
    [entidad]           INT            NULL
);

