CREATE TABLE [dbo].[TipoContraprestacion] (
    [IdTipoContraprestacion]     NVARCHAR (50) NOT NULL,
    [NombreTipoContraprestacion] VARCHAR (300) NULL,
    [ConsecutivoCarga]           INT           NOT NULL,
    CONSTRAINT [PK_TipoContraprestacion] PRIMARY KEY CLUSTERED ([IdTipoContraprestacion] ASC) WITH (FILLFACTOR = 80)
);

