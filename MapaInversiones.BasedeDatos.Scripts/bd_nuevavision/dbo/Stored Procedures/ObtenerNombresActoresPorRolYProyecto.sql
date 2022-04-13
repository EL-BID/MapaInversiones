-- =============================================
CREATE PROCEDURE [dbo].[ObtenerNombresActoresPorRolYProyecto]
@IdRol INT
,@IdProyecto INT
AS
BEGIN	

IF (@IdRol = 3 OR @IdRol = 4 ) --'INTERVENTOR' --Traer interventores y supervisores
	BEGIN
		SELECT Actor.NombreActor  
		,CASE WHEN Actor.IDRol = 4 THEN  'Supervisor'
			ELSE  ''
		END AS  Rol
		FROM ActorXProyecto 
		INNER JOIN Actor ON Actor.IdActor = ActorXProyecto.IDActor AND Actor.IDRol = ActorXProyecto.idrol
			AND (ActorXProyecto.IDRol = 3 OR ActorXProyecto.IDRol = 4 ) AND IdProyecto = @IdProyecto	
		ORDER BY Actor.NombreActor
	END
ELSE
	BEGIN
		SELECT Actor.NombreActor  
		,CASE WHEN Actor.IDRol = 4 THEN  'Supervisor'
			ELSE  ''
		END AS  Rol
		FROM ActorXProyecto 
		INNER JOIN Actor ON Actor.IdActor = ActorXProyecto.IDActor AND Actor.IDRol = ActorXProyecto.idrol
			AND ActorXProyecto.idrol = @IdRol AND IdProyecto = @IdProyecto	
		ORDER BY Actor.NombreActor
	END

--SELECT '' AS NombreActor, '' AS Rol


END
