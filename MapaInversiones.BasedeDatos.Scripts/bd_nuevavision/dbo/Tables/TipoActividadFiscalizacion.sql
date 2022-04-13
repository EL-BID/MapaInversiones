CREATE TABLE [dbo].[TipoActividadFiscalizacion] (
    [Id]     NVARCHAR (50) NOT NULL,
    [Nombre] VARCHAR (250) NOT NULL,
    CONSTRAINT [PK_TipoActividadFiscalizacion] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 80)
);

