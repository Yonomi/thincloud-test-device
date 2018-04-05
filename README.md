# thincloud-test-device


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
