CREATE TABLE [wcm].[LayerMetadataIndex] (
    [Id]         INT           IDENTITY (1, 1) NOT NULL,
    [DocumentId] INT           NULL,
    [Zone]       NVARCHAR (64) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_LayerMetadataIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

