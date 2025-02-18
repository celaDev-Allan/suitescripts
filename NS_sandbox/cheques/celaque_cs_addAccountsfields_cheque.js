/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function beforeLoad(context) {
        if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
            var form = context.form;

            // Crear el campo personalizado
            var customField = form.addField({
                id: 'custpage_accounts',
                type: serverWidget.FieldType.SELECT,
                label: 'Accounts'
            });

            // Insertar el campo personalizado en la posición deseada
            form.insertField({
                field: customField,
                nextfield: 'custbody_formapago'
            });
        }
    }

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var currentRecord = context.newRecord;
            var customDropdownValue = currentRecord.getValue({
                fieldId: 'custpage_accounts'
            });

            currentRecord.setValue({
                fieldId: 'account',
                value: customDropdownValue
            });
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };

});