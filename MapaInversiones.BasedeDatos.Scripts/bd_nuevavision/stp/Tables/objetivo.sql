CREATE TABLE [stp].[objetivo] (
    [id]                  INT            NULL,
    [nombre]              NVARCHAR (MAX) NULL,
    [descripcion]         NVARCHAR (MAX) NULL,
    [tipo_objetivo_id]    INT            NULL,
    [nivel]               INT            NULL,
    [entidad]             INT            NULL,
    [tipo_presupuesto]    INT            NULL,
    [programa]            INT            NULL,
    [subprograma]         INT            NULL,
    [proyecto]            INT            NULL,
    [funcional]           INT            NULL,
    [borrado_int]         INT            NULL,
    [version]             INT            NULL,
    [anho]                INT            NULL,
    [borrado]             VARCHAR (5)    NULL,
    [fecha_actualizacion] DATETIME2 (6)  NULL,
    [fecha_insercion]     DATETIME2 (6)  NULL,
    [usuario_responsable] NVARCHAR (MAX) NULL
);

