CREATE TABLE [mh].[PROYECTO_ACTIVIDAD_X_DISTRITO] (
    [idProyectoActividad] INT NULL,
    [idRegion]            INT NULL,
    [idDepartamento]      INT NULL,
    [idDistrito]          INT NULL,
    CONSTRAINT [FK_PROYECTO_FK_DISTRI_LOCALIZA] FOREIGN KEY ([idRegion], [idDepartamento], [idDistrito]) REFERENCES [mh].[LOCALIZACION] ([idRegion], [idDepartamento], [idDistrito]),
    CONSTRAINT [FK_PROYECTO_FK_PROY_A_PROYECTO] FOREIGN KEY ([idProyectoActividad]) REFERENCES [mh].[PROYECTO_ACTIVIDAD] ([idProyectoActividad])
);

