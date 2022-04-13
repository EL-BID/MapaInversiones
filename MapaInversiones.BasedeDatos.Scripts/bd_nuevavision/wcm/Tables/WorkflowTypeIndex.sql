CREATE TABLE [wcm].[WorkflowTypeIndex] (
    [Id]             INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]     INT            NULL,
    [WorkflowTypeId] NVARCHAR (255) NULL,
    [Name]           NVARCHAR (255) NULL,
    [IsEnabled]      BIT            NULL,
    [HasStart]       BIT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_WorkflowTypeIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

