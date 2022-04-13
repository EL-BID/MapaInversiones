-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [stpPsgr].[Update_Consulta_PND_x_Indicadores_Meta_Avance]
AS
BEGIN
	truncate table [consulta].[PND_x_Indicadores_Meta_Avance_STP];

	insert into [consulta].[PND_x_Indicadores_Meta_Avance_STP]
	select	*
	from	[stpPsgr].[Vw_PND_x_Indicadores_Meta_Avance];
END
