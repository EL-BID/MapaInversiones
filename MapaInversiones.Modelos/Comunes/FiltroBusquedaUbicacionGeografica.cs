using System;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class FiltroBusquedaUbicacionGeografica
    {
        public string CodigoMunicipio { get; set; ***REMOVED***
        public string CodigoDepartamento { get; set; ***REMOVED***
        public string CodigoRegion { get; set; ***REMOVED***

        
        public FiltroBusquedaUbicacionGeografica()
        {
            CodigoRegion = CodigoDepartamento = CodigoMunicipio = string.Empty;
    ***REMOVED***

       
        public FiltroBusquedaUbicacionGeografica(Dictionary<string, string> parameters)
        {

            if (parameters.Keys.Contains("municipio"))
            {
                this.CodigoMunicipio = Convert.ToString(parameters["municipio"]);
        ***REMOVED***
            if (parameters.Keys.Contains("department"))
            {
                this.CodigoDepartamento = Convert.ToString(parameters["department"]);
        ***REMOVED***
            if (parameters.Keys.Contains("departamento"))
            {
                this.CodigoDepartamento = Convert.ToString(parameters["departamento"]);
        ***REMOVED***
            if (parameters.Keys.Contains("region"))
            {
                this.CodigoRegion = Convert.ToString(parameters["region"]);
        ***REMOVED***
           

    ***REMOVED***           


***REMOVED***
***REMOVED***
