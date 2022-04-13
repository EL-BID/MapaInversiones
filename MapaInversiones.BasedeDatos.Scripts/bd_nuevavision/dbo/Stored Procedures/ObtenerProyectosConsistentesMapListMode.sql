--exec [dbo].[ObtenerProyectosConsistentesMapListMode] '','','',20,0,'','2020,2019,2018,2017,2016,2015,2014,2013,2012',0,null
CREATE PROCEDURE [dbo].[ObtenerProyectosConsistentesMapListMode]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdSector AS INT,
@IdOrgFinanciador AS INT,
@NombreProyecto AS VARCHAR(1000),
@periodosList varchar(300),
@IdEstado  AS INT,
@CuadradoVisualIntersectar geography
AS
BEGIN
SET NOCOUNT ON;

CREATE  TABLE #Periodos (
           Periodo INT
   );    
INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList


IF (@IdEstado = 0 AND @IdOrgFinanciador = 0) --Sin Filtro Estado de proyecto
	BEGIN
		SELECT  DISTINCT proy.IdProyecto, proy.NombreProyecto, proy.nombreEstado, proy.NombreActor, VlrTotalProyectoFuenteRegalias, proy.VlrTotalProyectoTodasLasFuentes 
	  FROM
	  (
		SELECT DISTINCT proy.*,E.NombreEstado, a.NombreActor
		FROM
	   VwProyectosAprobados(nolock) as proy
		  INNER JOIN ProyectoXEntidadTerritorial pxe ON pxe.IdProyecto = proy.IdProyecto
		  INNER JOIN HistoriaEstado H ON H.IDPROYECTO = proy.IDPROYECTO 
		  INNER JOIN [dbo].[Estado] E ON H.idEstado = E.idEstado and H.actualSiNo=1
		  INNER JOIN dbo.ActorXProyecto AP ON AP.IDProyecto = proy.IdProyecto and AP.IDRol=1
		  INNER JOIN  dbo.Actor a on a.IdActor = AP.IDActor  
		 ,#Periodos PER
	  WHERE Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto) 
	  AND (IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE  IdRegion = @IdRegion) OR @IdRegion =  '' OR @IdRegion IS NULL )
	  AND (IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
	  AND (IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
	  AND (IdSector = @IdSector OR @IdSector = ''  OR @IdSector IS NULL OR @IdSector = 0)
	  AND (proy.NombreProyecto COLLATE Latin1_General_CI_AI LIKE @NombreProyecto OR @NombreProyecto = ''  OR @NombreProyecto IS NULL)
	  ) AS proy	
	  ORDER BY proy.NombreProyecto
	END
ELSE IF (@IdOrgFinanciador <> 0)
		BEGIN
		SELECT DISTINCT proy.IdProyecto, proy.NombreProyecto, proy.nombreEstado, proy.NombreActor, VlrTotalProyectoFuenteRegalias, proy.VlrTotalProyectoTodasLasFuentes 
	  FROM
	  (
		SELECT DISTINCT proy.*,E.NombreEstado, a.NombreActor
		FROM
	   VwProyectosAprobados(nolock) as proy
		  INNER JOIN ProyectoXEntidadTerritorial pxe ON pxe.IdProyecto = proy.IdProyecto
		  INNER JOIN HistoriaEstado H ON H.IDPROYECTO = proy.IDPROYECTO 
		  INNER JOIN [dbo].[Estado] E ON H.idEstado = E.idEstado and H.actualSiNo=1
		  INNER JOIN dbo.ActorXProyecto AP ON AP.IDProyecto = proy.IdProyecto and AP.IDRol=1
		  INNER JOIN  dbo.Actor a on a.IdActor = AP.IDActor   
		 ,#Periodos PER
	  WHERE Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto) 
	  AND (IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE  IdRegion = @IdRegion) OR @IdRegion =  '' OR @IdRegion IS NULL )
	  AND (IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
	  AND (IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
	  AND (IdSector = @IdSector OR @IdSector = ''  OR @IdSector IS NULL OR @IdSector = 0)
	  AND (proy.NombreProyecto COLLATE Latin1_General_CI_AI LIKE @NombreProyecto OR @NombreProyecto = ''  OR @NombreProyecto IS NULL)
	  AND proy.IdProyecto in (select distinct IdProyecto from ProyectoOrganismoFinanciador WHERE IdOrganismoFinanciador=@IdOrgFinanciador)

	  ) AS proy	
	ORDER BY proy.NombreProyecto
	END
	ELSE
	BEGIN
		SELECT DISTINCT proy.IdProyecto, proy.NombreProyecto, proy.nombreEstado, proy.NombreActor, VlrTotalProyectoFuenteRegalias, proy.VlrTotalProyectoTodasLasFuentes 
			 FROM
	  (
		SELECT DISTINCT proy.*,E.NombreEstado, a.NombreActor
			FROM    dbo.Proyecto AS proy WITH (nolock) 
				INNER JOIN dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto
				INNER JOIN dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto
				INNER JOIN [dbo].[Estado] E ON he.idEstado = E.idEstado
				INNER JOIN dbo.ActorXProyecto AP ON AP.IDProyecto = proy.IdProyecto and AP.IDRol=1
				INNER JOIN  dbo.Actor a on a.IdActor = AP.IDActor    
				,#Periodos PER					
		WHERE   (he.IdEstado = @IdEstado AND (he.ActualSiNo = 1))
			AND Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto) 
			AND (IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE  IdRegion = @IdRegion) OR @IdRegion =  '' OR @IdRegion IS NULL )
			AND (IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND (IdSector = @IdSector OR @IdSector = ''  OR @IdSector IS NULL OR @IdSector = 0)		
			AND (proy.NombreProyecto COLLATE Latin1_General_CI_AI LIKE @NombreProyecto OR @NombreProyecto = ''  OR @NombreProyecto IS NULL)	
			 ) AS proy
	  ORDER BY proy.NombreProyecto
	END
 
									
DROP TABLE #Periodos

END



