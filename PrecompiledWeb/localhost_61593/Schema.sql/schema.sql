USE [DrawingGen]
GO

/****** Object:  Table [dbo].[tbl_Log_Activity]    Script Date: 26-10-2026 00:59:31 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_Log_Activity](
	[ActivityID] [int] IDENTITY(1,1) NOT NULL,
	[AppName] [varchar](100) NULL,
	[ActivityUser] [varchar](100) NULL,
	[ActivityDate] [datetime] NULL,
	[ActivityType] [varchar](20) NULL,
	[ActivityDetails] [varchar](1000) NULL,
	[OrginServer] [varchar](100) NULL,
	[QueueRequestID] [int] NULL
) ON [PRIMARY]
GO


USE [DrawingGen]
GO

/****** Object:  Table [dbo].[tbl_dwgGen_RequestQueue]    Script Date: 26-10-2026 01:22:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_dwgGen_RequestQueue](
	[requestID] [int] IDENTITY(1,1) NOT NULL,
	[requesterUserName] [varchar](100) NOT NULL,
	[requesterCompany] [nvarchar](100) NULL,
	[requesterEmail] [varchar](100) NULL,
	[SalesRepName] [nvarchar](100) NULL,
	[SalesRepCompany] [nvarchar](100) NULL,
	[SalesRepEmail] [nvarchar](100) NULL,
	[DrawingFormat] [nvarchar](70) NULL,
	[masterJSON] [nvarchar](max) NULL,
	[statusID] [int] NULL,
	[fileNameBase] [nvarchar](100) NULL,
	[jobRequestType] [nvarchar](100) NULL,
	[salesOrderNumber] [nvarchar](100) NULL,
	[quoteNumber] [nvarchar](100) NULL,
	[projectName] [nvarchar](100) NULL,
	[customerName] [nvarchar](100) NULL,
	[dateAddedToQueue] [datetime] NULL,
	[DWGGenServerName] [varchar](200) NULL,
	[dateDWGGenStarted] [datetime] NULL,
	[dateDWGGenAllCompleted] [datetime] NULL,
	[dateSAPFirstFileReceived] [datetime] NULL,
	[dateSAPFileAllCompleted] [datetime] NULL,
	[dateEmailSent] [datetime] NULL,
	[dateDWGGenFailed] [datetime] NULL,
	[SourceID] [int] NULL,
	[dateTactonUploadStarted] [datetime] NULL,
	[dateTactonUploadCompleted] [datetime] NULL,
	[dateTactonUploadFailed] [datetime] NULL,
	[tactonConfiguredProductId] [nvarchar](100) NULL,
	[tactonConfiguredProductStrong] [nvarchar](100) NULL,
	[tactonSolutionId] [nvarchar](100) NULL,
	[tactonDrawingId] [nvarchar](100) NULL,
	[tactonWorkflowStateID] [nvarchar](10) NULL,
	[tactonTransitionStatus] [varchar](20) NULL,
	[tactonTicketNo] [nvarchar](100) NULL,
 CONSTRAINT [PK_RequestQueue] PRIMARY KEY CLUSTERED 
(
	[requestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


USE [DrawingGen]
GO

/****** Object:  Table [dbo].[tbl_Log_Email]    Script Date: 26-10-2026 01:23:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_Log_Email](
	[emailLogID] [int] IDENTITY(1,1) NOT NULL,
	[AppName] [varchar](100) NULL,
	[emailFrom] [varchar](100) NULL,
	[emailTo] [varchar](2000) NULL,
	[emailCC] [varchar](2000) NULL,
	[emailBCC] [varchar](500) NULL,
	[emailSubject] [varchar](500) NULL,
	[emailBody] [nvarchar](max) NULL,
	[emailSentDate] [datetime] NULL,
	[emailHost] [varchar](100) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


USE [DrawingGen]
GO

/****** Object:  View [dbo].[vw_Dashboard_Order]    Script Date: 26-10-2026 01:24:28 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE   VIEW [dbo].[vw_Dashboard_Order] AS
SELECT
    requestID,
    CAST(dateAddedToQueue AS date) AS ReceivedDate,
    ISNULL(requesterCompany, 'Unknown') AS RequesterCompany,
    requesterUserName AS Requester,
    CASE WHEN dateDWGGenFailed IS NOT NULL THEN 'Failed'
         WHEN dateDWGGenAllCompleted IS NOT NULL THEN 'Completed'
         ELSE 'In Progress' END AS Status
FROM dbo.tbl_dwgGen_RequestQueue
WHERE jobRequestType = 'Order' AND dateAddedToQueue IS NOT NULL;
GO


USE [DrawingGen]
GO

/****** Object:  View [dbo].[vw_Dashboard_Quote]    Script Date: 26-10-2026 01:24:50 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE   VIEW [dbo].[vw_Dashboard_Quote] AS
SELECT
    requestID,
    CAST(dateAddedToQueue AS date) AS ReceivedDate,
    ISNULL(requesterCompany, 'Unknown') AS RequesterCompany,
    requesterUserName AS Requester,
    CASE WHEN dateDWGGenFailed IS NOT NULL THEN 'Failed'
         WHEN dateDWGGenAllCompleted IS NOT NULL THEN 'Completed'
         ELSE 'In Progress' END AS Status
FROM dbo.tbl_dwgGen_RequestQueue
WHERE jobRequestType = 'Quote' AND dateAddedToQueue IS NOT NULL;
GO


