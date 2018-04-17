require('colors');
module.exports = function (ID, params) {

    var date = new Date();
    date = date.getFullYear().toString() + '-' +
        (date.getMonth() + 1).toString() + '-' +
        date.getDate().toString() + ' ' +
        date.getHours().toString() + ':' +
        date.getMinutes().toString() + ':' +
        date.getSeconds().toString();

    let parameters = params.parameters;
    parameters = (parameters) ? parameters : '';
    parameters = (typeof parameters === 'string') ? parameters : JSON.stringify(parameters);

    switch (ID) {
        case 'response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'RESPONSE: \n'.bold + params.responseData + '\n'
            ];
        case 'error':
            if (!params.responseData) params.responseData = '';
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'RESPONSE CODE: '.bold + params.responseCode + '\n\n' +
                'RESPONSE DATA: \n'.bold + (params.responseData).red + '\n'
            ];
        case 'request_error':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'ERROR: \n'.bold + (params.requestError).red + '\n' +
                'RESPONSE DATA: '.bold + 'CONNECTION ERROR'.red + '\n'
            ];
        case 'empty_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'RESPONSE: '.bold + ('EMPTY RESPONSE RECEIVED').red + '\n\n'
            ];
        case 'invalid_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'RESPONSE: \n'.bold + ((params.response) ? (params.response).red : 'empty response') + '\n\n' +
                'RESPONSE DATA: '.bold + '\nIT WAS NOT POSSIBLE TO PARSE THE RESPONSE\n'.red +
                ((params.error) ? params.error : '') + '\n'
            ];
        case 'exception':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'METHOD: '.bold + (params.method).italic + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'PARAMETERS: \n'.bold + parameters + '\n\n' +
                'EXCEPTION: '.bold + params.exception + ' \n'.red
            ];
    }

};
