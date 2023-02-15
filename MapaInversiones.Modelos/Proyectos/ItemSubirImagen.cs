using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
  public class ItemSubirImagen
  {
    public byte[] UploadedImage { get; set; }
    public string DescripcionImage { get; set; }
    public string LocationImage { get; set; }
    public string ProjectImage { get; set; }
  }
}
