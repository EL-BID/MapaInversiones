CREATE   VIEW Entidad_EstructuraPresupuestaria
as
SELECT  b.idEstructuraPresupuestaria as idEstructuraPresupuestariaEntidad
	  ,a.alturaNivel as AlturaNivelNivel
      ,a.[codigoEstructura] as idNivel
      ,a.[nombre] as nombreNivel
      ,a.[nombreCorto] as nombreCortoNivel
      ,a.[año] as anioNivel
       ,b.alturaNivel as AlturaNivelEntidad
      ,b.[codigoEstructura] as codigoEntidad
      ,b.[nombre]as nombreEntidad
      ,b.[nombreCorto]as nombreCortoEntidad
      ,b.[año]as AnioEntidad
	  ,c.sectores as SectorEntidad
  FROM [NuevaVisionPY].[stpPsgr].[ESTRUCTURA_PRESUPUESTARIA] as a
  inner join [stpPsgr].[ESTRUCTURA_PRESUPUESTARIA] as b
  on a.idEstructuraPresupuestaria=b.idPadre
  and a.[alturaNivel]=1
  and b.[alturaNivel]=2
  left join [stpPsgr].[SectoresXEstructuraPresupuestaria] as c
  on b.idEstructuraPresupuestaria=c.idEstructuraPresupuestaria
 -- where a.codigoEstructura=13
 -- and b.codigoEstructura=1
