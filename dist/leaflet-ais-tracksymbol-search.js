/**
 * Created by Johannes Rudolph on 30.08.2016.
 */

L.Control.AISTracksymbolSearch = L.Control.extend({
    /**
     *
     * @param options
     */
    initialize: function (options) {
        L.Control.prototype.initialize.call(this, options);
        this.setAisLayer(options.aisLayer || false);
    },

    /**
     *
     * @param map
     * @returns {div}
     */
    onAdd: function(map){
        this._map = map;

        var className = 'leaflet-control-AISTracksymbolSearch';
        var container = this._container = L.DomUtil.create('div',className);

        container.addEventListener('mouseover',function () {
            map.dragging.disable();
        });

        container.addEventListener('mouseout',function () {
            map.dragging.enable();
        });

        var input = this._input = L.DomUtil.create('input', "leaflet-control-aistracksymbolsearch-input", this._container);
        input.placeholder = "MMSI | Name | IMO ";
        L.DomEvent
            .stop(input)
            .on(input, 'touchstart', function (e) {
                input.focus();
            },this)
            .on(input, 'keydown', this._handleKeypress, this);
        
        var searchButton = this._searchButton = L.DomUtil.create("i","fa fa-search leaflet-control-aistracksymbolsearch-searchbutton",this._container);
        L.DomEvent
            .stop(searchButton)
            .on(searchButton, 'click', L.DomEvent.stop, this)
            .on(searchButton, 'click', this._searchTrack, this);

        return container;
    },

    /**
     *
     * @param e
     * @private
     */
    _searchTrack: function (e) {
        e.preventDefault();
        this._input.blur();
        var searchText = this._input.value;
        if(searchText.length === 0)
            return false;
        var result = this.getAisLayer().searchTrack(searchText);
        if(result){
            this._zoomToTrack(result);
            this._input.value = "";
        }
    },

    /**
     *
     * @param aisTrack
     * @private
     */
    _zoomToTrack: function (aisTrack) {
        aisTrack.openPopup();
        this._map.setView(aisTrack.getLatLng(), 14);
    },

    /**
     *
     * @param e
     * @private
     */
    _handleKeypress: function (e) {
        switch(e.keyCode)
        {
            case 13://Enter
                this._searchTrack(e);	//do search
                break;
        }
    },

    /**
     *
     * @param layer
     */
    setAisLayer: function (layer) {
        this._aisLayer = layer;
    },

    /**
     *
     * @returns {*}
     */
    getAisLayer: function () {
        return this._aisLayer;
    }
});

/**
 *
 * @param options
 * @returns {*}
 */
L.control.aistacksymbolsearch = function (options) {
    return new L.Control.AISTracksymbolSearch(options);
};