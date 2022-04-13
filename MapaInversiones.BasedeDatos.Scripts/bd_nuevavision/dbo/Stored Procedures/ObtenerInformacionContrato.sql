-- =============================================
-- Author:		<AND>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerInformacionContrato]
	-- Add the parameters for the stored procedure here
	@CODIGOCONTRATO AS VARCHAR(30)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

		
   SELECT *
    FROM (SELECT DENSE_RANK() OVER (ORDER BY CodigoProceso) NUMBER,*
		FROM
			(Select distinct  
			     cpcp.Anio
				,cpcp.UnidadCompra
				,w.[EstadoProceso]
				,w.[CodigoContrato]
				,w.[IdProceso] as [CodigoProceso]
				,w.[tipodocumento]
				,w.[numerodocumento]
				,w.[Contratista]
				,w.[uriProceso] as DocURL
				,w.UrlResumenAdjudicacion
				,w.UrlInvitados
				,w.[FechaPublicacion] as FechaIncioPublicacionProceso
				,cpcp.[OfertaPeriodoDuracion]
				,w.[FechaFirmaContrato] as [FechaPublicacion]
				,w.[FechaInicioContrato]
				,w.[FechaFinContrato]
				,w.ValorContrato
				,cpcp.MetodoContratacion
				,cpcp.CategoriaContratacion
				,cpcp.[FCH_INICIO_PUBLICACION]
				,cpcp.[FCH_FIN_PUBLICACION]
				,cpcp.[FCH_ESTIMADA_ADJUDICACION]
				,REPLACE(cpcp.[DescripcionContrato],'´´','') as [DescripcionContrato]
				,REPLACE(cpcp.[DescripcionProceso],'´´','') as [DescripcionProceso]
				, w.COVID19
					FROM vwContratosPerfilContratistaInformacionContratacion w
					inner join vwContratosPerfilContratosProceso cpcp
					on w.IdProceso=cpcp.IdProceso and w.codigocontrato=cpcp.codigocontrato and w.Id_Programa=cpcp.Id_Programa 
					WHERE 
						W.CodigoContrato=@CODIGOCONTRATO
					) TBL)TBL

END

