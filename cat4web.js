/**
 * JS version: v.0.1.0.
 * Compatible with: v.0.1.0 CAT4Web.exe.
 *
 * Author R8ACC.
 * Homepage https://github.com/kikimor/cat4web
 * CAT4Web https://cat4web.r8acc.ru
 */
function CAT4Web() {
    this.MODE_CW_U = 0x00800000;
    this.MODE_CW_L = 0x01000000;
    this.MODE_SSB_U = 0x02000000;
    this.MODE_SSB_L = 0x04000000;
    this.MODE_DIG_U = 0x08000000;
    this.MODE_DIG_L = 0x10000000;
    this.MODE_AM = 0x20000000;
    this.MODE_FM = 0x40000000;
    this.STATUS_NOTCONFIGURED = 0x00000000;
    this.STATUS_DISABLED = 0x00000001;
    this.STATUS_PORTBUSY = 0x00000002;
    this.STATUS_NOTRESPONDING = 0x00000003;
    this.STATUS_ONLINE = 0x00000004;

    /**
     * Timeout between reconnect attempts.
     * @type {int}
     */
    this.reconnectTimeout = 5000;

    var socket = null,
        connectState = false,
        isActive = false,
        self = this,
        rigNumber = null,
        status = null,
        frequency = null,
        mode = null,
        ptt = false;

    this.onConnect = function () {};
    this.onDisconnect = function () {};
    this.onChangeRigNumber = function (number) {};
    this.onChangeStatus = function (status) {};
    this.onChangeFrequency = function (frequency) {};
    this.onChangeMode = function (mode) {};
    this.onChangePTT = function (status) {};

    /**
     * Connection to CAT4Web server is active (established).
     * @returns {boolean}
     */
    this.isActive = function() {
        return isActive;
    };

    /**
     * Get using rig number.
     * @returns {int}
     */
    this.getRigNumber = function () {
        return rigNumber;
    };

    /**
     * Set rig number for use.
     * @param {int} value
     */
    this.setRigNumber = function (value) {
        sendData('rig-number', value);
    };

    /**
     * Get current connect status to OmniRig server.
     * @returns {int}
     */
    this.getStatus = function() {
        return status;
    };

    /**
     * Get current frequency in Hz.
     * @returns {int}
     */
    this.getFrequency = function() {
        return frequency;
    };

    /**
     * Set frequency in Hz.
     * @returns {int} value
     */
    this.setFrequency = function(value) {
        frequency = value;
        sendData('freq', value);
    };

    /**
     * Get current modulation.
     * @returns {int}
     */
    this.getMode = function() {
        return mode;
    };

    /**
     * Set current modulation.
     * @param {int} value
     */
    this.setMode = function(value) {
        sendData('mode', value);
    };

    /**
     * Get current PTT status.
     * @returns {boolean}
     */
    this.getPTT = function() {
        return ptt;
    };

    /**
     * Connect to CAT4Web server.
     * @returns {boolean}
     */
    this.connect = function () {
        if (typeof WebSocket !== 'function') {
            console.log('WebSocket not supported for you. Sorry.');
            return false;
        }

        if (!connectState) {
            connectState = true;
            socket = new WebSocket("ws://127.0.0.1:34469");
            socket.onopen = onOpen;
            socket.onclose = onClose;
            socket.onmessage = onMessage;
            return true;
        }

        return false;
    };

    /**
     * Disconnect from CAT4Web server.
     * @returns {*}
     */
    this.disconnect = function () {
        connectState = isActive = false;
        if (socket) {
            socket.close();
            return true;
        }
        return false;
    };

    /**
     * Action on open connect to CAT4Web server.
     */
    function onOpen() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://cat4web.r8acc.ru/licence/request', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    sendData('token', JSON.parse(xhr.responseText));
                } else {
                    socket.close();
                    console.log('Could not get access key. Send mail to i@r8acc.ru.')
                }
            }
        };
        xhr.send();
    }

    /**
     * Action on close connect to CAT4Web server.
     */
    function onClose() {
        self.onDisconnect();

        if (connectState) {
            connectState = false;
            setTimeout(function () {
                self.connect();
            }, self.reconnectTimeout);
        }
    }

    /**
     * Action on get message from CAT4Web server.
     */
    function onMessage(event) {
        var data = JSON.parse(event.data);

        if (data.auth === true) {
            isActive = true;
            self.onConnect();
        } else {
            switch (data.type) {
                case 'rig-number':
                    rigNumber = data.value !== null ? parseInt(data.value) : null;
                    self.onChangeRigNumber(rigNumber);
                    break;
                case 'status':
                    status = data.value !== null ? parseInt(data.value) : null;
                    self.onChangeStatus(status);
                    break;
                case 'freq':
                    frequency = data.value !== null ? parseInt(data.value) : null;
                    self.onChangeFrequency(frequency);
                    break;
                case 'mode':
                    mode = data.value !== null ? parseInt(data.value) : null;
                    self.onChangeMode(mode);
                    break;
                case 'ptt':
                    ptt = !!data.value;
                    self.onChangePTT(ptt);
                    break;
            }
        }

    }

    /**
     * Send data to CAT4Web server.
     * @param {string} param
     * @param {string|int} value
     */
    function sendData(param, value) {
        if (connectState) {
            socket.send(param + '=' + value);
        }
    }
}
