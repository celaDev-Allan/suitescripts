/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search'], function(record, search) {

    function pageInit(context) {
        var currentRecord  =context.currentRecord;
        updateAccountField(context.currentRecord);
        //Select cuenta 
        var selectCuenta = currentRecord.getValue({
            fieldId: 'account'
        });
      log.debug(selectCuenta);
        currentRecord.setValue({fieldId: 'custpage_accounts', value:selectCuenta });
        
    }

    function fieldChanged(context) {
        if (context.fieldId === 'currency') { 
            setTimeout(function() {
                updateAccountField(context.currentRecord);
            }, 500); 
        }
    }

    function updateAccountField(currentRecord) {
        var selectedCurrency = currentRecord.getValue({
            fieldId: 'custbody_accountcurr'
        });

        var accountOptions = getAvailableAccounts(selectedCurrency);
        console.log('accountOptions', accountOptions);

        var accountField = currentRecord.getField({
            fieldId: 'custpage_accounts'
        });

        accountField.removeSelectOption({ value: null }); 

        accountOptions.forEach(function(account) {
            accountField.insertSelectOption({
                value: account.value,
                text: account.text
            });
        });
    }

    function getAvailableAccounts(selectedCurrency) {
        var results = [];
        var accountSearchObj = search.create({
            type: "account",
            filters: [
                ["custrecord_currency", "is", selectedCurrency]
            ],
            columns: [
                search.createColumn({name: "internalid", label: "Internal ID"}),
                search.createColumn({name: "name", sort: search.Sort.ASC, label: "Name"})
            ]
        });

        accountSearchObj.run().each(function(result){
            results.push({
                value: result.getValue({name: "internalid"}),
                text: result.getValue({name: "name"})
            });
            return true;
        });

        return results;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});


// otra version 

/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function pageInit(context) {
        var currentRecord = context.currentRecord;
        try {
            updateAccountField(currentRecord);

            // Seleccionar cuenta
            var selectCuenta = currentRecord.getValue({ fieldId: 'account' });
            log.debug('Selected Account', selectCuenta);

            currentRecord.setValue({ fieldId: 'custpage_accounts', value: selectCuenta });
        } catch (e) {
            log.error({
                title: 'Error en pageInit',
                details: e.toString()
            });
        }
    }

    function fieldChanged(context) {
        if (context.fieldId === 'currency' || context.fieldId === 'custbody_accountcurr') { 
            setTimeout(function() {
                try {
                    updateAccountField(context.currentRecord);
                } catch (e) {
                    log.error({
                        title: 'Error en fieldChanged',
                        details: e.toString()
                    });
                }
            }, 500); 
        }
    }

    function updateAccountField(currentRecord) {
        var selectedCurrency = currentRecord.getValue({ fieldId: 'custbody_accountcurr' });
        var accountOptions = getAvailableAccounts(selectedCurrency);
        log.debug('Account Options', accountOptions);

        var accountField = currentRecord.getField({ fieldId: 'custpage_accounts' });

        // Limpiar opciones previas
        accountField.removeSelectOption({ value: null });

        // Insertar opciones nuevas
        accountOptions.forEach(function(account) {
            accountField.insertSelectOption({
                value: account.value,
                text: account.text
            });
        });

        // Seleccionar la cuenta actual si está en la lista de opciones
        var selectCuenta = currentRecord.getValue({ fieldId: 'account' });
        if (selectCuenta) {
            accountField.insertSelectOption({
                value: selectCuenta,
                text: accountOptions.find(option => option.value === selectCuenta)?.text || ''
            });
            accountField.setValue(selectCuenta);
        }
    }

    function getAvailableAccounts(selectedCurrency) {
        var results = [];
        var accountSearchObj = search.create({
            type: "account",
            filters: [
                ["custrecord_currency", "is", selectedCurrency]
            ],
            columns: [
                search.createColumn({ name: "internalid", label: "Internal ID" }),
                search.createColumn({ name: "name", sort: search.Sort.ASC, label: "Name" })
            ]
        });

        accountSearchObj.run().each(function(result) {
            results.push({
                value: result.getValue({ name: "internalid" }),
                text: result.getValue({ name: "name" })
            });
            return true;
        });

        return results;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});

