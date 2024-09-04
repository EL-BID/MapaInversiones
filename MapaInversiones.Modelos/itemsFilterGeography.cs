using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Clase cuando son items de tipo geografico
    /// Hereda de itemFilters, para tomar los datos:
    /// name,value
    /// </summary>
    public class itemsFilterGeography : itemFilters
    {
        /// <summary>
        /// Objeto de tipo Depends On para generar relación entre una 
        /// entidad territorial de rango inferior y su superior
        /// </summary>
        /// <remarks>Ej: Departamento con Municipio</remarks>

        public List<DependsOn> dependsOn { get; set; }
        /// <summary>
        /// Arreglo de decimal que contiene los datos latitud y longitud
        /// de la primera coordenada
        /// </summary>
        public List<decimal> topLeft { get; set; }
        /// <summary>
        /// Arreglo de decimal que contiene los datos latitud y longitud
        /// de la segunda coordenada
        /// </summary>
        public List<decimal> bottomRight { get; set; }
    }
}
