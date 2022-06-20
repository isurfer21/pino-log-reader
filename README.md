# pino-log-reader

The [Pino Log Reader](https://github.com/isurfer21/pino-log-reader) is a web based client-side log reader specifically built to view [Pino](https://getpino.io/) logs.

It parses the [Pino](https://github.com/pinojs/pino) log files which consist of logged json object in each line and could render that in a *raw* or *tabular* format. 

It could filter the lines of the log based on the *Filter Text* criteria. 

Try by clicking over [Pino Log Reader](https://isurfer21.github.io/pino-log-reader/). 

## Prerequisite

Any HTTP based static file server would work. For quick installation, you may use [Suxm](https://github.com/isurfer21/Suxm). 

## Usage

The local log file could be loaded via file selector using *Choose file* button. 

Alternatively, the remote file reference could be passed in the URL query parameter under `link` param, e.g.,

	http://localhost/?link=/logs/server.log

## History

The codebase have been taken as a base from my earlier project [LogReader](https://github.com/isurfer21/LogReader).
