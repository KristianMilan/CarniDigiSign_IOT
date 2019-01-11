using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SignDisplay
{
    public class AutoProvision
    {
        public string baseurl { get; set; }
        public string token { get; set; }
        public string secret { get; set; }
        public string feed { get; set; }
        public string error { get; set; }

        AutoProvision() { error = ""; }
    }

    public class ProvisionManager
    {
        public async Task<AutoProvision> GetFeed(string baseuri, string passcode, string token)
        {

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(baseuri);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            AutoProvision ap = null;
            string responsestring = "";


            HttpResponseMessage response = await client.GetAsync("provision?secret=" + passcode + "&token=" + token);
            if (response.IsSuccessStatusCode)
            {
                responsestring = await response.Content.ReadAsStringAsync();
                ap = JsonConvert.DeserializeObject<AutoProvision>(responsestring);
            }

            return ap;
        }
    }

}
