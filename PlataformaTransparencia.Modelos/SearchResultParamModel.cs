using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class SearchResultParamModel
    {
            public int Id { get; set; } // int
            public string Hierarchy { get; set; } // varchar(100)
            public string Type { get; set; } // varchar(50)
            public string Url { get; set; } // varchar(250)
            public string Param { get; set; } // varchar(250)
    }
}
