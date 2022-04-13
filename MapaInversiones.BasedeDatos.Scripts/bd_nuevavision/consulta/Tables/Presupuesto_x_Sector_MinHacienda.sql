CREATE TABLE [consulta].[Presupuesto_x_Sector_MinHacienda] (
    [IdNegocioProyecto]       VARCHAR (23)    NULL,
    [IdNegocioRubroObjetivo]  VARCHAR (31)    NULL,
    [AnioPresupuesto]         INT             NOT NULL,
    [Nivel]                   VARCHAR (60)    NOT NULL,
    [NombreEntidad]           VARCHAR (60)    NOT NULL,
    [sectores]                VARCHAR (150)   NULL,
    [Clasificacion]           VARCHAR (30)    NULL,
    [NombrePrograma]          NVARCHAR (60)   NULL,
    [NombreSubPrograma]       NVARCHAR (60)   NULL,
    [NombreProyectoActividad] NVARCHAR (60)   NULL,
    [CodigoVersion]           INT             NULL,
    [NombreVersion]           VARCHAR (60)    NULL,
    [CodigoFuente]            INT             NULL,
    [CodigoObjetivo]          INT             NULL,
    [Presupuesto]             NUMERIC (15)    NULL,
    [Avance]                  NUMERIC (18, 2) NULL
);

