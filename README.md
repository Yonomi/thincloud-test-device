# Yonomi Thincloud Test Device

Run a virtual device that interfaces with Thincloud

## Installation
`npm install`

## Config
Update `config/device.config.json`
specifically the `iotConnection.host` and adding your `devicetype` and specifying a `physicalId`

Create your device certs and add Cert Authority file
[AWS IoT](https://us-west-2.console.aws.amazon.com/iot/home?region=us-west-2#/dashboard)


## Usage

`npm start`

[Commision](http://localhost:8082/#!/commission)




## Test
`npm test`

(c) Copyright 2018 Yonomi Inc. All rights reserved.
