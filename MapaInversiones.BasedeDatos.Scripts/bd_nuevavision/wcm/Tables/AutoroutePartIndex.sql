CREATE TABLE [wcm].[AutoroutePartIndex] (
    [Id]                     INT             IDENTITY (1, 1) NOT NULL,
    [DocumentId]             INT             NULL,
    [ContentItemId]          NVARCHAR (26)   NULL,
    [ContainedContentItemId] NVARCHAR (26)   NULL,
    [JsonPath]               NVARCHAR (MAX)  NULL,
    [Path]                   NVARCHAR (1024) NULL,
    [Published]              BIT             NULL,
    [Latest]                 BIT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AutoroutePartIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

