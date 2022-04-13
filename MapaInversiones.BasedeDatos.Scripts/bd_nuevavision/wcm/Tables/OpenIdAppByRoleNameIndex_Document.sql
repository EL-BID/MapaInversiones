CREATE TABLE [wcm].[OpenIdAppByRoleNameIndex_Document] (
    [OpenIdAppByRoleNameIndexId] INT NOT NULL,
    [DocumentId]                 INT NOT NULL,
    CONSTRAINT [FK_OpenIdAppByRoleNameIndex_Document_DocumentId] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    CONSTRAINT [FK_OpenIdAppByRoleNameIndex_Document_Id] FOREIGN KEY ([OpenIdAppByRoleNameIndexId]) REFERENCES [wcm].[OpenIdAppByRoleNameIndex] ([Id])
);

