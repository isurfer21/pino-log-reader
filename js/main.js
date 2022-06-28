/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a MIT License.
 */

const LOG_LEVELS = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace'
};

var main = function(e) {
    console.log('main');

    var LogReader = function() {
        var containers = {},
            controls = {},
            model = {};
        var getParsedData = function(data) {
            var lines = data.split('\n'),
                rows = [], thead;
            for (let i = 0; i < lines.length; i++) {
                if (!!lines[i]) {
                    let line =  JSON.parse(lines[i]);
                    if (i == 0) {
                        let titles = Object.keys(line).join('</th><th>');
                        thead = '<thead><tr><th>' + titles + '</th></tr></thead>';
                    }
                    line.level = LOG_LEVELS[line.level];
                    line.time = (!!line.time) ? new Date(line.time).toLocaleString() : line.time;
                    line.msg = (!!line.msg) ? `<pre>${line.msg}</pre>` : line.msg;
                    let cells = Object.values(line).join('</td><td>');
                    rows.push('<td>' + cells + '</td>');
                }
            }
            let tbody = '<tbody><tr>' + rows.join('</tr><tr>') + '</tr></tbody>';
            let output = '<table>' + thead + tbody + '</table>';
            return output;
        }
        var getFilteredData = function(pattern, data) {
            var output = data;
            if (!!pattern) {
                var ilines = data.split('\n'),
                    olines = [];
                for (let i = 0; i < ilines.length; i++) {
                    if (ilines[i].indexOf(pattern) >= 0) {
                        olines.push(ilines[i]);
                    }
                }
                output = olines.join('\n');
            }
            return output;
        }
        var renderOutput = function(data) {
            if (!!data) {
                let filteredData = getFilteredData(containers.filterStr.val(), data);
                containers.outputResponse.html(filteredData);
                let parsedData = getParsedData(filteredData);
                containers.outputParsed.html(parsedData);
            }
        }
        var readQueryParam = function () {
            model.urlQueryParams = new URLSearchParams(window.location.search);
        }
        var loadRemoteFile = function(link) {
            let url = decodeURIComponent(link);
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    model.cachedFileContent = data;
                    renderOutput(model.cachedFileContent);
                    containers.output.removeClass('hide');
                });
        }

        controls.handleFileSelect = function(evt) {
            console.log('controls.handleFileSelect', evt);
            let files = evt.target.files;
            if (files.length > 0) {
                var fileExtension = /\.(log|txt)$/gi;
                var fileTobeRead = files[0];
                if (fileTobeRead.name.match(fileExtension)) {
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        model.cachedFileContent = fileReader.result;
                        renderOutput(model.cachedFileContent);
                    }
                    fileReader.readAsText(fileTobeRead);
                    containers.output.removeClass('hide');
                } else {
                    alert("Please select log file");
                }
            }
        }
        controls.handleOutputFormat = function(e) {
            console.log('controls.handleOutputFormat', e);
            let outputFmt = e.target.value;
            if (outputFmt == "raw") {
                containers.outputRaw.removeClass('hide');
                containers.outputParsed.addClass('hide');
            } else {
                containers.outputRaw.addClass('hide');
                containers.outputParsed.removeClass('hide');
            }
        }
        controls.rerenderOutput = function(e) {
            e.preventDefault();
            renderOutput(model.cachedFileContent);
        }
        controls.noAction = function(e) {
            e.preventDefault();
        }
        controls.resetAtDefaultState = function(e) {
            containers.outputResponse.html('');
            containers.outputParsed.html('');
            containers.output.addClass('hide');
            containers.fmtRaw.trigger('click');
            return
        }
        controls.showAbout = function(e) {
            containers.appAbout.removeClass('hide');
        }
        controls.hideAbout = function(e) {
            containers.appAbout.addClass('hide');
        }

        this.destroy = function() {
            console.log('LogReader', cid, 'destroy');
            containers.fileRef.off('change', controls.handleFileSelect);
            containers.fmtRaw.off('click', controls.handleOutputFormat);
            containers.fmtParsed.off('click', controls.handleOutputFormat);
        }
        this.initialize = function() {
            console.log('LogReader initialized');
            containers.appLogo = $('.app-logo');

            containers.appAbout = $('#appAbout');
            containers.appAboutClose = containers.appAbout.find('.modal-btn-close');

            containers.output = $('.output');
            containers.outputRaw = containers.output.find('pre');
            containers.outputResponse = containers.output.find('code');
            containers.outputParsed = containers.output.find('.parsed');

            containers.ctrlPanel = $('form#ctrlPanel');
            containers.filterStr = $('input#filterStr');
            containers.fmtRaw = $('input#fmtRaw');
            containers.fmtParsed = $('input#fmtParsed');
            containers.fileRef = $('input#fileRef');
            containers.btnReset = $('input#btnReset');

            readQueryParam();
            if (!!model.urlQueryParams.get('link')) {
                containers.fileRef.addClass('hide');
                containers.btnReset.addClass('hide');
                loadRemoteFile(model.urlQueryParams.get('link'));
            } else {
                containers.fileRef.on('change', controls.handleFileSelect);
            }
            containers.fmtRaw.on('click', controls.handleOutputFormat);
            containers.fmtParsed.on('click', controls.handleOutputFormat);
            containers.ctrlPanel.on('reset', controls.resetAtDefaultState);
            containers.ctrlPanel.on('submit', controls.rerenderOutput);
            containers.filterStr.on('blur', controls.rerenderOutput);

            containers.appLogo.on('click', controls.showAbout);
            containers.appAboutClose.on('click', controls.hideAbout);

            containers.ctrlPanel.trigger('click');
        }
    }

    var app = new LogReader();
    app.initialize();
};

$(main);