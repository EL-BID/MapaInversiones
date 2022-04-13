CREATE TABLE [wcm].[AliasPartIndex] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]    INT            NULL,
    [Alias]         NVARCHAR (767) NULL,
    [ContentItemId] NVARCHAR (26)  NULL,
    [Latest]        BIT            DEFAULT ((0)) NULL,
    [Published]     BIT            DEFAULT ((1)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AliasPartIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

