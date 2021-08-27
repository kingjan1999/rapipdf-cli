Unofficial CLI for RapiPDF
===========

[![Version](https://img.shields.io/npm/v/@kingjan1999/rapipdf-cli.svg)](https://www.npmjs.com/package/@kingjan1999/rapipdf-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@kingjan1999/rapipdf-cli.svg)](https://npmjs.org/package/@kingjan1999/rapipdf-cli)
[![License](https://img.shields.io/npm/l/@kingjan1999/rapipdf-cli.svg)](https://github.com/kingjan1999/rapipdf-cli/blob/master/package.json)

This project is an adaption of [RapiPDF](https://github.com/mrin9/RapiPdf) providing a CLI for generating PDFs based on OpenAPI specs.
Apart from just providing an CLI, some additional configuration options (e.g. adding a logo) are provided.

<!-- toc -->
* [Usage](#usage)
* [Configuration File](#configuration-file)
* [Example Usage](#example-usage)
<!-- tocstop -->

# Usage
```sh-session
$ npm install -g @kingjan1999/rapipdf-cli
$ rapipdf (-v|--version|version)
@kingjan1999/rapipdf-cli/0.0.3 linux-x64 node-v14.15.1
$ rapipdf --help [COMMAND]
USAGE
  $ rapipdf SpecFile # can be either the path to a local file or a remote url (both .yaml and .json are supported)

OPTIONS

  -c, --configFile=configFile # pass the path to the configuration file (optional, see below)
  -o, --outputFile=outputFile # pass the path to the output file (defaults to "api.pdf")
```


# Configuration File

You can pass a configuration file to the CLI (using the `-c` parameter) overriding the defaults. An example is provided in this repository (`rapipdf.config.example-de.json`).

# Example Usage

Calling

```sh-session
$ rapipdf -o petstore.json.pdf -c config.json  petstore.json
```

in the `examples/` folder results in the uploaded [petstore.json.pdf](https://github.com/kingjan1999/rapipdf-cli/raw/master/examples/petstore.json.pdf).
