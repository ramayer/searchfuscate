
function perform_search(keyword) {
  kwd                       = keyword.escapeHTML();
  $('txt').value            = keyword;
  $('e_MSN').src            = 'http://search.msn.com/results.aspx?q=' + kwd + '&FORM=MSNH';
  $('e_Google').src         = 'http://www.google.com/search?hl=en&q=' + kwd + '&btnG=Google+Search';
  $('e_Yahoo').src          = 'http://search.yahoo.com/search?p='+kwd+'&fr=yfp-t-501&toggle=1&cop=mss&ei=UTF-8';
  $('e_dishAdish').src      = 'http://dishAdish.com/q/'+kwd;
  $('e_Ask').src            = 'http://www.ask.com/web?q='+kwd+'search&o=0&l=dir&jss=0';
  // $('Searchfuscate').src  = 'addterm.html?'+kwd;
}

var sites = ['Google','Yahoo','MSN','Ask', 'dishAdish','Searchfuscate'];
var timer=30;
var paused = false;
var nextterm = "";
var terms = ['goat','seared ahi tuna','clinton'];
var wordcounter=0;

function get_query_string() {
    var fullURL = parent.document.URL;
    var qpos = fullURL.indexOf('?q=');
    if (qpos == -1) return "";
    var xxx = fullURL.substring(qpos+3, fullURL.length);
    return xxx;
}
function update_engines(t) {
    var tabhtml = '';
    var enginehtml = '';
    var tabelem = $('tabs');
    var bodylem = $('');
    for (var i=0;i<sites.length-1;++i) {
          var site = sites[i];
          tabhtml += '<li><span id="t_'+site+'"><a href="javascript:set_tab(\''+site+'\')">'+site+'</a></span></li>';
          enginehtml += '<iframe class="searchengine" id="e_'+site+'" src="faq.html"></iframe>';
    }
    var site = sites[sites.length-1];
    tabhtml += '<li><span id="t_'+site+'"><a href="javascript:set_tab(\''+site+'\')">About Searchfuscate</a></span></li>'
          enginehtml += '<iframe class="searchengine" id="e_'+site+'" src="faq.html"></iframe>';
    Element.update(tabelem,tabhtml);
    Element.update($('engines'),enginehtml);
    new Ajax.Request('data/words.json', {
        method:'get',
        asynchronous: false,
        onSuccess: function(transport){
            var result = transport.responseText;
            terms = eval( '(' + transport.responseText +')' );
        }
    });
}

function set_tab(t) {
    for (var i=0;i<sites.length;++i) {
        id = sites[i];
        $('e_'+id).style.display='none';
        $('t_'+id).className='unselected';
    }
    $('e_'+t).style.display='block';
    $('t_'+t).className='selected';
}


function setpaused(p) {
    paused = p
    Element.update('pauselink',p ? "unpause" : "pause");
}

function faq(fn) {
    set_tab('Searchfuscate');
  // $('Searchfuscate').src  = 'faq.html#'+fn;
}

function countdown() {
    nextterm = terms[wordcounter];
    if (!paused) {
        timer = timer - 1;
        var nextterm = terms[wordcounter];
        var headmsg  ="Searchfuscate will search for a new random term <i>('"+nextterm+"')</i> if idle for <b>"+timer+"</b> seconds to protect your privacy <a href='javascript:faq(1)'><small>(read how this helps)</small></a> You can <a id='pauselink' onclick='setpaused(!paused);false;' href='#'>pause if you need more time</a>.";
        Element.update('headmsg',headmsg);
        if ( (timer < 15) && (timer%2==0) ) {
            $('pauselink').style.backgroundColor='#ff0';
        }
    } else {
        var headmsg  ="Searchfuscate is paused.  When unpaused searchfuscate will search for a new random term <i>('"+nextterm+"')</i> in <b>"+timer+"</b> seconds to protect your privacy <a href='javascript:faq(1)'><small>(read how this helps)</small></a> Click to <a id='pauselink' onclick='setpaused(!paused);false;' href='#'>unpause</a>.";
        Element.update('headmsg',headmsg);
    }
    if (timer<1) {
        $('txt').value=nextterm;
        perform_search(nextterm);
        wordcounter = Math.floor(Math.random()*terms.length);
        nextterm = terms[wordcounter];
        timer=Math.floor(Math.random()*60)+10;
    }
    setTimeout('countdown()',1000);
}

