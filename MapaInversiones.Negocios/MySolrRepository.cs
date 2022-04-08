using SolrNet;
using SolrNet.Commands.Parameters;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Negocios
{

    public class MySolrRepository
    {
        private const string V = "*";
        private readonly ISolrOperations<Modelos.SolrResponse> _solr;

        public MySolrRepository(ISolrOperations<Modelos.SolrResponse> solr)
        {
            _solr = solr;
        }

        public async Task<IEnumerable<Modelos.SolrResponse>> Search(string searchString)
        {
            searchString = searchString.Replace(" ", "\\ ");
            QueryOptions query_options = new QueryOptions {
                StartOrCursor = new StartOrCursor.Start(0),
                Rows = 250,
                OrderBy = { new SortOrder("principal", Order.ASC) }
            };

            SolrQuery query = new SolrQuery(V + searchString + V);
            SolrQuery query2 = new SolrQuery("metadata:*" + searchString + "*");
            var results = await _solr.QueryAsync(query | query2, query_options);

            return results;
        }

        public async Task<IEnumerable<Modelos.SolrResponse>> Search(string searchString, string Type, int start, int  sort, int rows)
        {
            int WordsCount= 0;

            if (searchString != null) {
                WordsCount = searchString.Split(" ").Count();
                searchString = searchString.Replace(" ", "\\ ");
            }

            if (Type != null && Type != "undefined") {
                Type = Type.Replace(" ", "\\ ");
            }

            QueryOptions query_options = new QueryOptions {
                StartOrCursor = new StartOrCursor.Start(start),
                Rows = rows,
                OrderBy = { new SortOrder("principal",(Order) sort) }  //Order.ASC
            };

            SolrQuery query = new SolrQuery('"'+searchString+ '"');
            SolrQuery query2 = new SolrQuery("");

            if (WordsCount > 1) {
                query2 = new SolrQuery("metadata:"+'"' + searchString + '"');
            }
            else {
                query2 = new SolrQuery("metadata:*" + searchString + "*");
            }

            IEnumerable<Modelos.SolrResponse> results;

            if (Type != null && Type.Length > 0 && Type != "undefined") {
                SolrQuery query3 = new SolrQuery("type:" + Type);
                var rta = await _solr.QueryAsync((query | query2) & query3, query_options);
                results = rta;
                if (results.Count() > 0) { results.ElementAt(0).numFound = rta.NumFound; }
            }
            else {
                var rta = await _solr.QueryAsync(query | query2, query_options);
                results = rta;
                if (results.Count() > 0) { results.ElementAt(0).numFound = rta.NumFound; }
            }

           

            return results;
        }

        public async Task<IEnumerable<Modelos.SolrResponse>> Autocomplete(string searchString)
        {
            searchString = searchString.Replace(" ", "\\ ");

            QueryOptions query_options = new QueryOptions {
                StartOrCursor = new StartOrCursor.Start(0),
                Rows = 10//,
                //OrderBy = { new SortOrder("principal", Order.ASC) }
            };

            SolrQuery query = new SolrQuery(searchString);
            var results = await _solr.QueryAsync(query, query_options);

            return results;
        }

        public async Task<Modelos.SolrResponse> SearchWithFilters(string searchString)
        {
            var solrResult = (await _solr.QueryAsync(new SolrMultipleCriteriaQuery(new ISolrQuery[]
              {
                  new SolrQueryByField("_template", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
                  new SolrQueryByField("_language", "da"),
                  new SolrQueryByField("_latestversion", "true"),
                  new SolrQueryByField("advertcategorydeprecated_b", "false"),
                  new SolrQueryByField("_title", searchString)
              }, SolrMultipleCriteriaQuery.Operator.AND), new QueryOptions { Rows = 1 }))
              .FirstOrDefault();

            if (solrResult != null)
                return solrResult;

            return null;
        }
    }
}
