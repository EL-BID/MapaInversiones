
namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class GenericEnumerators
    {
        public enum GeographicKindEnumeration
        {
            Region = 0,
            Department = 1,
            Municipality = 2,
            Default = 3
        }

        public enum FilterKindEnumeration
        {
            ProyectState = 0,
            ProyectSector =1,
            ProyectType =2,
            ProyectPeriod =3,
            ProyectOrgFinanciador = 4,
            ProyectoEntidadEjecutora = 5
        }

        public enum SearchType
        {
            Map = 0,
            List = 1
        }

        public enum SeccionFuncionalAplicativo
        {
            Comunes = 0,
            Proyectos = 1,
            Recursos = 2,
            Produccion = 3,
            Fiscalizacion = 4,
            FiscalizacionANM = 5
        }
        
    }
}