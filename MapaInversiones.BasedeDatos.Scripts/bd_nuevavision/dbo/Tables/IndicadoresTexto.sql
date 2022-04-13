CREATE TABLE [dbo].[IndicadoresTexto] (
    [CodigoIndicador] INT            NOT NULL,
    [Texto]           NVARCHAR (500) NULL,
    [Negrilla]        NVARCHAR (500) NOT NULL,
    CONSTRAINT [PK_IndicadoresTexto] PRIMARY KEY CLUSTERED ([CodigoIndicador] ASC) WITH (FILLFACTOR = 80)
);

