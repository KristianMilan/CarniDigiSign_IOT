using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Net;

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


    public class Tweet
    {
        public string url { get; set; }
        public string author_name { get; set; }
        public string author_url { get; set; }
        public string html { get; set; }
        public int width { get; set; }
        public object height { get; set; }
        public string type { get; set; }
        public string cache_age { get; set; }
        public string provider_name { get; set; }
        public string provider_url { get; set; }
        public string version { get; set; }
    }

    public class AutoProvision
    {
        public string baseurl { get; set; }
        public string token { get; set; }
        public string secret { get; set; }
        public string feed { get; set; }
        public string error { get; set; }
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


    public class ScreenManager
    {

        string _baseURI = "";
        string _feedId = "";
        string _passcode = "";

        public async Task<Screen[]> GetScreensAsync(string baseuri, string feedId, string passcode)
        {
            _baseURI = baseuri;
            _feedId = feedId;
            _passcode = passcode;

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(_baseURI);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            Screen[] sl = null;
            string items = "";


            HttpResponseMessage response = await client.GetAsync("feeds?secret="+_passcode+"&feed=" + _feedId);
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

        public async Task<Tweet> GetTweetAsync(string tweetUrl)
        {
            var twitterUrl = "https://publish.twitter.com";
            tweetUrl = System.Net.WebUtility.UrlEncode(tweetUrl);

            HttpClientHandler hc = new HttpClientHandler();
            hc.AutomaticDecompression = DecompressionMethods.GZip;
            HttpClient client = new HttpClient(hc);
            client.BaseAddress = new Uri(twitterUrl);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            
            HttpResponseMessage response = await client.GetAsync("/oembed?omit_script=1&url=" + tweetUrl);
            Tweet t = new Tweet();
            string json = "";

            if (response.IsSuccessStatusCode)
            {
                var buffer = await response.Content.ReadAsByteArrayAsync();
                var byteArray = buffer.ToArray();
                json = Encoding.ASCII.GetString(byteArray, 0, byteArray.Length);
                t = JsonConvert.DeserializeObject<Tweet>(json);

            }

            return t;
        }

    }
}
