using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace SignDisplay
{
    public class Screen
    {
        public string name { get; set; }
        public string uri { get; set; }
        public string feed { get; set; }
        public string order { get; set; }
        public string duration { get; set; }
        public string sign_text { get; set; }
        public string sign_type { get; set; }
        public string _id { get; set; }
        public int __v { get; set; }
        public DateTime modified_date { get; set; }
        public DateTime created_date { get; set; }
    }

    public class ScreenManager
    {

        string _baseURI = "";

        public async Task<Screen[]> GetScreensAsync(string baseuri)
        {
            _baseURI = baseuri;

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(_baseURI);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            Screen[] sl = null;
            string items = "";


            HttpResponseMessage response = await client.GetAsync("screens");
            if (response.IsSuccessStatusCode)
            {
                items = await response.Content.ReadAsStringAsync();
                sl = JsonConvert.DeserializeObject<Screen[]>(items);

            }


            List<Screen> nsl;
            nsl = sl.ToList<Screen>();
            nsl.Sort((x, y) => Convert.ToInt32(x.order).CompareTo(Convert.ToInt32(y.order)));

            return nsl.ToArray<Screen>();
        }

        public async Task<Screen> GetScreenAsync(string id)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(_baseURI);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            Screen s = null;
            string item = "";


            HttpResponseMessage response = await client.GetAsync("screens/" + id);
            if (response.IsSuccessStatusCode)
            {
                item = await response.Content.ReadAsStringAsync();
                s = JsonConvert.DeserializeObject<Screen>(item);

            }

            return s;
        }
        
    }
}
