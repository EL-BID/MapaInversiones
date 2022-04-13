-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerInformacionContratosPorFiltros]
	-- Add the parameters for the stored procedure here
	@ANNIO AS INT,
	@NUMERODOCUMENTO AS VARCHAR(30),
	@NOMBRE AS VARCHAR(100),
	@NUMEROPAGINA INT,
	@REGPORPAGINA INT,
	@IDPROYECTO INT,
	@IDPROGRAMA INT,
	@COVID19 INT = NULL,
	@NOMBREPROCESO AS VARCHAR(100),
	@NOMBREENTIDAD AS VARCHAR(100),
	@TOTALREGISTROS INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  @TOTALREGISTROS = COUNT(distinct [CodigoProceso] )
		FROM Vw_InformacionProcesoConYSinCodigoContratacion
	WHERE 
		(Anio = @ANNIO  OR @ANNIO IS NULL )AND 
		(NUMERODOCUMENTO = @NUMERODOCUMENTO OR @NUMERODOCUMENTO IS NULL) AND 
		(CONTRATISTA like '%'+@NOMBRE+'%' OR @NOMBRE IS NULL)AND 
		(IDPROYECTO = @IDPROYECTO OR @IDPROYECTO IS NULL)
		AND 
		(ID_PROGRAMA = @IDPROGRAMA OR @IDPROGRAMA IS NULL)
		AND 
		(COVID19 = @COVID19 OR @COVID19 IS NULL)
		

		
   SELECT *
    FROM (SELECT DENSE_RANK() OVER (ORDER BY CodigoProceso) NUMBER,*
		FROM
			(Select distinct  
			     Anio
				,UnidadCompra
				,[EstadoProceso]
				,[CodigoContrato]
				,[CodigoProceso]
				,[tipodocumento]
				,[numerodocumento]
				,[Contratista]
				,DocURL
				,UrlResumenAdjudicacion
				,UrlInvitados
				,FechaFirmaContrato
				,[OfertaPeriodoDuracion]
				,[FechaPublicacion]
				,[FechaInicioContrato]
				,[FechaFinContrato]
				,ValorContrato
				,MetodoContratacion
				,CategoriaContratacion
				,[FCH_INICIO_PUBLICACION]
				,[FCH_FIN_PUBLICACION]
				,[FCH_ESTIMADA_ADJUDICACION]
				,REPLACE([DescripcionContrato],'´´','') as [DescripcionContrato]
				,REPLACE([DescripcionProceso],'´´','') as [DescripcionProceso]
				, COVID19
				FROM Vw_InformacionProcesoConYSinCodigoContratacion
				WHERE 
					(Anio = @ANNIO  OR @ANNIO IS NULL )AND 
					(NUMERODOCUMENTO = @NUMERODOCUMENTO OR @NUMERODOCUMENTO IS NULL) AND 
					(CONTRATISTA like '%'+@NOMBRE+'%' OR @NOMBRE IS NULL)AND 
					(IDPROYECTO = @IDPROYECTO OR @IDPROYECTO IS NULL)AND 
					(ID_PROGRAMA = @IDPROGRAMA OR @IDPROGRAMA IS NULL)
					AND  (COVID19 = @COVID19 OR @COVID19 IS NULL) 
					) TBL)TBL
    WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
END

