using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class RespuestaPoligonoTerritorial
    {
        public string type { get; set; }
        public string lastUpdated { get; set; }
        public Geojson geojson { get; set; }


        public bool status { get; set; }

        public string message { get; set; }

        public RespuestaPoligonoTerritorial()
        {
            type = "";
            geojson = new Geojson();
            lastUpdated = "1";
        }
    }

    public class Geojson
    {
        public string type { get; set; }
        public List<Object> features { get; set; }

        public Geojson()
        {
            features = new List<object>();
            type = "FeatureCollection";
        }
    }

    public class Feature
    {
        //public PropJ properties { get; set; }
        public Object geometry { get; set; }
        public Feature()
        {
            //properties = new PropJ()
            //{
            //    //type = "departamento" 
            //};
            //geometry = new GeometriaJ();
        }


    }

    public class GeometriaJ
    {
        public string type { get; set; }
        public string coordinates { get; set; }
        public GeometriaJ()
        {

        }
    }

    public class PropJ
    {
        //public string type { get; set; }
        public string name { get; set; }
        public string id { get; set; }
    }


}
