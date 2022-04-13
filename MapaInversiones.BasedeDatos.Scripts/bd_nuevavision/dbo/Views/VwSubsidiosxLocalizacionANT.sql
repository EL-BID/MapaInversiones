


CREATE VIEW [dbo].[VwSubsidiosxLocalizacionANT]
as

Select IdSubsidio,
case when E.IdDepartamento='0' then replace(E.IdDepartamento,'0','00')
else E.IdDepartamento end as IdDepartamento, 
replace(E.NombreDepartamento, 'PROYECTOS NACIONALES','ASUNCION') as NombreDepartamento,
case when E.IdMunicipio='0' then replace(E.IdMunicipio,'0','0000') else E.IdMunicipio end 
as IdMunicipio, replace(E.NombreMunicipio,'NACIONALES','ASUNCION') as NombreMunicipio,
[CaracteristicaSubsidio],[TipoSubsidio] AS ClaseSubsidio,
sum(cast([ValorSubsidio] as money)) as ValorSubsidio
, sum([CantidadSubsidio]) as CantidadSubsidio
,isnull(E.Geojson,'{"geometry":{"coordinates":[[[[-57.561618,-25.228362],[-57.539848,-25.236209],[-57.528779,-25.241952],[-57.52724,-25.24436],[-57.533576,-25.250356],[-57.536349,-25.260923],[-57.542558,-25.272185],[-57.540311,-25.286101],[-57.541846,-25.29189],[-57.543786,-25.293713],[-57.543239,-25.296288],[-57.560393,-25.320226],[-57.586135,-25.341443],[-57.589484,-25.340443],[-57.590463,-25.338845],[-57.588113,-25.338017],[-57.589787,-25.335115],[-57.591882,-25.335693],[-57.593468,-25.332313],[-57.594381,-25.33282],[-57.596191,-25.330352],[-57.595719,-25.32845],[-57.597475,-25.329069],[-57.602318,-25.325545],[-57.603142,-25.326481],[-57.60785,-25.320785],[-57.609461,-25.322378],[-57.607874,-25.318393],[-57.611444,-25.31734],[-57.612213,-25.314894],[-57.615377,-25.313133],[-57.62162,-25.323524],[-57.619991,-25.325107],[-57.62134,-25.327706],[-57.633972,-25.338016],[-57.632344,-25.338401],[-57.636421,-25.349102],[-57.635287,-25.349378],[-57.636884,-25.362253],[-57.639562,-25.366885],[-57.6361,-25.369034],[-57.64208,-25.380387],[-57.646645,-25.374055],[-57.648327,-25.368403],[-57.661791,-25.35644],[-57.667835,-25.345315],[-57.667242,-25.33575],[-57.673858,-25.315799],[-57.673222,-25.290896],[-57.67094,-25.283547],[-57.665677,-25.277344],[-57.631831,-25.257116],[-57.593662,-25.241651],[-57.574556,-25.223937],[-57.561618,-25.228362]]]],"type":"MultiPolygon"***REMOVED***,"properties":{"Type":"municipio","name":"ASUNCION","id":"0000"***REMOVED***,"type":"Feature"***REMOVED***') as GeoJson

from (
SELECT CONCAT(IdNivel,IdEntidad,S.Claseprograma,IdPrograma,replace(IdActividad,0,1)) AS IdSubsidio,
cast(CASE WHEN S.CodigoDepartamento=1 AND RTRIM(LTRIM(S.NombreDepartamento))='CAPITAL'
THEN '00' 
when  S.CodigoDepartamento=1 AND RTRIM(LTRIM(S.NombreDepartamento))='ALTO PARAGUAY'
then '10' else S.[CodigoDepartamento] end as nvarchar(10)) as CodigoDepartamento,
cast(CASE WHEN S.CodigoDepartamento=1 AND RTRIM(LTRIM(S.NombreDepartamento))='CAPITAL'
THEN '0000' 
when  S.CodigoDepartamento=1 AND RTRIM(LTRIM(S.NombreDepartamento))='ALTO PARAGUAY'
then '1705' else S.[CodigoDistrito] end as nvarchar(10)) as CodigoMunicipio,
isnull([CaracteristicaSubsidio],'NO APLICA') as CaracteristicaSubsidio
,'SUBSIDIO PARA BONOS ALIMENTICIOS A FAMILIAS (Ñangareko)' as TipoSubsidio
,isnull([TipoKit],'NO APLICA') AS TipoKit,
[ValorSubsidio],[CantidadSubsidio]
  FROM [dbo].[Subsidios] S)T
  inner join [dbo].[EnteTerritorial] E
 on T.[CodigoDepartamento]=E.IdDepartamento and E.IdMunicipio=T.CodigoMunicipio
-- where CaracteristicaSubsidio NOT LIKE '%TRANSFERENCIA%'
 group by E.IdDepartamento, E.NombreDepartamento, E.IdMunicipio, E.NombreMunicipio,
[CaracteristicaSubsidio],[TipoSubsidio],E.Geojson,T.IdSubsidio

