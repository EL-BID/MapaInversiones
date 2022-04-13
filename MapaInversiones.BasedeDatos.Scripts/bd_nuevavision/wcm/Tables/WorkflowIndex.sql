CREATE TABLE [wcm].[WorkflowIndex] (
    [Id]             INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]     INT            NULL,
    [WorkflowTypeId] NVARCHAR (255) NULL,
    [WorkflowId]     NVARCHAR (255) NULL,
    [WorkflowStatus] NVARCHAR (255) NULL,
    [CreatedUtc]     DATETIME       NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_WorkflowIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

