CREATE TABLE [stpPsgr].[PROYECTO_ACTIVIDAD_X_DISTRITO] (
    [idProyectoActividad] INT NULL,
    [idRegion]            INT NULL,
    [idDepartamento]      INT NULL,
    [idDistrito]          INT NULL,
    CONSTRAINT [FK_PROYECTO_FK_DISTRI_LOCALIZA] FOREIGN KEY ([idRegion], [idDepartamento], [idDistrito]) REFERENCES [stpPsgr].[LOCALIZACION] ([idRegion], [idDepartamento], [idDistrito]),
    CONSTRAINT [FK_PROYECTO_FK_PROY_A_PROYECTO] FOREIGN KEY ([idProyectoActividad]) REFERENCES [stpPsgr].[PROYECTO_ACTIVIDAD] ([idProyectoActividad])
);

