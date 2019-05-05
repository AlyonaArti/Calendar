$(document).ready(function(){
    var cd = new Date();
    var themonth = cd.getMonth() + 1;
    var theyear = cd.getFullYear();
    renderCal(themonth, theyear);

    $('.minusmonth').click(function(){
        if (themonth === 1) {
            themonth = 12;
            theyear += -1;
        } else {
            themonth += -1;
        }
        renderCal(themonth, theyear);
        writeData(pageData);
    });

    $('.addmonth').click(function(){
        if (themonth === 12) {
            themonth = 1;
            theyear += 1;
        } else {
            themonth += 1;
        }
        renderCal(themonth, theyear);
        writeData(pageData);
    });

    function renderCal(themonth, theyear){
        $('.calendar ul.group li').remove();
        var d = new Date(),
        day = d.getDate(), 
        month = d.getMonth() + 1,
        currentMonth = themonth, 
        year = theyear || d.getFullYear(),
        days = numDays(currentMonth,d.getYear()), 
        fDay = firstDay(currentMonth,d.getYear(), days) !== 0
            ? firstDay(currentMonth,d.getYear(), days)
            : 7, 
        date = year + "-" + ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2),
        months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        $('.calendar p.monthname').text(months[currentMonth-1]); 

        for (var i=0;i<fDay-1;i++) { 
            $('<li class="empty">&nbsp;</li>').appendTo('.calendar ul.group');
        }

        for (var i = 1; i<=days; i++) { 
            $('<li data-date="' + year + '-' + ('0' + currentMonth).slice(-2) + '-' + ('0' + i).slice(-2) + '">'+i+'</li>').appendTo('.calendar ul.group');
        }

        function firstDay(month, year, days) {
            var dayMonthDiff = 30 - days;
            return new Date(year,month,1).getDay() + dayMonthDiff;
        }

        function numDays(month,year) {
            return new Date(year,month,0).getDate();
        }

        $('.calendar li').click(function(){ 
            $('.calendar li').removeClass('active');
            $(this).addClass('active');
        });

        $(".calendar").find("[data-date='" + date + "']").addClass("active-date");

    }

    var pageData = [
        {
            "id": 1,
            "date": "2019-05-02",
            "title": "Party",
            "person": "Sam",
            "text": ""
        },
        {
            "id": 2,
            "date": "2019-06-22",
            "title": "B-day",
            "person": "Ben,Sara",
            "text": ""
        },
        {
            "id": 3,
            "date": "2019-04-12",
            "title": "title",
            "person": "Ben",
            "text": "some text"
        }
    ];

    function writeData(data) {
        for (var i = 0; i < data.length; i++) {
            $('[data-date="' + data[i].date + '"]').addClass('filled');
        }
    }

    writeData(pageData);

    var currentDate = '';

    function showEvents(elem, data){
        if(elem.hasClass("filled")){
            $(".events-block li").remove();
            for (var i = 0; i < data.length; i++) {
                if(currentDate == data[i].date) {
                    $(".events-block ul").append('<li id="' + pageData[i].id + '"><div><p class="event-title">'+ pageData[i].title +'</p><p class="event-person">'+ pageData[i].person +'</p><p class="event-description">'+ pageData[i].text +'</p></div><button class="edit">Edit</button></li>');
                }
            }
        }
    };

    $("body").on("click", "[data-date]", function() {
        $("body").find(".events-block").remove();
        $("body").append('<div class="events-block"><ul></ul><button class="add-new-event">Add new event</button></div>');
        
        currentDate = $(this).attr('data-date');
        showEvents($(this), pageData);        
    });

    $("body").on("click", ".events-block .add-new-event", function(){
        $(this).parent().append('<div class="new-event__block"><input type="text" id="event-title" placeholder="Event"><input type="text" id="event-person" placeholder="Some person"><textarea name="description" id="event-description" cols="40" rows="3" placeholder="Description"></textarea><button class="save">Save</button><button class="delete">Delete</button></div>');
        $(this).hide();
    });

    $("body").on("click", ".events-block .save", function(){
        let eventTitle = $(this).parent().find("#event-title").val(),
            eventPerson = $(this).parent().find("#event-person").val(),
            eventDescription = $(this).parent().find("#event-description").val();

        if(eventDescription.length !== 0 || eventPerson.length !== 0 || eventTitle.length !== 0){
            var dataID = $(this).parent().attr("data-id");

            if(typeof dataID !== typeof undefined && dataID !== false) {
                for (var i = 0; i < pageData.length; i++) {
                    if(dataID == pageData[i].id) {
                        pageData[i].title = eventTitle;
                        pageData[i].person = eventPerson;
                        pageData[i].text = eventDescription;
                    }
                }

            } else{
                var newEvent = {
                    "id": pageData[pageData.length - 1].id + 1,
                    "date": currentDate,
                    "title": eventTitle,
                    "person": eventPerson,
                    "text": eventDescription
                };

                pageData.push(newEvent);
                writeData(pageData);
            }
            showEvents($("[data-date='" + currentDate + "']"), pageData);

            $(this).parent().prev().show();
            $(this).parent().remove();
        } 
    });


    $("body").on("click", ".events-block .delete", function(){
        var dataID = $(this).parent().attr("data-id");

        if(typeof dataID !== typeof undefined && dataID !== false) {
            for (var i = 0; i < pageData.length; i++) {
                if(dataID == pageData[i].id) {
                    $('[data-date="' + pageData[i].date + '"]').removeClass('filled');
                    pageData.splice(i, 1);
                }
            }

        }

        $(this).parent().prev().show();
        $(this).parent().parent().remove("li");
        $(this).parent().remove(".new-event__block");
    });

    $("body").on("click", ".events-block .edit", function(){
        let eventTitle = $(this).parent().find(".event-title").text(),
            eventPerson = $(this).parent().find(".event-person").text(),
            eventDescription = $(this).parent().find(".event-description").text();
        var eventId = $(this).parent().attr('id');

        $(this).parent().append('<div class="new-event__block" data-id="' + eventId + '"><input type="text" id="event-title" placeholder="Event" value="' + eventTitle + '"><input type="text" id="event-person" placeholder="Some person" value="' + eventPerson + '"><textarea name="description" id="event-description" cols="40" rows="3" placeholder="Description">' + eventDescription + '</textarea><button class="save">Save</button><button class="delete">Delete</button></div>');
        $(this).prev().remove();        
        $(this).remove();
        
    });

    function filterFunction(data) {
        var input, filter, input;
        input = document.getElementById("search");
        filter = input.value.toLowerCase();
        inputDate = moment(input.value).format();
        console.log('inputDate', inputDate);

        $("#searchResult li").remove();
        if(input.value.length > 0){
            for (i = 0; i < data.length; i++) {
                var eventDate = moment(data[i].date).format();
                console.log('eventDate', eventDate);
                if (data[i].title.toLowerCase().indexOf(filter) > -1 ||
                data[i].person.toLowerCase().indexOf(filter) > -1 ||
                data[i].date.toLowerCase().indexOf(filter) > -1 || eventDate == inputDate)  {
                    $("#searchResult ul").append('<li>' + data[i].title + '</li>');
                }
            }
            if ($("#searchResult li").length === 0) {
                $("#searchResult ul").append('<li>No result</li>');
            };
        }
    }

    $("#search").keyup(function(){
        filterFunction(pageData);
    });
})