CREATE TABLE [wcm].[ContentItemIndex] (
    [Id]                   INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]           INT            NULL,
    [ContentItemId]        NVARCHAR (26)  NULL,
    [ContentItemVersionId] NVARCHAR (26)  NULL,
    [Latest]               BIT            NULL,
    [Published]            BIT            NULL,
    [ContentType]          NVARCHAR (255) NULL,
    [ModifiedUtc]          DATETIME       NULL,
    [PublishedUtc]         DATETIME       NULL,
    [CreatedUtc]           DATETIME       NULL,
    [Owner]                NVARCHAR (255) NULL,
    [Author]               NVARCHAR (255) NULL,
    [DisplayText]          NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ContentItemIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

