Cross platform XMPP client
====

Runs on windows/linux/osx. Major WIP. 
![image](https://cloud.githubusercontent.com/assets/848347/2843490/29899a82-d07f-11e3-8048-fbdb08867e83.gif)


### Screenshots
![image](https://f.cloud.github.com/assets/848347/2495396/f01279a6-b2f4-11e3-9733-af2955a94cff.png)




### Install
* Download [node-webkit v0.8.*](https://github.com/rogerwang/node-webkit)
* Download [nw-gyp](https://github.com/rogerwang/nw-gyp)

```
$ git clone https://github.com/moonsspoon/chat.git
$ cd chat
$ npm install
$ npm install -g bower grunt-cli
$ cd ui
$ bower install
$ cd ..
$ grunt build
```

Rebuild native dependencies with nw-gyp (replace * with your node-webkit version)
```
$ nw-gyp rebuild --target=0.8.*
```

### License
MIT

