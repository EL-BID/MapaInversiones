CREATE TABLE [consulta].[ODS_MinHacienda] (
    [IdNegocioProyecto] VARCHAR (19)   NULL,
    [codNivelEntidad]   VARCHAR (7)    NULL,
    [AnioPresupuesto]   INT            NULL,
    [CodigoODS]         INT            NULL,
    [NombreODS]         VARCHAR (4000) NULL
);


GO
CREATE CLUSTERED COLUMNSTORE INDEX [ClusterIndexODSMinHac]
    ON [consulta].[ODS_MinHacienda];

