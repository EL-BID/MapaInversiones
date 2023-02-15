using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class RespuestaPoligonoTerritorial
    {
        public string type { get; set; ***REMOVED***
        public string lastUpdated { get; set; ***REMOVED***
        public Geojson geojson { get; set; ***REMOVED***


        public bool status { get; set; ***REMOVED***

        public string message { get; set; ***REMOVED***

        public RespuestaPoligonoTerritorial()
        {
            type = "";
            geojson = new Geojson();
            lastUpdated = "1";
    ***REMOVED***
***REMOVED***

    public class Geojson
    {
        public string type { get; set; ***REMOVED***
        public List<Object> features { get; set; ***REMOVED***

        public Geojson()
        {
            features = new List<object>();
            type = "FeatureCollection";
    ***REMOVED***
***REMOVED***

    public class Feature
    {
        //public PropJ properties { get; set; ***REMOVED***
        public Object geometry { get; set; ***REMOVED***
        public Feature()
        {
            //properties = new PropJ()
            //{
            //    //type = "departamento" 
            //***REMOVED***;
            //geometry = new GeometriaJ();
    ***REMOVED***


***REMOVED***

    public class GeometriaJ
    {
        public string type { get; set; ***REMOVED***
        public string coordinates { get; set; ***REMOVED***
        public GeometriaJ()
        {

    ***REMOVED***
***REMOVED***

    public class PropJ
    {
        //public string type { get; set; ***REMOVED***
        public string name { get; set; ***REMOVED***
        public string id { get; set; ***REMOVED***
***REMOVED***


***REMOVED***
