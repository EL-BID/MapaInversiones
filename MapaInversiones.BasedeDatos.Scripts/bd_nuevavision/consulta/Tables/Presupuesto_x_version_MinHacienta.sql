CREATE TABLE [consulta].[Presupuesto_x_version_MinHacienta] (
    [IdNegocioProyecto]      VARCHAR (23)  NULL,
    [IdNegocioRubroObjetivo] VARCHAR (31)  NULL,
    [AnioPresupuesto]        INT           NOT NULL,
    [NombreEntidad]          VARCHAR (60)  NOT NULL,
    [sectores]               VARCHAR (150) NULL,
    [CodigoVersion]          INT           NULL,
    [NombreVersion]          VARCHAR (60)  NULL,
    [Presupuesto]            NUMERIC (38)  NULL
);

