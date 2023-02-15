using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class DataCommonSections
    {
        public DataCommonSections()
        {
        }
        /// <summary>
        /// Lista que saca la informacion del datasource.
        /// </summary>
        public List<InformationSource> dataSource { get; set; }
        /// <summary>
        /// Es el numero de visitas.
        /// </summary>
        public int visitsNumber { get; set; }
    }
}
