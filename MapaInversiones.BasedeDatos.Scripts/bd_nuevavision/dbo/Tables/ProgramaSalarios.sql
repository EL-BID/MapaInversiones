CREATE TABLE [dbo].[ProgramaSalarios] (
    [FechaPresupuesto]        DATE            NULL,
    [Ejecutado]               NUMERIC (18, 2) NULL,
    [claseprograma]           INT             NULL,
    [codigoProyectoActividad] INT             NULL,
    [proyectoClasificacion]   VARCHAR (5)     NULL,
    [codigoSnip]              VARCHAR (30)    NULL,
    [objetodegasto]           INT             NULL,
    [fuente]                  INT             NULL,
    [organismoFinanciador]    INT             NULL,
    [departamento]            INT             NULL,
    [pais]                    INT             NULL,
    [CodigoNivel]             INT             NULL,
    [CodigoEntidad]           INT             NULL,
    [CodigoPrograma]          INT             NULL,
    [Anio]                    INT             NULL,
    [FechaModificacion]       DATETIME        NULL
);

