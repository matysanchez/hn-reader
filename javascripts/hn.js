var Storage, index=1;

function loadHN(){
    // Check it out if the site was already loaded in the last 10 minutes.
    if( $.cookie('loaded') ){
        // Check if browser supports localStorage and the variable exists
        if(typeof(Storage)=="undefined" && !Storage){
            // If not, we have to load, at least we need the variable Storange
            firstLoad();
            exit;
        }
        // In this instance we have the variable, we don't care any more if the browser
        // supports localStorange
        for ( var i = 0; i < 30; i++ ) {
            // Adding every single new in the home page
            // See @addTitle
            addTitle(Storage.results.collection1[i]);
            // Getting information about the last and next time the crawler run
            $("#lastrun").text( jQuery.timeago(Storage.lastsuccess) );
            $("#nextrun").text( jQuery.timeago(Storage.nextrun).split(' ago')[0] );
        }
    }else{
        // If the cookie do not exist, we have to load everything
        firstLoad(); // No cookie = load
    }
}

function firstLoad(){
    $.ajax({
        "url":"http://www.kimonolabs.com/api/9z5sblqk?apikey=1c8c727df3017b23afbd58e02ef0d3d1&callback=getHN",
        "crossDomain":true,
        "dataType":"jsonp"
    });
}

function getHN(data){
    // We use the same variable for localStorange support or not, that is cool
    // Check if the browser supports localStorange
    if(typeof(Storage)!=="undefined"){
        // Set dataHN localStorange variable with the JSON object
        localStorage.setItem( 'dataHN', JSON.stringify(data) );
        // Read the dataHN localStorange variable and covert into a object
        Storage   = JSON.parse(localStorage.getItem( 'dataHN' ));
    }else{
        // If the browser do not support LocalStorange it's cool, we can handle it
        Storage = data;
    }
    $.cookie('loaded', '1', { expires: 0.00694 }); // Expires in aprox. 10 mins
    loadHN();
}

function addTitle(data){
    // Function to add every single new in the home page
    var title_text, title_href, author_text, author_href, source_text, comments_text, comments_href, time_splited, time_text=null, append='';

    title_text    = data.title.text;
    title_href    = data.title.href;
    author_text   = data.author.text;
    author_href   = data.author.href;
    source_text   = data.source;
    comments_text = data.comments.text;
    comments_href = data.comments.href;
    if(data.details.text){
        time_splited  = data.details.text.split(' ');
        time_text     = time_splited[4] + ' ' + time_splited[5] + ' ' + time_splited[6];
    }

    // If we can get the title, we are fu**ed
    if(title_text && title_href){
        append+= '   <div class="column">';
        append+= '       <h2><span id="number">'+index+'.</span> <a href="'+title_href+'">'+title_text+'</a></h2>';
        append+= '       <p>';

        if( author_href && author_text )
            append+= 'Sent by  <a href="'+author_href+'">'+author_text+'</a>';
        if( time_text )
            append+= ' '+time_text;
        if( source_text )
            append+= ' | '+source_text;
        if( comments_href && comments_text ){
            comments_href = comments_href.replace("//item?", "/item?");
            append+= ' | <a href="'+comments_href+'">'+comments_text;
        }

        append+='</a></p>'
        append+= '   </div>';
        $("#hnews").append(append);
        index++;
    }
}

// Run son, run!
firstLoad();