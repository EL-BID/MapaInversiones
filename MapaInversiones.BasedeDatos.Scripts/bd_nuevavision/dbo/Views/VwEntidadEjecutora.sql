






CREATE VIEW [dbo].[VwEntidadEjecutora]
WITH SCHEMABINDING
AS
SELECT  EF.[IdProyecto]
										  ,EE.[IdEntidad]
										  ,EE.NombreEntidad,COUNT_BIG(*) AS COUNT
									  FROM [dbo].[EsquemaFinanciacionProyecto] EF
						 inner join [dbo].[Fuente]  EE on EF.[IdEntidad]=EE.[IdEntidad]
						 group by EF.[IdProyecto]
										  ,EE.[IdEntidad]
										  ,EE.NombreEntidad









