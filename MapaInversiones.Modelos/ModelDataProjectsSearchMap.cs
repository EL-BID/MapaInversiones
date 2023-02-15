using PlataformaTransparencia.Modelos.Comunes;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Clase que representa el resultado de la busqueda en el mapa
    /// Hereda de BussinesLogicResult para tomar los datos status y mesage
    /// 3.2 [S2] Búsqueda de proyectos mapa
    /// </summary>
    public class ModelDataProjectsSearchMap : RespuestaContratoBase
    {
        public ModelDataProjectsSearchMap()
        {
            this.objects = new List<objectProjectsSearchMap>();          
           
        }

        public List<objectProjectsSearchMap> objects { get; set; }
        /// <summary>
        /// Es el valor recaudado, tener en cuenta el nivel geografico y 
        /// el periodo.
        /// </summary>
        public decimal collectedMoney { get; set; }
        /// <summary>
        /// Valor aprobado, tener en cuenta los parametros.
        /// </summary>
        public decimal approvedMoney { get; set; }
        /// <summary>
        /// Es el numero de proyectos aprobados tener en cuenta los parametros.
        /// </summary>
        public decimal approvedProjects { get; set; }
        /// <summary>
        /// Es el valor aprobado tener en cuenta los parametros.
        /// </summary>
        public decimal approvedMoneyTotal { get; set; }
        /// <summary>
        /// número total de proyectos
        /// </summary>
        public int totalProjectsNumber { get; set; }
    }
}