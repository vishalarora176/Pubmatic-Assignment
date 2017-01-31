/**
 * Created by Vishal Arora on 1/31/2017.
 */

var service = (function() {

    var dataType = "";
    var requiredLength = 0;
    var finalArray;
    var filterValue = "";

    function getDataFromService() {
        var xmlhttp = new XMLHttpRequest();
        var url = "data/data.json";
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var arr = JSON.parse(this.responseText);
                if(filterValue !== "") {
                    var arr = filterArray(arr);
                }
                sortArray(arr);
            }
        };
        xmlhttp.open("GET", url, false);
        xmlhttp.send();

    }

    function sortArray(data) {
        data.sort(function(a,b) {
            if (a.datetimes[dataType] > b.datetimes[dataType]) {
                return -1;
            }
            if (a.datetimes[dataType] < b.datetimes[dataType]) {
                return 1;
            }
            return 0;
        });


        if(requiredLength > 0)
            data.splice(requiredLength, data.length);

        finalArray = data;

    }

    function filterArray(data) {
        var filtered = data.filter(function(item, index) {
            if(item.tags.includes(filterValue)) {
                return true;
            }
        });
        return filtered;
    }

    function servicePromise() {
        finalArray = null;
        var promise = new Promise(function(resolve, reject) {
            getDataFromService();
            if(finalArray != null)
                resolve();
        });

        promise.then(function(result) {
            if(finalArray.length > 0)
                populateUI(finalArray);
        });
    }

    return {

        getLastUpdatedData : function(requestLength, filter) {
            dataType = "updated";
            filterValue = filter;
            requiredLength = requestLength;
            servicePromise();
        },

        getLastExecutedData : function(requestLength, filter) {
            dataType = "last executed";
            filterValue = filter;
            requiredLength = requestLength;
            servicePromise();
        }
    }

})();