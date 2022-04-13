CREATE TABLE [wcm].[TaxonomyIndex] (
    [Id]                    INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]            INT            NULL,
    [TaxonomyContentItemId] NVARCHAR (26)  NULL,
    [ContentItemId]         NVARCHAR (26)  NULL,
    [ContentType]           NVARCHAR (255) NULL,
    [ContentPart]           NVARCHAR (255) NULL,
    [ContentField]          NVARCHAR (255) NULL,
    [TermContentItemId]     NVARCHAR (26)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TaxonomyIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IDX_TaxonomyIndex_List]
    ON [wcm].[TaxonomyIndex]([ContentType] ASC, [ContentPart] ASC, [ContentField] ASC);


GO
CREATE NONCLUSTERED INDEX [IDX_TaxonomyIndex_Search]
    ON [wcm].[TaxonomyIndex]([TermContentItemId] ASC);

