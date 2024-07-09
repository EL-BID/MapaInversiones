using SolrNet;
using SolrNet.Commands.Parameters;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Proyectos;
using System;
using System.Security.Cryptography;

namespace PlataformaTransparencia.Negocios
{

    public class MySolrRepository
    {
        private const string V = "*";
        private readonly ISolrOperations<Modelos.SolrResponse> _solr;

        public MySolrRepository(ISolrOperations<Modelos.SolrResponse> solr)
        {
            _solr = solr;
    ***REMOVED***

        public async Task<IEnumerable<Modelos.SolrResponse>> Search(string searchString)
        {
            searchString = searchString.Replace(" ", "\\ ");
            QueryOptions query_options = new QueryOptions {
                StartOrCursor = new StartOrCursor.Start(0),
                Rows = 250,
                OrderBy = { new SortOrder("principal", Order.ASC) ***REMOVED***
        ***REMOVED***;

            SolrQuery query = new SolrQuery(V + searchString + V);
            SolrQuery query2 = new SolrQuery("metadata:*" + searchString + "*");
            var results = await _solr.QueryAsync(query | query2, query_options);

            return results;
    ***REMOVED***

        public async Task<IEnumerable<Modelos.SolrResponse>> Search(string searchString = "", string Type = "", string Id="", int start = 0, int sort = 0, int rows = 20)
        {
            int WordsCount = 0;
            SolrQueryResults<Modelos.SolrResponse> SolrResponse;

            if (!String.IsNullOrEmpty(searchString))
            {
                WordsCount = searchString.Split(" ").Count();
                searchString = searchString.Replace(" ", "\\ ");
                searchString = searchString.Replace("-", "\\-");
        ***REMOVED***

            if (Type != null && Type != "undefined")
            {
                Type = Type.Replace(" ", "\\ ");
        ***REMOVED***

            QueryOptions query_options = new QueryOptions
            {
                StartOrCursor = new StartOrCursor.Start(start),
                Rows = rows,
                OrderBy = { new SortOrder("principal", (Order)sort) ***REMOVED***  //Order.ASC
        ***REMOVED***;

            SolrQuery query = new SolrQuery('"' + searchString + '"');
            SolrQuery query2 = new SolrQuery("metadata:" + '"' + searchString + '"');

            IEnumerable<Modelos.SolrResponse> results;

            if (Type != null && Type.Length > 0 && Type != "undefined")
            {
                SolrQuery query3 = new SolrQuery("type:" + Type);
                SolrResponse = await _solr.QueryAsync((query | query2) & query3, query_options);
        ***REMOVED***
            else if (!String.IsNullOrEmpty(Id))
            {
                Id = "(" + Id.Replace(",", " OR ") + ")";
                SolrQuery query4 = new SolrQuery("id:" + Id);
                SolrResponse = await _solr.QueryAsync(query4, query_options);
        ***REMOVED***
            else
            {
                SolrResponse = await _solr.QueryAsync(query | query2, query_options);
        ***REMOVED***

            results = SolrResponse;
            if (results.Count() > 0) { results.ElementAt(0).numFound = SolrResponse.NumFound; ***REMOVED***

            return results;
    ***REMOVED***

        public async Task<IEnumerable<Modelos.SolrResponse>> Autocomplete(string searchString)
        {
            searchString = searchString.Replace(" ", "\\ ");

            QueryOptions query_options = new QueryOptions {
                StartOrCursor = new StartOrCursor.Start(0),
                Rows = 10//,
        ***REMOVED***;

            SolrQuery query = new SolrQuery(searchString);
            var results = await _solr.QueryAsync(query, query_options);

            return results;
    ***REMOVED***

        public async Task<Modelos.SolrResponse> SearchWithFilters(string searchString)
        {
            var solrResult = (await _solr.QueryAsync(new SolrMultipleCriteriaQuery(new ISolrQuery[]
              {
                  new SolrQueryByField("_template", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
                  new SolrQueryByField("_language", "da"),
                  new SolrQueryByField("_latestversion", "true"),
                  new SolrQueryByField("advertcategorydeprecated_b", "false"),
                  new SolrQueryByField("_title", searchString)
            ***REMOVED*** SolrMultipleCriteriaQuery.Operator.AND), new QueryOptions { Rows = 1 ***REMOVED***))
              .FirstOrDefault();

            if (solrResult != null)
                return solrResult;

            return null;
    ***REMOVED***
***REMOVED***
***REMOVED***
