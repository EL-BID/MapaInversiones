CREATE TABLE [wcm].[OpenIdScopeByResourceIndex_Document] (
    [OpenIdScopeByResourceIndexId] INT NOT NULL,
    [DocumentId]                   INT NOT NULL,
    CONSTRAINT [FK_OpenIdScopeByResourceIndex_Document_DocumentId] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    CONSTRAINT [FK_OpenIdScopeByResourceIndex_Document_Id] FOREIGN KEY ([OpenIdScopeByResourceIndexId]) REFERENCES [wcm].[OpenIdScopeByResourceIndex] ([Id])
);

