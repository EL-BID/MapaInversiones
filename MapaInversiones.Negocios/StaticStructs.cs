namespace PlataformaTransparencia.Negocios
{
  public class StaticStructs
  {
    public struct LocationType
    {
      public struct Department
      {
        public const string Name = "DEPARTAMENTO";
        public struct ChildLocation
        {
          public const string Name = "Municipios";
          public const string Type = "MUNICIPIO";
        } 
      }
      public struct District
      {
        public const string Name = "DISTRITO";
        public struct ChildLocation
        {
          public const string Name = "Corregimientos";
          public const string Type = "CORREGIMIENTO";
        }
      }
      public struct Municipality
      {
        public const string Name = "MUNICIPIO";
        public struct ChildLocation
        {
          public const string Name = "Corregimientos";
          public const string Type = "CORREGIMIENTO";
        }
      }
      public struct Province
      {
        public const string Name = "PROVINCIA";
        public struct ChildLocation
        {
          public const string Name = "Distritos";
          public const string Type = "DISTRITO";
        }
      }
    }
    public struct StateProject
    {
      public const string Continuity = "Continuidad";
      public const string New = "Nuevo";
    }
  }
}
