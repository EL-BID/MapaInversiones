-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [stpPsgr].[Update_Consulta_Objetivos_PND_STP]
AS
BEGIN
	truncate table [consulta].[Objetivos_PND_STP];

	insert into [consulta].[Objetivos_PND_STP]
	select	*
	from	[stpPsgr].[Vw_ObjetivosPND_STP];
END
