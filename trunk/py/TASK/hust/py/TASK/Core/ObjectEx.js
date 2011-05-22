
    /**
     * Get the number of objects in the map
     *
     * @signature function(map)
     * @param map {Object} the map
     * @return {Integer} number of objects in the map
     */
    objectGetLength :
    ({
      "count": function(map) {
        return map.__count__;
      },

      "default": function(map)
      {
        var length = 0;

        for (var key in map) {
          length++;
        }

        return length;
      }
    })[(({}).__count__ == 0) ? "count" : "default"],

