CREATE TABLE [wcm].[WorkflowTypeStartActivitiesIndex] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]        INT            NULL,
    [WorkflowTypeId]    NVARCHAR (255) NULL,
    [Name]              NVARCHAR (255) NULL,
    [IsEnabled]         BIT            NULL,
    [StartActivityId]   NVARCHAR (255) NULL,
    [StartActivityName] NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_WorkflowTypeStartActivitiesIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

