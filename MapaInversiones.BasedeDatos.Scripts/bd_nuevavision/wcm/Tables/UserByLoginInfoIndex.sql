CREATE TABLE [wcm].[UserByLoginInfoIndex] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]    INT            NULL,
    [LoginProvider] NVARCHAR (255) NULL,
    [ProviderKey]   NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserByLoginInfoIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

