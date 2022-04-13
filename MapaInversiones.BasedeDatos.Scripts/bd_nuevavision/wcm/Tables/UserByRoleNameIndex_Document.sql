CREATE TABLE [wcm].[UserByRoleNameIndex_Document] (
    [UserByRoleNameIndexId] INT NOT NULL,
    [DocumentId]            INT NOT NULL,
    CONSTRAINT [FK_UserByRoleNameIndex_Document_DocumentId] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    CONSTRAINT [FK_UserByRoleNameIndex_Document_Id] FOREIGN KEY ([UserByRoleNameIndexId]) REFERENCES [wcm].[UserByRoleNameIndex] ([Id])
);

