using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Location;
using System.Collections.Generic;
using static PlataformaTransparencia.Modelos.ModelLocationData;

namespace PlataformaTransparencia.Negocios.Location
{
  public interface ILocationBLL
  {
    public List<TableSectores> GetListSectores();
    public LocationProfileDetailData GetDetailLocationProfileByLocationIdAndTypeLocation(string locationId, string typeLocation, string jurisdictionId);
    public BudgetFundsLocation GetBudgetFundsByLocationIdAndYear(string locationId, int year);
    public BudgetFundsLocation GetConsolidatedCostByLocationAndYear(string locationId, int year);
    public ModelLocationProjectPot GetPotProjectsLocationsByLocationIdAndYear(string locationId, string sectorId, int pagina, int tamanoPagina);
    ModelDistribucionPorTipoGastoByLocalizacionIdAndYear GetBudgetConsolidateByLocationIdAndYear(string locationId, int year);
    public ModelLocationData GetODSLocation(string locationId);
    public ModelLocationData GetConsolidadoODSInversionLocalizacion(string idLocalizacion, string idSector, string idEntidad, string destacados, int pagina, int tamanopagina);

  }
}
