using System;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class FiltroBusquedaUbicacionGeografica
    {
        public string CodigoMunicipio { get; set; }
        public string CodigoDepartamento { get; set; }
        public string CodigoRegion { get; set; }

        
        public FiltroBusquedaUbicacionGeografica()
        {
            CodigoRegion = CodigoDepartamento = CodigoMunicipio = string.Empty;
        }

       
        public FiltroBusquedaUbicacionGeografica(Dictionary<string, string> parameters)
        {

            if (parameters.Keys.Contains("municipio"))
            {
                this.CodigoMunicipio = Convert.ToString(parameters["municipio"]);
            }
            //if (parameters.Keys.Contains("department"))
            //{
            //    this.CodigoDepartamento = Convert.ToString(parameters["department"]);
            //}
            if (parameters.Keys.Contains("departamento"))
            {
                this.CodigoDepartamento = Convert.ToString(parameters["departamento"]);
            }
            if (parameters.Keys.Contains("region"))
            {
                this.CodigoRegion = Convert.ToString(parameters["region"]);
            }
           

        }           


    }
}
