-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [stpPsgr].[Update_Consulta_Presupuesto_x_Sector_STP]
AS
BEGIN
	truncate table [consulta].[Presupuesto_x_Sector_STP];

	insert into [consulta].[Presupuesto_x_Sector_STP]
	select	*
	from	[stpPsgr].[Vw_Presupuesto_x_Sector_STP];
END
