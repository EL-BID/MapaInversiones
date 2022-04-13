CREATE TABLE [wcm].[ContainedPartIndex] (
    [Id]                INT           IDENTITY (1, 1) NOT NULL,
    [DocumentId]        INT           NULL,
    [ListContentItemId] NVARCHAR (26) NULL,
    [Order]             INT           NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ContainedPartIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

