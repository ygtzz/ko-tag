;(function() {
    function fKoTag(options) {
        var self = this;
        self.options = options;
        self.sSeparator = ko.observable(options['separator'] || '');
        self.sPlaceholder = ko.observable(options['placeholder'] || '');
        self.sWrapClass = ko.observable(options['wrapclass'] || '');
        self.nBackspaceCount = 0;
        self.aTag = self.options.value || ko.observableArray();
        self.sText = ko.observable();
        self.sTextClass = ko.pureComputed(function() {
            if (self.bTextError()) {
                return 'tag-error';
            }
            return '';
        });
        self.bTextError = ko.pureComputed(function() {
            var sText = self.sText();
            if (!self.options.bAllowDuplicate && self.fbDuplicate(sText)) {
                return true;
            }
            return false;
        });
        self.fDelete = function(item) {
            self.aTag.remove(item);
        }
    }
    fKoTag.prototype.fAdd = function() {
        var self = this;
        if (self.bTextError()) {
            return;
        }
        var sText = self.sText();
        if (!self.options.bAllowEmpty && sText !== undefined && sText !== null && sText.length < 1) {
            return;
        }
        self.aTag.push(self.sText());
        self.sText('');
    }
    fKoTag.prototype.fDeleteLast = function() {
        var self = this;
        var sText = self.sText();
        if (sText === undefined || sText === null || self.sText().length === 0) {
            self.nBackspaceCount++;
            if (self.nBackspaceCount > 1) {
                self.aTag.pop();
                self.nBackspaceCount = 0;
            }
        }
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
            case 8:
                self.fDeleteLast();
                break;
            default:
                break;
        }
        evt.stopPropagation();
    }

    //window["fKoTag"] = fKoTag;
    ko.components.register('ko-tag', {
        viewModel: fKoTag,
        template: '<div data-bind="css:sWrapClass" class="tag-wrap">' 
                        + '<span data-bind="foreach:aTag">' 
                                + '<span data-bind="text:$parent.sSeparator,visible:$index()>0"></span>' 
                                + '<span class="tag tag-orange">' 
                                    + '<span data-bind="text:$data"></span>' 
                                    + '<span data-bind="click:$parent.fDelete" class="tag-del">×</span>' 
                                + '</span>' 
                        + '</span>' 
                        + '<input data-bind="textInput:sText,event:{keyup:fInputKeyup},css:sTextClass,attr:{placeholder:sPlaceholder}" type="text" class="tag-input"/>' 
                    + '</div>'
    });
})();