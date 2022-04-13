CREATE TABLE [wcm].[WorkflowBlockingActivitiesIndex] (
    [Id]                    INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]            INT            NULL,
    [ActivityId]            NVARCHAR (255) NULL,
    [ActivityName]          NVARCHAR (255) NULL,
    [ActivityIsStart]       BIT            NULL,
    [WorkflowTypeId]        NVARCHAR (255) NULL,
    [WorkflowId]            NVARCHAR (255) NULL,
    [WorkflowCorrelationId] NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_WorkflowBlockingActivitiesIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

