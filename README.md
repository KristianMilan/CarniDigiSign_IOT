# CarniDigiSign_IOT

# History
Previously, this was part of a three piece solution: this app to display screens on Windows10IOT, another app to [create signs](https://github.com/graboskyc/CarniDigiSign_App), and a third app which [acts as the server](https://github.com/graboskyc/CarniDigiSign_Server).

Now this has been simplified as the server solution is legacy in favor of using MongoDB Atlas as the cloud database and MongoDB Stitch as the serverless platform for REST APIs.

# About this repo

So now this app will display signs in rotation and the other project still [creates signs](https://github.com/graboskyc/CarniDigiSign_App).

![](SS/SS01.png)

The end result is a simple to deploy and manage utility for digital signage. 

These two apps are UWP apps. The intent of this one is to be deployed on a Raspberry Pi or Intel Compute Stick running Windows 10 IOT to display the digial signage

# Sign type support

Supported options for the type of screen are:
* Hidden - _hide_ - The record is ignored but kept in the database
* Image - _image_ - A URL to an image
* Text - _text_ - The Text field is displayed in line
* Tweet - _tweet_ - The URL to a specific tweet. The Twitter API is called to retrieve and it is formatted
* Video - _video_ - A URL to a video file supported by the UWP video element
* Web - _web_ - A URL to a website

# Deployment
* Deploy a Raspberry Pi with Windows 10 IOT
* Connect it to the network
* Sign up for MongoDB Atlas 
* Create a cluster and a database called `digisign` with collections for `registration` and `screens`
* Connect a Stitch application to MongoDB Atlas cluster
* Install the `stitch-cli` and load the Stitch folder into that app. Note that each config file is expecting a string in the `secret` field above the `SECRET_AS_QUERY_PARAM` which I have omitted when I uploaded it to source control. Put your credentials and phone number in the Twilio section and Values section or delete that trigger and twil folders.
* Download Visual Studio 2017, open the solution in `SignDisplay`
* Edit the `Resources.resw` with the URL of the stitch app above and the secret you created above
* Deploy the app onto the Pi
* It will wait on the regirstration page seen above in the screenshot and should send a text message to you
* Log into Atlas and manually enter the `feed`, `baseurl`, etc as expected for this to work
* Every 90 seconds or so the Pi will update to check if it is registered and start the slideshow
* Add to the `screens` collection with the screens needed to rotate. This can be done manually (sample docs below) or via the other app listed above in the readme

# Data flow 
![](SS/FlowChart.png)

# Additional features
* There is a `list` Stitch endpoint that when visited will show all registered devices
* There is a `details` Stitch endpoint that you can get to either from the above `list` endpoint or via the QR code generated while device is pending registration. The idea here is you can print the QR code and affix it to the device to track inventory. You can get to this page via the UUID `token` generated or via the MAC address. 
* The `registration` collection shoudl be manually updated (no UI yet) to store the `mac`, `secret`, `baseurl`, `feed`, `name`, `location`, `model` and will autopopulate `firstseen` and `lastseen` dates based on registration time and last registration request respectively. The `secret`, `baseurl`, and `feed` are required to function (and obviously `token` which will automatically be there) while all other attributes are strictly for tracking purposes within the `list` and `details` UI endpoints for management. Not for required functionality.

## Disabling auto-provisioning
* comment out the line in `SignDisplay/SignDisplay/MainPage.xaml.cs` in `MainPage` method the line starting `autoprovision(` 
* Push to the device
* make sure that you have a keyboard plugged into the Pi
* Manually fill out the URL, secret, and feed into the relevent text boxes
* Click the button to load the REST api call to get the screens

# Implementation details
* the token is generated using the `EasClientDeviceInformation` in `Windows.Security.ExchangeActiveSyncProvisioning` and should persist after reboots during my testing. Other methods did not persist on the Pi. Did not yet test to see if it persists after updates
* Use a Pi and maintain physical security over this when deployed to make sure that it cannot be tampered with as the URL and secret are not encrypted on the SD Card
* It is recommended to use a dumb TV to plug this into as smart TVs leave another attach vector to manipulation by passers-by
* Change the default administrator password on the Windows installation, use an isolated network, disable remote access to it
* Use strong random secret strings 

# Sample docs
## Registration on initial reg
```
{
    "_id":"5c3b8c3598f568ae6946bda2",
    "token":"0c93f018-a23b-5b42-ee71-79a607da2a40",
    "lastseen":"2019-01-13T19:20:01.682Z",
    "firstseen":"2019-01-13T19:06:29.693Z"
}
```
## Registration after manual update
```
{
    "_id":"5c3943c75ee2663fe3a1b230",
    "token":"eb89e839-3850-dadf-7970-7b977627ec73",
    "secret":"supersecretstring",
    "feed":"nameoffeed",
    "mac":"b8:92:cb:f4:aa:b1",
    "baseurl":"https://stitchurlhere",
    "lastseen":"2019-01-13T18:36:06.881Z",
    "name":"Test Subject 1",
    "location":"Chris's Desk",
    "model":"Raspberry Pi 3b",
    "firstseen":"2019-01-11T22:10:43.066Z"
}
```
## Screens
```
{
    "_id":"594bef61d3d13001432045b0",
    "__v":0,
    "created_date":"2017-06-22T16:25:05.471Z",
    "duration":"10", // seconds to display content before rotate
    "feed":"nameoffeed",
    "modified_date":"2017-06-22T16:25:05.471Z",
    "name":"Connect",
    "order":"140", // order to be displayed
    "sign_text":"",
    "sign_type":"image", // see above for types
    "uri":"https://something.com/pic.jpg
}
```