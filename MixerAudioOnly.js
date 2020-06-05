// ==UserScript==
// @name         Mixer Audio Only
// @namespace    https://github.com/antisocialian/MixerAudioOnly
// @version      0.6.1
// @description  Set streams to audio-only depending on the state of a checkbox/cookie
// @author       antisocialian
// @match        *mixer.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var m;

    //initialize global variables
    var audioOnly = false;
    var intervalvariable, intervalnav;

    //get the cookie that stores true/false for the page
    checkCookie();

    //hook into the window's load event to check that the video is in the correct state. doing this as an interval DOES mean it is running constantly while the checkbox is checked,
    //but ALSO means it will catch when the channel hosts or goes offline & online again. This was the only workaround I could get to catch whent he channel had hosted someone else(or went offline&online)
    window.addEventListener('load', function() {
        intervalnav = setInterval(navLoad, ((Math.random()) + 2) *1000);
        intervalvariable = setInterval(cAO, ((Math.random()) + 3) *1000);
    }, false);

    function navLoad() {
        clearInterval(intervalnav);

        //add the checkbox along the top menu on the page and add hook to its onClick() event
        var navbar = document.getElementsByClassName("stickly-sentinel");
        console.error(navbar.length);
        navbar[0].insertAdjacentHTML("beforeend", "<label _ngcontent-c5 class='nav-link'><input type='checkbox' id='chkaudioOnly' value='audioOnly'> Audio Only</label>");
        m = document.getElementById("chkaudioOnly");
        m.addEventListener('click', tglAO, false);
    }

    //this is the event for the checkbox onClick() hook
    //it should set the global variable to the state of the checkbox, then set the cookie, then redo the audio-only button, and finally stop/start the interval function again
    function tglAO() {
        //var tmpAO = m.checked;
        if(m){
            audioOnly = m.checked;
        }
        setCookie("audioOnly", audioOnly, 30);
        cAO();
        if (m.checked == false) {
            clearInterval(intervalvariable);
        } else {
            intervalvariable = setInterval(cAO, ((Math.random()) + 3) *1000);
        }
    }

    //this is the function to check/click the audio-only button
    function cAO(){
        //get the list of elements with the correct class.
        //**NOTE** this may need to be updated, should the site change the layout of the page
        var x = document.getElementsByClassName("_2YmB_I5OliPyB7_rs748W3 _1kIlUXtgizhBW5Drjbvqmm");
        var i,j;

        for (i = 0; i < x.length; i++) {
            //since the button element uses an aria-label and not a name/id we have to check the attributes of each element to find the audio-only button
            for (j = 0; j < x[i].attributes.length; j++) {
                if (x[i].attributes[j].value == "Audio Only") {
                    //comparing the inner <div> HTML of the button to check the state of the audio only.
                    //this was the only waay I could find to get the state of the button from the page so that we could properly click the button
                    //the problem is that the button looks like a checkbox, but is in fact a button that changes the icon of a checkbox depending
                    //on whether it has been clicked on/off
                    var p = x[i].innerHTML;
                    var r = p.includes("check_box_outline_blank");
                    if (r == true) {
                        if (audioOnly == true) {
                            if(m){
                                m.checked = true;
                            }
                            x[i].click();
                        }
                    } else {
                        if (audioOnly == false) {
                            if(m){
                                m.checked = false;
                            }
                            x[i].click();
                        }
                    }
                }
            }
        }
    }

    //copied from w3schools.com/js/js_cookies.asp
    //i didn't make this function
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires;
    }

    //copied from w3schools.com/js/js_cookies.asp
    //i didn't make this function
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //check the cookie and set the global variable & checkbox accordingly
    function checkCookie() {
        var tmpCookie = getCookie("audioOnly");
        if (tmpCookie == 'true') {
            audioOnly = true;
            if(m){
                m.checked = true;
            }
        } else {
            audioOnly = false;
            if(m){
                m.checked = false;
            }
        }
    }
}
)();
