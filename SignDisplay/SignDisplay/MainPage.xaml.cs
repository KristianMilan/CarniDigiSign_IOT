using System;
using Windows.Security.Cryptography;
using Windows.Security.Cryptography.Core;
using Windows.Storage.Streams;
using Windows.System.Profile;
using Windows.UI;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media.Imaging;
using Windows.ApplicationModel.Resources;
using System.Threading.Tasks;
using Windows.ApplicationModel.Core;

namespace SignDisplay
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        Screen[] _screens = null;
        ScreenManager _sm = new ScreenManager();
        string _url = "";
        string _feedId = "";
        string _passcode = "";
        int _currentIndex = 0;
        int _currentTimer = 0;
        DispatcherTimer _disTimer;
        Tweet _t = null;

        string _apbaseurl = "";
        string _apsecret = "";

        int _errorCount = 0;

        public MainPage()
        {
            this.InitializeComponent();

            var view = ApplicationView.GetForCurrentView();

            view.TitleBar.BackgroundColor = Color.FromArgb(255, 11, 140, 26);
            view.TitleBar.ButtonBackgroundColor = Color.FromArgb(255, 11, 140, 26);
            view.TitleBar.ButtonForegroundColor = Colors.White;
            view.TitleBar.ButtonPressedForegroundColor = Color.FromArgb(255, 11, 140, 26);
            view.TitleBar.ButtonPressedBackgroundColor = Colors.White;
            view.TitleBar.ButtonHoverBackgroundColor = Colors.White;
            view.TitleBar.ButtonHoverForegroundColor = Color.FromArgb(255, 11, 140, 26);

            _disTimer = new DispatcherTimer();
            _disTimer.Tick += _disTimer_Tick;

            var resources = new ResourceLoader("Resources");
            _apbaseurl = resources.GetString("AutoProvsionBaseUrl");
            _apsecret = resources.GetString("AutoProvisionSecret");
            autoprovision(_apbaseurl,_apsecret);

        }

        private void _disTimer_Tick(object sender, object e)
        {
            DisplayNext();
        }

        public async void GetScreens()
        {
            try
            {
                _screens = await _sm.GetScreensAsync(_url, _feedId, _passcode);
                DisplayNext();
            } catch (Exception ex)
            {
                _errorCount += 1;
                await Task.Delay(TimeSpan.FromSeconds(5));
                // kill the app
                CoreApplication.Exit();
            }
        }

        async void DisplayNext()
        {
            if (_currentIndex == _screens.Length) {
                _currentIndex = 0;
                try
                {
                    _screens = await _sm.GetScreensAsync(_url, _feedId, _passcode);
                }
                catch(Exception ex)
                {
                    _errorCount += 1;
                    await Task.Delay(TimeSpan.FromSeconds(20));
                    if(_errorCount>1)
                    {
                        // kill the app
                        AppRestartFailureReason result = await CoreApplication.RequestRestartAsync("");
                        if (result == AppRestartFailureReason.NotInForeground ||
                            result == AppRestartFailureReason.RestartPending ||
                            result == AppRestartFailureReason.Other)
                        {
                            GetScreens();
                        }
                    }
                    else
                    {
                        DisplayNext();
                    }
                }
            }

            Screen s = _screens[_currentIndex];
            _t = null;

            if (s.sign_type == "hide")
            {
                _currentIndex = _currentIndex + 1;
                DisplayNext();
            }
            else
            {

                if (s.sign_type == "web")
                {
                    view_web.Visibility = Windows.UI.Xaml.Visibility.Visible;
                    view_image.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_text.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_media.Visibility = Windows.UI.Xaml.Visibility.Collapsed;

                    view_web.Visibility = Windows.UI.Xaml.Visibility.Visible;
                    view_web.Navigate(new Uri(s.uri));

                }
                if (s.sign_type == "video")
                {
                    view_web.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_image.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_text.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_media.Visibility = Windows.UI.Xaml.Visibility.Visible;

                    view_media.Source = new Uri(s.uri);

                }
                else if (s.sign_type == "image")
                {
                    view_image.Visibility = Windows.UI.Xaml.Visibility.Visible;
                    view_web.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_text.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_media.Visibility = Windows.UI.Xaml.Visibility.Collapsed;

                    BitmapImage imageSource = new BitmapImage(new Uri(s.uri));
                    view_image.Width = imageSource.DecodePixelHeight = (int)this.ActualWidth;
                    view_image.Source = imageSource;
                }
                else if (s.sign_type == "text")
                {
                    view_text.Visibility = Windows.UI.Xaml.Visibility.Visible;
                    view_web.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_image.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_media.Visibility = Windows.UI.Xaml.Visibility.Collapsed;

                    view_text.Document.SetText(Windows.UI.Text.TextSetOptions.None, s.sign_text);
                }
                else if (s.sign_type == "tweet")
                {
                    view_web.Visibility = Windows.UI.Xaml.Visibility.Visible;
                    view_image.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_text.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
                    view_media.Visibility = Windows.UI.Xaml.Visibility.Collapsed;

                    try
                    {
                        _t = await _sm.GetTweetAsync(s.uri);
                        view_web.Source = new Uri("ms-appx-web:///Tweet.html");
                    } catch (Exception ex)
                    {
                        _errorCount += 1;
                        DisplayNext();
                    }

                }

                _currentTimer = Convert.ToInt32(s.duration);
                _disTimer.Interval = new TimeSpan(0, 0, _currentTimer);
                _disTimer.Start();

                _currentIndex = _currentIndex + 1;
            }
            
        }

        private void run()
        {
            _url = txt_uri.Text;
            _feedId = txt_feed.Text;
            _passcode = txt_passcode.Text;
            configstack.Visibility = Visibility.Collapsed;
            GetScreens();
        }

        private async void autoprovision(string baseurl, string secret)
        {
            if (baseurl != "")
            {
                // https://stackoverflow.com/questions/34153786/unique-device-id-uwp
                HardwareToken token = HardwareIdentification.GetPackageSpecificToken(null);
                IBuffer hardwareId = token.Id;
                HashAlgorithmProvider hasher = HashAlgorithmProvider.OpenAlgorithm("MD5");
                IBuffer hashed = hasher.HashData(hardwareId);
                string hashedString = CryptographicBuffer.EncodeToHexString(hashed);

                ProvisionManager pm = new ProvisionManager();
                AutoProvision ap;
                try
                {
                    ap = await pm.GetFeed(baseurl, secret, hashedString);
                    if (ap.error == "")
                    {
                        txt_uri.Text = ap.baseurl;
                        txt_feed.Text = ap.feed;
                        txt_passcode.Text = ap.secret;
                        run();
                    }
                    else
                    {
                        txt_uri.Text = ap.error;
                        txt_feed.Text = hashedString;
                    }
                }
                catch(Exception ex)
                {
                    txt_uri.Text = "Error auto provisioning... probably network... trying again in 10";
                    txt_feed.Text = ex.ToString();
                    await Task.Delay(TimeSpan.FromSeconds(10));
                    autoprovision(baseurl, secret);
                }
            }
        }

        private async void view_web_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args)
        {
            if (_t != null)
            {
                await view_web.InvokeScriptAsync("setAuthor", new string[] { _t.author_name.ToString() });
                await view_web.InvokeScriptAsync("setBody", new string[] { _t.html.ToString() });
            }
        }

        private void btn_autoprov_Click(object sender, RoutedEventArgs e)
        {
            autoprovision(_apbaseurl,_apsecret);
        }

        private void btn_run_Click(object sender, RoutedEventArgs e)
        {
            run();
        }
    }
}
