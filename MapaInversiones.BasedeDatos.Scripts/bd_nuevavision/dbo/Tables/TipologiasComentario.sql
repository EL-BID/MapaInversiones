CREATE TABLE [dbo].[TipologiasComentario] (
    [IdTipologiaComenario] INT IDENTITY (1, 1) NOT NULL,
    [IdTipologia]          INT NOT NULL,
    [IdComentario]         INT NOT NULL,
    CONSTRAINT [PK_TipologiasComentario] PRIMARY KEY CLUSTERED ([IdTipologiaComenario] ASC),
    CONSTRAINT [FK_TipologiasComentario_Tipologias] FOREIGN KEY ([IdTipologia]) REFERENCES [dbo].[Tipologias] ([IdTipologia])
);

