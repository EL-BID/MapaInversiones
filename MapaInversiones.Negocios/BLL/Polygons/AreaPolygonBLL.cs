using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;
using PlataformaTransparencia.Infrastructura.DataModels;
using System.Linq;
using LinqToDB;
using LinqToDB.Common;

namespace PlataformaTransparencia.Negocios.BLL.Polygons
{
    public class AreaPolygonBLL
    {
        private static TransparenciaDB DataModel;

        public AreaPolygonBLL (TransparenciaDB connection)
        {
            DataModel = connection;
        }

        public static JObject GenerarPoligonosDeDepartamentos()
        {
            string nombreTipoEnteRepresentaMunicipio = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaDpto;
            List<string> entes = new List<string>();

            StringBuilder jSonString = new StringBuilder();
            jSonString.Append("{ ");
            jSonString.Append("\"status\":true,");
            jSonString.Append("\"lastUpdated\":1234567890,");
            jSonString.Append("\"type\":\"departamento\",");
            jSonString.Append("\"geojson\":{");
            jSonString.Append("\"type\":\"FeatureCollection\",");
            jSonString.Append("\"features\":[");

                entes = (from ente in DataModel.EnteTerritorials
                     where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaMunicipio.ToUpper())
                         select ente.Geojson).ToList();

            bool primerRegistro = true;
            string Bogota = string.Empty;
            foreach (string municipioJson in entes) {
                if (primerRegistro)
                    primerRegistro = false;
                else
                    jSonString.Append(",");
                if (municipioJson.Contains("BOGOTA, D.C.")) {
                    Bogota = municipioJson;
                    jSonString.Remove(jSonString.Length - 1, 1);
                }
                else
                    jSonString.Append(municipioJson);
            }
            jSonString.Append(",");
            jSonString.Append(Bogota);
            jSonString.Append("]}}");

            JObject objReturn = JObject.Parse(jSonString.ToString());
            return objReturn;
        }

        public static JObject GenerarPoligonosDeRegiones()
        {
            string nombreTipoEnteRepresentaMunicipio = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaRegion;
            List<string> entes = new List<string>();

            StringBuilder jSonString = new StringBuilder();
            jSonString.Append("{ ");
            jSonString.Append("\"status\":true,");
            jSonString.Append("\"lastUpdated\":1234567890,");
            jSonString.Append("\"type\":\"region\",");
            jSonString.Append("\"geojson\":{");
            jSonString.Append("\"type\":\"FeatureCollection\",");
            jSonString.Append("\"features\":[");


            using (var context = new TransparenciaDB()) {
                entes = (from ente in context.EnteTerritorials
                         where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaMunicipio.ToUpper())
                         select ente.Geojson).ToList();
            }
            bool primerRegistro = true;
            foreach (string municipioJson in entes) {
                if (primerRegistro)
                    primerRegistro = false;
                else
                    jSonString.Append(",");
                jSonString.Append(municipioJson);
            }

            jSonString.Append("]}}");

            JObject objReturn = JObject.Parse(jSonString.ToString());
            return objReturn;
        }

        public static JObject GenerarPoligonosDeMunicipios()
        {
            string nombreTipoEnteRepresentaMunicipio = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaMunicipio;
            List<string> entes = new List<string>();

            StringBuilder jSonString = new StringBuilder();
            jSonString.Append("{ ");
            jSonString.Append("\"status\":true,");
            jSonString.Append("\"lastUpdated\":1234567890,");
            jSonString.Append("\"type\":\"municipio\",");
            jSonString.Append("\"geojson\":{");
            jSonString.Append("\"type\":\"FeatureCollection\",");
            jSonString.Append("\"features\":[");


            using (var context = new TransparenciaDB()) {
                entes = (from ente in context.EnteTerritorials
                         where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaMunicipio.ToUpper())
                         select ente.Geojson).ToList();
            }
            bool primerRegistro = true;
            foreach (string municipioJson in entes) {
                if (primerRegistro)
                    primerRegistro = false;
                else
                    jSonString.Append(",");
                jSonString.Append(municipioJson);
            }

            jSonString.Append("]}}");

            JObject objReturn = JObject.Parse(jSonString.ToString());
            return objReturn;


        }



    }

}
