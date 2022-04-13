CREATE TABLE [dbo].[ProyeccionRecursosITEMS_20210406] (
    [IdProyeccion]            INT            IDENTITY (1, 1) NOT NULL,
    [IdItem]                  INT            NOT NULL,
    [Item]                    VARCHAR (30)   NULL,
    [IdArticulo]              INT            NOT NULL,
    [Articulo]                VARCHAR (30)   NULL,
    [DescripcionArticulo]     VARCHAR (4000) NULL,
    [PlanificadoValorUSD]     INT            NOT NULL,
    [TransferidoValorUSD]     INT            NOT NULL,
    [codigoprogramaNegocio]   INT            NOT NULL,
    [codigoProyectoActividad] INT            NOT NULL,
    [FuenteFinanciacion]      INT            NULL,
    [OrganismoFinanciador]    INT            NULL
);

