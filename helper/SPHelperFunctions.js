var RHSP = {

    /**
    * @returns int : How many attachments are added, -1 if errored out
    */
    getAttachmentCount: function () {
        var length;

        try {

            length = angular.element("#sc_cat_item").scope().attachments.length;

        } catch (e) {

            console.log(e);
            length = -1;

        }

        return length;
    },

    /** Disables the submit button
    * @param {boolean} bool - Disables if true; Enables if false
    * @param {String} text - Reason for the button to be disabled
    */
    disableSubmit: function (bool, text) {

        var button;
        button = angular.element('button[name="submit"]');
        button.prop('disabled', bool);

    },

    /**
     * @param {Array} fields - An array of fields to have their value cleared out
     */
    clearValues: function (fields) {
        if (fields instanceof Array) {
            fields.forEach(function (fieldName) {
                g_form.clearValue(fieldName);
            });
        }
    },

/**
 * Check the current form for field messages being displayed
 * @param {String} [type=all] - Type of msg, follows SN OOTB 'info' and 'error', use 'all' for both
 * @returns {Boolean} - Whether the form has any field message
 */
    hasFieldMsgs: function (type) {

        if (typeof (type) === 'undefined') {
            type = 'all';
        }

        var infoMsg = [],
            errorMsg = [];
        var hasMsgs = false;

        if (type == 'all' || type == 'info') {
            infoMsg = angular.element(".bg-info");
        }
        if (type == 'all' || type == 'error') {
            errorMsg = angular.element('.bg-danger');
        }

        if (infoMsg.length > 0 || errorMsg.length > 0) {
            hasMsgs = true;
            // console.log(infoMsg);
            // console.log(errorMsg);
        }

        return hasMsgs;

    }
};
