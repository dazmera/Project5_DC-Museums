// javascript to control behaviour when hamburger button is clicked

'use strict';

var isOpened;

$(document).ready(function () {

    //decide whether to open the sidebar nav initially, depending on how big the window width is
    isOpened = window.innerWidth > 500;

    // callback when hamburger menu is clicked
    $("#hamburger").click(function () {

        // show sidebar if necessary
        if (isOpened) {
            $('#sidebar').css('display', 'block');
            $('.museumView').css('display', 'block');
        } else {
            $('#sidebar').css('display', 'none');
            $('.museumView').css('display', 'none');
        }

        isOpened = !isOpened;

    });

    // click the hamburger once to init
    $("#hamburger").click();

});