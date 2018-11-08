# CarniDigiSign_IOT

# History
Previously, this was part of a three piece solution: this app to display screens on Windows10IOT, another app to [create signs](https://github.com/graboskyc/CarniDigiSign_App), and a third app which [acts as the server](https://github.com/graboskyc/CarniDigiSign_Server).

Now this has been simplified as the server solution is legacy in favor of using MongoDB Atlas as the cloud database and MongoDB Stitch as the serverless platform for REST APIs.

# About this repo

So now this app will display signs in rotation and the other project still [creates signs](https://github.com/graboskyc/CarniDigiSign_App).

![](SS/SS01.png)

The end result is a simple to deploy and manage utility for digital signage. 

These two apps are UWP apps. The intent of this one is to be deployed on a Raspberry Pi or Intel Compute Stick running Windows 10 IOT to display the digial signage

![](SS/ss01.jpg)

# Sign type support

Supported options for the type of screen are:
* Hidden - _hide_ - The record is ignored but kept in the database
* Image - _image_ - A URL to an image
* Text - _text_ - The Text field is displayed in line
* Tweet - _tweet_ - The URL to a specific tweet. The Twitter API is called to retrieve and it is formatted
* Video - _video_ - A URL to a video file supported by the UWP video element
* Web - _web_ - A URL to a website
. 