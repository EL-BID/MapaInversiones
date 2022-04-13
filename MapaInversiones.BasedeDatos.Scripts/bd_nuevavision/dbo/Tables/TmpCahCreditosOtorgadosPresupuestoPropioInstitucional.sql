CREATE TABLE [dbo].[TmpCahCreditosOtorgadosPresupuestoPropioInstitucional] (
    [Fuente]                            NVARCHAR (50)  NOT NULL,
    [FondoTipo]                         NVARCHAR (100) NOT NULL,
    [DistribucionGerencia]              NVARCHAR (50)  NOT NULL,
    [DistribucionCodigoDelDepartamento] VARCHAR (20)   NOT NULL,
    [DistribucionDepartamento]          NVARCHAR (50)  NOT NULL,
    [DistribucionSucursal]              NVARCHAR (50)  NOT NULL,
    [Sector]                            NVARCHAR (50)  NOT NULL,
    [Nuevo]                             TINYINT        NULL,
    [Viejo]                             TINYINT        NULL,
    [Importe]                           INT            NULL,
    [filesource]                        NVARCHAR (100) NOT NULL,
    [id]                                INT            IDENTITY (1, 1) NOT NULL,
    [codigoprogramaNegocio]             INT            NULL,
    [CodigoProyecto]                    INT            NULL,
    [FechaCargue]                       DATETIME       NOT NULL
);

