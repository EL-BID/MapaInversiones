-- =============================================
-- Author:		Jcastiblanco
-- Create date: 2020-05-24
-- Description:	se crea tabla de prioridad de ordenamiento de contratos y se agrega al sp
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerInformacionContratosRPPorFiltros]
	-- Add the parameters for the stored procedure here
	@ANNIO INT,
	@NOMBRE AS VARCHAR(100),
	@NUMEROPAGINA INT,
	@REGPORPAGINA INT,
	@NOMBREPROCESO AS VARCHAR(100),
	@NOMBREENTIDAD AS VARCHAR(100),
	@TOTALREGISTROS INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  @TOTALREGISTROS = COUNT(distinct UnidadCompra )
	FROM Vw_InformacionProcesoConYSinCodigoContratacion
		where (Anio = @ANNIO  OR @ANNIO IS NULL ) AND COVID19=2 AND
		(CONTRATISTA LIKE '%'+@NOMBRE+'%' OR @NOMBRE IS NULL)AND 
		(UNIDADCOMPRA LIKE '%'+@NOMBREENTIDAD+'%' OR @NOMBREENTIDAD IS NULL)AND 
		(DESCRIPCIONPROCESO LIKE '%'+@NOMBREPROCESO+'%' OR @NOMBREPROCESO IS NULL) 

		
   SELECT *
    FROM (SELECT DENSE_RANK() OVER (ORDER BY ORDEN,UnidadCompra) NUMBER,*
		FROM
			(Select distinct  
			     Anio
				,A.UnidadCompra
				,[EstadoProceso]
				,[CodigoContrato]
				,[CodigoProceso]
				,[tipodocumento]
				,[numerodocumento]
				,[Contratista]
				, DocURL
				,UrlResumenAdjudicacion
				,UrlInvitados
				,[FechaFirmaContrato]
				,[OfertaPeriodoDuracion]
				, [FechaPublicacion]
				,[FechaInicioContrato]
				,[FechaFinContrato]
				,ValorContrato
				,MetodoContratacion
				,CategoriaContratacion
				,[FCH_INICIO_PUBLICACION]
				,[FCH_FIN_PUBLICACION]
				,[FCH_ESTIMADA_ADJUDICACION]
				,[DescripcionContrato]
				, [DescripcionProceso]
				, COVID19
				,ISNULL(B.orden,1000) AS ORDEN
					FROM Vw_InformacionProcesoConYSinCodigoContratacion as a
					left join contratosorden as b
					on a.UnidadCompra=B.unidadcompra
					WHERE COVID19 > 0
						AND (Anio = @ANNIO  OR @ANNIO IS NULL ) 
						 AND
						(CONTRATISTA LIKE '%'+@NOMBRE+'%' OR @NOMBRE IS NULL)AND 
						(a.UNIDADCOMPRA LIKE '%'+@NOMBREENTIDAD+'%' OR @NOMBREENTIDAD IS NULL)AND 
						(DESCRIPCIONPROCESO LIKE '%'+@NOMBREPROCESO+'%' OR @NOMBREPROCESO IS NULL)	
					) TBL)TBL
    WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
	order by ORDEN,UnidadCompra, CodigoProceso
END


