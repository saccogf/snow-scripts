var RHWorkflowUtils = Class.create();
RHWorkflowUtils.prototype = {
    initialize: function () { },

    /**
     * Broadcast a WF event
     * @param {String} evt - Workflow event, for a list check: https://docs.servicenow.com/bundle/rome-servicenow-platform/page/administer/workflow-administration/reference/r_WorkflowEventsInTheBaseSystem.html
     * @param {GlideRecord} task - Record running the WFs to broadcast
     */
    fireWorkflowEvent: function (evt, task) {

        var wf = new Workflow().getRunningFlows(task);

        while (wf.next()) {

            new Workflow().broadcastEvent(wf.sys_id, evt);

        }
    },

    /**
     * Cancels all running flows for the task record and restart them on their most up-to-date version
     * @param {GlideRecord} task - Record for which WFs will be reset
     * @param {Boolean} [writeWorkNotes=false] - Whether work notes should be written to target record
     */
    restartAndUpdateWF: function (task, writeWorkNotes) {
        var workflows = [],
            wfMessage = '';
        var context = new Workflow().getRunningFlows(task);
        while (context.next()) {

            if (!context.parent.nil()) {
                continue;
            }

            workflows.push(context.workflow_version.workflow.toString());
            wfMessage += 'Workflow "' + context.workflow_version.workflow.name.toString() + '" updated to latest version and restarted\n';
        }

        var wf = new Workflow();
        wf.cancel(task);

        for (var i = 0; i < workflows.length; i++) {
            // gs.info('{0}: Restarting {1} on {2}', i, workflows[i], task.getDisplayValue());
            wf.startFlow(workflows[i], task, task.operation(), this._getVars(task));
        }

        if (writeWorkNotes) {
            task.work_notes = wfMessage;
            task.update();
        }

    },


    /**
   * @todo Make this work for task_sla (percentage timers)
   * @description Looks for active timer activities in active WF contexts for the current record and force their next action to be 5s from now
   * @param {GlideRecord} task - Record with an active timer activity to be skipped
   */
    skipWFTimer: function (task) {
        var wfScratchpad = {},
            triggerID = ''; // wf_executing.scratchpad.label to query next

        var wfExec = new GlideRecord('wf_executing');
        // activity_definition = '3961a1da0a0a0b5c00ecd84822f70d85' // Timer
        wfExec.addQuery('activity.activity_definition', '3961a1da0a0a0b5c00ecd84822f70d85');
        wfExec.addQuery('context.id', task.getUniqueValue()); // Context running on the current record
        wfExec.setLimit(1);
        wfExec.query();

        if (wfExec.next()) {
            wfScratchpad = JSON.parse(wfExec.scratchpad.toString());
            triggerID = wfScratchpad['label'];

            var triggerGR = new GlideRecord('sys_trigger');

            if (triggerGR.get('name', triggerID)) {
                var nextGDT = new GlideDateTime();
                var gt = new GlideTime();
                gt.setValue('00:00:05'); // 5 second timer; can be tweaked, but do not set to now
                nextGDT.add(gt);
                triggerGR.setValue('next_action', nextGDT);
                triggerGR.update();
                gs.addInfoMessage('Timer activity skipped!');
            }
        } else {
            gs.addInfoMessage('No timer activities found for the current context.');
        }
    },

    _getVars: function (task /* GlideRecord */) {
        var vars = {};
        for (var n in task.variables) {
            vars[n] = task.variables[n];
        }
    },

    type: 'RHWorkflowUtils'
};
