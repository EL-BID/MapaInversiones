using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public class ManejoPorcentajes
    {

        /// <summary>
        /// Devuelve el porcentaje 
        /// </summary>
        /// <param name="max">valor máximo para obtener el porcentaje</param>
        /// <param name="value">valor para el cual se obtiene el porcentaje</param>
        /// <returns>númer que representa el porcentaje en texto</returns>
        public static string ValorPorcentajeString(decimal max, decimal value)
        {
            return string.Format("{0:P2}", (value / max));
        }

    }
}
