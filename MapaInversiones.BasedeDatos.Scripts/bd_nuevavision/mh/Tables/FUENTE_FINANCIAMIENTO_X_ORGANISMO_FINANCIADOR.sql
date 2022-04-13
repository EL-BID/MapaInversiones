CREATE TABLE [mh].[FUENTE_FINANCIAMIENTO_X_ORGANISMO_FINANCIADOR] (
    [idFuenteFinanciamiento] INT NULL,
    [idOrganismoFinanciador] INT NULL,
    CONSTRAINT [FK_FUENTE_X_ORGANISMO] FOREIGN KEY ([idFuenteFinanciamiento]) REFERENCES [mh].[FUENTE_FINANCIAMIENTO] ([idFuenteFinanciamiento]),
    CONSTRAINT [FK_ORGANISMO_X_FUENTE] FOREIGN KEY ([idOrganismoFinanciador]) REFERENCES [mh].[ORGANISMO_FINANCIADOR] ([idOrganismoFinanciador])
);

