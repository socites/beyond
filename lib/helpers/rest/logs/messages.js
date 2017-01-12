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
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: \n'.bold + JSON.stringify(params.response) + '\n'
            ];
        case 'error':
            if (!params.response.message) params.response.message = '';
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE CODE: '.bold + params.response.code + '\n\n' +
                'MESSAGE: '.bold + (params.response.message).red + '\n'
            ];
        case 'connection_error':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'ERROR: \n'.bold + (params.error).red + '\n' +
                'MESSAGE: '.bold + 'CONNECTION ERROR'.red + '\n'
            ];
        case 'empty_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: '.bold + ('EMPTY RESPONSE RECEIVED').red + '\n\n'
            ];
        case 'invalid_response':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'RESPONSE: \n'.bold + (params.response).red + '\n\n' +
                'MESSAGE: '.bold + '\nIT WAS NOT POSSIBLE TO PARSE THE RESPONSE\n'.red + params.error + '\n'
            ];
        case 'exception':
            return [
                '\n' +
                'DATE: '.bold + date + '\n' +
                'REQUEST: \n'.bold + (params.url).italic + '\n\n' +
                'POST PARAMETERS: \n'.bold + params.parameters + '\n\n' +
                'EXCEPTION: '.bold + params.exception + ' \n'.red
            ];
    }

};
