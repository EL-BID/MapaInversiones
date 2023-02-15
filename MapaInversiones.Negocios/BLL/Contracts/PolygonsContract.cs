using Newtonsoft.Json.Linq;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.BLL.Polygons;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Negocios.Contracts
{
    public class PolygonsContract : RespuestaContratoBase
    {

        public ModelDataAreaPolygons ModelDataAreaPolygons { get; set; ***REMOVED***
        /// <summary>
        /// Instancia clase 
        /// </summary>
        public PolygonsContract()
        {
    ***REMOVED***
        ///// <summary>
        ///// Instancia la clase.
        ///// </summary>
        ///// <param name="parameters">Diccionario con la lista de los parametros.</param>
        //public PolygonsContract(Dictionary<string, string> parameters)
        //{
        //    this.GetAtributtes(parameters);
        //***REMOVED***

        /// <summary>
        /// Metodo que me retorna los poligonos por tipo de region
        /// </summary>
        /// <param name="geographicKindEnumeration"></param>
        public JObject Fill(GenericEnumerators.GeographicKindEnumeration GeographicKindEnumeration)
        {
            JObject result = new JObject();
            try
            {
               
                    if (GeographicKindEnumeration == GenericEnumerators.GeographicKindEnumeration.Region)
                    {
                        result = AreaPolygonBLL.GenerarPoligonosDeRegiones();
                ***REMOVED***
                    else if (GeographicKindEnumeration == GenericEnumerators.GeographicKindEnumeration.Department)
                    {
                        result = AreaPolygonBLL.GenerarPoligonosDeDepartamentos();
                ***REMOVED***
                    else
                    {
                        result = AreaPolygonBLL.GenerarPoligonosDeMunicipios();
                ***REMOVED***               
        ***REMOVED***
            catch (Exception ex)
            {
                this.Status = false;
                LogHelper.GenerateLog(ex);
                this.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
            return result;
    ***REMOVED***

        /// <summary>
        /// Recorre los parametros y los mapea a cada una de las propiedades
        /// del contrato, resuelve el tipo.
        /// </summary>
        /// <param name="parameters">Diccionario con los parametros.</param>
        private void GetAtributtes(Dictionary<string, string> parameters)
        {
            try
            {
                if (parameters.Keys.Contains("lastUpdated"))
                {
                    Secuence = Convert.ToInt32(parameters["lastUpdated"].ToString());
            ***REMOVED***
                else
                {
                    Secuence = 123456789;
            ***REMOVED***
        ***REMOVED***
            catch (Exception ex)
            {
                this.Status = false;
                LogHelper.GenerateLog(ex);
                this.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***
        private int? Secuence;
       
***REMOVED***
***REMOVED***