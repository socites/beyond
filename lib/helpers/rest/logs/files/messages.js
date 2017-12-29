require('colors');
module.exports = function (ID, params) {

    var date = new Date();
    date = date.getFullYear().toString() + '-' +
        (date.getMonth() + 1).toString() + '-' +
        date.getDate().toString() + ' ' +
        date.getHours().toString() + ':' +
        date.getMinutes().toString() + ':' +
        date.getSeconds().toString();

    switch (ID) {
        case 'response':
            let response = {
                'code': params.responseCode,
                'data': params.responseData
            };

            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: \n'.bold + JSON.stringify(response) + '\n'
            ];
        case 'error':
            if (!params.responseData) params.responseData = '';
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE CODE: '.bold + params.responseCode + '\n\n' +
                'RESPONSE DATA: '.bold + (params.responseData).red + '\n'
            ];
        case 'request_error':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'ERROR: \n'.bold + (params.requestError).red + '\n' +
                'RESPONSE DATA: '.bold + 'CONNECTION ERROR'.red + '\n'
            ];
        case 'empty_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: '.bold + ('EMPTY RESPONSE RECEIVED').red + '\n\n'
            ];
        case 'invalid_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: \n'.bold + (params.response).red + '\n\n' +
                'RESPONSE DATA: '.bold + '\nIT WAS NOT POSSIBLE TO PARSE THE RESPONSE\n'.red + params.error + '\n'
            ];
        case 'exception':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'EXCEPTION: '.bold + params.exception + ' \n'.red
            ];
    }

};
