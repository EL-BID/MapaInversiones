using PlataformaTransparencia.Modelos.Location;
using System;
using System.Collections.Generic;
using System.Text;
using static PlataformaTransparencia.Modelos.ModelLocationData;

namespace PlataformaTransparencia.Negocios.Location
{
    public interface ILocationBLL
    {
        public List<TableSectores> GetListSectores();
        public LocationProfileDetailData GetDetailLocationProfileByLocationIdAndTypeLocation(string locationId, string typeLocation, string jurisdictionId);
    }
}
