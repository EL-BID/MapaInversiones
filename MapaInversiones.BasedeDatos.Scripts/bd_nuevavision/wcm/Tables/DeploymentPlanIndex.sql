CREATE TABLE [wcm].[DeploymentPlanIndex] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId] INT            NULL,
    [Name]       NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_DeploymentPlanIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

