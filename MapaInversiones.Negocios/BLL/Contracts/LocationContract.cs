using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Location;

namespace PlataformaTransparencia.Negocios.BLL.Contracts
{
    public class LocationContract: RespuestaContratoBase
    {
        public ModelLocationData LocationModel { get; set; ***REMOVED***

        public LocationContract()
        {
            this.LocationModel = new ModelLocationData();
    ***REMOVED***

        public void Fill(string location_id, string type)
        {
            try
            {
                this.LocationModel = new LocationBLL().ObtenerDatosLocalizacionInicio(location_id, type);
                this.Status = true;
        ***REMOVED***
            catch (Exception ex) {
                this.Status = false;
                //LogHelper.GenerateLog(ex);
                this.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***
***REMOVED***
***REMOVED***
