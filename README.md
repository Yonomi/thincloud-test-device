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

## Using the CLI tool

### Install
`$ npm install -g thincloud-test-device`

### Usage

```
  Usage: thincloud-test-device [options]

  A CLI Tool for running a Thincloud Test Device

  Options:

    -v, --version               output the version number
    -c, --config [config_file]  Configuration File to Use
    -s, --create-config         Create a starter configuration file
    -p, --port                  Set port for test device server [default is 8082]
    -h, --help                  output usage information
  Example:

    $ thincloud-test-device -c /path/to/config_file.json

  Sample Config File:

  {
    "privateKey": "/path/to/private.key",
    "clientCert": "/path/to/client.cert",
    "caCert": "/path/to/rootCA.pem",
    "physicalId": "00:ED:98:45:RR",
    "deviceType": "LIGHT"
  }
```

(c) Copyright 2018 Yonomi Inc. All rights reserved.
