;(function() {
    function fKoTag(options) {
        var self = this;
        self.options = options;
        self.sSeparator = ko.observable(options['sSeparator'] || '');
        self.bAllowDuplicate = ko.observable(options['bAllowDuplicate'] || false);
        self.bAllowEmpty = ko.observable(options['bAllowEmpty'] || false);
        self.aTag = ko.observableArray();
        self.sText = ko.observable();
        self.sTextClass = ko.pureComputed(function() {
            if(self.bTextError()){
                return 'tag-error';
            }
            return '';
        });
        self.bTextError = ko.pureComputed(function() {
            var sText = self.sText();
            if (!self.options.bAllowDuplicate && self.fbDuplicate(sText)) {
                return true;
            }
            if (!self.options.bAllowEmpty && sText && sText.length < 1) {
                return true;
            }
            return false;
        });
    }
    fKoTag.prototype.fAdd = function() {
        var self = this;
        if (self.bTextError()) {
            return;
        }
        self.aTag.push(self.sText());
        self.sText('');
    }
    fKoTag.prototype.fDelete = function(item) {
        var self = this;
        self.aTag.remove(item);
    }
    fKoTag.prototype.fbDuplicate = function(val) {
        var self = this;
        var aTag = self.aTag();
        for (var i = 0; len = aTag.length, i < len; i++) {
            if (aTag[i] === val) {
                return true;
            }
        }
        return false;
    }
    fKoTag.prototype.fInputKeyup = function(data, evt) {
        var self = this;
        switch (evt.keyCode) {
            case 13:
                self.fAdd();
                break;
            default:
                break;
        }
    }

    window["fKoTag"] = fKoTag;
})();
